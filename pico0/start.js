
async function start() {
	test_littleParser(); //test_newline()	//test_lexer();
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
	if (Array.isArray(ast)) return ast.map(x => prpr(x,ind)).join('');

	let t = ast.type;
	if (t == 'eof') { return ''; }
	else if (t == 'NB') { return ' '.repeat(ind) + ast.val.trim(); }
	else if (t == 'Braced') {
		let st = prpr(ast.m, ind + 2);
		//return '\n' + ' '.repeat(ind) + '{\n' + st + '\n' + ' '.repeat(ind) + '}\n';
		return ' {\n' + st + '\n' + ' '.repeat(ind) + '}\n';
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







