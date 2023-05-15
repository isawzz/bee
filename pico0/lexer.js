function* lexer(s) {
	let cursor = 0, char = s[0];

	function next() { cursor++; char = s[cursor]; }
	function peek(n) { return s[cursor + n]; }

	function number() {
		let value = '';
		let r = new RegExp(/^[0-9]\d*(\.\d+)?$/);
		if (char == '-' && r.test(peek(1))) { value = '-'; next(); }
		while (r.test(char)) { value += char; next(); }
		return value.length >= 1 ? { type: 'number', value } : null;
	}

	function white() { while (/\s/.test(char)) next(); }

	function eof() {
		if (char === undefined) { return { type: 'EOF' } } else return null;
	}

	function lexchar(ch) { if (char === ch) { next(); return { type: ch } } else return null; }
	function lexchar(list) { let res = list.includes(char) ? { type: char } : null; if (res) next(); return res; }

	for (; ;) {
		white();
		let token = number() ?? lexchar('{}[]()') ?? eof();
		if (token) {
			yield token;
			if (token.type == 'EOF') break;
		}
		else { yield { type: 'unknown', value: `unexpected character "${char}" at ${cursor}` }; next();  }
	}
}
