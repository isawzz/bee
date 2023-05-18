function parser(tokens, verbose = false) {
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


if (typeof module !== 'undefined' && module.exports) { module.exports = parser; }












