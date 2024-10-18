# PostCSS Responsive Type

**Important:** This version is not tested with `line-height`, and `letter-spacing`. It is only suited for responsive `font-size`.

## Changes

This fork of [https://github.com/madeleineostoja/postcss-responsive-type](postcss-responsive-type) includes the following changes:

-   Replaced `vw` calculations with `cqw` and `@media` queries `@container` queries.
-   When no specific container is defined using the `font-container` property, the plugin generates container queries that use the nearest ancestor with a containment context.
-   Added support for specifying a custom container name using the `font-container` property.
-   Retained the ability to use media queries by setting `font-container: media`.

## Why

The changes made to postcss-responsive-type offer several benefits:

1. **Container-based scaling:** By replacing vw calculations with cqw and using @container queries instead of @media queries, the font sizes are now scaled based on the size of the containing element rather than the entire viewport. This approach is more flexible and adaptable to different scenarios, such as CMS preview modes like WordPress block editor or Sanity, where the available space for content may be limited due to the presence of editing panels.
2. **Nearest ancestor containment:** When no specific container is defined using the font-container property, the plugin automatically generates container queries that use the nearest ancestor with a containment context. This behaviour ensures that the font sizes are scaled relative to the closest containing element, providing a more predictable and consistent responsive typography experience.
3. **Custom container support:** The addition of the font-container property allows you to specify a custom container name for the container queries. This feature gives you more control over which element serves as the reference for font size scaling, enabling you to target specific containers within your layout.
4. **Backward compatibility:** Despite the focus on container queries, the forked version of postcss-responsive-type retains the ability to use media queries by setting font-container: media. This ensures backward compatibility with existing projects that rely on media query-based responsive typography, while still providing the option to leverage the benefits of container queries.

By incorporating these changes, postcss-responsive-type now offers a more versatile and container-aware approach to responsive typography. It addresses the limitations of viewport-based scaling and provides a solution that works well in various scenarios, including CMS preview modes and complex layouts with multiple containers.

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
