
function littleParser(s) {
	// parses string literals and non-string code
	//grammar: 
	// P := EMPTY | CODE | S | P P
	// EMPTY := ''
	// NB := any_char_except_{}
	function tokenizer(s) {
		var _cursor = 0, _ch = s[0];
		function next() { _ch = s[++_cursor]; }
		function white() { while (/\s/.test(_ch)) next(); return null; }
		function error(msg) { console.log(msg); }
		function lexchar(list) { let res = list.includes(_ch) ? { type: _ch, val: _ch } : null; if (res) next(); return res; }
		function exceptch(list, type) { let val = ''; while (_ch != undefined && !list.includes(_ch)) { val += _ch; next(); } return val.length >= 1 ? { type: type, val } : null; }
		function exceptstr(list, type) { 
			let val = ''; 
			let peek = s.substring(_cursor);
			while (_ch != undefined && !list.includes(_ch)) { val += _ch; next(); } return val.length >= 1 ? { type: type, val } : null; 
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
					if (ch == '\\'){next();val += _ch; } 
					next(); 
				}
				
				next();
				return { type: 'S', val };
			} else return null;
		}

		var tokenlist = [];
		while (_ch !== undefined) {
			let token = white() ?? number() ?? string();
			if (token) tokenlist.push(token);
			else { error('unexpected char ' + _ch); next(); }
		}
		tokenlist.push({ type: 'eof', val: null });
		return tokenlist;
	}
	var tokens, token, idx = 0;
	function nextToken() { token = tokens[idx++]; }

	function P() {
		nextToken();
		return EMPTY() ?? [Lit()].concat(P()); //reflects BNF exactly!!!!!!!
	}
	function EMPTY() { return token && token.type == 'eof' ? token : null; }
	function Lit() { return N() ?? S(); }
	function N() { return token && token.type == 'N' ? token : null; }
	function S() { return token && token.type == 'S' ? token : null; }

	function parse() {
		tokens = tokenizer(s);
		let ast = P(); //classic function P
		return ast;
	}
	return parse(); //!YEAH!!!!
}

if (typeof module !== 'undefined' && module.exports) { module.exports = littleParser; }


