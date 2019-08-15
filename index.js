const mix = require('laravel-mix');
const path = require('path');

class TwigToHtml {
  dependencies() {
    return ['html-webpack-plugin', 'raw-loader', 'twig-html-loader'];
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
    this.config = Object.assign(
      {
        files: [],
        fileOptions: {},
        fileBase: undefined,
        twigOptions: null,
        enabled: true
      },
      config
    );
  }

  webpackRules() {
    if (!this.config.enabled) return;

    const options = Object.assign(
      {
        autoescape: true,
        functions: {}
      },
      this.config.twigOptions
    );

    return {
      test: /\.twig$/,
      use: [
        'raw-loader',
        {
          loader: 'twig-html-loader',
          options: options
        }
      ]
    };
  }

  webpackPlugins() {
    if (!this.config.enabled) return;

    const HtmlWebpackPlugin = require('html-webpack-plugin');
    const globby = require('globby');

    const normaliseFileConfig = files =>
      typeof files[0] === 'string'
        ? globby.sync(files).map(file => ({ template: file, ...this.config.fileOptions }))
        : typeof files[0] === 'object'
        ? Object.values(files).reduce((prev, fileConfig) => {
            const paths = globby.sync(fileConfig.template).map(file => ({
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
            .split('/')
            .map(chunk => chunk.startsWith('_'))
            .filter(Boolean).length === 0
      );

    const addFilename = config =>
      config.map(item => {
        const isSubPath = this.config.fileBase !== path.dirname(item.template);
        const prefixPath = isSubPath
          ? path
              .dirname(item.template)
              .split(path.sep)
              .pop()
          : '';
        const newFileName = `${path.basename(
          item.template,
          path.extname(item.template)
        )}.html`;
        return {
          ...item,
          filename: path.join(prefixPath, newFileName)
        };
      });

    const createPages = pages =>
      pages.map(
        page =>
          new HtmlWebpackPlugin({
            ...page,
            hash: mix.inProduction()
          })
      );

    const pluginConfig = createPages(
      addFilename(removeUnderscorePaths(normaliseFileConfig(this.config.files)))
    );

    return pluginConfig;
  }

  webpackConfig(webpackConfig) {
    if (!this.config.enabled) return;
    webpackConfig.output.publicPath = ''; // Fix path issues
  }
}

mix.extend('twigToHtml', new TwigToHtml());
