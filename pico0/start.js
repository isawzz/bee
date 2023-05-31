
async function start() {

	testPP3(); //testExtractStrings(); //testPP2(); //testPP1_code_nobrace(); //testPP0(); //startest_cards();

}
async function testPP3() {
	let s = await codeFromFile('../pico0/allf.js'); //s = s.substring(0, 1000);
	//mBy('code0').innerHTML = `<xmp>` + s + `</xmp>`;
	let tokenlist = codeToTokens(s);
	let { code, slist } = codeExtractStrings(tokenlist);
	codePresent(code, 'code1')
	let tokenlist2=codeToTokens(code,true);
	//console.log('tokens2',tokenlist2);

	//in each C item, replace all newline by ;
	for(const t of tokenlist2){
		if (t.type !='C') continue;
		let c = t.oldval = t.val;
		c = replaceAllSpecialChars(c,'\n','$$$');
		assertion(!c.includes('\n'))
		//c = replaceAllSpecialChars(c,' ;',';');
		assertion(c.length>0,`not a string ${c}`)
		//console.log('...',isString(c),c.trim())
		t.newcode = stringBefore(c,'//').trim();
	}

	let xlist = tokenlist2.filter(x=>x.type == 'C' && !isEmptyOrWhiteSpace(x.newcode) || x.type != 'C');
	let code1 = xlist.filter(x=>x.type == 'C').map(x=>x.newcode).join('$$$');

	//ich moecht jetzt wissen was alles nach $$$ oder vor $$$ kommen kann!!!
	let parts = code1.split('$$$');
	let newparts = parts.filter(x=>!isEmptyOrWhiteSpace(x)).map(x=>x.trim());
	let davor=[],danach=[],nstart=2,nend=2;
	for(const p of newparts){
		assertion(!p.includes('\n'))
		addIf(davor,p.substr(p.length-nend-1,nend))
		addIf(danach,p.substr(0,nstart))
	}
	//nach einer newline sollen spaces geloescht werden
	//console.log('danach',danach);
	//console.log('davor',davor);
	// codePresent(code1,'code1');
	//assertion(!code1.includes('hallo'))
	return;

	
	codePresent(code, 'code1')
	let newcode = codeReplaceStrings(code, slist);
	codePresent(newcode, 'code1')
}
async function testExtractStrings() {
	let s = await codeFromFile('../pico0/allf.js'); s = s.substring(0, 1000);
	mBy('code0').innerHTML = `<xmp>` + s + `</xmp>`;
	let tokenlist = codeToTokens(s);
	let { code, slist } = codeExtractStrings(tokenlist);
	codePresent(code, 'code1')
	let newcode = codeReplaceStrings(code, slist);
	codePresent(newcode, 'code1')
}
async function testSplitBefore() {
	let s = await codeFromFile('../pico0/allf.js'); //s = s.substring(0,1000);
	mBy('code0').innerHTML = `<xmp>` + s + `</xmp>`;
	let blocks = splitBeforeAny(s, ['function', 'async', 'class', 'var', 'const']);
	console.log('blocks', blocks);
}
async function testPP2() {
	let s = await codeFromFile('../pico0/allf.js');
	mBy('code0').innerHTML = `<xmp>` + s + `</xmp>`;
	//remove all '\n'
	//remove all '  '
	let lines = s.split('\n');
	let s1 = '';
	for (const line of lines) {
		let lt = line.trim();
		let parts = lt.split('( '); lt = parts.join('(');
		s1 += lt;
	}
	parts = s1.split('='); s1 = parts.join(' = ');
	parts = s1.split(';'); s1 = parts.join('; ');
	parts = s1.split(' '); s1 = parts.filter(x => x.trim().length >= 1).join(' ');

	mBy('code1').innerHTML = `<xmp>` + s1 + `</xmp>`;
}


