<a href="https://www.npmjs.com/package/laravel-mix-twig-to-html"><img src="https://img.shields.io/npm/v/laravel-mix-twig-to-html.svg" alt="NPM"></a>
<a href="https://www.npmjs.com/package/laravel-mix-twig-to-html"><img src="https://img.shields.io/npm/l/laravel-mix-twig-to-html.svg" alt="NPM"></a>

# Laravel Mix Twig to Html

A Laravel Mix extension to convert twig files to html.

## Usage

Install the extension:

```bash
npm install laravel-mix-twig-to-html --save-dev
```

or

```bash
yarn add laravel-mix-twig-to-html --dev
```

Then require and configure the extension within your `webpack.mix.js`.

## Simple configuration

Create the html pages from a string (or an array) of [minimatch](https://github.com/isaacs/minimatch#usage) supported paths to your twig files.

```js
const mix = require('laravel-mix');

require('laravel-mix-twig-to-html');

mix.twigToHtml({
    files: 'src/templates/**/*.{twig,html}',
    fileBase: 'src/templates',
});
```

## Advanced configuration

Additional output options allow you to set custom [html-webpack-plugin options](https://github.com/jantimon/html-webpack-plugin#options) and [twig options](https://github.com/radiocity/twig-html-loader#options).

```js
const mix = require('laravel-mix');

require('laravel-mix-twig-to-html');

const files = [
    {
        template: 'src/templates/about/**/*.twig',
        title: 'About',
    },
    {
        template: 'src/templates/index.twig',
        title: 'Home',
        inject: false, // disable asset tag injection
    }
]

mix.twigToHtml({
    files: files,
    fileBase: 'src/templates',
    twigOptions: { data: {} },
});
```

## Underscore to ignore

Files or folders prefixed with an underscore are ignored from html output. This is a handy feature for ignoring component and layout files.
```
Ignored files:
/_components/header.twig
/_layouts/base.twig
/_include.twig
```

## Options

| Name        | Type               | Default | Description                                                                                                                                                    |
| ----------- | ------------------ | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| files *     | `string` / `array` | `[]`    | Paths to your twig source files (supports [minimatch](https://github.com/isaacs/minimatch#usage))<br>OR<br> An array of objects to pass to html-webpack-plugin |
| fileBase *  | `string`           | ``      | The base path to your template folder                                                                                                                          |
| twigOptions | `object`           | `{}`    | The twig-html-loader options, see [twig-html-loader](https://github.com/radiocity/twig-html-loader#options) for the options                                    |
| enabled     | `boolean`          | `true`  | Turns the extension on or off manually                                                                                                                         |

*&nbsp;= Required

## Links

This extension was created for the [Agency Webpack Mix Config](https://github.com/ben-rogerson/agency-webpack-mix-config).