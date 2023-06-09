
async function codebaseExtendFromProject(project) {
	// read in codebase
	let globlist = await codeParseFile('../allg.js');
	let funclist = await codeParseFile('../allf.js');
	let list = globlist.concat(funclist); //keylist in order of loading!
	let bykey = list2dict(list, 'key');
	let bytype = {};
	for (const k in bykey) { let o = bykey[k]; lookupAddIfToList(bytype, [o.type], o); }
	//get .js files from project
	let htmlFile = `../${project}/index.html`;
	let html = await route_path_text(htmlFile);
	html = removeCommentLines(html, '<!--', '-->');
	let dirhtml = `../${project}`;
	let files = extractFilesFromHtml(html, htmlFile);
	files = files.filter(x => !x.includes('../all'));
	console.log('files', files)
	// let res=await codebaseFromFiles(files);	return res;
	let [globtext, functext, functextold] = await codebaseFromFiles(files,bykey,bytype,list);
	downloadAsText(globtext, 'allglobals', 'js');
	downloadAsText(functext, 'allfuncs', 'js');
	downloadAsText(functextold, 'allfuncs_old', 'js');
	return [globtext, functext, functextold];
}
async function codebaseFromFiles(files,bykey,bytype,list){
	let olist = [];
	for (const path of files) {
		let opath = await codeParseFile(path);
		olist = olist.concat(opath);
	}
	//sollen die jetzt gleich in bytype kommen?oder in bykey? bytype kann duplicates haben!!! davon nimm das letzte in olist!
	let mytype = {}, mykey = {};
	for (const o of olist) { mykey[o.key] = o; }
	for (const k in mykey) { let o = mykey[k]; lookupAddIfToList(mytype, [o.type], o); }

	//alle keys in bykey und in mykey sind unique. aber es kann same key in beiden geben
	//welchen code nehm ich dann?
	let dupltext = '';
	for (const k in mykey) {
		let onew = mykey[k];
		let oold = bykey[k];
		if (isdef(oold) && onew.code == oold.code) {
			console.log('override w/ SAME code', k);//brauch garnix machen!
		} else if (isdef(oold)) {
			console.log('override w/ DIFFERENT code', k);//override code with new code but keep old code!
			oold.oldcode = oold.code;
			oold.code = onew.code;
			dupltext += oold.oldcode + '\n' + oold.code + '\n';
		} else {
			bykey[k] = onew; //add new element to bykey
			lookupAddIfToList(bytype, [onew.type], onew);
			list.push(onew);
		}
	}

	// console.log('bytype',bytype); return //get_keys(bytype));return;
	//list, bytype und bykey sind jetzt complete!!!!
	let globtext = '', functext = '', functextold = '';
	for (const type of ['const', 'var', 'class']) {
		if (nundef(bytype[type])) continue;
		for (const o of bytype[type]) { globtext += o.code + '\n'; }
	}
	let sortedFuncKeys = sortCaseInsensitive(bytype.function.map(x => x.key));
	sortedFuncKeys.map(x => functext += bykey[x].code + '\n');
	sortedFuncKeys.map(x => functextold += (isdef(bykey[x].oldcode) ? bykey[x].oldcode : bykey[x].code) + '\n');

	return [globtext, functext, functextold]
}
async function codeParseFile(path) {
	let text = await route_path_text(path);

	//let keys = codeParseKeys(text); console.log('parse', path, keys)
	let olist = codeParseBlocks(text);

	return olist; // [keys, olist];
}
function codeParseKeys(text) {
	let keys = [];
	let lines = text.split('\r\n');
	for (const l of lines) {
		if (['var', 'const', 'cla', 'func', 'async'].some(x => l.startsWith(x))) {
			let key = ithWord(l, (l[0] == 'a' ? 2 : 1), true);
			keys.push(key);
		}
	}
	return keys;
}
function codeParseBlocks(text) {
	//erstmal ohne regions!!!
	let lines = text.split('\r\n');
	lines = lines.map(x => removeTrailingComments(x));
	let i = 0, o = null, res = [];
	while (i < lines.length) {
		let l = lines[i];
		if (['var', 'const', 'cla', 'func', 'async'].some(x => l.startsWith(x))) {
			[o, iLineAfterBlock] = codeParseBlock(lines, i);
			i = iLineAfterBlock;
			res.push(o)
		} else i++;
	}
	return res;
}
function codeParseBlock(lines, i) {
	let l = lines[i];
	let type = l[0] == 'a' ? ithWord(l, 1) : ithWord(l, 0);
	let key = l[0] == 'a' ? ithWord(l, 2, true) : ithWord(l, 1, true);
	let code = l + '\n'; i++; l = lines[i];
	while (i < lines.length && !(['var', 'const', 'cla', 'func', 'async'].some(x => l.startsWith(x)) && !l.startsWith('}'))) {
		if (!l.trim().startsWith('//') || isEmptyOrWhiteSpace(l)) code += l + '\n';
		i++; l = lines[i];
	}

	code = replaceAllSpecialChars(code, '\t', '  ');
	code = code.trim();

	return [{ key: key, type: type, code: code }, i];
}

