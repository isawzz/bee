

async function cssbaseNew(dir,files) {
	let tcss=`
	* {
		margin: 0;
		padding: 0;
		border: 0;
		box-sizing: border-box;
	}
	`;
	for(const file of files){
		let path = dir+'/'+file+'.css';
		tcss += await route_path_text(path) + '\n';
	}
	let t = replaceAllSpecialChars(tcss, '\t', '  ');
	let lines = t.split('\r\n');
	let allkeys = [], newlines = []; //in newlines
	let di = {};
	for (const line of lines) {
		if (cssIsKeywordLine(line)) {
			let newline = line.startsWith('@') ? stringAfter(line, ' ') : line.startsWith(':') ? stringAfter(line, ':') : line;
			let key = firstWordIncluding(newline, '_-: >').trim();
			newline = key + stringAfter(newline, key);
			addIf(allkeys, key);
			newlines.push(newline)
			let ch = line[0];
			let type = isLetter(ch) ? 't' : ch == '.' ? 'c' : ch == '@' ? 'k' : ch == ':' ? 'r' : 'i';
			if (isdef(di[key]) && type != di[key].type){
				console.log('duplicate key',key,type,di[key].type);
			}
			di[key] = { type: type, key: key }
		} else {
			newlines.push(line);
		}
	}

	//allkeys has all css keys in order, di is bykey
	//add clauses
	let neededkeys = allkeys;
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

async function rest() {
	let odict = list2dict(olist, 'key');
	for (const k in odict) {
		if (isdef(difuncs[k])) {
			//check if code changed, in which case alert!
			if (odict[k].code != difuncs[k].code) {
				console.log('NEW DUPL!', k);

				if (nundef(difuncs[k].oldcode)) difuncs[k].oldcode = difuncs[k].code;
				difuncs[k].code = odict[k].code;

				dupltext += difuncs[k].oldcode + '\n' + difuncs[k].code + '\n';
				difuncs[k].override = odict[k].code;
			}
			continue;
		}
		difuncs[k] = odict[k];
	}
}

async function rest() {

	let globtext = globlist.map(x => x.code).join('\n');
	//downloadAsText(globtext,'allglobals','js');

	let difuncs = list2dict(funclist, 'key');
	// let keys = sortCaseInsensitive(get_keys(difuncs));
	// let functext = '';
	// for (const k of keys) { functext += difuncs[k].code + '\n'; }
	//downloadAsText(functext,'allfuncs','js');

	//bis jetzt hab ich nur allglobals und allfuncs rewritten!
	let project = 'coding';

	let dupltext = '';
	for (const path of files) {
		let olist = await codeParseFile(path);
		let odict = list2dict(olist, 'key');
		for (const k in odict) {
			if (isdef(difuncs[k])) {
				//check if code changed, in which case alert!
				if (odict[k].code != difuncs[k].code) {
					console.log('NEW DUPL!', k);

					if (nundef(difuncs[k].oldcode)) difuncs[k].oldcode = difuncs[k].code;
					difuncs[k].code = odict[k].code;

					dupltext += difuncs[k].oldcode + '\n' + difuncs[k].code + '\n';
					difuncs[k].override = odict[k].code;
				}
				continue;
			}
			difuncs[k] = odict[k];
		}
	}

	let keys = sortCaseInsensitive(get_keys(difuncs));
	let functext = '', oldtext = '';
	for (const k of keys) {
		let o = difuncs[k];
		functext += o.code + '\n';
		oldtext += (isdef(o.oldcode) ? o.oldcode : o.code) + '\n';
	}
	//downloadAsText(functext,'allfuncs','js');
	//downloadAsText(oldtext, 'allfuncs_old', 'js');

	let knownNogos = { codingfull: ['uiGetContact'], coding: ['uiGetContact', 'grid'] };
	let seed = ['start'].concat(extractOnclickFromHtml(html)); //console.log('seed',seed)
	let byKeyMinimized = _minimizeCode(difuncs, seed, valf(knownNogos[project], []));
	let keysMinimized = keys.filter(x => isdef(byKeyMinimized[x]));
	keysMinimized = sortCaseInsensitive(keysMinimized);
	let closuretext = '';
	for (const k of keysMinimized) { closuretext += byKeyMinimized[k].code + '\n'; }
	downloadAsText(closuretext, 'closure', 'js');

	AU.ta.value = keysMinimized.join(', ');

}


async function codebaseExtend(project){
	let globlist = await codeParseFile('../allglobals.js');
	let funclist = await codeParseFile('../allfuncs.js');
	let list = globlist.concat(funclist); //keylist in order of loading!
	let bykey=list2dict(list,'key');
	let bytype={};
	for(const k in bykey){
		let o=bykey[k];
		lookupAddIfToList(bytype,[o.type,k],o);
	}
	//get .js files from project
	let htmlFile = `../${project}/index.html`;
	let html = await route_path_text(htmlFile);
	html = removeCommentLines(html, '<!--', '-->');
	let dirhtml = `../${project}`;
	let files = extractFilesFromHtml(html, htmlFile);
	files = files.filter(x => !x.includes('../all'));
	console.log('files', files)
	if (files.length < 2) {
		console.log('ONLY FILE IS', files[0], '...aborting');
		return;
	}



	let globtext = globlist.map(x => x.code).join('\n');
	//downloadAsText(globtext,'allglobals','js');

	let difuncs = list2dict(funclist, 'key');
	// let keys = sortCaseInsensitive(get_keys(difuncs));
	// let functext = '';
	// for (const k of keys) { functext += difuncs[k].code + '\n'; }
	//downloadAsText(functext,'allfuncs','js');

	//bis jetzt hab ich nur allglobals und allfuncs rewritten!
	let project = 'coding';

	let dupltext = '';
	for (const path of files) {
		let olist = await codeParseFile(path);
		let odict = list2dict(olist, 'key');
		for (const k in odict) {
			if (isdef(difuncs[k])) {
				//check if code changed, in which case alert!
				if (odict[k].code != difuncs[k].code) {
					console.log('NEW DUPL!', k);

					if (nundef(difuncs[k].oldcode)) difuncs[k].oldcode = difuncs[k].code;
					difuncs[k].code = odict[k].code;

					dupltext += difuncs[k].oldcode + '\n' + difuncs[k].code + '\n';
					difuncs[k].override = odict[k].code;
				}
				continue;
			}
			difuncs[k] = odict[k];
		}
	}

	let keys = sortCaseInsensitive(get_keys(difuncs));
	let functext = '', oldtext = '';
	for (const k of keys) {
		let o = difuncs[k];
		functext += o.code + '\n';
		oldtext += (isdef(o.oldcode) ? o.oldcode : o.code) + '\n';
	}
	//downloadAsText(functext,'allfuncs','js');
	//downloadAsText(oldtext, 'allfuncs_old', 'js');

	let knownNogos = { codingfull: ['uiGetContact'],coding: ['uiGetContact','grid'] };
	let seed = ['start'].concat(extractOnclickFromHtml(html)); //console.log('seed',seed)
	let byKeyMinimized = _minimizeCode(difuncs, seed, valf(knownNogos[project], []));
	let keysMinimized = keys.filter(x => isdef(byKeyMinimized[x]));
	keysMinimized = sortCaseInsensitive(keysMinimized);
	let closuretext = '';
	for (const k of keysMinimized) { closuretext += byKeyMinimized[k].code + '\n'; }
	downloadAsText(closuretext, 'closure', 'js');

	AU.ta.value = keysMinimized.join(', ');

}

function mist111() {
	if (isEmpty(line.trim()) || line.startsWith) { i++; }
	let type = 'in_process';
	let w = stringBefore(line, ' ');
	let ch = line[0];
	let i = 0; while (line[i] == '\t') { i++; }
	let fw = line.slice(i);
	if (line.startsWith('//#region')) { w = 'REGION'; type = 'REGION' }
	else if (line.startsWith('//#endregion')) { w = 'ENDREGION'; type = 'REGION' }
	else if (line.startsWith('//')) { w = 'COMMENT'; type = 'empty' }
	else if (isdef(fw) && fw.startsWith('//')) { w = 'COMMENT'; type = 'empty' }
	else if (ch == '\t') { w = 'TAB'; }
	else if (ch == '}' || ch == '{') { w = 'BRACKET' }
	else if (nundef(ch)) { w = 'UNDEFINED'; type = 'WTF' }
	else if (ch == ' ') { w = 'SPACE'; } //type = 'WTF' }
	else if (ch == '\r') { type = 'WTF' }
	else if (nundef(fw)) { w = fw; type = 'WTF' }
	if (['async', 'class', 'const', 'function', 'var'].includes(w)) type = 'block';
	else if (isLetter(ch)) type = 'WTF';
	return [w, type];

}
async function __codeParseFile(path, byKey, ckeys, idx) {
	let chunk = '', kw = null, blocktype = null, region = null;
	let txt = await route_path_text(path);
	let fname = stringAfterLast(path, '/'); fname = stringBefore(fname, '.');
	let lines = txt.split('\n');
	for (const line of lines) {
		let [w, type] = _getLineStart(line);
		if (line.trim() == '`;' && kw) { chunk += line + '\n'; continue; }
		if (type == 'WTF') { continue; }
		else if (type == 'empty') { continue; }
		else if (type == 'in_process') {
			if (line.trim().startsWith('//')) continue; // #region') || line.includes('//#endregion')) continue;
			if (kw) { chunk += line + '\n'; }
		}
		else if (type == 'REGION') { if (w == type) region = stringAfter(line, '//#region ').trim(); }
		else if (type == 'block') {
			if (kw) addCodeBlock(path, byKey, ckeys, kw, chunk, fname, region, blocktype, idx++);
			kw = w == 'async' ? stringAfter(line, 'function ') : stringAfter(line, ' '); kw = firstWord(kw, true);
			let blocktypes = { function: 'func', class: 'cla', async: 'func', var: 'var', const: 'const' };
			blocktype = blocktypes[w];
			chunk = line + '\n';
		} else { console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'); break; }
	}
	if (kw) addCodeBlock(path, byKey, ckeys, kw, chunk, fname, region, blocktype, idx++);
	return idx;
}

function collectCodeKeys(text) {
	let lines = text.split('\r\n');
	for (const l of lines) {
		if (['var', 'const', 'cla', 'func', 'async'].some(x => l.startsWith(x))) {
			let key = ithWord(l, l[0] == 'a' ? 2 : 1, true);
			keysSorted.push(key);
		}
	}
}
function collectCode(text,path) {
	let lines = text.split('\r\n');
	for (const l of lines) {
		if (['var', 'const', 'cla', 'func', 'async'].some(x => l.startsWith(x))) {
			let key = ithWord(l, l[0] == 'a' ? 2 : 1, true);
			keysSorted.push(key);
		}
	}
}
async function populateCODE(dir) {
	let text = CODE.text = await route_path_text('../allglobals.js') + '\r\n' + await route_path_text('../allfuncs.js');
	let keysSorted = CODE.keysSorted = collectCodeKeys(text);
	let superdi = CODE.superdi = await route_path_yaml_dict(dir + '/z_all.yaml');
	let justcode = await route_path_yaml_dict(dir + '/z_allcode.yaml');
	let history = await route_path_yaml_dict(dir + '/z_allhistory.yaml');
	CODE.di = {};
	for (const type in superdi) {
		for (const k in superdi[type]) {
			let o = superdi[type][k];
			o.code = justcode[k];
			o.history = history[k];
			CODE.di[k] = o;
		}
	}
	return [superdi, keysSorted];
}


async function load_Codebase(dir, path_allcode) {
	let path_js = isdef(path_allcode) ? path_allcode : '../basejs/cb2/allcode.js';
	dir = isdef(dir) ? dir : '../basejs';
	let text = CODE.text = await route_path_text(path_js);
	let keysSorted = [];
	let lines = text.split('\r\n');
	for (const l of lines) {
		if (['var', 'const', 'cla', 'func'].some(x => l.startsWith(x))) {
			let key = firstWordAfter(l, ' ', true);
			keysSorted.push(key);
		}
	}
	CODE.keysSorted = keysSorted;
	CODE.di = await route_path_yaml_dict(dir + '/z_all.yaml');
	CODE.justcode = await route_path_yaml_dict(dir + '/z_allcode.yaml');
	CODE.codelist = dict2list(CODE.justcode, 'key');
	CODE.history = await route_path_yaml_dict(dir + '/z_allhistory.yaml');
	let keys = {};
	for (const type in CODE.di) { for (const k1 in CODE.di[type]) keys[k1] = CODE.di[type][k1]; }
	CODE.all = keys;
	CODE.keylist = Object.keys(keys);
	return CODE;
}


//#region updateCodebase trial 1
async function start() {
	test_ui_extended();

	await updateCodebase('coding');

	//let x = await load_Codebase('../base/codebase', '../allcode.js'); console.log('CODE', x)
	//await load_assets_fetch('../base/', '../games/')
	//let [bundle, closure, csstext, html] = await bundleGenFromProject('game', false);
	// AU.ta.value = closure; 
}

function _assemble_code_sorted(list, di, preserveRegions = false) {
	let text = '';
	for (const k of list) {
		assertion(isdef(k), `KEY UNDEFINED ${k}`);
		if (nundef(di[k])) continue;
		let o = di[k];
		text += o.code;
	}
	return text;
}
function removeEmptyLines(x) {
	let lines = x.split('\n');
	lines = lines.filter(x => !isEmptyOrWhiteSpace(x));
	return lines.join('\n');
}
function isEmptyOrWhiteSpace(s) { return isEmpty(s.trim()); }

function codeNormalize(code) {

	let res = '';
	res = replaceAllSpecialChars(code, '\t', '  ');
	return res.trim(); //,'\r\n','\n'); //correct_code_text(code);	
}
function assemble_dicts(superdi) {
	let justcode = {};
	let history = {};
	let res = {};
	for (const type in superdi) {
		res[type] = {};
		for (const k in superdi[type]) {
			let o = jsCopy(superdi[type][k]);
			let code = remove_all_region_endregion(o.code);
			justcode[k] = codeNormalize(code); //replaceAllSpecialChars(replaceAllSpecialChars(code,'\t','  '),'\r\n','\n'); //correct_code_text(code);
			history[k] = o.history;
			delete o.code;
			delete o.history;
			res[type][k] = o;
		}
	}
	return [res, justcode, history];
}
function getCompactDatetime(str) {
	var date = new Date(str),
		mnth = ("0" + (date.getMonth() + 1)).slice(-2),
		day = ("0" + date.getDate()).slice(-2);
	hours = ("0" + date.getHours()).slice(-2);
	minutes = ("0" + date.getMinutes()).slice(-2);
	return [date.getFullYear(), mnth, day, hours, minutes].join("-");
}

function make_superdi() {
	let filenames = ['basemin', 'legacy', 'apiserver', 'apisimphp', 'gamehelpers', 'onclick', 'select', 'sim', 'cards'];
	let list = getFiles(filenames, 'C:\\xampp\\htdocs\\aroot\\SAFE\\bundle');
	let superdi = {};
	for (const file of list) {
		let text = fromFile(file.path);
		if (text.includes('= require(') || text.includes(' ol.')) { continue; } //console.log('skip file', file.path); 
		parseCodefile1(text, file.fname, true, file, superdi);
	}
	return superdi;
}
function get_current_superdi(dir) {

	//load current codebase dicts
	let diall = fromYamlFile(dir + 'z_all.yaml'); // const var cla func
	let dicode = fromYamlFile(dir + 'z_allcode.yaml'); // names
	let dihistory = fromYamlFile(dir + 'z_allhistory.yaml'); // names
	//console.log(diall.func.arrTake);
	//reconstruct superdi!
	let superdi = {};
	for (const type in diall) {
		for (const k in diall[type]) {
			let o = diall[type][k];
			o.code = dicode[k];
			o.history = dihistory[k];
			lookupSet(superdi, [type, k], o);
		}
	}
	return superdi;
}
function replaceConstByFunc(di, el) {
	let [key, code] = [el.key, el.code];
	delete di.const[key];
	//console.log('replace', key);

	let params = stringBefore(code, '=>').trim();
	let body = stringAfter(code, '=>').trim();
	if (params.includes('(')) {
		params = stringBefore(params, ')');
		params = stringAfter(params, '(');
	} else params = '';
	let text = `function ${key}(${params}) {`;
	if (body.startsWith('{')) {
		text += stringAfter(body, '{');
		text = stringBeforeLast(text, '}') + '}';
	} else {
		//console.log('body of',key,body[0])
		//if (body.startsWith('\r\n')) {body=stringAfter(body,'\r\n');console.log('body',body);}

		text += 'return ' + body + '}';
	}
	let o = el;
	o.code = text;
	//console.log('new body',text)
	o.sig = getFunctionSignature(stringBefore(text, '\r\n'), key);
	if (o.region == 'const') o.region = 'func'; //o.filename;
	o.type = 'func';
	di.func[key] = o;
	return di;
}
function replaceALLTESTS(di, el) {
	let [key, code] = [el.key, el.code];
	delete di.const[key];
	//console.log('replace', key);

	let params = '';
	let body = stringAfter(code, '\r\n').trim();
	let text = `function ${key}(${params}) {\r\n`;
	text += `return {\r\n${body}\r\n}`;
	let o = el;
	o.code = text;
	o.sig = getFunctionSignature(stringBefore(text, '\r\n'), key);
	if (o.region == 'const') o.region = 'func'; //o.filename;
	o.type = 'func';
	di.func[key] = o;
	return di;
}
function correct_code_text(code) {
	code = replaceAllSpecialChars(code, '\t', '  ');
	// if (code.startsWith('function') || code.startsWith('async')) {
	// 	if (stringCount(code, '\n') > 1) {
	// 		//console.log('code vorher',code)
	// 		let firstline = stringBefore(code, '\n');
	// 		let fltrimmed = firstline.trim();
	// 		if (!fltrimmed.endsWith('{')) {
	// 			let sig = stringBeforeLast(fltrimmed, '{') + '{\n';
	// 			let second = stringAfterLast(fltrimmed, '{');
	// 			code = sig + second + stringAfter(code, firstline);
	// 			console.log('code danach!!!\n', code)
	// 		}
	// 	}
	// }
	let lines = code.split('\r\n');
	for (const line of lines) {
		if (line.includes('\r')) console.log('CR in line!!!!', code);
		if (line.includes('\t')) {
			console.log('TAB in line!!!!', code);
			//replace tabs by spaces!

		}
	}
	return lines[0] + lines.slice(1).join('\n');
}
function assemble_consts(superdi) {
	let text = '//#region consts\r\n';
	let text2 = '//#region consts\r\n';
	let constlist = sortConstKeys(superdi);
	for (const c of constlist) {
		let constkey = c.key;
		if (['cx', 'PORT', 'SERVER', 'SERVERRURL'].some(x => x == constkey)) { delete superdi.const[constkey]; continue; }
		if (isdef(superdi.func[constkey]) || isdef(superdi.cla[constkey])) { delete superdi.const[constkey]; continue; }
		//if (constkey == 'GFUNC') continue;
		let code = c.code;
		//if (constkey == 'GFUNC') console.log('code', code, code.includes('colorDarker'))
		let skip = false;
		for (const k in superdi.func) { if (code.includes(k + '(') || code.includes(k + ',')) { skip = true; break; } }
		for (const k in superdi.cla) { if (code.includes(k + '(') || code.includes(k + ',') || skip) { skip = true; break; } }
		if (['OPS', 'Perlin', 'EMO'].includes(constkey)) { skip = false; }
		else if (constkey == 'ALLTESTS') {
			//sehr spezielle umwandlung:
			superdi = replaceALLTESTS(superdi, c);
			skip = true;
		}
		else if (code.includes('=>')) { superdi = replaceConstByFunc(superdi, c); skip = true; }

		if (skip) text2 += code.trim() + '\r\n'; else text += code.trim() + '\r\n';
	}
	text += '//#endregion\r\n\r\n';
	//text2 += '//#endregion\r\n\r\n';
	return [text, text2, superdi];
}
function quick_consts(superdi) {
	let text = '//#region consts\r\n';
	let constlist = sortConstKeys(superdi);
	for (const c of constlist) {
		let constkey = c.key;
		if (['cx', 'PORT', 'SERVER', 'SERVERRURL'].some(x => x == constkey)) { delete superdi.const[constkey]; continue; }
		if (isdef(superdi.func[constkey]) || isdef(superdi.cla[constkey])) { delete superdi.const[constkey]; continue; }
		let code = c.code;
		text += code.trim() + '\r\n';
	}
	text += '//#endregion\r\n\r\n';
	return text;
}
function is_chessvar(o) {
	//ich brauch die reihenfolge der vars genau gleich wie in 
	//console.log(get_keys(o));
	if (o.type == 'var' && o.filename == 'chess.js' && o.name.startsWith('brd_')) {
		lookupSet(superdi, ['chessvar', o.name], true);
	}
	let yes = o.history.some(x => x.includes('chess.js'));
	return yes;
	if (o.name.startsWith('brd_')) return true;
}
function repair_vars(superdi) {
	let varkeys = Object.keys(superdi.var);
	for (const varkey of varkeys) {
		if (['lifeView', 'exp', 'Deck', 'gridsize'].some(x => x == varkey)) { delete superdi.var[varkey]; continue; }
		let o = superdi.var[varkey];
		if (!o.sig.startsWith('var')) {
			o.sig = `var ${varkey}`
			//console.log('NOT A VAR SIG', varkey);
		}
		if (!o.code.startsWith('var')) {
			o.code = `var ${stringAfter(o.code, ' ')}`;
			//console.log('NOT A VAR CODE', varkey);
		}
		o.type = 'var';
	}
}
function quick_vars(superdi) {
	let text = '//#region vars\r\n';
	let varkeys = Object.keys(superdi.var);
	let dichess = {};
	for (const varkey of varkeys) {
		if (['lifeView', 'exp', 'Deck', 'gridsize'].some(x => x == varkey)) { delete superdi.var[varkey]; continue; }
		let o = superdi.var[varkey];
		if (is_chessvar(o)) {
			//console.log('chessvar', varkey);
			dichess[varkey] = o;
		} else if (varkey == varkey.toLowerCase() && varkey != 'c52') {
			delete superdi.var[varkey];
			continue;
		} else {
			text += o.code.trim() + '\r\n';
		}
	}
	//sonderbehandlung varchess
	let chessvars = sortChessVars(dichess);
	//console.log('chessvars[0]',chessvars[0]);
	let chessvarkeys = chessvars.map(x => x.name);
	for (const varkey of chessvarkeys) { let o = superdi.var[varkey]; text += o.code.trim() + '\r\n'; }

	text += '//#endregion\r\n\r\n';
	return text;
}
function remove_all_region_endregion(code) {
	let lines = code.split(`\r\n`);
	let res = '';
	for (const line of lines) {
		let trimmed = line.trim();
		if (trimmed.startsWith('//')) continue;
		res += line + '\r\n';
	}
	return res;
}
function quick_classes(superdi) {
	let text = '//#region classes\r\n';
	let keys = sortClassKeys(superdi);
	for (const k of keys) {
		let code = superdi.cla[k].code;
		if (['colorDict', 'VectorLayer', 'lCard'].some(x => code.includes(x))) continue;
		if (isdef(superdi.func[k])) { continue; }
		//code = remove_all_region_endregion(code);
		text += code.trim() + '\r\n';
	}
	text += '//#endregion\r\n\r\n';
	return text;
}
function quick_funcs(superdi, lstart = '_', lend = 'L') {
	let text = '';
	let byletter = sortFuncsAlpha(superdi);
	let skip = isdef(lstart);
	for (const letter in byletter) {
		if (skip && letter != lstart) continue;
		skip = false;
		text += `//#region ${letter}\r\n`;
		for (const k of byletter[letter]) {
			let code = superdi.func[k].code;
			if (['colorDict', 'VectorLayer', 'lCard'].some(x => code.includes(x))) continue;
			//code = remove_all_region_endregion(code);
			text += code.trim() + '\r\n';
		}
		text += '//#endregion\r\n\r\n';
		if (letter == lend) break;
	}

	return text;
}
function recompute_func_alpha() {

	let dir = 'C:\\xampp\\htdocs\\aroot\\basejs\\cb1\\';
	let superdi = get_current_superdi(dir);
	let text = quick_funcs(superdi, null, 'L');
	let text2 = quick_funcs(superdi, 'M');

	let dirout = 'C:\\xampp\\htdocs\\aroot\\basejs\\cb2\\';
	toFile(text, dirout + 'allfuncs.js');
	toFile(text2, dirout + 'allfuncs_m.js');
}
function recompute_const_var_classes() {

	let dir = 'C:\\xampp\\htdocs\\aroot\\basejs\\cb1\\';
	let superdi = get_current_superdi(dir);
	//let text = quick_vars(superdi);
	let text = quick_consts(superdi);
	text += quick_vars(superdi);
	text += quick_classes(superdi);

	let dirout = 'C:\\xampp\\htdocs\\aroot\\basejs\\cb2\\';
	toFile(text, dirout + 'allglobalshuge.js');
}
function repair_yaml_codebase() {

	let dir = 'C:\\xampp\\htdocs\\aroot\\basejs\\cb0\\';
	let superdi = get_current_superdi(dir);
	let [text, rejected, dinew] = assemble_consts(superdi);
	repair_vars(dinew);

	let dirout = 'C:\\xampp\\htdocs\\aroot\\basejs\\cb1\\';
	//toFile(text, dirout + 'allglobalshuge.js');
	//toFile(rejected, dirout + 'allglobalsrejected.js');

	let [di2, justcode, history] = assemble_dicts(dinew);
	toYamlFile(di2, `${dirout}z_all${LG ? 'LG' : ''}.yaml`);
	toYamlFile(justcode, `${dirout}z_allcode${LG ? 'LG' : ''}.yaml`);
	toYamlFile(history, `${dirout}z_allhistory${LG ? 'LG' : ''}.yaml`);

}
function downloadAsText(s, filename, ext = 'txt') {
	saveFileAtClient(
		filename + "." + ext,
		"data:application/text",
		new Blob([s], { type: "" }));
}
function downloadAsYaml(o, filename) {
	let y = jsyaml.dump(o);
	downloadAsText(y, filename, 'yaml');
}


async function updateCodebase(project) {
	let [superdi, di] = await getCurrentSuperdi(); console.log('superdi', superdi);
	// ich brauch auch die keylist fuer const,var,classes
	//die functions auch?

	//add everything from project bundle!
	let codechanges={};
	let [dibundle, keysbundle] = await getBundleDict(project); console.log('dibundle', dibundle)

	for (const k in dibundle) {
		//add to superdi if code changed!
		let o = dibundle[k];
		let code = codeNormalize(o.code); //.trim();
		let prev = di[k];
		if (isdef(prev)) { //this k exists in superdi
			//assertion(o.type == prev.type, 'type mismatch! ' + k);
			prev.code = codeNormalize(prev.code);
			if (prev.code != code) {
				console.log('code changed for',k)
				codechanges[k]={prev:prev.code,new:code,prevpath:prev.path,newpath:o.path,prevtype:prev.type,newtype:o.type};
				//prev.path = o.path;
				//prev.fname = o.fname;
				//prev.code = o.code;
				//if (prev.type == 'func') prev.sig = getFunctionSignature(stringBefore(code, '\n'), k);
			}
			//prev.history.push(o.path);
		} else {
			o.code = code;
			o.history = [o.path];
			o.name = k;
			o.timestamp = Date.now();
			o.datetime = getCompactDatetime(o.timestamp);
			o.sig = o.type == 'func' ? getFunctionSignature(stringBefore(code, '\n'), k) : o.type == 'cla' ? stringBefore(code, '{') : `${o.type} ${k}`;
			lookupSet(superdi, [o.type, k], o);
		}

	}

	console.log('superdi',superdi);
	console.log('codechanges',codechanges); CODE.changes=codechanges;
	
	//wie werden files updated?
	//ich hab jetzt ein neues superdi und will daraus z_all.yaml, z_allcode.yaml und z_allhistory.yaml machen
	//aufteilen
	let [di2, justcode, history] = assemble_dicts(superdi);
	console.log('di2',di2)

	let text='';
	for(const k of sortCaseInsensitive(get_keys(superdi.func))){
		text+= codeNormalize(superdi.func[k].code) + '\n';
	}

	text=removeEmptyLines(text);

	downloadAsText(text,'allfunc','js')
	downloadAsYaml(di2, `z_all.yaml`);
	downloadAsYaml(justcode, `z_allcode.yaml`);
	downloadAsYaml(history, `z_allhistory.yaml`);


}


async function getBundleDict(project) {
	let [htmlScriptsFile, htmlBodyFile] = [`../${project}/index.html`];
	let html = await route_path_text(htmlScriptsFile);
	html = removeCommentLines(html, '<!--', '-->');
	if (htmlBodyFile) html += await route_path_text(htmlBodyFile);
	let dirhtml = stringBeforeLast(htmlScriptsFile, '/');
	let files = extractFilesFromHtml(html, htmlScriptsFile);
	//console.log('files',files); return;
	// return [{},[]]
	let byKey = {}, ckeys = [], idx = 0, haveBundle = false;
	if (files.length == 1) {
		haveBundle = true;
		console.log('bundle already generated!!!', files[0]);
	}
	for (const f of files) {
		//console.log('parsing',f)
		let idxnew = await parseCodeFile(f, byKey, ckeys, idx);
		idx = idxnew;
		//console.log('idx',idx); //break;	
	}

	return [byKey, ckeys];

}

async function getCurrentSuperdi() {
	await load_Codebase('../base/codebase', '../allcode.js');
	let [diall, dicode, dihistory] = [CODE.di, CODE.justcode, CODE.history];
	let superdi = {}, byKey = {};
	for (const type in diall) {
		for (const k in diall[type]) {
			let o = diall[type][k];
			o.code = dicode[k];
			o.history = dihistory[k];
			lookupSet(superdi, [type, k], o);
			lookupSet(byKey, [k], o);
		}
	}
	return [superdi, byKey]; //superdi is by type!!!!

}


//#endregion

//#region updateCodebase trial 2 failed classic parse
async function start() {
	initCodingUI();
	AU.ta.value = 'hallo, na ENDLICH!!!!!!!!!!'

	//let[superdi,keys]=await populateCODE('../base/codebase');
	let keysglobals=codeParseKeys(await route_path_text('../allglobals.js'));
	console.log('keys',keys);


	// await updateCodebase('coding');


}

async function codeParseFile(path){
	let text=await route_path_text(path);
	let olist = codeParseText(text,path);
}
function codeParseText(text,path){
	let olist=[],region=path;	
	while(!isEmpty(text)){
		let o={};
		let rest=codeParseObject(text,o);
		console.log('o',o);
		o.path=path;
		if (nundef(o.region)) o.region=region; else region = o.region;
		olist.push(o);
		text=rest.trim();
		break;
	}
	console.log('list',olist)
	console.log('rest text',text);
}
function codeParseObject(text,o){
	while(!['var', 'const', 'class', 'function', 'async','//#region'].some(x=>text.startsWith(x))){
		text=stringAfter(text,'\n');
	}
	if (text.startsWith('//#region')){
		o.region=stringAfter(text,' ');
		text=stringAfter(text,'\n');
	}
	if (['var', 'const', 'cla', 'func', 'async'].some(x => text.startsWith(x))) {
		o.key = ithWord(text, text[0] == 'a' ? 2 : 1, true);
		o.type = ithWord(text,text[0] == 'a' ? 1 : 0);
		text=codeParseBlock(text,o)
	}

}
function codeParseBlock(text,o){
	//while(text[0]!=)
}

//#endregion

//#region vor updateCodebase
function addCodeBlock1(path, byKey, ckeys, kw, chunk, fname, region, blocktype, idx) {
	let prev = lookup(byKey, [kw]);
	if (kw == 'addCodeBlock') console.log('kw', kw)
	//let oldfname = prev && prev ? prev.fname : fname;
	let o = { key: kw, code: chunk, path: path, fname: fname, region: region ?? fname, type: blocktype, idx: idx++ };
	let codechange = !prev || prev.code != o.code;
	if (prev) {
		console.log('DUPLICATE', kw, path, prev.path, 'codechange',prev.code == o.code);
		if (prev.type != o.type) {
			console.log('... change from', prev.type, 'to', o.type);
		}
	} else { ckeys.push(kw); }
	if (codechange) lookupSetOverride(byKey, [kw], o); //newer one overrides older one!
	//soll ich history overriden wenn code unveraendert?
}
async function parseCodeFile(f, byKey, ckeys, idx) {
	let chunk = '', kw = null, blocktype = null, region = null;
	let txt = await route_path_text(f);
	let fname = stringAfterLast(f, '/'); fname = stringBefore(fname, '.');
	let lines = txt.split('\n');
	for (const line of lines) {
		let [w, type] = _getLineStart(line);
		if (line.trim() == '`;' && kw) { chunk += line + '\n'; continue; }
		if (type == 'WTF') { continue; }
		else if (type == 'empty') { continue; }
		else if (type == 'in_process') {
			if (line.trim().startsWith('//')) continue; // #region') || line.includes('//#endregion')) continue;
			if (kw) { chunk += line + '\n'; }
		}
		else if (type == 'REGION') { if (w == type) region = stringAfter(line, '//#region ').trim(); }
		else if (type == 'block') {
			if (kw) addCodeBlock(f, byKey, ckeys, kw, chunk, fname, region, blocktype, idx++);
			kw = w == 'async' ? stringAfter(line, 'function ') : stringAfter(line, ' '); kw = firstWord(kw, true);
			let blocktypes = { function: 'func', class: 'cla', async: 'func', var: 'var', const: 'const' };
			blocktype = blocktypes[w];
			chunk = line + '\n';
		} else { console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'); break; }
	}
	if (kw) addCodeBlock(f, byKey, ckeys, kw, chunk, fname, region, blocktype, idx++);
	return idx;
}
//#endregion
