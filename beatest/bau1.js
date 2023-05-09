
function wohl(code, index) {
	let iprev = -1;
	let res = [];
	while (index != iprev) {
		iprev = index;
		Z = consumeSimple(code, index, "'\"`(){}[]"); //console.log('Z', Z);

		index = Z.newIndex;
		if (index != iprev) res.push(Z.parsed);
		console.log('simple ends in', code[index]);
		Z = consumeDoubleSamePeek(code, Z.newIndex, "'\"`"); console.log('Z', Z)
		if (nundef(Z)) Z = consumeDoubleDiffPeek(code,index) ;//,'(',')')
		if (nundef(Z)) break;
		res.push(Z.parsed);
		index = Z.newIndex;
	}
	return isEmpty(res) ? undefined : { parsed: res, newIndex: index };
}
function consumeSimple(code, index, exc) {
	return consumeWhile(code, index, x => !exc.includes(x)) ?? { parsed: '', newIndex: index };
}
function consumeDoubleSamePeek(code, index, list){
	let ch=code[index];
	console.log('ch',ch)
	if (list.includes(ch)) return consumeDoubleSame(code,index,ch);
}
function consumeDoubleSame(code, index, ch) {
	Z = consume(code, index, ch); //console.log('..Z', Z);
	if (Z === undefined) return undefined; // {parsed:'',newIndex:index};
	// Z = consumeSimpleText(code,Z.newIndex); console.log('..Z', Z);
	// Z = consumeSimpleNE(code, Z.newIndex, ch); //console.log('..Z', Z);
	Z = consumeSimple(code, Z.newIndex, ch); //console.log('..Z', Z);
	if (Z === undefined) return undefined; // {parsed:'',newIndex:index};
	let content = Z.parsed;
	Z = consume(code, Z.newIndex, ch); //console.log('..Z', Z);
	if (Z === undefined) return undefined; // {parsed:'',newIndex:index};
	return Z.parsed == ch ? { parsed: [ch, content, ch], newIndex: Z.newIndex } : undefined;
}
function consumeDoubleDiffPeek(code, index, list='({['){
	let ch=code[index];
	let ch2=ch=='('?')':ch=='{'?'}':']'; //ch=='['?']':
	console.log('ch',ch)
	if (list.includes(ch)) return consumeDoubleDiff(code,index,ch,ch2);
}
function consumeDoubleDiff(code, index, ch1,ch2) {
	Z = consume(code, index, ch1); //console.log('..Z', Z);
	if (Z === undefined) return undefined; // {parsed:'',newIndex:index};
	Z = wohl(code, Z.newIndex); //console.log('..Z', Z);
	if (Z === undefined) return undefined; // {parsed:'',newIndex:index};
	let content = Z.parsed;
	Z = consume(code, Z.newIndex, ch2); //console.log('..Z', Z);
	if (Z === undefined) return undefined; // {parsed:'',newIndex:index};
	return Z.parsed == ch2 ? { parsed: [ch1, content, ch2], newIndex: Z.newIndex } : undefined;
}


















function consumeSimpleVor(code, index) {
	return consumeWhile(code, index, x => !'{[`"\'('.includes(x)) ?? { parsed: '', newIndex: index };
}
function consumeDoubleStart(code, index) {
	let ch = code[0];
	let expect = ch == '{' ? '}' : ch == '[' ? ']' : ch == '(' ? ')' : ch;

	Z = consume(code, index, '('); console.log('..Z', Z);
	if (Z === undefined) return undefined; // {parsed:'',newIndex:index};
	// Z = consumeSimpleText(code,Z.newIndex); console.log('..Z', Z);
	Z = wohlgeformt(code, Z.newIndex); console.log('..Z', Z);
	if (Z === undefined) return undefined; // {parsed:'',newIndex:index};
	let content = Z.parsed;
	Z = consume(code, Z.newIndex, ')'); console.log('..Z', Z);
	return Z.parsed == ')' ? { parsed: ['(', content, ')'], newIndex: Z.newIndex } : undefined;
}
function consumeSimpleNE_UNUSABLE(code, idx, ch) {
	let i = idx;
	// while (code[i] != null && code[i] != ch && (code[i] != `\\${ch}` || code[i + 1] != ch)) { i++; }
	// while (code[i] != null && code[i] != ch && code[i] != `\\${ch}`) { i++; }
	while (code[i] != null && code[i] != ch && code[i] != '\\') { i++; }

	if (i > idx) { return { parsed: code.substring(idx, i), newIndex: i } }
}