function muell() {
	let tokenlist = codeToTokens(s, true);
	//console.log('tokens', tokenlist)
	let ast = codeAstFromTokens(tokenlist);
	console.log('ast', ast);
	let code = codePP1(tokenlist, ast);
	mBy('code0').innerHTML = `<xmp>` + s + `</xmp>`;
	console.log('DONE!');
	//jetzt brauch ich pp! aber wie?
	// let code = codeFromTokens(tokenlist);
}
async function testPP1_code_nobrace() {
	let s = await codeFromFile('../pico0/source.js');
	let tokenlist = codeToTokens(s, true);
	//console.log('tokens', tokenlist)
	let ast = codeAstFromTokens(tokenlist);
	console.log('ast', ast);
	let code = codePP1(tokenlist, ast);
	mBy('code0').innerHTML = `<xmp>` + s + `</xmp>`;
	console.log('DONE!');
	//jetzt brauch ich pp! aber wie?
	// let code = codeFromTokens(tokenlist);
}
async function testPP0() {
	let s = await codeFromFile('../pico0/allf.js');
	let tokenlist = codeToTokens(s, true);
	//let tokenlist = await codeToTokens('../pico0/allf.js');

	let code = codeFromTokens(tokenlist);
	//console.log(code)
	//downloadAsText(code,'mycode','js');
	// mBy('code0').innerHTML = `&lt;div&gt;`+code+`&lt;/div&gt;`;
	mBy('code0').innerHTML = `<xmp>` + code + `</xmp>`;
	console.log('DONE!')
}
async function testCodeFormatter(path) {
	input = await route_path_text(path);
	input = replaceAllSpecialChars(input, '\t', '  ');
	input = replaceAllSpecialChars(input, '\r', '');
	console.clear();
	//let s = ` hallo das "hallo ist ein "w"ort" aber 123 nicht!`
	//input = `let match = html && /\bsrc="?([^"\s]+)"?\s*/.exec(html);`
	let tok = tokutils(input);
	let prev = null;
	var tokenlist = []; let rcount = 0;
	while (tok.get() !== undefined) {
		let token = tok.string() ?? tok.code() ?? tok.regexp() ?? tok.comment();
		if (token === true) { prev = null; continue; } //break;
		if (token) {
			if (prev && prev.type == token.type) { console.log('BAD!!!', token, prev, tok.getpos()); break; }
			prev = token;
			token.line = tok.getpos().line;
			tokenlist.push(token);
			//if (token.type == 'R') { rcount++; if (rcount > 1300) break; }
		} else { error('unexpected char ' + tok.get() + ', pos:' + tok.getpos().line); tok.next(); break; }
	}
	//tokenlist.map(x => {if (x.type == 'R') console.log(x)});
	// tokenlist.map(x => console.log(x));
	console.log('stopped at', tok.getpos(), tok.peekstr(20))
	tokenlist.push({ type: 'eof', val: null });
	// console.log('tokens:', tokenlist.length);

	let code = '', i = 0, slist = [];
	for (const t of tokenlist) {
		// if (prev == t.type) { console.log('FEHLER BEI', t); return; } prev = t.type;
		if (t.type == 'C') {
			code += t.val;
			// } else if (t.type == 'S') {
			// 	code += `'@@@${i++}@@@'`;
			// 	slist.push(`${t.sep}${t.val}${t.sep}`);
		} else if (t.type == 'R' || t.type == 'S') {
			i++;
			code += `${t.sep}${t.val}${t.sep}`;
			//slist.push(`${t.sep}${t.val}${t.sep}`);
		} else break;
	}

	//console.log('code', code)
	//slist.map(x => console.log(x))
	console.log('liste hat', slist.length, 'entries')
	//downloadAsYaml(slist,'mystrings');
	downloadAsText(code, 'mycode', 'js');
	return;
	//zusammenstueckeln!!!!
	let res = '', rest = code; i = -1;
	while (!isEmpty(rest) && ++i < slist.length) {
		let chunk = stringBefore(rest, `'@@@`);
		res += chunk;
		res += slist[i];
		rest = stringAfter(rest, `@@@'`);
	}

	res += rest;
	//console.log('resulting code:\n',res)
	//downloadAsText(res, 'newnewnew', 'js')
	mBy('code1').innerHTML = res; //res.substring(0,100);
	console.log('DONE!')

	//test_hallo(); //testLettersBefore();//test_littleParser(); //test_newline()	//test_lexer();
}
function test_replaceAllSafe() {
	let msg = '"hallo das ist gu"t"""';
	let msg1 = msg.replace(/"/g, '');
	let msg2 = replaceAllSafe(msg, '"', '');
	console.log('msg', msg, msg1 == msg2); return;


}
function test_hallo() {
	let s = '"hallo"';
	tokens = tokenizer(s); console.log('tokens', tokens)

}
function tokenizer(s) {
	var _cursor = 0, _ch = s[0];
	function next() { _ch = s[++_cursor]; }
	function peek(n) { return s[_cursor + n]; }
	function peekstr(n) { return s.substring(_cursor, _cursor + n); }
	function white() { while (/\s/.test(_ch)) next(); return null; }
	function error(msg) { console.log(msg); }
	function lexchar(list) { let res = list.includes(_ch) ? { type: _ch, val: _ch } : null; if (res) next(); return res; }
	function exceptch(list, type) { let val = ''; while (_ch != undefined && !list.includes(_ch)) { val += _ch; next(); } return val.length >= 1 ? { type: type, val } : null; }
	function exceptstr(list, type) {
		let val = '';
		while (_ch != undefined && !list.some(x => peekstr(x.length) == x)) { val += _ch; next(); } return val.length >= 1 ? { type: type, val } : null;
	}

	function number() { let val = ''; while (Number(_ch)) { val += _ch; next(); } return val.length >= 1 ? { type: 'N', val: Number(val) } : null; }
	function string() {
		if ("'`\"".includes(_ch)) {
			let sep = _ch;
			next();

			let val = '';
			//console.log('sep', sep)
			while (![undefined, sep].includes(_ch)) {
				val += _ch;
				if (_ch == '\\') { next(); val += _ch; }
				next();
			}

			next();
			return { type: 'S', val };
		} else return null;
	}
	var tokenlist = [];
	while (_ch !== undefined) {
		let token = string();
		if (token) tokenlist.push(token);
		else { error('unexpected char ' + _ch); next(); }
	}
	tokenlist.push({ type: 'eof', val: null });
	return tokenlist;
	// return {next, peek, peekstr,white,error,lexchar,exceptch,exceptstr,number,string};
}
async function testLettersBefore() {
	//input = await route_path_text('../allg.js');
	input = await route_path_text('../pico0/allfuncs.js');
	input = replaceAllSpecialChars(input, '\t', '  ');
	input = replaceAllSpecialChars(input, '\r', '');
	console.clear();

	let parts = input.split('{');
	let zuvor = {};
	for (const p of parts) {
		let pt = p.trim();
		let ch = pt[pt.length - 1]; //stringLast(pt);
		if (nundef(zuvor[ch])) zuvor[ch] = true;
	}

	console.log('zuvor', get_keys(zuvor))
}
async function test_littleParser() {
	let file = '../pico0/source.js';
	input = await route_path_text(file);
	input = replaceAllSpecialChars(input, '\t', '  ');
	input = replaceAllSpecialChars(input, '\r', '');
	console.clear();
	let ast = littleParser(input); //"function dsf sdf() fs{ hasdasjkjgnd 12 }{23}{{}}}"); //12 3 'hallo 43234 \ndas' 14 2455");
	console.dir(ast, { depth: null });

	mBy('code1').innerHTML = prpr(ast);
	// let [o, dParent, title] = [ast, mBy('code1'), 'AST']
	// mNode(o, dParent, title);
}
function prpr(ast, ind = 0) {
	if (Array.isArray(ast)) return ast.map(x => prpr(x, ind)).join('');

	let t = ast.type;
	if (t == 'eof') { return ''; }
	else if (t == 'NB') {
		let s = ast.val.trim();
		return (s.length == 1) ? s : ' '.repeat(ind) + s;
	} else if (t == 'Braced') {
		let st = prpr(ast.m, ind + 2);
		//return '\n' + ' '.repeat(ind) + '{\n' + st + '\n' + ' '.repeat(ind) + '}\n';
		return ' {\n' + st + '\n' + ' '.repeat(ind) + '}';
	}
}
async function test_parser() {
	let file = '../pico0/source.js';
	input = await route_path_text(file);
	input = replaceAllSpecialChars(input, '\t', '  ');
	input = replaceAllSpecialChars(input, '\r', '');
	//console.clear(); 
	const forest = parser(file, lexer(file, input));
	forest.map(x => console.dir(x, { depth: null }));
	let [o, dParent, title] = [forest[0], mBy('code1'), 'AST']
	mNode(o, dParent, title);

}
async function test_lexer() {
	let input = `7574 334 2`;
	let file = '../pico0/source.js';
	input = await route_path_text(file);
	console.log('start');
	let res = lexer(file, input);
	//console.log('res', res)
	for (const token of res) {
		console.log(token);
	}
	console.log('finish');

}
function test_newline() {
	const input = "-7737 23\n13a3003\n\n";
	const input2 = `-7737 23
13a3003

`;
	const input3 = "-7737 23\r\n13a3003\r\n\r\n";
	let i4 = replaceAllSpecialChars(input3, '\r', '')
	console.log('code', input == input2, input == input3, input == i4)

}
//#region cardtests
async function startest_cards() {
	await load_syms(); //console.log('SymKeys',SymKeys)
	let k = rChoose(KeySets.animals);
	dTable = mBy('div0'); mFlexWrap(dTable); mStyle(dTable, { gap: 10 });
	test_calcSpecial(k); //test_primitive(k); //test_vicuna();
}
function test_calcSpecial(k) {
	for (const num of range(2, 30)) {
		let cols = calcSpecialCols(num);
		//let sz = 70 -  (num>=9?Math.ceil((num-8)/3)*9 : 0);
		let sz = 70;
		if (num >= 12) {
			let wieOft3 = Math.ceil((num - 11) / 3);
			for (let i of range(wieOft3)) sz *= .9;
			//console.log(num, wieOft3, sz);
		}
		let pos = calcSpecialPos(num, cols, sz);
		//console.log(pos);
		let c = cardGetObject(rChoose(KeySets.life), num, pos, sz);
		mAppend(dTable, iDiv(c));
		//console.log(num, cols, pos)
	}
}
function test_vicuna() {
	// Usage:
	const cardWidth = 100; // Example card width
	const cardHeight = 150; // Example card height
	//const symbolCount = 9; // Example number of symbols on a card
	for (const i of range(2, 20)) {
		const positions = calculateSymbolPositions(cardWidth, cardHeight, i);
		//console.log(positions);
		let dp = mDiv(dTable, { w: cardWidth, h: cardHeight, border: 'black', position: 'relative' });
		let sz = 10;
		for (const pos of positions) {
			let x = mDiv(dp, { bg: 'red', position: 'absolute', top: pos.y - sz / 2, left: pos.x - sz / 2, w: sz, h: sz })
		}

		// let x = cardGetSpecial(k, 120, i);
		// mAppend(dTable, iDiv(x))
	}
}
function test_primitive(k) {
	for (const i of range(2, 11)) {
		let x = cardGetPrimitive(k, 120, i);
		mAppend(dTable, iDiv(x))
	}
	//testPP1_code_nobrace();//testPP0(); //testCodeFormatter('../pico0/allglobals.js');	//test_hallo(); //testLettersBefore();//test_littleParser(); //test_newline()	//test_lexer();
}
//#endregion







