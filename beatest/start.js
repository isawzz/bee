async function start() {
	let s = `hallo {wie geht's {dir}}`; //getsample(5); console.log('length', s.length, '\ncode:', s);

	Z = wohl1(s, 0);
	console.log('Z', Z.parsed)


	//recursively augment parsed
	let lst = [];
	let x = recAugmentParsed(Z.parsed, lst);
	console.log('lst', lst)
}

function recAugmentParsed(el, reslist = []) {

	if (isEmpty(el)) return;
	else if (isString(el)) {
		reslist.push({ s: el, len: el.length });
	} else if (Array.isArray(el) && el[0] == '{' && isString(el[1])) {
		reslist.push({ s: `{ ${el[1]} }`, len: el[1].length });
	} else if (Array.isArray(el) && el[0] != '{') {
		recAugmentParsed(el[0], reslist);
		recAugmentParsed(el.slice(1),reslist);
	} else if (Array.isArray(el)){
		// { [] }
		let list1=[];
		//recAugmentParsed(el[1], list1);
		recAugmentParsed(el.slice(1,el.length-1),list1);
		//list1 sollte jetzt alle teilergebnisse haben!
		reslist.push({ s: `{ ${list1.map(x=>x.s).join('')} }`, len: list1.map(x=>x.s).join('').length });


	}
}


//#region tests trials 1-3
function test_mit_complex_code() {
	for (const i of range(1, 1)) {
		let s = getsample(i);
		console.log('code:', s)
		Z = wohl(s, 0, '{}');
		console.log('result', Z)
	}

}
function test_simpleexp() {
	let code = `da asd (hallo das ist (ei(a)e) kethastrophe, das ist bloed!!!!) hallo (bloed)`;
	code = `hallo 'das ist' dasdasda`;// wirklich' schade'`
	code = `hallo 'das \'ist\'' dasdasda wirklich' schade'`;
	code = 'hallo \'da\' ist etwas';
	code = '"\'"`'; //'es darf nicht "\'\"`" sein'
	code = ["'", '\`', '"', "'", "'"].join(''); //geht ueberhaupt nicht!!!
	code = `da 'asd (hallo (a) ${code}) hallo (bloed)`;
	code = `da ('asd (hallo)' (a) '\`') hallo (bloed)`;
	console.log(code, code.length)
	Z = wohl(code, 0, '{}'); //="'\"`(){}[]"
	if (isdef(Z)) {
		let arr = arrFlatten(Z.parsed)
		console.log('parsed', arr)
		console.log('index', Z.newIndex)
		console.log('result', Z.result)
	}

	//Z = wohlgeformt(code, 0); console.log('Z', Z)
	//Z = consumeSimpleText(code, 0); console.log('Z', Z)

}
function test_arrFlatten() {
	//arr=[['se'],['aber','nicht','doch'],['nanana']]
	arr = [['se'], ['aber', ['nicht', 123, [1, 2, [29], 3]], 'doch'], ['nanana']]
	console.log('flatten test:', arrFlatten(arr))

}
function test2_trial1() {
	let code = `(hallo das ist eine kethastrophe, das ist bloed!!!!)`;
	Z = consumeParExp(code, Z, '('); console.log('Z', Z)

	// Z = consumeWhitespace(code, 0); console.log('Z', Z)
	// Z = consume(code, Z, '('); console.log('Z', Z)
	// Z = consumeWhile(code, Z.newIndex, x => !'()'.includes(x)); console.log('Z', Z);
	// Z = consume(code, Z.newIndex, ')'); console.log('Z', Z)
}
function test1_trial1() {
	let code = `(halllo)`; //((hallo,[das,das]))`; //`('this_is'==/an_example/)`
	Z = myParser(code); console.log('Z', Z)
}
function test0_trial1() {
	let code = getsample(0);
	code = removeCommentLines(code, '//'); console.log('code', code)

	//Z = consumeOtherThan(code, 0, '{}[]()"`\''); console.log('Z', Z)
	Z = consumeWhitespace(code, 0); console.log('Z', Z)
	Z = justOther(code, Z); console.log('Z', Z)
	let before = code[Z.newIndex]; console.log('before', before);
	Z = justPar(code, Z.newIndex); console.log('Z', Z)

}
//#endregion
