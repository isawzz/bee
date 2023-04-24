
function cssKeysNeeded(tcss, code, html) {
	let t = replaceAllSpecialChars(tcss, '\t', '  ');
	let lines = t.split('\r\n');
	let allkeys = [], newlines = []; //in newlines
	let di = {};
	for (const line of lines) {
		if (cssIsKeywordLine(line)) {
			let newline = line.startsWith('@') ? stringAfter(line, ' ') : line.startsWith(':') ? stringAfter(line, ':') : line;
			let word = firstWordIncluding(newline, '_-: ').trim();
			newline = word + stringAfter(newline, word);
			addIf(allkeys, word);
			newlines.push(newline)
			let ch = line[0];
			let type = isLetter(ch) ? 't' : ch == '.' ? 'c' : ch == '@' ? 'k' : ch == ':' ? 'r' : 'i';
			di[word] = { type: type, key: word }
		} else {
			newlines.push(line);
		}
	}
	let neededkeys = [];
	for (const k of allkeys) {
		if (['rubberBand'].includes(k)) continue;
		let ktest = k.includes(' ') ? stringBefore(k, ' ') : k.includes(':') ? stringBefore(k, ':') : k;
		if (['root'].some(x => x == k)) addIf(neededkeys, k);
		else if (code.includes(`${ktest}`) || code.includes(`'${ktest}'`) || code.includes(`"${ktest}"`)) addIf(neededkeys, k);
		else if (html.includes(`${ktest}`)) addIf(neededkeys, k);
	}
	return [di, neededkeys, newlines];
}

function cssNormalize(tcss, code, html) {
	[di, neededkeys, newlines] = cssKeysNeeded(tcss, code, html);
	console.log('needed', sortCaseInsensitive(neededkeys))
	let clause = '';
	let state = 'search_kw'; // search_kw search_clause_start search_clause_end
	for (const kw of neededkeys) {
		let i = 0;
		for (const line of newlines) {
			let lt = line.trim(); //console.log('ende',lt.endsWith('\n')); //return;
			if (line.startsWith(kw) && firstWordIncluding(line, '_-: ').trim() == kw) { //firstWordIncluding(line, '_- ').trim() == kw)  {
				assertion(line.includes('{') || line.includes(','), `WEIRED LINE: ${line}`)
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
	for (const type in dis) {
		let ksorted = sortCaseInsensitive(get_keys(dis[type]));
		let prefix = type == 't' ? '' : type == 'k' ? '@keyframes ' : type == 'c' ? '.' : type == 'r' ? ':' : '#';
		for (const kw of ksorted) {
			let startfix = prefix + kw;
			for (const clause of dis[type][kw].clauses) {
				text += startfix + clause;
			}
		}
	}
	return text;
}




function _minimizeCode(di, symlist = ['start'], nogo = []) {
	let done = {};
	let tbd = symlist; //console.log('symlist', symlist)
	let MAX = 1000000, i = 0;
	let visited = { Card:true, change: true, grid: true, jQuery: true, config: true, Number: true, sat: true, hallo: true, autocomplete: true, PI: true };

	while (!isEmpty(tbd)) {
		if (++i > MAX) break; //else console.log('i',i)
		let sym = tbd[0]; console.log('sym', sym,i);
		if (isdef(visited[sym])) { tbd.shift(); continue; }
		visited[sym] = true;
		let o = di[sym];
		if (nundef(o)) { tbd.shift(); continue; } //console.log('not def',sym);
		let text = o.code; //always using last function body!!!
		let words = toWords(text, true);
		for (const w of words) {
			if (nogo.some(x => w.startsWith(x))) continue; //'uiGetC'+'ontact')) {console.log('sym',sym,w);return done;}
			if (nundef(done[w]) && nundef(visited[w]) && w != sym && isdef(di[w])) addIf(tbd, w);
		}
		assertion(sym == tbd[0], 'W T F')
		tbd.shift();
		done[sym] = o;
	}
	return done;
}


async function bundleGenerateFrom(htmlScriptsFile, htmlBodyFile = null, download = true) {
	let html = await route_path_text(htmlScriptsFile);
	html = removeCommentLines(html, '<!--', '-->');
	if (htmlBodyFile) html += await route_path_text(htmlBodyFile);
	let dirhtml = stringBeforeLast(htmlScriptsFile, '/');
	let project = stringAfter(dirhtml, '/'); if (project.includes('/')) project = stringBefore(project, '/');
	let files = extractFilesFromHtml(html, htmlScriptsFile);
	let byKey = {}, ckeys = [], idx = 0, haveBundle = false;
	if (files.length == 1) {
		haveBundle = true;
		console.log('bundle already generated!!!', files[0]);
	}
	for (const f of files) { let idxnew = await parseCodeFile(f, byKey, ckeys, idx); idx = idxnew; }
	let bundle_code = _assemble_code_sorted(ckeys, byKey, haveBundle);
	let knownNogos = { codingfull: ['uiGetContact'] };
	let seed = ['start'].concat(extractOnclickFromHtml(html)); //console.log('seed',seed)
	let byKeyMinimized = _minimizeCode(byKey, seed, valf(knownNogos[project], []));
	let ckeysMinimized = ckeys.filter(x => isdef(byKeyMinimized[x]));
	let closure_code = _assemble_code_sorted(ckeysMinimized, byKeyMinimized, haveBundle);
	if (download) downloadAsText(closure_code, `${project}_closure`, 'js');
	let scripts = `</body><script src="../${dirhtml}/closure.js"></script><script>onload = start;</script>\n</html>`;
	let htmlcode = stringBefore(html, `</body>`) + scripts;
	AU.ta.value = closure_code;
	cssfiles = extractFilesFromHtml(html, htmlScriptsFile, 'css');
	console.log('cssfiles', cssfiles)
	let csstext = files.length > 0 ? await cssGenerateFrom(cssfiles[0], bundle_code, html) : 'no css';
	return [bundle_code, closure_code, csstext, html];
}









