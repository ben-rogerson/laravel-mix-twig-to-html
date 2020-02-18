const mix = require("laravel-mix");
const { dirname, basename, extname, join, sep } = require("path");

const assign = Object.assign;

class TwigToHtml {
  dependencies() {
    return ["html-webpack-plugin", "html-loader", "twig-html-loader"];
  }

  register(config) {
    if (!config.files || config.files.length <= 0) {
      throw new Error(
        `Missing files\nEg: mix.twigToHtml({ files: ['path/to/twigfile.twig'] })`
      );
    }
    if (!config.fileBase) {
      throw new Error(
        `Missing fileBase\nEg: mix.twigToHtml({ fileBase: ['path/to/your/twig/templates'] })`
      );
    }
    this.config = assign(
      {
        files: [],
        fileBase: undefined,
        twigOptions: null,
        htmlOptions: null,
        htmlWebpack: null,
        enabled: true
      },
      config
    );
  }

  webpackRules() {
    if (!this.config.enabled) return;

    const options = assign(
      {
        autoescape: true,
        functions: {}
      },
      this.config.twigOptions
    );

    return {
      test: /\.twig$/,
      use: [
        {
          loader: "html-loader",
          options: assign(
            {
              minify: mix.inProduction(),
              attrs: [
                ":srcset",
                "img:src",
                "audio:src",
                "video:src",
                "video:poster",
                "track:src",
                "embed:src",
                "source:src",
                "input:src",
                "object:data"
              ]
            },
            this.config.htmlOptions
          )
        },
        {
          loader: "twig-html-loader",
          options: options
        }
      ]
    };
  }

  webpackPlugins() {
    if (!this.config.enabled) return;

    const HtmlWebpackPlugin = require("html-webpack-plugin");
    const { sync } = require("globby");

    const normaliseFileConfig = files =>
      typeof files[0] === "string"
        ? sync(files).map(file => ({ template: file }))
        : typeof files[0] === "object"
        ? Object.values(files).reduce((prev, fileConfig) => {
            const paths = sync(fileConfig.template).map(file => ({
              ...fileConfig,
              template: file
            }));
            return prev.concat(paths);
          }, [])
        : [];

    const removeUnderscorePaths = config =>
      config.filter(
        item =>
          item.template
            .split("/")
            .map(chunk => chunk.startsWith("_"))
            .filter(Boolean).length === 0
      );

    const addFilename = config =>
      config.map(item => {
        const isSubPath = this.config.fileBase !== dirname(item.template);
        const prefixPath = isSubPath
          ? dirname(item.template)
              .split(sep)
              .pop()
          : "";
        const newFileName = `${basename(
          item.template,
          extname(item.template)
        )}.html`;
        return {
          ...item,
          filename: join(prefixPath, newFileName)
        };
      });

    const createPages = pages =>
      pages.map(page => {
        const options = assign(
          {
            ...page,
            hash: mix.inProduction()
          },
          this.config.htmlWebpack
        );

        return new HtmlWebpackPlugin(options);
      });

    return createPages(
      addFilename(removeUnderscorePaths(normaliseFileConfig(this.config.files)))
    );
  }

  webpackConfig(webpackConfig) {
    if (!this.config.enabled) return;
    webpackConfig.output.publicPath = ""; // Fix path issues
  }
}

mix.extend("twigToHtml", new TwigToHtml());
