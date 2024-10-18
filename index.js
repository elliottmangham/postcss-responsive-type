'use strict';

const postcss = require('postcss');

const DEFAULT_PARAMS = {
		'font-size': {
			minSize: '12px',
			maxSize: '21px',
			minWidth: '420px',
			maxWidth: '1280px',
		},
		'line-height': {
			minSize: '1.2em',
			maxSize: '1.8em',
			minWidth: '420px',
			maxWidth: '1280px',
		},
		'letter-spacing': {
			minSize: '0px',
			maxSize: '4px',
			minWidth: '420px',
			maxWidth: '1280px',
		},
	},
	PARAM_RANGE = {
		'font-size': 'font-range',
		'line-height': 'line-height-range',
		'letter-spacing': 'letter-spacing-range',
	},
	PARAM_DECLS = {
		'font-size': {
			minSize: 'min-font-size',
			maxSize: 'max-font-size',
			minWidth: 'lower-font-range',
			maxWidth: 'upper-font-range',
		},
		'line-height': {
			minSize: 'min-line-height',
			maxSize: 'max-line-height',
			minWidth: 'lower-line-height-range',
			maxWidth: 'upper-line-height-range',
		},
		'letter-spacing': {
			minSize: 'min-letter-spacing',
			maxSize: 'max-letter-spacing',
			minWidth: 'lower-letter-spacing-range',
			maxWidth: 'upper-letter-spacing-range',
		},
	};

// Assign default root size
let rootSize = '16px';

/**
 * Extract the unit from a string
 * @param  {String} value value to extract unit from
 * @return {String}       unit
 */
function getUnit(value) {
	var match = value.match(/px|rem|em/);

	if (match) {
		return match.toString();
	}
	return null;
}

/**
 * Px -> Rem converter
 * @param  {String} px pixel value
 * @return {String}    rem value
 */
function pxToRem(px) {
	return parseFloat(px) / parseFloat(rootSize) + 'rem';
}

function fetchResponsiveSizes(rule, declName, cb) {
	rule.walkDecls(declName, (decl) => {
		if (decl.value.indexOf('responsive') > -1) {
			let vals = decl.value.match(/-?\d*\.?\d+(?:\w+)?/g);

			if (vals) {
				cb(vals[0], vals[1]);
			}
		}
	});
}

function fetchRangeSizes(rule, declName, cb) {
	rule.walkDecls(declName, (decl) => {
		let vals = decl.value.split(/\s+/);

		cb(vals[0], vals[1]);
		decl.remove();
	});
}

function fetchParams(rule, declName) {
	let params = Object.assign({}, DEFAULT_PARAMS[declName]),
		rangeDecl;

	// Fetch params from shorthand declName, i.e., font-size or line-height, etc
	fetchResponsiveSizes(rule, declName, (minSize, maxSize) => {
		params.minSize = minSize;
		params.maxSize = maxSize;
	});

	// Fetch params from shorthand font-range or line-height-range
	fetchRangeSizes(rule, PARAM_RANGE[declName], (minSize, maxSize) => {
		params.minWidth = minSize;
		params.maxWidth = maxSize;
	});

	// Fetch parameters from expanded properties
	rangeDecl = PARAM_DECLS[declName];

	Object.keys(rangeDecl).forEach((param) => {
		rule.walkDecls(rangeDecl[param], (decl) => {
			params[param] = decl.value.trim();
			decl.remove();
		});
	});

	return params;
}

/**
 * Build new responsive type rules
 * @param  {object} rule     old CSS rule
 * @return {object}          object of new CSS rules
 */