async function cssExtendFromProject(project) {
	//cssbase ist in '../allcss.css'
	// let list = ['../allcss', `../coding/final`]; // ['reset','base','cards','features','mybutton','shapes'];//'base','cards','features','mybutton','shapes']; //,'cards','chess' //wurde bereits geloescht!!!
	// let csstext = await cssbaseNew(list); //,'../base/css');
	//eigentlich sollten transitions auch darein gehen! oder?
	//erstmal mach die files
	let htmlFile = `../${project}/index.html`;
	let html = await route_path_text(htmlFile);
	cssfiles = extractFilesFromHtml(html, htmlFile, 'css');
	console.log('cssfiles', cssfiles);
	cssfiles.unshift('../allcss.css');

	let csstext =  await cssFromFiles(cssfiles);
	downloadAsText(csstext, 'allcss', 'css');
	return csstext;
}
async function cssFromFiles(files, dir = '', types=['root', 'tag', 'class', 'id', 'keyframes']) {

	//get concatenated text from files
	let tcss = '';
	if (!isEmpty(dir) && !dir.endsWith('/')) dir += '/';
	for (const file of files) {
		let path = dir + file + (file.endsWith('.css')?'':'.css');
		tcss += await route_path_text(path) + '\r\n';
	}
	let t = replaceAllSpecialChars(tcss, '\t', '  ');
	// console.log('t',t)

	//prep dictionary by key: di = {key: type:}
	let lines = t.split('\r\n');
	if (lines.length <= 2) lines = t.split('\n');
	console.log('lines',lines)
	let allkeys = [], newlines = []; //in newlines
	let di = {};
	let testresult = '';
	for (const line of lines) {
		let type = cssKeywordType(line);
		if (type) {
			testresult += line[0] + '=';//addIf(testresult,line[0]); 
			let newline = isLetter(line[0]) || line[0] == '*' ? line : line[0] == '@' ? stringAfter(line, ' ') : line.substring(1);
			// testresult += newline + '\n';
			let key = line.includes('{') ? stringBefore(newline, '{') : stringBefore(newline, ','); //firstWordIncluding(newline, '_-: >').trim();
			key = key.trim();
			// testresult += key + '\n';
			if (isdef(di[key]) && type != di[key].type) {
				console.log('duplicate key', key, type, di[key].type);
			}
			di[key] = { type: type, key: key }
			newline = key + stringAfter(newline, key);
			if (key == '*') console.log('***', stringAfter(newline, key));
			//testresult += newline + '\n';
			addIf(allkeys, key);
			newlines.push(newline)
			di[key] = { type: type, key: key }
		} else {
			newlines.push(line);
		}
	}
	console.log('di', di)
	// return testresult; //linestarts.join();

	//allkeys has all css keys in order, di is bykey
	//add clauses
	let neededkeys = allkeys;
	let clause = '';
	let state = 'search_kw'; // search_kw search_clause_start search_clause_end
	for (const kw of neededkeys) {
		let i = 0;
		for (const line of newlines) {
			if (line.startsWith(kw)) {
				let w1 = line.includes('{') ? stringBefore(line, '{') : stringBefore(line, ',');
				if (w1.trim() != kw) continue;
				assertion(line.includes('{') || line.includes(','), `WEIRED LINE: ${kw} ${line}`);
				if (line.includes('{')) {
					clause = '{\n'; state = 'search_clause_end';
				} else if (line.includes(',')) {
					state = 'search_clause_start';
				}
			} else if (state == 'search_clause_start' && line.includes('{')) {
				clause = '{\n'; state = 'search_clause_end';
			} else if (state == 'search_clause_end') {
				if (line[0] == '}') {
					clause += line;
					let cleanclause = cssCleanupClause(clause, kw);
					lookupAddIfToList(di, [kw, 'clauses'], cleanclause);
					lookupAddIfToList(di, [kw, 'fullclauses'], clause);
					state = 'search_kw';
				} else {
					clause += line + '\n';
				}
			}
		}
	}

	//create dis = dict by type,key
	let dis = {};
	for (const o of get_values(di)) {
		if (nundef(o.clauses)) continue;
		let x = lookup(dis, [o.type, o.key]); if (x) console.log('DUPL:', o.key, o.type)
		lookupSet(dis, [o.type, o.key], o);
	}

	//combine to final text
	let text = '';

	let ditypes = {root:58, tag:'t', class:46, id:35, keyframes:64}; // : tags . # @
	if (types.includes('root')) types=['root'].concat(arrMinus(types,['root']));
	console.log('types',types);
	types = types.map(x=>ditypes[x]);
	//root als erstes!!!
	//let types = [58, t, 46, 35, 64]; // : tags . # @
	for (const type of types) {
		if (nundef(dis[type])) continue;
		let ksorted = sortCaseInsensitive(get_keys(dis[type]));
		let prefix = type == 't' ? '' : String.fromCharCode(type);
		if (prefix == '@') prefix += 'keyframes ';
		console.log('type', type, prefix, ksorted)
		for (const kw of ksorted) {
			let startfix = prefix + kw;
			for (const clause of dis[type][kw].clauses) {
				text += startfix + clause;
			}
		}
	}
	return text;


}
function cssKeywordType(line) {
	if (isLetter(line[0]) || line[0] == '*' && line[1] != '/') return 't';
	else if (toLetters(':.#').some(x => line[0] == x)) return (line.charCodeAt(0)); //[0].charkey());
	else if (line.startsWith('@keyframes')) return (line.charCodeAt(0));
	else return null;
	//return toLetters('*:.@#').some(x => line[0] == x) || isLetter(line[0]); 
}
async function cssSelectFromFile(cssfile,types){
	//nochmal die types aufschreiben!

	let csstext =  await cssFromFiles([cssfile],'',types);
	downloadAsText(csstext, 'selectioncss', 'css');
	return csstext;

}


