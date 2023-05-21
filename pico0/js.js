//#region top stuff
//usage: nodemon -q js.js
//import { readFileSync } from 'fs' // import pkg from "./lexer.cjs" // const { lexer } = pkg;
// *** weil lexer.js ein CommonJS ist: ***
var fs = require('fs');
var lexer = require('./lexer.js');
var parser = require('./parser.js');
var littleParser = require('./littleParser.js');

var input = "123 4134\n -13"; //'hallo'"; //1{2.4 \'[['[]4)()";
var file = './source.js', line = 1, col = 1;
input = fs.readFileSync(file); //das returned einen weireden Buffer mit bytes
input = String(input);
function replaceAllSpecialChars(str, sSub, sBy) { return str.split(sSub).join(sBy); }
input = replaceAllSpecialChars(input, '\t', '  ');
input = replaceAllSpecialChars(input, '\r', '');

//#endregion
function start() {
	test_littleParser(); //test_parser();
}

function test_littleParser() {
	console.clear();
	let ast = littleParser(input); //"function dsf sdf() fs{ hasdasjkjgnd 12 }{23}{{}}}"); //12 3 'hallo 43234 \ndas' 14 2455");
	console.dir(ast, { depth: null });
}





//#region done
function test_parser() {
	console.clear(); //console.log('start');//console.log('___code\n', input); 

	const forest = parser(file, lexer(file, input));

	forest.map(x => console.dir(x, { depth: null })); return;

	console.dir(forest, { depth: null }); return;

	for (const ast of forest) {
		let res = outputast(ast); console.log(res)
	}
	// for (const token of lexer(file,input)) { console.log(token); }
	// console.log(JSON.stringify([...lexer(input)]));
	//console.log('finish');
}
//console.log('input\n',input)
start();


function outputast(ast) {
	let x = JSON.stringify(ast);
	console.log(x)
}
function outputast(ast) {
	// console.log('typeof ast',typeof ast)
	if (t == 'object' && ast.type !== undefined) {
		let s = `${ast.type} (`
		for (const k of Object.keys(ast)) {
			let val = ast[k];
			s += k + ' ';
			if (typeof val == 'object') outputast(val);
		}
		s += ')';
		console.log(s)
	}
}
function outputast(ast) {
	let t = typeof ast;
	if (t == 'string') return ast;
	if (t == 'object') {
		let s = `(type:${ast.type}\n`;
		for (const k of Object.keys(ast)) {
			if (k == 'type') continue;
			s += k + ':' + outputast(ast[k]) + ' ';
		}
		s = s.substring(0, s.length - 1); s += ')';
		return s;
	}
	return '';
}

function outputast(ast, ind = 0) {
	let t = typeof ast;
	if (t == 'string' || t == 'number') return ast;
	if (ast === null) return '\n*** BUG!!! ***';
	if (t == 'object') {
		//console.log('ast',ast,typeof ast)
		let s = '\n' + ' '.repeat(ind) + `(type:${ast.type} `;
		for (const k of Object.keys(ast)) {
			if (['type', 'line', 'column'].includes(k)) continue;
			s += outputast(ast[k], ind + 1) + ' ';
		}
		s = s.substring(0, s.length - 1); s += ')';
		return s;
	}
	return '';
}

function outputast(ast, ind = 0) {
	let t = typeof ast;
	if (t == 'string' || t == 'number') return ast;
	if (ast === null) return `\n*** BUG!!! ${line}:${col} ***`;
	if (t == 'object') {
		//if (ast.type == 'oplit') console.log('ast', ast, typeof ast)
		let s = '\n' + ' '.repeat(ind) + `(type:${ast.type} `;
		for (const k of Object.keys(ast)) {
			if (k == 'line') { line = ast.line; continue; }
			if (k == 'column') { col = ast.column; continue; }
			if (k == 'type') { continue; }
			s += outputast(ast[k], ind + 1) + ' ';
		}
		s = s.substring(0, s.length - 1); s += ')';
		return s;
	}
	return '';
}