function buildRules(rule, declName, params, result) {
	let rules = {},
		minSize = params.minSize,
		maxSize = params.maxSize,
		minWidth,
		maxWidth,
		sizeUnit = getUnit(params.minSize),
		maxSizeUnit = getUnit(params.maxSize),
		widthUnit = getUnit(params.minWidth),
		maxWidthUnit = getUnit(params.maxWidth),
		sizeDiff,
		rangeDiff;

	if (sizeUnit === null) {
		throw rule.error('sizes with unitless values are not supported');
	}

	if (sizeUnit !== maxSizeUnit && widthUnit !== maxWidthUnit) {
		rule.warn(result, 'min/max unit types must match');
	}

	if (sizeUnit === 'rem' && widthUnit === 'px') {
		minWidth = pxToRem(params.minWidth);
		maxWidth = pxToRem(params.maxWidth);
	} else if (sizeUnit === widthUnit || (sizeUnit === 'rem' && widthUnit === 'em')) {
		minWidth = params.minWidth;
		maxWidth = params.maxWidth;
	} else {
		rule.warn(result, 'this combination of units is not supported');
	}

	// Check for the font-container property
	let fontContainer = rule.parent.some((i) => i.prop === 'font-container');

	if (fontContainer) {
		fontContainer = rule.parent.find((i) => i.prop === 'font-container').value.trim();
	}

	// Build the responsive type declaration
	sizeDiff = parseFloat(maxSize) - parseFloat(minSize);
	rangeDiff = parseFloat(maxWidth) - parseFloat(minWidth);

	if (fontContainer === 'true') {
		rules.responsive =
			'calc(' + minSize + ' + ' + sizeDiff + ' * ((100cqw - ' + minWidth + ') / ' + rangeDiff + '))';
	} else {
		rules.responsive =
			'calc(' + minSize + ' + ' + sizeDiff + ' * ((100vw - ' + minWidth + ') / ' + rangeDiff + '))';
	}

	// Build the container queries or media queries
	if (fontContainer === 'true') {
		rules.minMedia = postcss.atRule({
			name: 'container',
			params: '(max-width: ' + params.minWidth + ')',
		});

		rules.maxMedia = postcss.atRule({
			name: 'container',
			params: '(min-width: ' + params.maxWidth + ')',
		});
	} else if (fontContainer && fontContainer !== 'true') {
		rules.minMedia = postcss.atRule({
			name: 'container',
			params: fontContainer + ' (max-width: ' + params.minWidth + ')',
		});

		rules.maxMedia = postcss.atRule({
			name: 'container',
			params: fontContainer + ' (min-width: ' + params.maxWidth + ')',
		});
	} else {
		rules.minMedia = postcss.atRule({
			name: 'media',
			params: 'screen and (max-width: ' + params.minWidth + ')',
		});

		rules.maxMedia = postcss.atRule({
			name: 'media',
			params: 'screen and (min-width: ' + params.maxWidth + ')',
		});
	}

	// Add the required content to new container queries or media queries
	rules.minMedia
		.append({
			selector: rule.selector,
		})
		.walkRules((selector) => {
			selector.append({
				prop: declName,
				value: params.minSize,
			});
		});

	rules.maxMedia
		.append({
			selector: rule.selector,
		})
		.walkRules((selector) => {
			selector.append({
				prop: declName,
				value: params.maxSize,
			});
		});

	return rules;
}

const plugin = () => ({
	postcssPlugin: 'postcss-responsive-type',
	Once(root, { result }) {
		root.walkRules(function (rule) {
			let thisRule, newRules;

			// Check root font-size (for rem units)
			if (rule.selector.indexOf('html') > -1) {
				rule.walkDecls('font-size', (decl) => {
					if (decl.value.indexOf('px') > -1) {
						rootSize = decl.value;
					}
				});
			}

			rule.walkDecls(/^(font-size|line-height|letter-spacing)$/, (decl) => {
				let params;

				// If decl doesn't contain responsive keyword, exit
				if (decl.value.indexOf('responsive') === -1) {
					return;
				}

				thisRule = decl.parent;
				params = fetchParams(thisRule, decl.prop);
				newRules = buildRules(thisRule, decl.prop, params, result);

				// Insert the base responsive declaration
				if (decl.value.indexOf('responsive') > -1) {
					decl.replaceWith({ prop: decl.prop, value: newRules.responsive });
				}

				// Insert the container queries or media queries
				thisRule.parent.insertAfter(thisRule, newRules.minMedia);
				thisRule.parent.insertAfter(thisRule, newRules.maxMedia);
			});
		});
	},
});

plugin.postcss = true;

module.exports = plugin;
