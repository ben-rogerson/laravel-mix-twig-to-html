const mix = require("laravel-mix")
const path = require("path")

class TwigToHtml {
    dependencies() {
        return ["html-webpack-plugin", "raw-loader", "twig-html-loader"]
    }

    register(config) {
        if (!config.files || config.files.length <= 0) {
            throw new Error(
                `Missing files\nEg: mix.twigToHtml({ files: ['path/to/twigfile.twig'] })`
            )
        }
        if (!config.fileBase) {
            throw new Error(
                `Missing fileBase\nEg: mix.twigToHtml({ fileBase: ['path/to/your/twig/templates'] })`
            )
        }
        this.config = Object.assign(
            {
                files: [],
                fileBase: undefined,
                twigOptions: null,
                enabled: true,
            },
            config
        )
    }

    webpackRules() {
        if (!this.config.enabled) return

        const options = Object.assign(
            { autoescape: true },
            this.config.twigOptions
        )

        return {
            test: /\.twig$/,
            use: [
                "raw-loader",
                {
                    loader: "twig-html-loader",
                    options: options,
                },
            ],
        }
    }

    webpackPlugins() {
        if (!this.config.enabled) return

        const HtmlWebpackPlugin = require("html-webpack-plugin")
        const files =
            typeof this.config.files === "object"
                ? this.config.files
                : [this.config.files]

        const templatePages = files.map(file => {
            const isSubPath = this.config.fileBase !== path.dirname(file)
            const prefixPath = isSubPath
                ? path
                      .dirname(file)
                      .split(path.sep)
                      .pop()
                : ""
            const newFileName = `${path.basename(
                file,
                path.extname(file)
            )}.html`
            return new HtmlWebpackPlugin({
                template: file,
                filename: path.join(prefixPath, newFileName),
                hash: mix.inProduction(),
            })
        })
        return templatePages
    }

    webpackConfig(webpackConfig) {
        if (!this.config.enabled) return
        webpackConfig.output.publicPath = "" // Fix path issues
    }
}

mix.extend("twigToHtml", new TwigToHtml())
