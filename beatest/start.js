async function start() {
	test_pico0();
	test_jsbeautify(8);
}

function test_pico0() {
	const input = "7";

	function* lexer(s) {
		let ch = s[0];
		if (ch === undefined) {
			yield { type: 'EOF' }
		}

	}

	console.log('start');
	for (const token of lexer(input)) {
		console.log(token);
	}
	console.log('finish');
}



function test_jsbeautify(n=0) {
	DA.samples = getCodeSamples();
	DA.index = n-1;
	testNext();
	mButton('Next', testNext, mBy('dTest'));
	//addEventListener('click', function(event) { console.log('click');	PR.prettyPrint(); }, false);
}
function testNext() {
	let i = DA.index = (DA.index + 1) % DA.samples.length;
	let s = DA.samples[i];

	mBy('code1').innerHTML = s;

	let x = js_beautify(s, {
		indent_size: 1,
		indent_char: ' ',
		preserve_newlines: false,
		brace_style: 'preserve-inline', // collapse expand none end-expand preserve-inline,
		wrap_line_length: 80,
	})
	//console.log(x)
	mBy('code2').innerHTML = x;

	// let y = js_beautify(s, {
	// 	indent_size: 1,
	// 	indent_char: ' ',
	// 	preserve_newlines: false,
	// 	brace_style: 'none', // collapse expand none end-expand preserve-inline,
	// 	wrap_line_length: 60,
	// })
	// mBy('code3').innerHTML = y;

	//mBy('gpretty').innerHTML = s;

}


//#region tests trials 1-3
function test_wohl1() {
	let s = getsample(1); //`hallo {wie geht's {dir}}`; //
	console.log('length', s.length, '\ncode:', s);
	Z = wohl1(s, 0); console.log('Z', Z.parsed)
}
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
