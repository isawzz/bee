
function start() {
	const input = "-7737 23\t13a3003";
	console.log('code',input)
	console.log('start');
	let res = lexer(input);
	console.log('res', res)
	for (const token of res) {
		console.log(token);
	}
	console.log('finish');

}











