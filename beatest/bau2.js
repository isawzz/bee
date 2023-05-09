
function arrFlatten(arr) {
	if (!Array.isArray(arr)) return arr;
	let res = [];
	for (let i = 0; i < arr.length; i++) {
		let el = arr[i];
		if (Array.isArray(el)) {
			let f = arrFlatten(el);
			f.map(x => res.push(x));
		} else res.push(el);
	}
	return res;
}

function wohlgeformt(code, index) {
	let iprev = -1;
	let res = [];
	while (index != iprev) {
		iprev = index;
		Z = consumeSimpleText(code, index); //console.log('Z', Z);
		index = Z.newIndex;
		if (index != iprev) res.push(Z.parsed);
		Z = consumeParExp(code, Z.newIndex); //console.log('Z', Z)
		if (nundef(Z)) break;
		res.push(Z.parsed);
		index = Z.newIndex;
	}
	return isEmpty(res) ? undefined : { parsed: res, newIndex: index };
}
function consumeSimpleText(code, index) {
	return consumeWhile(code, index, x => !'()'.includes(x)) ?? { parsed: '', newIndex: index };
}
function consumeParExp(code, index) {
	Z = consume(code, index, '('); console.log('..Z', Z);
	if (Z === undefined) return undefined; // {parsed:'',newIndex:index};
	// Z = consumeSimpleText(code,Z.newIndex); console.log('..Z', Z);
	Z = wohlgeformt(code, Z.newIndex); console.log('..Z', Z);
	if (Z === undefined) return undefined; // {parsed:'',newIndex:index};
	let content = Z.parsed;
	Z = consume(code, Z.newIndex, ')'); console.log('..Z', Z);
	return Z.parsed == ')' ? { parsed: ['(', content, ')'], newIndex: Z.newIndex } : undefined;
}
