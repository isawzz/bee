var C = null;
var S = {};
function download(jsonObject, fname) {
	json_str = JSON.stringify(jsonObject);
	saveFile(fname + '.json', 'data:application/json', new Blob([json_str], { type: '' }));
}
function downloadAsText(s, filename, ext = 'txt') {
	saveFileAtClient(
		filename + "." + ext,
		"data:application/text",
		new Blob([s], { type: "" }));
}
function error(msg) {
	let fname = getFunctionsNameThatCalledThisFunction();
	console.log(fname, 'ERROR!!!!! ', msg);
}
function getFunctionsNameThatCalledThisFunction() {
	let c1 = getFunctionsNameThatCalledThisFunction.caller;
	if (nundef(c1)) return 'no caller!';
	let c2 = c1.caller;
	if (nundef(c2)) return 'no caller!';
	return c2.name;
}
function isEmpty(arr) {
	return arr === undefined || !arr
		|| (isString(arr) && (arr == 'undefined' || arr == ''))
		|| (Array.isArray(arr) && arr.length == 0)
		|| Object.entries(arr).length === 0;
}
function isString(param) { return typeof param == 'string'; }
function nundef(x) { return x === null || x === undefined; }
function replaceAllSpecialChars(str, sSub, sBy) { return str.split(sSub).join(sBy); }
function rest() { }
async function route_path_text(url) {
	let data = await fetch(url);
	let text = await data.text();
	return text;
}
function saveFile(name, type, data) {
	if (data != null && navigator.msSaveBlob) return navigator.msSaveBlob(new Blob([data], { type: type }), name);
	var a = $("<a style='display: none;'/>");
	var url = window.URL.createObjectURL(new Blob([data], { type: type }));
	a.attr('href', url);
	a.attr('download', name);
	$('body').append(a);
	a[0].click();
	setTimeout(function () {
		window.URL.revokeObjectURL(url);
		a.remove();
	}, 500);
}
function saveFileAtClient(name, type, data) {
	if (data != null && navigator.msSaveBlob) return navigator.msSaveBlob(new Blob([data], { type: type }), name);
	let a = document.createElement('a');
	a.style.display = 'none';
	let url = window.URL.createObjectURL(new Blob([data], { type: type }));
	a.href = url;
	a.download = name;
	document.body.appendChild(a);
	simulateClick(a);
	setTimeout(function () {
		window.URL.revokeObjectURL(url);
		a.remove();
	}, 500);
}
function simulateClick(elem) {
	var evt = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
	var canceled = !elem.dispatchEvent(evt);
}
async function start() {
	input = await route_path_text('../pico0/closure.js');
	input = replaceAllSpecialChars(input, '\t', '  ');
	input = replaceAllSpecialChars(input, '\r', '');
	console.clear();
	let tok = tokutils(input);
	var tokenlist = [];
	while (tok.get() !== undefined) {
		let token = tok.code() ?? tok.string();
		if (token) tokenlist.push(token);
		else { error('unexpected char ' + tok.get()); tok.next(); }
	}
	tokenlist.push({ type: 'eof', val: null });
	let code = '', i = 0, slist = [];
	for (const t of tokenlist) {
		if (t.type == 'C') {
			code += t.val;
		} else if (t.type == 'S') {
			code += `'@@@${i++}@@@'`;
			slist.push(`${t.sep}${t.val}${t.sep}`);
		} else break;
	}
	console.log('liste hat', slist.length, 'entries')
	let res = '', rest = code; i = -1;
	while (!isEmpty(rest) && ++i < slist.length) {
		let chunk = stringBefore(rest, `'@@@`);
		res += chunk;
		res += slist[i];
		rest = stringAfter(rest, `@@@'`);
	}
	res += rest;
	downloadAsText(res, 'newnewnew', 'js')
	console.log('DONE!')
}
function stringAfter(sFull, sSub) {
	let idx = sFull.indexOf(sSub);
	if (idx < 0) return '';
	return sFull.substring(idx + sSub.length);
}
function stringBefore(sFull, sSub) {
	let idx = sFull.indexOf(sSub);
	if (idx < 0) return sFull;
	return sFull.substring(0, idx);
}
function tokutils(s) {
	var _cursor = 0, _ch = s[0];
	function get() { return _ch; }
	function next() { _ch = s[++_cursor]; }
	function peek(n) { return s[_cursor + n]; }
	function peekstr(n) { return s.substring(_cursor, _cursor + n); }
	function white() { while (/\s/.test(_ch)) next(); return null; }
	function error(msg) { console.log(msg); }
	function lexchar(list) { let res = list.includes(_ch) ? { type: _ch, val: _ch } : null; if (res) next(); return res; }
	function exceptch(list, type) { let val = ''; while (_ch != undefined && !list.includes(_ch)) { val += _ch; next(); } return val.length >= 1 ? { type: type, val } : null; }
	function exceptstr(list, type) {
		let val = '';
		while (_ch != undefined && !list.some(x => peekstr(x.length) == x)) { val += _ch; next(); } return val.length >= 1 ? { type: type, val } : null;
	}
	function number() { let val = ''; while (Number(_ch)) { val += _ch; next(); } return val.length >= 1 ? { type: 'N', val: Number(val) } : null; }
	function string() {
		if ("'`\"".includes(_ch)) {
			let sep = _ch;
			next();
			let val = '';
			while (![undefined, sep].includes(_ch)) {
				val += _ch;
				if (_ch == '\\') { console.log('YES'); next(); val += _ch; }
				next();
			}
			next();
			return { type: 'S', val, sep };
		} else return null;
	}
	function code() { return exceptch("'`\"", 'C'); }
	return { get, next, peek, peekstr, white, error, lexchar, exceptch, exceptstr, code, number, string };
}
