
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









