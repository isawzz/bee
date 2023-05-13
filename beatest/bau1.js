
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



