function littleParser0(s) {
	// parses exactly 1 number
	//grammar: 
	// P := N
	// N := number
	function P() { return N(); }
	function N() { return { type: 'N', val: Number(s) }; }

	function parse() {
		return P();
	}
	return parse(); //!YEAH!!!!
}
function littleParser1(s) {
	// parses list of numbers
	//grammar: 
	// P := '' | N P
	// N := number
	function tokenizer(s) {
		var _cursor = 0, _ch = s[0];
		function next() { _ch = s[++_cursor]; }
		function error(msg) { console.log(msg); }
		function number() { let val = ''; while (Number(_ch)) { val += _ch; next(); } return val.length >= 1 ? { type: 'N', val: Number(val) } : null; }
		function white() { while (/\s/.test(_ch)) next(); return null; }

		var tokenlist = [];
		while (_ch !== undefined) {
			let token = white() ?? number();
			if (token) tokenlist.push(token);
			else { error('unexpected char ' + _ch); next(); }
		}
		tokenlist.push({ type: 'eof', val: null });
		return tokenlist;
	}

	var tokens, token, idx = 0;

	function nextToken() { token = tokens[idx++]; }
	function P() {
		let list = [];
		for (; ;) {
			let node = EMPTY() ?? N(); // das ?? ist ein or
			console.log('token', token)
			if (!node) { break; }
			list.push(node);
			nextToken();
		}
		return list;
	}
	function* P() {
		let node = EMPTY() ?? N(); // das ?? ist ein or
		while (node) {
			yield node;
			nextToken();
			node = EMPTY() ?? N();
		}
	}
	function P() {
		let node = EMPTY() ?? N(); // das ?? ist ein or
		if (!node) { return []; }
		nextToken();
		return [node].concat(P());
	}
	function EMPTY() { return token && token.type == 'eof' ? token : null; }
	function N() { return token && token.type == 'N' ? token : null; }

	function parse() {
		tokens = tokenizer(s);
		//console.log('tokens', tokens); return tokens;
		nextToken();
		let ast = P(); //classic function P
		//let ast = [...P()]; //generator function* P
		console.log('DONE!!')
		return ast;
		//for (const t of tokenizer(s)) console.log(t);
	}
	return parse(); //!YEAH!!!!
}
function littleParser2(s) {
	// parses list of numbers
	//grammar: 
	// P := EMPTY | N P
	// EMPTY := ''
	// N := number
	function tokenizer(s) {
		var _cursor = 0, _ch = s[0];
		function next() { _ch = s[++_cursor]; }
		function white() { while (/\s/.test(_ch)) next(); return null; }
		function error(msg) { console.log(msg); }

		function number() { let val = ''; while (Number(_ch)) { val += _ch; next(); } return val.length >= 1 ? { type: 'N', val: Number(val) } : null; }

		var tokenlist = [];
		while (_ch !== undefined) {
			let token = white() ?? number();
			if (token) tokenlist.push(token);
			else { error('unexpected char ' + _ch); next(); }
		}
		tokenlist.push({ type: 'eof', val: null });
		return tokenlist;
	}
	var tokens, token, idx = 0;
	function nextToken() { token = tokens[idx++]; }

	function P() {
		nextToken();
		return EMPTY() ?? [N()].concat(P()); //reflects BNF exactly!!!!!!!
	}
	function EMPTY() { return token && token.type == 'eof' ? token : null; }
	function N() { return token && token.type == 'N' ? token : null; }

	function parse() {
		tokens = tokenizer(s);
		let ast = P(); //classic function P
		return ast;
	}
	return parse(); //!YEAH!!!!
}
function littleParser3(s) {
	// parses a sequence of Literals (String or Number)
	//grammar: 
	// P := EMPTY | Lit P
	// EMPTY := ''
	// Lit += N | S
	// N := number
	// S := ' exc(') '|" exc(") "|` exc(`) `
	// exc(x) := any_char_except_x
	function tokenizer(s) {
		var _cursor = 0, _ch = s[0];
		function next() { _ch = s[++_cursor]; }
		function white() { while (/\s/.test(_ch)) next(); return null; }
		function error(msg) { console.log(msg); }

		function number() { let val = ''; while (Number(_ch)) { val += _ch; next(); } return val.length >= 1 ? { type: 'N', val: Number(val) } : null; }
		function string() {
			if ("'`\"".includes(_ch)) {
				let sep = _ch;
				next();
				let val = '';
				console.log('sep', sep)
				while (![undefined, sep].includes(_ch)) { val += _ch; next(); }
				next();
				return { type: 'S', val };
			} else return null;
		}

		var tokenlist = [];
		while (_ch !== undefined) {
			let token = white() ?? number() ?? string();
			if (token) tokenlist.push(token);
			else { error('unexpected char ' + _ch); next(); }
		}
		tokenlist.push({ type: 'eof', val: null });
		return tokenlist;
	}
	var tokens, token, idx = 0;
	function nextToken() { token = tokens[idx++]; }

	function P() {
		nextToken();
		return EMPTY() ?? [Lit()].concat(P()); //reflects BNF exactly!!!!!!!
	}
	function EMPTY() { return token && token.type == 'eof' ? token : null; }
	function Lit() { return N() ?? S(); }
	function N() { return token && token.type == 'N' ? token : null; }
	function S() { return token && token.type == 'S' ? token : null; }

	function parse() {
		tokens = tokenizer(s);
		let ast = P(); //classic function P
		return ast;
	}
	return parse(); //!YEAH!!!!
}
function littleParser4(s) {
	// parses braced exp
	//grammar: 
	// P := EMPTY | Lit | { P } | P P
	// EMPTY := ''
	// Lit += N | S
	// N := number
	// S := ' exc(') '|" exc(") "|` exc(`) `
	// exc(x) := any_char_except_x
	function tokenizer(s) {
		var _cursor = 0, _ch = s[0];
		function next() { _ch = s[++_cursor]; }
		function white() { while (/\s/.test(_ch)) next(); return null; }
		function error(msg) { console.log(msg); }

		function number() { let val = ''; while (Number(_ch)) { val += _ch; next(); } return val.length >= 1 ? { type: 'N', val: Number(val) } : null; }
		function string() {
			if ("'`\"".includes(_ch)) {
				let sep = _ch;
				next();
				let val = '';
				console.log('sep', sep)
				while (![undefined, sep].includes(_ch)) { val += _ch; next(); }
				next();
				return { type: 'S', val };
			} else return null;
		}
		function lexchar(list) { let res = list.includes(_ch) ? { type: _ch, val: _ch } : null; if (res) next(); return res; }

		var tokenlist = [];
		while (_ch !== undefined) {
			let token = white() ?? number() ?? string() ?? lexchar('{}');
			if (token) tokenlist.push(token);
			else { error('unexpected char ' + _ch); next(); }
		}
		tokenlist.push({ type: 'eof', val: null });
		return tokenlist;
	}
	var tokens, token, idx = 0;
	function nextToken() { token = tokens[idx++]; }
	function guess(type) { return token && token.type == type ? token : null; }

	function P() {
		nextToken();
		let x = EMPTY() ?? Lit() ?? Braced();
		if (!x) return [];
		if (x.type == 'eof') return [x]; else return [x].concat(P());
	}
	function EMPTY() { return guess('eof'); }
	function Braced() {
		let left = guess('{'); if (!left) return null;
		let m = P(); if (!m) return null;
		let right = guess('}');
		if (right) return { type: 'Braced', left, m, right };
		return null;
	}
	function Lit() { return N() ?? S(); }
	function N() { return guess('N'); }
	function S() { return guess('S'); }

	function parse() {
		tokens = tokenizer(s);
		let ast = P(); //classic function P
		return ast;
	}
	return parse(); //!YEAH!!!!
}
function littleParser5(s) {
	// parses only brace nobrace
	//grammar: 
	// P := EMPTY | NOBRACE | { P } | P P
	// EMPTY := ''
	// NOBRACE := exc({})
	// exc(x) := any_char_except_x
	function tokenizer(s) {
		var _cursor = 0, _ch = s[0];
		function next() { _ch = s[++_cursor]; }
		function white() { while (/\s/.test(_ch)) next(); return null; }
		function error(msg) { console.log(msg); }
		function lexchar(list) { let res = list.includes(_ch) ? { type: _ch, val: _ch } : null; if (res) next(); return res; }
		function exceptstr(list, type) { let val = ''; while (_ch != undefined && !list.includes(_ch)) { val += _ch; next(); } return val.length >= 1 ? { type: type, val } : null; }

		function number() { let val = ''; while (Number(_ch)) { val += _ch; next(); } return val.length >= 1 ? { type: 'N', val: Number(val) } : null; }
		function string() {
			if ("'`\"".includes(_ch)) {
				let sep = _ch;
				next();
				let val = '';
				console.log('sep', sep)
				while (![undefined, sep].includes(_ch)) { val += _ch; next(); }
				next();
				return { type: 'S', val };
			} else return null;
		}

		var tokenlist = [];
		while (_ch !== undefined) {
			let token = white() ?? exceptstr('{}', 'N') ?? lexchar('{}');
			if (token) tokenlist.push(token);
			else { error('unexpected char ' + _ch); next(); }
		}
		tokenlist.push({ type: 'eof', val: null });
		return tokenlist;
	}
	var tokens, token, idx = 0;
	function nextToken() { token = tokens[idx++]; }
	function guess(type) { return token && token.type == type ? token : null; }

	function P() {
		nextToken();
		let x = EMPTY() ?? N() ?? Braced();
		if (!x) return [];
		if (x.type == 'eof') return [x]; else return [x].concat(P());
	}
	function EMPTY() { return guess('eof'); }
	function Braced() {
		let left = guess('{'); if (!left) return null;
		let m = P(); if (!m) return null;
		let right = guess('}');
		if (right) return { type: 'Braced', left, m, right };
		return null;
	}
	function N() { return guess('N'); }

	function parse() {
		tokens = tokenizer(s);
		let ast = P(); //classic function P
		console.log('...parsing DONE')
		return ast;
	}
	return parse(); //!YEAH!!!!
}
function littleParser6(s) {
	// parses only brace nobrace
	//grammar: 
	// P := EMPTY | NB | { P } | P P
	// EMPTY := ''
	// NB := any_char_except_{}
	function tokenizer(s) {
		var _cursor = 0, _ch = s[0];
		function next() { _ch = s[++_cursor]; }
		function white() { while (/\s/.test(_ch)) next(); return null; }
		function error(msg) { console.log(msg); }
		function lexchar(list) { let res = list.includes(_ch) ? { type: _ch, val: _ch } : null; if (res) next(); return res; }
		function exceptstr(list, type) { let val = ''; while (_ch != undefined && !list.includes(_ch)) { val += _ch; next(); } return val.length >= 1 ? { type: type, val } : null; }

		var tokenlist = [];
		while (_ch !== undefined) {
			let token = white() ?? exceptstr('{}', 'NB') ?? lexchar('{}');
			if (token) tokenlist.push(token);
			else { error('unexpected char ' + _ch); next(); }
		}
		tokenlist.push({ type: 'eof', val: null });
		return tokenlist;
	}
	var tokens, token, idx = 0;
	function nextToken() { token = tokens[idx++]; }
	function guess(type) { return token && token.type == type ? token : null; }

	function P() {
		nextToken();
		let x = EMPTY() ?? NB() ?? Braced();
		if (!x) return [];
		if (x.type == 'eof') return [x]; else return [x].concat(P());
	}
	function EMPTY() { return guess('eof'); }
	function Braced() {
		let left = guess('{'); if (!left) return null;
		let m = P(); if (!m) return null;
		let right = guess('}');
		if (right) return { type: 'Braced', left, m, right };
		return null;
	}
	function NB() { return guess('NB'); }

	function parse() {
		tokens = tokenizer(s); console.log('tokens', tokens)
		let ast = P(); //classic function P
		console.log('...parsing DONE')
		return ast;
	}
	return parse(); //!YEAH!!!!
}
function littleParser6NO(s) {
	// parses only brace nobrace
	//grammar: 
	// P := EMPTY | NB | { P } | P P
	// EMPTY := ''
	// NB := any_char_except_{}
	function tokenizer(s) {
		var _cursor = 0, _ch = s[0];
		function next() { _ch = s[++_cursor]; }
		function white() { while (/\s/.test(_ch)) next(); return null; }
		function error(msg) { console.log(msg); }
		function lexchar(list) { let res = list.includes(_ch) ? { type: _ch, val: _ch } : null; if (res) next(); return res; }
		function exceptstr(list, type) { let val = ''; while (_ch != undefined && !list.includes(_ch)) { val += _ch; next(); } return val.length >= 1 ? { type: type, val } : null; }

		var tokenlist = [];
		while (_ch !== undefined) {
			let token = white() ?? exceptstr('{}', 'NB') ?? lexchar('{}');
			if (token) tokenlist.push(token);
			else { error('unexpected char ' + _ch); next(); }
		}
		tokenlist.push({ type: 'eof', val: null });
		return tokenlist;
	}
	var tokens, token, idx = 0;
	function nextToken() { token = tokens[idx++]; }
	function guess(type) { return token && token.type == type ? token : null; }

	function P() {
		nextToken();
		let x = EMPTY() ?? NB() ?? Braced();
		if (!x) return [];
		if (x.type == 'eof') return [x]; else return [x].concat(P());
	}
	function EMPTY() { return guess('eof'); }
	function Braced() {
		let left = guess('{'); if (!left) return null;
		let m = P(); if (!m) return null;
		let right = guess('}');
		if (right) return { type: 'Braced', left, m, right };
		return null;
	}
	function NB() { return guess('NB'); }
	function NB_BROKEN() {
		let o = guess('NB');
		if (!o) return null;

		let s = o.val;
		//split at '\n'
		let lines = s.split('\n');
		let res = '';
		for (const line of lines) {
			let lt = line.trim();
			if (lt.length == 0) continue;
			res += lt;

			if (!';,:=<>|&$()['.includes(res[res.length - 1])) res += ';'
		}
		return { type: 'NB', val: res };
	}

	function parse() {
		tokens = tokenizer(s); console.log('tokens', tokens)
		let ast = P(); //classic function P
		console.log('...parsing DONE')
		return ast;
	}
	return parse(); //!YEAH!!!!
}

