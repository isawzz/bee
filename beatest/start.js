async function start() {

	test_arrFlatten();return;

	let code = `da asd (hallo das ist (ei(a)e) kethastrophe, das ist bloed!!!!) hallo (bloed)`;
	code = `hallo 'das ist' dasdasda`;// wirklich' schade'`
	code = `hallo 'das \'ist\'' dasdasda wirklich' schade'`;
	code = 'hallo \'da\' ist etwas';
	code = '"\'"`'; //'es darf nicht "\'\"`" sein'
	code = ["'",'\`','"',"'","'"].join(''); //geht ueberhaupt nicht!!!
	code = `da 'asd (hallo (a) ${code}) hallo (bloed)`;
	code = `da ('asd (hallo)' (a) '\`') hallo (bloed)`;
	console.log(code,code.length)
	Z = wohl(code, 0); 
	if (isdef(Z)) {
		let arr=arrFlatten(Z.parsed)
		console.log('parsed', arr)
		console.log('index', Z.newIndex)
	}

	//Z = wohlgeformt(code, 0); console.log('Z', Z)
	//Z = consumeSimpleText(code, 0); console.log('Z', Z)
}

function test_arrFlatten(){
	arr=[['se'],['aber','nicht','doch'],['nanana']]
	//arr=[['se'],['aber',['nicht',123,[1,2,3]],'doch'],['nanana']]
	console.log('flatten test:',arrFlatten(arr))

}
function test2() {
	let code = `(hallo das ist eine kethastrophe, das ist bloed!!!!)`;
	Z = consumeParExp(code, Z, '('); console.log('Z', Z)

	// Z = consumeWhitespace(code, 0); console.log('Z', Z)
	// Z = consume(code, Z, '('); console.log('Z', Z)
	// Z = consumeWhile(code, Z.newIndex, x => !'()'.includes(x)); console.log('Z', Z);
	// Z = consume(code, Z.newIndex, ')'); console.log('Z', Z)
}
function test1() {
	let code = `(halllo)`; //((hallo,[das,das]))`; //`('this_is'==/an_example/)`
	Z = myParser(code); console.log('Z', Z)
}
function test0() {
	let code = getsample(0);
	code = removeCommentLines(code, '//'); console.log('code', code)

	//Z = consumeOtherThan(code, 0, '{}[]()"`\''); console.log('Z', Z)
	Z = consumeWhitespace(code, 0); console.log('Z', Z)
	Z = justOther(code, Z); console.log('Z', Z)
	let before = code[Z.newIndex]; console.log('before', before);
	Z = justPar(code, Z.newIndex); console.log('Z', Z)

}

