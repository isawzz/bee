function isNumeric(ch) {
	//let r = new RegExp(/^\d*$/);
	//return /^\d*$/.test(ch);
	return ch >= '0' && ch <= '9';
}

function* lexer(file, s, verbose = false) {
	//assumes: no \t and no \r in s
	let cursor = 0, char = s[0]; if (verbose) console.log('lexer:', char);

	let line = 1, column = 0;
	function next() { cursor++; if (char == '\n') { column = 1; line++; } else column++; char = s[cursor]; if (verbose) console.log('lexer:', char); }
	function peek(n) { return s[cursor + n]; }

	let special = '{}[]()\'"`+=/*';
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
	function addop() { return lexchar('+-'); }
	function mulop() { return lexchar('*/%'); }

	function white() { while (/\s/.test(char)) next(); }

	function eof() {
		if (char === undefined) { return { type: 'EOF' }; } else return null;
	}

	function lexchar(ch) { if (char === ch) { next(); return { type: ch } } else return null; }
	function lexchar(list) { let res = list.includes(char) ? { type: char } : null; if (res) next(); return res; }

	for (; ;) {
		white();
		let token = number() ?? listchar() ?? nolist();
		if (token) { yield token; continue; }
		if (token = eof()) { if (verbose) console.log('EOF!!!', char); yield token; break; }
		yield `unexpected: "${char}" at ${file}:${line}:${column}`; next();
	}
}

// *** testing ***
//console.log('module',typeof module)
//if (module !== undefined) module.exports = lexer;

// *** to import default function:  ***
if (typeof module !== 'undefined' && module.exports) { module.exports = lexer; }

// *** to import multiple functions:  ***
// if (typeof module !== 'undefined' && module.exports) { // expose as a commonjs module
// 	module.exports = {
// 		lexer,
// 		isNumeric
// 	};
// 	console.log('...importing from CommonJS:', Object.keys(module.exports))
// }


