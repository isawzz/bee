
async function start() {
	initCodingUI();
	AU.ta.value = 'hallo, na ENDLICH!!!!!!!!!!';

	let list = ['reset','base','cards','features','mybutton','shapes'];//'base','cards','features','mybutton','shapes']; //,'cards','chess'
	let csstext = await cssbaseNew('../base/css', list);
	AU.ta.value = csstext;

}
function cssKeywordType(line) {
	if (isLetter(line[0]) || line[0]=='*' && line[1]!='/') return 't';
	else if (toLetters(':.@#').some(x => line[0] == x)) return (line.charCodeAt(0)); //[0].charkey());
	else return null;
	//return toLetters('*:.@#').some(x => line[0] == x) || isLetter(line[0]); 
}

async function cssbaseNew(dir, files) {
	let tcss = '';
	for (const file of files) {
		let path = dir + '/' + file + '.css';
		tcss += await route_path_text(path) + '\r\n';
	}
	let t = replaceAllSpecialChars(tcss, '\t', '  ');
	let lines = t.split('\r\n');
	let allkeys = [], newlines = []; //in newlines
	let di = {};
	let testresult = '';
	for (const line of lines) {
		let type = cssKeywordType(line);
		if (type) {
			testresult += line[0] + '=';//addIf(testresult,line[0]); 
			let newline = isLetter(line[0]) || line[0]=='*' ? line : line[0] == '@' ? stringAfter(line, ' ') : line.substring(1);
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

	let dis = {};
	for (const o of get_values(di)) {
		if (nundef(o.clauses)) continue;
		let x = lookup(dis, [o.type, o.key]); if (x) console.log('DUPL:', o.key, o.type)
		lookupSet(dis, [o.type, o.key], o);
	}
	let text = '';
	//root als erstes!!!
	let types = [58,t,46,35,64]; // : tags . # @
	for (const type of types) {
		if (nundef(dis[type])) continue;
		let ksorted = sortCaseInsensitive(get_keys(dis[type]));
		let prefix = type == 't' ? '' : String.fromCharCode(type);
		if (prefix == '@') prefix += 'keyframes ';
		console.log('type',type,prefix,ksorted)
		for (const kw of ksorted) {
			let startfix = prefix + kw;
			for (const clause of dis[type][kw].clauses) {
				text += startfix + clause;
			}
		}
	}
	return text;


}
async function codebaseNew(project) {
	let [globtext, functext, functextold] = await codebaseExtend(project);
	downloadAsText(globtext, 'allglobals', 'js');
	downloadAsText(functext, 'allfuncs', 'js');
	downloadAsText(functextold, 'allfuncs_old', 'js');
}
async function codebaseExtend(project) {
	// read in codebase
	let globlist = await codeParseFile('../allglobals.js');
	let funclist = await codeParseFile('../allfuncs.js');
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




















