async function closureFromProject(project) {

	//get the dicts
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

	// *** here bykey contains newest code for project ***
	//minimize
	let knownNogos = { codingfull: ['uiGetContact'], coding: ['uiGetContact', 'grid'] };
	let seed = ['start'].concat(extractOnclickFromHtml(html)); console.log('seed', seed)
	let byKeyMinimized = _minimizeCode(bykey, seed, valf(knownNogos[project], []));

	let cvckeys = list.filter(x => isdef(byKeyMinimized[x.key]) && x.type != 'function').map(x => x.key); //in order of appearance!
	let funckeys = list.filter(x => isdef(byKeyMinimized[x.key]) && x.type == 'function').map(x => x.key); //in order of appearance!
	funckeys = sortCaseInsensitive(funckeys);

	//generate
	let closuretext = '';
	for (const k of cvckeys) { closuretext += byKeyMinimized[k].code + '\n'; }
	for (const k of funckeys) { closuretext += byKeyMinimized[k].code + '\n'; }

	//css closure as well!
	cssfiles = extractFilesFromHtml(html, htmlFile, 'css');
	console.log('cssfiles', cssfiles);
	cssfiles.unshift('../allcss.css');

	//generate css dict

	//get concatenated text from files
	let tcss = '';
	for (const path of cssfiles) { tcss += await route_path_text(path) + '\r\n'; }
	let t = replaceAllSpecialChars(tcss, '\t', '  ');
	// console.log('t',t)

	//prep dictionary by key: di = {key: type:}
	let lines = t.split('\r\n');
	if (lines.length <= 2) lines = t.split('\n');
	console.log('lines', lines)
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

	//minimize
	let neededkeys = [], code = closuretext;
	for (const k of allkeys) {
		if (['rubberBand'].includes(k)) continue;
		let ktest = k.includes(' ') ? stringBefore(k, ' ') : k.includes(':') ? stringBefore(k, ':') : k;
		if (['root'].some(x => x == k)) addIf(neededkeys, k);
		else if (code.includes(`${ktest}`) || code.includes(`'${ktest}'`) || code.includes(`"${ktest}"`)) addIf(neededkeys, k);
		else if (html.includes(`${ktest}`)) addIf(neededkeys, k);
	}

	//add clauses to di
	let clause = '';
	let state = 'search_kw';
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

	//generate text
	let csstext = '';
	let types = ['root', 'tag', 'class', 'id', 'keyframes'];
	let ditypes = { root: 58, tag: 't', class: 46, id: 35, keyframes: 64 }; // : tags . # @
	if (types.includes('root')) types = ['root'].concat(arrMinus(types, ['root']));
	console.log('types', types);
	types = types.map(x => ditypes[x]);
	for (const type of types) {
		if (nundef(dis[type])) continue;
		let ksorted = sortCaseInsensitive(get_keys(dis[type]));
		let prefix = type == 't' ? '' : String.fromCharCode(type);
		if (prefix == '@') prefix += 'keyframes ';
		console.log('type', type, prefix, ksorted)
		for (const kw of ksorted) {
			let startfix = prefix + kw;
			for (const clause of dis[type][kw].clauses) {
				csstext += startfix + clause;
			}
		}
	}

	return [closuretext, csstext];
}







