
function handle_token (current_token, preserve_statement_flags) {
	console.log('token',current_token.type)
	if (current_token.type === TOKEN.START_EXPR) {
		this.handle_start_expr(current_token);
	} else if (current_token.type === TOKEN.END_EXPR) {
		this.handle_end_expr(current_token);
	} else if (current_token.type === TOKEN.START_BLOCK) {
		this.handle_start_block(current_token);
	} else if (current_token.type === TOKEN.END_BLOCK) {
		this.handle_end_block(current_token);
	} else if (current_token.type === TOKEN.WORD) {
		this.handle_word(current_token);
	} else if (current_token.type === TOKEN.RESERVED) {
		this.handle_word(current_token);
	} else if (current_token.type === TOKEN.SEMICOLON) {
		this.handle_semicolon(current_token);
	} else if (current_token.type === TOKEN.STRING) {
		this.handle_string(current_token);
	} else if (current_token.type === TOKEN.EQUALS) {
		this.handle_equals(current_token);
	} else if (current_token.type === TOKEN.OPERATOR) {
		this.handle_operator(current_token);
	} else if (current_token.type === TOKEN.COMMA) {
		this.handle_comma(current_token);
	} else if (current_token.type === TOKEN.BLOCK_COMMENT) {
		this.handle_block_comment(current_token, preserve_statement_flags);
	} else if (current_token.type === TOKEN.COMMENT) {
		this.handle_comment(current_token, preserve_statement_flags);
	} else if (current_token.type === TOKEN.DOT) {
		this.handle_dot(current_token);
	} else if (current_token.type === TOKEN.EOF) {
		this.handle_eof(current_token);
	} else if (current_token.type === TOKEN.UNKNOWN) {
		this.handle_unknown(current_token, preserve_statement_flags);
	} else {
		this.handle_unknown(current_token, preserve_statement_flags);
	}
};







function wohl1(code, index) {
	let iprev = -1;
	let res = [];
	while (index != iprev) {
		iprev = index;
		Z = consumeWhileNot(code, index, '{}'); //console.log('Z', Z);
		index = Z.newIndex;
		if (index != iprev) res.push(Z.parsed.trim());

		Z = consumeBraces(code, Z.newIndex); //console.log('Z', Z)
		if (nundef(Z)) break;
		res.push(Z.parsed);
		index = Z.newIndex;
	}
	return isEmpty(res) ? undefined : { parsed: res, newIndex: index };
}
function consumeWhileNot(code, index, exc) {
	return consumeWhile(code, index, x => !exc.includes(x)) ?? { parsed: '', len: 0, newIndex: index };
}
function consumeBraces(code, index) {
	Z = consume(code, index, '{'); //console.log('..Z', Z);
	if (Z === undefined) return undefined; 
	Z = wohl1(code, Z.newIndex); //console.log('..Z', Z);
	if (Z === undefined) return undefined; 
	let content = Z.parsed;
	Z = consume(code, Z.newIndex, '}'); //console.log('..Z', Z);
	return Z.parsed == '}' ? { parsed: ['{', content, '}'], newIndex: Z.newIndex } : undefined;
}



