function removeTrailingComments(line) {
	let icomm = line.indexOf('//');
	if (icomm <= 0 || ':"`\''.includes(line[icomm - 1])) return line;
	if ([':', '"', "'", '`'].some(x => line.indexOf(x) < icomm)) return line;

	return line.substring(0, icomm);
}


function ithWord(s, n, allow_) {
	let ws = toWords(s, allow_);
	// console.log('?',s,n,allow_,ws);
	return ws[Math.min(n, ws.length - 1)];
}


function initCodingUI() {
	mStyle('dMain', { bg: 'silver' });
	[dTable, dSidebar] = mCols100('dMain', '1fr auto', 0);
	let [dtitle, dta] = mRows100(dTable, 'auto 1fr', 2);
	mDiv(dtitle, { padding: 10, fg: 'white', fz: 24 }, null, 'OUTPUT:');
	AU.ta = mTextArea100(dta, { fz: 20, padding: 10, family: 'opensans' });

}
function mCols100(dParent, spec, gap = 4) {
	let grid = mDiv(dParent, { padding: gap, gap: gap, box: true, display: 'grid', h: '100%', w: '100%' })
	grid.style.gridTemplateColumns = spec;
	let res = [];
	for (const i of range(stringCount(spec, ' ') + 1)) {
		let d = mDiv(grid, { h: '100%', w: '100%', box: true })
		res.push(d);
	}
	return res;
}
function mRows100(dParent, spec, gap = 4) {
	let grid = mDiv(dParent, { padding: gap, gap: gap, box: true, display: 'grid', h: '100%', w: '100%' })
	grid.style.gridTemplateRows = spec;
	let res = [];
	for (const i of range(stringCount(spec, ' ') + 1)) {
		let d = mDiv(grid, { h: '100%', w: '100%', box: true })
		res.push(d);
	}
	return res;
}
function mTextArea100(dParent, styles = {}) {
	mCenterCenterFlex(dParent)
	let html = `<textarea style="width:100%;height:100%;box-sizing:border-box" wrap="hard"></textarea>`;
	let t = mCreateFrom(html);
	mStyle(t, styles);
	mAppend(dParent, t);
	return t;
}





