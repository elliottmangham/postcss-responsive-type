# PostCSS Responsive Type

Note: This version is not tested with `line-height`, and `letter-spacing`. It is only suited for responsive `font-size`.

## Changes

This fork of [https://github.com/madeleineostoja/postcss-responsive-type](postcss-responsive-type) includes the following changes:

-   Removed the default container (`comp`) for container queries.
-   When no specific container is defined using the `font-container` property, the plugin generates container queries that use the nearest ancestor with a containment context.
-   Added support for specifying a custom container name using the `font-container` property.
-   Retained the ability to use media queries by setting `font-container: media`.

### Examples

#### Using container queries with the nearest ancestor container

```css
.example-1 {
	font-size: responsive 16px 24px;
	font-range: 400px 800px;
}
```

Generated CSS:

```
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

```
.example-2 {
  font-size: responsive 20px 32px;
  font-range: 600px 1200px;
  font-container: my-container;
}
```

Generated CSS:

```
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

```
.example-3 {
  font-size: responsive 14px 18px;
  font-range: 300px 600px;
  font-container: media;
}
```

Generated CSS:

```
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

```
"postcss-responsive-type": "github:elliottmangham/postcss-responsive-type"
```

-   Run `npm install` to install the plugin from the GitHub repository.

2.  Install from a local path:

-   Clone the forked repository to your local machine:

```
git clone https://github.com/elliottmangham/postcss-responsive-type.git
```

-   Add the following line to your project's package.json file, replacing `path/to/postcss-responsive-type` with the actual path to your cloned repository:

```
"postcss-responsive-type": "file:path/to/postcss-responsive-type"
```

-   Run `npm install` to install the plugin from the local path.

After installation, you can use the plugin in your PostCSS configuration file:

```
module.exports = {
  plugins: [
    require('postcss-responsive-type'),
    // Other plugins...
  ],
};
```
