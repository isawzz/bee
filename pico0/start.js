
async function start() {
	//codeFormatter('../pico0/allglobals.js');
}
async function codeFormatter(path){
	input = await route_path_text(path);
	input = replaceAllSpecialChars(input, '\t', '  ');
	input = replaceAllSpecialChars(input, '\r', '');
	console.clear();
	//let s = ` hallo das "hallo ist ein "w"ort" aber 123 nicht!`
	//input = `let match = html && /\bsrc="?([^"\s]+)"?\s*/.exec(html);`
	let tok = tokutils(input);
	let prev = null;
	var tokenlist = []; let rcount = 0;
	while (tok.get() !== undefined) {
		let token = tok.string() ?? tok.code() ?? tok.regexp() ?? tok.comment();
		if (token === true) { prev = null; continue; } //break;
		if (token) {
			if (prev && prev.type == token.type) { console.log('BAD!!!', token, prev, tok.getpos()); break; }
			prev = token;
			token.line = tok.getpos().line;
			tokenlist.push(token);
			if (token.type == 'R') { rcount++; if (rcount > 1300) break; }
		} else { error('unexpected char ' + tok.get() + ', pos:' + tok.getpos().line); tok.next(); break; }
	}
	//tokenlist.map(x => {if (x.type == 'R') console.log(x)});
	// tokenlist.map(x => console.log(x));
	console.log('stopped at', tok.getpos(), tok.peekstr(20))
	tokenlist.push({ type: 'eof', val: null });
	// console.log('tokens:', tokenlist.length);

	let code = '', i = 0, slist = [];
	for (const t of tokenlist) {
		// if (prev == t.type) { console.log('FEHLER BEI', t); return; } prev = t.type;
		if (t.type == 'C') {
			code += t.val;
		// } else if (t.type == 'S') {
		// 	code += `'@@@${i++}@@@'`;
		// 	slist.push(`${t.sep}${t.val}${t.sep}`);
		} else if (t.type == 'R' || t.type == 'S') {
			i++;
			code += `${t.sep}${t.val}${t.sep}`;
			//slist.push(`${t.sep}${t.val}${t.sep}`);
		} else break;
	}

	//console.log('code', code)
	//slist.map(x => console.log(x))
	console.log('liste hat', slist.length, 'entries')
	//downloadAsYaml(slist,'mystrings');
	downloadAsText(code,'mycode','js');
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





function test_replaceAllSafe() {
	let msg = '"hallo das ist gu"t"""';
	let msg1 = msg.replace(/"/g, '');
	let msg2 = replaceAllSafe(msg, '"', '');
	console.log('msg', msg, msg1 == msg2); return;


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
	//input = await route_path_text('../allg.js');
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







