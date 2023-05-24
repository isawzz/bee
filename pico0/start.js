
async function start() {

	input = await route_path_text('../pico0/allfuncs.js');
	input = replaceAllSpecialChars(input, '\t', '  ');
	input = replaceAllSpecialChars(input, '\r', '');
	console.clear();
	//let s = ` hallo das "hallo ist ein "w"ort" aber 123 nicht!`
	let tok = tokutils(input);
	var tokenlist = [];
	while (tok.get() !== undefined) {
		let token = tok.code() ?? tok.string();
		if (token) tokenlist.push(token);
		else { error('unexpected char ' + tok.get()); tok.next(); }
	}
	tokenlist.push({ type: 'eof', val: null });
	tokenlist.map(x => console.log(x));
	console.log('tokens:',tokenlist.length);
	//return;

	let code = '', i = 0, slist = [], prev=null; 
	for (const t of tokenlist) {
		if (prev == t.type){
			console.log('FEHLER BEI',t);
			return;
		}
		prev=t.type;
		if (t.type == 'C') {
			code += t.val;
		} else if (t.type == 'S') {
			code += `'@@@${i++}@@@'`;
			slist.push(`${t.sep}${t.val}${t.sep}`);
		} else break;
	}
	//downloadAsYaml(slist,'mystrings');
	//downloadAsText(code,'mycode','js');

	//console.log('code', code)
	//slist.map(x => console.log(x))
	console.log('liste hat', slist.length, 'entries')
	return;
	//zusammenstueckeln!!!!
	let res = '', rest = code; i = -1;
	while (!isEmpty(rest) && ++i < slist.length) {
		let chunk = stringBefore(rest, `'@@@`);
		res += chunk;
		res += slist[i];
		rest = stringAfter(rest, `@@@'`);
	}

	res += rest;
	//console.log('resulting code:\n',res)
	//downloadAsText(res, 'newnewnew', 'js')
	mBy('code1').innerHTML = res; //res.substring(0,100);
	console.log('DONE!')

	//test_hallo(); //testLettersBefore();//test_littleParser(); //test_newline()	//test_lexer();
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
			//console.log('sep', sep)
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







function test_hallo() {
	let s = '"hallo"';
	tokens = tokenizer(s); console.log('tokens', tokens)

}
function tokenizer(s) {
	var _cursor = 0, _ch = s[0];
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
			//console.log('sep', sep)
			while (![undefined, sep].includes(_ch)) {
				val += _ch;
				if (_ch == '\\') { next(); val += _ch; }
				next();
			}

			next();
			return { type: 'S', val };
		} else return null;
	}
	var tokenlist = [];
	while (_ch !== undefined) {
		let token = string();
		if (token) tokenlist.push(token);
		else { error('unexpected char ' + _ch); next(); }
	}
	tokenlist.push({ type: 'eof', val: null });
	return tokenlist;
	// return {next, peek, peekstr,white,error,lexchar,exceptch,exceptstr,number,string};
}
async function testLettersBefore() {
	//input = await route_path_text('../allglobals.js');
	input = await route_path_text('../pico0/allfuncs.js');
	input = replaceAllSpecialChars(input, '\t', '  ');
	input = replaceAllSpecialChars(input, '\r', '');
	console.clear();

	let parts = input.split('{');
	let zuvor = {};
	for (const p of parts) {
		let pt = p.trim();
		let ch = pt[pt.length - 1]; //stringLast(pt);
		if (nundef(zuvor[ch])) zuvor[ch] = true;
	}

	console.log('zuvor', get_keys(zuvor))
}
async function test_littleParser() {
	let file = '../pico0/source.js';
	input = await route_path_text(file);
	input = replaceAllSpecialChars(input, '\t', '  ');
	input = replaceAllSpecialChars(input, '\r', '');
	console.clear();
	let ast = littleParser(input); //"function dsf sdf() fs{ hasdasjkjgnd 12 }{23}{{}}}"); //12 3 'hallo 43234 \ndas' 14 2455");
	console.dir(ast, { depth: null });

	mBy('code1').innerHTML = prpr(ast);
	// let [o, dParent, title] = [ast, mBy('code1'), 'AST']
	// mNode(o, dParent, title);
}
function prpr(ast, ind = 0) {
	if (Array.isArray(ast)) return ast.map(x => prpr(x, ind)).join('');

	let t = ast.type;
	if (t == 'eof') { return ''; }
	else if (t == 'NB') {
		let s = ast.val.trim();
		return (s.length == 1) ? s : ' '.repeat(ind) + s;
	} else if (t == 'Braced') {
		let st = prpr(ast.m, ind + 2);
		//return '\n' + ' '.repeat(ind) + '{\n' + st + '\n' + ' '.repeat(ind) + '}\n';
		return ' {\n' + st + '\n' + ' '.repeat(ind) + '}';
	}
}
async function test_parser() {
	let file = '../pico0/source.js';
	input = await route_path_text(file);
	input = replaceAllSpecialChars(input, '\t', '  ');
	input = replaceAllSpecialChars(input, '\r', '');
	//console.clear(); 
	const forest = parser(file, lexer(file, input));
	forest.map(x => console.dir(x, { depth: null }));
	let [o, dParent, title] = [forest[0], mBy('code1'), 'AST']
	mNode(o, dParent, title);

}
async function test_lexer() {
	let input = `7574 334 2`;
	let file = '../pico0/source.js';
	input = await route_path_text(file);
	console.log('start');
	let res = lexer(file, input);
	//console.log('res', res)
	for (const token of res) {
		console.log(token);
	}
	console.log('finish');

}
function test_newline() {
	const input = "-7737 23\n13a3003\n\n";
	const input2 = `-7737 23
13a3003

`;
	const input3 = "-7737 23\r\n13a3003\r\n\r\n";
	let i4 = replaceAllSpecialChars(input3, '\r', '')
	console.log('code', input == input2, input == input3, input == i4)

}







