function animeBy(el, styles = {}, opts = {}) {
	let o = { targets: el };
	for (const prop in styles) {
		let k = valf(STYLE_PARAMS[prop], prop);
		k = convertCssToCamelCase(k);
		let val = styles[prop];
		if (['background', 'backgroundColor', 'color'].includes(k)) val = colorHex(val);
		let n = Number(val);
		o[k] = isNumber(val) ? prop == 'opacity' ? n : '' + n + 'px' : val;
	}
	addKeys(opts, o);
	if (isdef(opts.callback)) { o.complete = opts.callback; }
	let a = anime(o);
	return a;
}

function animeTo(el, styles = {}, opts = {}) {
	let o = { targets: el };
	for (const prop in styles) {
		let k = valf(STYLE_PARAMS[prop], prop);
		k = convertCssToCamelCase(k);
		let val = styles[prop];
		if (['background', 'backgroundColor', 'color'].includes(k)) val = colorHex(val);
		let n = Number(val);
		o[k] = isNumber(val) ? prop == 'opacity' ? n : '' + n + 'px' : val;
	}
	addKeys(opts, o);
	if (isdef(opts.callback)) { o.complete = opts.callback; }
	let a = anime(o);
	return a;
}
function animetestGetElement(n=1){
	let ch=arrChildren(dTable);
	for(let i=ch.length;i<n;i++){
		ch.push(animtestCreate(1, dTable, { w: 250, h: 250, bg: 'gold', margin: 10 }));
	}
	return n==1?ch[0]:arrTake(ch,n);
}
function animTo(els, styles = {}, opts = {}) {
	let o = {};
	for (const prop in styles) {
		let k = valf(STYLE_PARAMS[prop], convertCssToCamelCase(prop));
		let val = styles[prop];
		let n = Number(val);
		//console.log('val', val, 'n', n)
		o[k] = isNumber(val) ? prop == 'opacity' ? n : '' + n + 'px' : val;
	}
	let kflist = [o];
	//console.log('kflist', kflist)
	addKeys({ duration: 1000, delay: 0, fill: 'forwards' }, opts);
	if (!isList(els)) els = [els];
	let res = [];
	for (const elem of els) {
		let a = toElem(elem).animate(kflist, opts);
		res.push(a);
	}
	//typeof val == 'function'? val: 
	if (isdef(opts.callback)) { arrLast(res).onfinish = opts.callback; }
	return res.length == 1 ? res[0] : res;
}
function mAnimateTo(elem, prop, val, callback, msDuration = 1000, easing = 'cubic-mBezier(1,-0.03,.86,.68)', delay = 0) {
	let o = {};
	o[prop] = isString(val) || prop == 'opacity' ? val : '' + val + 'px';
	let kflist = [o];
	let opts = { duration: msDuration, fill: 'forwards', easing: easing, delay: delay };
	let a = toElem(elem).animate(kflist, opts);
	if (isdef(callback)) { a.onfinish = callback; }
	return a;
}














