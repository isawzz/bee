function animtestCreate(n, dParent, styles) {
	return range(n).map((i) => mDiv(dParent, styles));
}
function animtestAnimate(el, styles, opts) {
	let o = { targets: el };
	for (const prop in styles) {
		let k = valf(STYLE_PARAMS[prop], prop);
		o[k] = styles[prop];
	}
	addKeys(opts, o);
	anime(o);
}
function convertCssToCamelCase(prop) {
	var replaced = prop.replace(/-([a-z])/gi, function (s, group1) {
		return group1.toUpperCase();
	});
	return replaced;
}







