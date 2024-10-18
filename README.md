# PostCSS Responsive Type

**Important:** This version is not tested with `line-height`, and `letter-spacing`. It is only suited for responsive `font-size`.

## Changes

This fork of [https://github.com/madeleineostoja/postcss-responsive-type](postcss-responsive-type) includes the following changes:

-   By default, the plugin uses `vw` calculations and `@media` queries for responsive typography.
-   When `font-container` is set to `'true'`, the plugin switches to using `cqw` calculations and `@container` queries with the nearest ancestor that has a containment context.
-   When `font-container` is set to a custom value other than `'true'`, the plugin uses `cqw` calculations and `@container` queries with the specified container name.
-   Retained the ability to use `vw` calculations and `@media` queries by not setting the `font-container` property or setting it to a value other than `'true'`.

## Why

The changes made to `postcss-responsive-type` offer flexibility and backward compatibility:

1. **Default behavior:** By default, the plugin uses `vw` calculations and `@media` queries for responsive typography. This ensures backward compatibility with existing projects that rely on viewport-based scaling and media queries.
2. **Container-based scaling:** When `font-container` is set to `'true'`, the plugin switches to using `cqw` calculations and `@container` queries. This allows for font sizes to be scaled based on the size of the containing element rather than the entire viewport. It provides flexibility in scenarios where the available space for content may be limited, such as CMS preview modes like WordPress block editor or Sanity.
3. **Custom container support:** When `font-container` is set to a custom value other than `'true'`, the plugin uses `cqw` calculations and `@container` queries with the specified container name. This feature gives you control over which element serves as the reference for font size scaling, enabling you to target specific containers within your layout.
4. **Flexibility and backward compatibility:** The changes made to `postcss-responsive-type` provide flexibility in choosing between viewport-based scaling with media queries and container-based scaling with container queries. By retaining the ability to use `vw` calculations and `@media` queries, the plugin ensures backward compatibility with existing projects while still offering the benefits of container queries when desired.

These changes make `postcss-responsive-type` a versatile tool for responsive typography, catering to different project requirements and layouts. It allows developers to choose the appropriate scaling method based on their needs, whether it's viewport-based scaling with media queries or container-based scaling with container queries.

### Examples

#### Using container queries with the nearest ancestor container

```css
.example-1 {
	font-size: responsive 16px 24px;
	font-range: 400px 800px;
}
```

Generated CSS:

```css
.example-1 {
	font-size: calc(16px + 8 * ((100cqw - 400px) / 400));
}

@container (max-width: 400px) {
	.example-1 {
		font-size: 16px;
	}
}

@container (min-width: 800px) {
	.example-1 {
		font-size: 24px;
	}
}
```

#### Using container queries with a custom container name

```css
.example-2 {
	font-size: responsive 20px 32px;
	font-range: 600px 1200px;
	font-container: my-container;
}
```

Generated CSS:

```css
.example-2 {
	font-size: calc(20px + 12 * ((100cqw - 600px) / 600));
}

@container my-container (max-width: 600px) {
	.example-2 {
		font-size: 20px;
	}
}

@container my-container (min-width: 1200px) {
	.example-2 {
		font-size: 32px;
	}
}
```

#### Using media queries (the behaviour of the original postcss-responsive-type)

```css
.example-3 {
	font-size: responsive 14px 18px;
	font-range: 300px 600px;
	font-container: media;
}
```

Generated CSS:

```css
.example-3 {
	font-size: calc(14px + 4 * ((100vw - 300px) / 300));
}

@media screen and (max-width: 300px) {
	.example-3 {
		font-size: 14px;
	}
}

@media screen and (min-width: 600px) {
	.example-3 {
		font-size: 18px;
	}
}
```

## Installation

Please note that this forked version of` postcss-responsive-type` is not yet available on npm.

To install this forked version, you can use one of the following methods:

1.  Install from GitHub repository:

-   Add the following line to your project's `package.json` file:

```js
"postcss-responsive-type": "github:elliottmangham/postcss-responsive-type"
```

-   Run `npm install` to install the plugin from the GitHub repository.

2.  Install from a local path:

-   Clone the forked repository to your local machine:

```cli
git clone https://github.com/elliottmangham/postcss-responsive-type.git
```

-   Add the following line to your project's package.json file, replacing `path/to/postcss-responsive-type` with the actual path to your cloned repository:

```js
"postcss-responsive-type": "file:path/to/postcss-responsive-type"
```

-   Run `npm install` to install the plugin from the local path.

After installation, you can use the plugin in your PostCSS configuration file:

```js
module.exports = {
	plugins: [
		require('postcss-responsive-type'),
		// Other plugins...
	],
};
```
