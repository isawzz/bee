function mAnimateTo(elem, prop, val, callback, msDuration = 1000, easing = 'cubic-bezier(1,-0.03,.86,.68)', delay = 0) {
	let o = {};
	o[prop] = isString(val) || prop == 'opacity' ? val : '' + val + 'px';
	let kflist = [o];
	let opts = { duration: msDuration, fill: 'forwards', easing: easing, delay: delay };
	let a = toElem(elem).animate(kflist, opts);
	if (isdef(callback)) { a.onfinish = callback; }
	return a;
}
function animTo(els, styles = {}, opts = {}) {
	let o = {};
	for (const prop in styles) {
		let k = valf(STYLE_PARAMS[prop], convertCssToCamelCase(prop));
		let val = styles[prop];
		let n = Number(val);
		console.log('val',val,'n', n)
		o[k] = isNumber(val) ? prop == 'opacity' ? n : '' + n + 'px' : val;
	}
	let kflist = [o];
	console.log('kflist',kflist)
	let easing = 'ease'; //normalizeEasing('easeOutElastic');
	let elasticity = 500; //(1000 - minMaxValue(500, 1, 999)) / 1000;

	addKeys({ duration: 1000, delay: 0, easing: easing, elasticity: elasticity, fill: 'forwards', iterations: 2, direction: 'alternate' }, opts);
	if (!isList(els)) els=[els];
	let res=[];
	for(const elem of els){
		let a = toElem(elem).animate(kflist, opts);
		res.push(a);
	}
	//typeof val == 'function'? val: 
	if (isdef(opts.callback)) { arrLast(res).onfinish = opts.callback; }
	return res.length==1?res[0]:res;
}













