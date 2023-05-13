
function lexNumber(val, s, i) {
	let dot = val == '.';
	while (lexTestNumber(s[++i]) || !dot && (dot = lexTestCh(s[i], '.'))) val += s[i];
	return [val, --i];
}
function lexTestWhite(ch) { return isWhiteSpace(ch); } //) ch.test(/w/); } // isEmptyOrWhiteSpace(ch); } //.test(/w/); }
function lexTestCh(ch, c) { return ch == c; }
function lexTestNumber(ch) { return isDigit(ch); }
function lexer(s) {

	let tokens = [];
	let i = 0;
	while (i <= s.length) {
		let ch = s[i];

		if (lexTestWhite(ch)) {
			console.log('white ch',ch)
			while (lexTestWhite(s[++i])); i--;
		} else if (lexTestNumber(ch) || ch == '-') {
			let [val, inew] = lexNumber(ch, s, i);
			i = inew;
			tokens.push({ type: 'number', value: val });
		} else if (lexTestNumber(ch) || ch == '-') {
			let [val, inew] = lexNumber(ch, s, i);
			i = inew;
			tokens.push({ type: 'number', value: val });
		} else if (ch === undefined) {
			tokens.push({ type: 'EOF' });
		} else {
			tokens.push({ type: `ERROR at char ${i}`, value: ch });
		}
		i++;

	}
	return tokens;
}


