
//#region format js trial 4: zu complex!
function wohl(code, index, simple) {
	let iprev = -1;
	let res = [], result=[], idx = index;
	while (index != iprev) {
		iprev = index;
		Z = consumeSimple(code, index, simple); console.log('Z', Z); //"'\"`(){}[]"); //console.log('Z', Z);

		index = Z.newIndex;
		if (index != iprev) {res.push(Z.parsed);result.push(Z); }
		//console.log('simple ends in', code[index]);
		Z = consumeDoubleSamePeek(code, Z.newIndex, "'\"`"); //console.log('Z', Z)
		if (nundef(Z)) Z = consumeDoubleDiffPeek(code, index, '{');//,'(',')')
		if (nundef(Z)) break;
		res.push(Z.parsed);result.push(Z);
		index = Z.newIndex;
	}
	res = arrFlatten(res)
	let len = res.join('').length; //console.log('res', res)

	assertion(index - idx == len, `NEIN!!! ${index}-${idx} ${len}\n${res}`)
	return isEmpty(res) ? undefined : { result:result, parsed: res, len: len, newIndex: index };
}
function consumeSimple(code, index, exc) {
	return consumeWhile(code, index, x => !exc.includes(x)) ?? { result:[], parsed: '', len: 0, newIndex: index };
}
function consumeDoubleSamePeek(code, index, list) {
	let ch = code[index];
	//console.log('ch',ch)
	if (list.includes(ch)) return consumeDoubleSame(code, index, ch);
}
function consumeDoubleSame(code, index, ch) {
	let result=[];
	Z = consume(code, index, ch); //console.log('..Z', Z);
	if (Z === undefined) return undefined; else result.push(Z); // {parsed:'',newIndex:index};
	// Z = consumeSimpleText(code,Z.newIndex); console.log('..Z', Z);
	// Z = consumeSimpleNE(code, Z.newIndex, ch); //console.log('..Z', Z);
	Z = consumeSimple(code, Z.newIndex, ch); //console.log('..Z', Z);
	if (Z === undefined) return undefined; else result.push(Z);
	let content = Z.parsed;
	Z = consume(code, Z.newIndex, ch); //console.log('..Z', Z);
	if (Z === undefined) return undefined; else result.push(Z);
	return Z.parsed == ch ? { result:result, type:ch, parsed: [ch, content, ch], len: content.length + 2 * ch.length, newIndex: Z.newIndex } : undefined;
}
function consumeDoubleDiffPeek(code, index, list = '({[') {
	let ch = code[index];
	console.log('ch',ch)
	let ch2 = ch == '(' ? ')' : ch == '{' ? '}' : ']'; //ch=='['?']':
	//console.log('ch',ch)
	if (list.includes(ch)) return consumeDoubleDiff(code, index, ch, ch2);
}
function consumeDoubleDiff(code, index, ch1, ch2) {
	console.log('cdd',ch1,ch2)
	let result=[];
	Z = consume(code, index, ch1); //console.log('..Z', Z);
	console.log('cdd',ch1,ch2,Z)
	if (Z === undefined) return undefined;  else result.push(Z);// {parsed:'',newIndex:index};
	Z = wohl(code, Z.newIndex); //console.log('..Z', Z);
	console.log('cdd',ch1,ch2,Z)
	if (Z === undefined) return undefined;  else result.push(Z);// {parsed:'',newIndex:index};
	let content = Z.parsed;
	Z = consume(code, Z.newIndex, ch2); //console.log('..Z', Z);
	console.log('cdd',ch1,ch2,Z)
	if (Z === undefined) return undefined;  else result.push(Z);
	return Z.parsed == ch2 ? { result:result, type:ch1, parsed: [ch1, content, ch2], len: content.length + ch1.length + ch2.length, newIndex: Z.newIndex } : undefined;
}



//#region format js trial 3: works for ()
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



//#region format js trial 2: helpers

function given(val, f) { return isdef(val) ? f(val) : undefined; }
function myAst(code, index) {
	return justPar(code, index)
		// justArray(code, index)
		// ?? justBraces(code, index)
		// ?? justOther(code, index)
		// ?? justParenth(code, index);
}
function myParser(code) {
	const foundASTs = []
	let index = 0;

	let previousIndex;
	while (index < code.length && previousIndex !== index) {
		previousIndex = index;

		index = consumeWhitespace(code, index);

		const parseResult = myAst(code, index);
		if (parseResult !== undefined) {
			index = parseResult.newIndex;
			foundASTs.push(parseResult.parsed);
		}
	}

	return foundASTs;
}

function justOther(code, index) {
	let arr = '{}[]()"`\'';
	return consumeWhile(code, index, x => !'{}[]()"`\''.includes(x));
}
function justString(code, index) {
	given(consume(code, index, '"'), ({ newIndex: index }) => {
		const startIndex = index;
		let escaped = false;

		while (escaped || code[index] !== '"') {
			if (code[index] === '\\') {
				escaped = true;
			} else {
				escaped = false;
			}

			index++
		}

		return {
			parsed: {
				kind: 'string',
				value: code.substring(startIndex, index)
			},
			newIndex: index + 1
		}
	});
}
function justArray(code, index) {
	return given(consume(code, index, '['), ({ newIndex: index }) =>
		given(consumeWhitespace(code, index), index =>
			given(series(code, index, myAst, ','), ({ parsed: members, newIndex: index }) =>
				given(consumeWhitespace(code, index), index =>
					given(consume(code, index, ']'), ({ newIndex: index }) => ({
						parsed: {
							kind: 'array',
							members,
						},
						newIndex: index
					}))))));
}
function justBraces(code, index) {
	return given(consume(code, index, '{'), ({ newIndex: index }) =>
		given(consumeWhitespace(code, index), index =>
			given(series(code, index, myAst, ','), ({ parsed: members, newIndex: index }) =>
				given(consumeWhitespace(code, index), index =>
					given(consume(code, index, '}'), ({ newIndex: index }) => ({
						parsed: {
							kind: 'block',
							members,
						},
						newIndex: index
					}))))));
}
function justPar(code, index) {
	return given(consume(code, index, '('), ({ newIndex: index }) =>
		given(consumeWhitespace(code, index), index =>
			given(series(code, index, myAst, ','), ({ parsed: members, newIndex: index }) =>
				given(consumeWhitespace(code, index), index =>
					given(consume(code, index, ')'), ({ newIndex: index }) => ({
						parsed: {
							kind: 'parenth',
							members,
						},
						newIndex: index
					}))))));
}


//#region format js trial 1
function formatjs(code, stripWhiteSpaces = true, stripEmptyLines = true, whitespace = '  ', maxlen = 60) {

	var currentIndent = 0;
	code = removeCommentLines(code, '//');
	code = code.trim().split('\n').join(' ');

	var result = '', ch, chNext, chPrev;
	for (var i = 0; i <= code.length; i++) {
		ch = code.substr(i, 1);
		chNext = code.substr(i + 1, 1);

		if (ch === '{') {
			currentIndent++;
			result += '{\n' + whitespace.repeat(currentIndent);
		} else if (ch === '}' && chNext == ';') {
			if (--currentIndent < 0) currentIndent = 0;
			result += '}';
		} else if (ch === '}') {
			if (--currentIndent < 0) currentIndent = 0;
			result += '\n' + whitespace.repeat(currentIndent) + '}';
		} else if (ch === ';' && chNext != '}') {
			result += ';\n' + whitespace.repeat(currentIndent);
		} else
			result += ch;
	}

	return result;
}