var count_checks = 0;
function trace(name, v) { console.log('check', count_checks++, name); return v; }
function* lexer_trace_throw(s) {

	for (let i = 0; i <= s.length; i++) {
		let ch = s[i];
		if (trace('7', ch === '7')) { yield { type: 'number', value: 7 } }
		else if (trace('undefined', ch === undefined)) { yield { type: 'EOF' } }
		else throw new SyntaxError(`unexpected char ${ch} at position ${i}`)
	}

}

//versions
function* lexer0(s) {
	for (let i = 0; i <= s.length; i++) {
		let ch = s[i];
		if (ch === '7') { yield { type: 'number', value: ch }; }
		else if (ch === undefined) { yield { type: 'EOF' } }
		else { yield { type: `ERROR at char ${i}`, value: ch } }
	}
}
function* lexer1(s) {

	for (let i = 0; i <= s.length; i++) {
		let ch = s[i];
		//console.log('ch', ch)
		function number() {
			let value = '';
			for (; i <= s.length; i++) {
				ch = s[i];
				if (ch == '7') { value += ch; }
				else { break; }
			}
			return { type: 'number', value }
		}

		if (ch === '7') { yield number(); } // { type: 'number', value: 7 } }
		else if (ch === undefined) { yield { type: 'EOF' } }
		else { yield { type: `ERROR at char ${i}`, value: ch } }

	}

}
function* lexer2(s) {
	let cursor = 0;
	let char = undefined;

	function number() {
		let value = '';
		for (; cursor <= s.length; cursor++) {
			char = s[cursor];
			if (char == '7') { value += char; }
			else { break; }
		}
		return value.length >= 1 ? { type: 'number', value } : null;
	}

	function eof() {
		if (char === undefined) { cursor++; return { type: 'EOF' } } else return null;
	}

	for (; cursor <= s.length;) {
		let token = number() ?? eof();
		if (token) yield token;
		else throw new SyntaxError(`unexpected character "${char}" at ${cursor + 1}`)
	}

}
function* lexer3(s) {
	let cursor = 0;
	let char = undefined;

	function number() {
		let value = '';
		for (; cursor <= s.length; cursor++) {
			char = s[cursor];
			if (char == '7') { value += char; }
			else { break; }
		}
		return value.length >= 1 ? { type: 'number', value } : null;
	}

	function eof() {
		if (char === undefined) { cursor++; return { type: 'EOF' } } else return null;
	}

	for (; ;) {
		let token = number() ?? eof();
		if (token) { yield token; if (token.type == 'EOF') break; }
		else { cursor++; yield { type: 'unknown', value: `unexpected character "${char}" at ${cursor}` }; }
	}

}
function* lexer4(s) {
	let cursor = 0, char = s[0];

	function next() { cursor++; char = s[cursor]; }

	function number() {
		let value = '';
		while (/^\d+$/.test(char)) { value += char; next(); }
		return value.length >= 1 ? { type: 'number', value } : null;
	}

	function white() {
		let value = '';
		while (/\s/.test(char)) { value += char; next(); }
		return value.length >= 1 ? { type: 'white', value } : null;
	}

	function eof() {
		if (char === undefined) { return { type: 'EOF' } } else return null;
	}
	function lexchar(ch) { if (char === ch) { next(); return { type: ch } } else return null; }

	for (; ;) {
		let token = white() ?? number() ?? lexchar('{') ?? lexchar('}') ?? eof();
		if (token) {
			if (token.type != 'white') yield token;
			if (token.type == 'EOF') break;
		}
		else { next(); yield { type: 'unknown', value: `unexpected character "${char}" at ${cursor}` }; }
	}
}
function* lexer5(s) {
	let cursor = 0, char = s[0];

	function next() { cursor++; char = s[cursor]; }

	function number() {
		let value = '';
		let r = new RegExp(/^-?[0-9]\d*(\.\d+)?$/);
		console.log('==>', value + char)
		while (r.test(value + char)) { value += char; next(); }
		//while (/^\d+$/.test(char)) { value += char; next(); }
		return value.length >= 1 ? { type: 'number', value: +value } : null;
	}

	function white() {
		let value = '';
		while (/\s/.test(char)) { value += char; next(); }
		return value.length >= 1 ? { type: 'white', value } : null;
	}

	function eof() {
		if (char === undefined) { return { type: 'EOF' } } else return null;
	}

	function lexchar(ch) { if (char === ch) { next(); return { type: ch } } else return null; }
	function lexchar(list) { let res = list.includes(char) ? { type: char } : null; if (res) next(); return res; }

	for (; ;) {
		let token = white() ?? number() ?? lexchar('{}[]()') ?? eof();
		if (token) {
			if (token.type != 'white') yield token;
			if (token.type == 'EOF') break;
		}
		else { next(); yield { type: 'unknown', value: `unexpected character "${char}" at ${cursor}` }; }
	}
}
function* lexer6(s) {
	let cursor = 0, char = s[0];

	function next() { cursor++; char = s[cursor]; }
	function peek(n) { return s[cursor + n]; }

	function number() {
		let value = '';
		let r = new RegExp(/^\d*$/);
		if (char == '-' && r.test(peek(1))) { value = '-'; next(); }
		while (r.test(char)) { value += char; next(); }
		return value.length >= 1 ? { type: 'number', value } : null;
	}
	function nobr() {
		let value = '';
		while (/^[^{}()['"`\]]$/.test(char)) { value += char; next(); }
		return value.length >= 1 ? { type: 'nobr', value } : null;
	}

	function white() { while (/\s/.test(char)) next(); }

	function eof() {
		if (char === undefined) { return { type: 'EOF' } } else return null;
	}

	function lexchar(ch) { if (char === ch) { next(); return { type: ch } } else return null; }
	function lexchar(list) { let res = list.includes(char) ? { type: char } : null; if (res) next(); return res; }

	for (; ;) {
		white();
		let token = nobr() ?? lexchar('{}[]()\'"`') ?? eof();
		if (token) {
			yield token;
			if (token.type == 'EOF') break;
		}
		else { yield { type: 'unknown', value: `unexpected character "${char}" at ${cursor}` }; next(); }
	}
}
function* lexer7(s) {
	// var inErrorMode = false;
	let cursor = 0, char = s[0];
	let line = 1, column = 0;
	function next() { cursor++; if (char == '\n') { column = 1; line++; } else column++; char = s[cursor]; }
	function peek(n) { return s[cursor + n]; }

	function number() {
		let value = '';
		if (char == '-' && isNumeric(peek(1))) { value = '-'; next(); }
		while (isNumeric(char)) { value += char; next(); }
		return value.length >= 1 ? { type: 'number', value } : null;
	}
	function nobr() {
		let value = '';
		while (/^[^{}()['"`\]]$/.test(char)) { value += char; next(); }
		return value.length >= 1 ? { type: 'nobr', value } : null;
	}

	function white() { while (/\s/.test(char)) next(); }

	function eof() {
		if (char === undefined) { return { type: 'EOF' } } else return null;
	}

	function lexchar(ch) { if (char === ch) { next(); return { type: ch } } else return null; }
	function lexchar(list) { let res = list.includes(char) ? { type: char } : null; if (res) next(); return res; }

	for (; ;) {
		white();
		let token = number() ?? lexchar('{}[]()\'"`') ?? eof();
		if (token) {
			yield token;
			if (token.type == 'EOF') break;
			// inErrorMode = false;
		}
		else { yield `unexpected: "${char}" at ${file}:${line}:${column}`; next(); }
		// else { 
		// 	if (!inErrorMode) yield `unexpected: "${char}" at ${file}:${line}:${column}`; 
		// 	next(); inErrorMode=true;
		// }
		// else { yield { type: 'unknown', value: `unexpected character "${char}" at ${file}:${line}:${column}` }; next(); }
		// else { throw new SyntaxError(`unexpected character "${char}" at ${file}:${line}:${column}`); }
	}
}
function* lexer8(file, s) {
	//assumes: no \t and no \r in s
	let cursor = 0, char = s[0];

	let line = 1, column = 0;
	function next() { cursor++; if (char == '\n') { column = 1; line++; } else column++; char = s[cursor]; }
	function peek(n) { return s[cursor + n]; }

	let special = '{}[]()\'"`';
	function listchar() { let res = special.includes(char) ? { type: char } : null; if (res) next(); return res; }
	function nolist() {
		let value = '';
		while (char !== undefined && !special.includes(char)) { value += char; next(); }
		return value.length >= 1 ? { type: 'nolist', value: value.trim() } : null;
	}

	function number() {
		let value = '';
		if (char == '-' && isNumeric(peek(1))) { value = '-'; next(); }
		while (isNumeric(char)) { value += char; next(); }
		return value.length >= 1 ? { type: 'number', value } : null;
	}
	// function nobr() { let value = ''; while (/^[^{}()['"`\]]$/.test(char)) { value += char; next(); } return value.length >= 1 ? { type: 'nobr', value } : null; }

	function white() { while (/\s/.test(char)) next(); }

	function eof() {
		if (char === undefined) { return { type: 'EOF' } } else return null;
	}

	function lexchar(ch) { if (char === ch) { next(); return { type: ch } } else return null; }
	function lexchar(list) { let res = list.includes(char) ? { type: char } : null; if (res) next(); return res; }

	for (; ;) {
		white();
		let token = number() ?? listchar() ?? nolist() ?? eof();
		if (token) { yield token; if (token.type == 'EOF') break; }
		else { yield `unexpected: "${char}" at ${file}:${line}:${column}`; next(); }
	}
}

function parser0(tokens) {
	//source: '11+22+33+44'
	let last = null, opn1 = null, opn2 = null, op = null;
	let result = [];
	for (const token of tokens) {
		if (op) {
			const opn2 = token;
			result.push({
				type: 'binop',
				opn1: opn1,
				opn2: opn2,
				op: op
			});
		}
		if ('+-*/'.includes(token.type)) {
			op = token;
			opn1 = last;
		}
		last = token;
		//console.log(token)
	}
	return result;
}
function parser1(tokens) {
	//source: '11+22'
	let token = null;

	function next() { token = tokens.next().value; console.log('parser:', token && token.type) }

	function number() {
		if (token.type == 'number') {
			const _token = token;
			next();
			return _token;
		} else return null;
	}
	function binop() {
		if ('+-*/'.includes(token.type)) {
			const _token = token;
			next();
			return _token;
		} else return null;
	}
	function binexp() {
		const left = number();
		if (!left) return null;
		const op = binop();
		if (!op) return null;
		const right = number();
		if (!right) return null;

		return { type: 'binexp', left, op, right };
	}

	next();	//console.log('token', token);
	const program = binexp()
	if (!program) {
		throw new SyntaxError(`unknown token ${token.type}`);
	}

	return program;
}
function parser2(tokens, verbose = false) {
	let token = null;

	function next() { token = tokens.next().value; if (verbose) console.log('parser:', token && token.type) }

	function numlit() {
		if (token.type == 'number') {
			const _token = token;
			next();
			return { type: 'numlit', value: _token.value };
		} else return null;
	}
	function oplit() {
		if (token && '+-*/'.includes(token.type)) {
			const _token = token;
			next();
			return { type: 'oplit', value: _token.type };
		} else return null;
	}
	function binexp() {
		const head = numlit();
		if (!head) return null;
		return bintail(head);
	}
	function bintail(head) {
		const op = oplit();
		if (!op) return head;
		const right = binexp();
		if (!right) {
			throw new SyntaxError(`right operand missing!!!, got ${token.type}`,);
		};

		return { type: 'binexp', left: head, op, right };
	}

	next();	//console.log('token', token);
	const program = binexp()
	if (token.type != 'EOF') { throw new SyntaxError(`expected EOF, got ${token.type}`); }
	//if (!program) { throw new SyntaxError(`unknown token ${token.type}`); }
	//console.log('token',token)
	//if (token) { throw new SyntaxError(`unknown token ${token.type}`); }

	return program;
}
function parser3(file, tokens, verbose = false) {
	let token = null;

	function next() { token = tokens.next().value; if (verbose) console.log('parser:', token && token.type) }

	function numlit() {
		if (token.type == 'number') {
			const _token = token;
			next();
			//console.log('token',token)
			return { type: 'numlit', value: _token.value, line: _token.line, column: _token.column };
		} else return null;
	}
	function oplit() {
		if (token && '+-*/'.includes(token.type)) {
			const _token = token;
			next();
			return { type: 'oplit', value: _token.type };
		} else return null;
	}
	function binexp() {
		const head = numlit();
		if (!head) return null;
		const op = oplit();
		if (!op) return head;
		const right = binexp();
		if (!right) { error('right operand missing!!!'); }

		return { type: 'binexp', left: head, op, right };
	}
	function binexpL() {
		const head = numlit();
		if (!head) return null;

		return bintail(head);
	}
	function bintail(head) {
		const op = oplit();
		if (!op) return head;
		const right = numlit();
		if (!right) { error('right operand missing!!!'); }

		const node = { type: 'binexpL', left: head, op, right };
		return bintail(node);
	}
	function error(msg) {
		// throw new SyntaxError(`right operand missing!!!, got ${token.type}`,);
		console.log('SyntaxError!!!', msg)
		if (token.type == 'EOF') {
			console.log('unexpected EOF reached')
		} else console.log(`got ${token.type} at ${file}:${token.line}:${token.column}`);
	}

	next();
	const program = binexp()
	if (token.type != 'EOF') { error('expected EOF'); }

	return program;
}
function parser4(file, tokens, verbose = false) {
	let token = null;

	function next() { token = tokens.next().value; if (verbose) console.log('parser:', token && token.type) }

	function numlit() {
		if (token.type == 'number') {
			const _token = token;
			next();
			//console.log('token',token)
			return { type: 'numlit', value: _token.value, line: _token.line, column: _token.column };
		} else return null;
	}
	function oplit() {
		if (token && '+-*/'.includes(token.type)) {
			const _token = token;
			next();
			return { type: 'oplit', value: _token.type };
		} else return null;
	}
	function binexp() {
		const head = numlit();
		if (!head) return null;
		const op = oplit();
		if (!op) return head;
		const right = binexp();
		if (!right) { error('right operand missing!!!'); }

		return { type: 'binexp', left: head, op, right };
	}
	function binexpL() {
		const head = numlit();
		if (!head) return null;

		return bintail(head);
	}
	function bintail(head) {
		const op = oplit();
		if (!op) return head;
		const right = numlit();
		if (!right) { error('right operand missing!!!'); }

		const node = { type: 'binexpL', left: head, op, right };
		return bintail(node);
	}

	var errCount = 0;
	function error(msg) {
		// throw new SyntaxError(`right operand missing!!!, got ${token.type}`,);
		console.log(`parse error ${++errCount}!!!`, msg)
		if (token.type == 'EOF') { console.log('unexpected EOF reached') }
		else console.log(`  got ${token.type} at ${file}:${token.line}:${token.column}`);
	}

	next();
	const forest = [];
	while (token) {
		let tree = binexp();
		forest.push(tree);
		if (token && token.type != 'EOF') error('>unexpected:')
		next();
		if (token && token.type == 'EOF') break;
	}

	//if (token.type != 'EOF') { error('expected EOF'); }
	if (errCount > 0) { console.log(`parsing ${errCount} ERRORS!!!`) }
	else { console.log('parsing ...ok') }

	return forest;
}
//#endregion










