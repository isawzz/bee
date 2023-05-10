
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



















