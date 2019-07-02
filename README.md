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

Then require and configure the extension within `webpack.mix.js`:

```js
const mix = require('laravel-mix');

require('laravel-mix-twig-to-html');

mix.twigToHtml({
    files: [
        'src/templates/index.twig',
        'src/templates/about/index.twig'
    ],
    fileBase: 'src/templates',
    twigOptions: { data: {} },
    enabled: true,
});
```

## Options

| Name        | Type                          | Default      | Description   |
| ----------- | ----------------------------- | ------------ | ------------- |
| files       | `array`                     | `[]`       | (Required) An array of twig file paths. |
| fileBase       | `string`                     | ``       | (Required) The base path to your template folder. This is so we can create an accurate folder structure with the built files. |
| twigOptions       | `object`                     | `{}`       | The twig-html-loader options, see [twig-html-loader](https://github.com/radiocity/twig-html-loader#options) for the options. |
| enabled     | `boolean`                     | `true`       | Should extension be used. |

## Links

This extension was created for the [Agency Webpack Mix Config](https://github.com/ben-rogerson/agency-webpack-mix-config).