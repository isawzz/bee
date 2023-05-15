const input = "'hallo'"; //1{2.4 \'[['[]4)()";
function start() {
	console.clear(); console.log('___code\n', input); console.log('start');
	for (const token of lexer(input)) { console.log(token); }
	// console.log(JSON.stringify([...lexer(input)]));
	console.log('finish');
}

function* lexer(s) {
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
start();

//#region old versions
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












