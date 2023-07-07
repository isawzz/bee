


function parser(file, tokens, verbose = false) {
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


if (typeof module !== 'undefined' && module.exports) { module.exports = parser; }












