

async function start() {
	initCodingUI();
	AU.ta.value = 'hallo, na ENDLICH!!!!!!!!!!'

	//await 	
	let globlist = await codeParseFile('../allglobals.js');
	let globtext = globlist.map(x => x.code).join('\n');
	//downloadAsText(globtext,'allglobals','js');

	let funclist = await codeParseFile('../allfuncs.js');
	let difuncs = list2dict(funclist, 'key');
	// let keys = sortCaseInsensitive(get_keys(difuncs));
	// let functext = '';
	// for (const k of keys) { functext += difuncs[k].code + '\n'; }
	//downloadAsText(functext,'allfuncs','js');

	//bis jetzt hab ich nur allglobals und allfuncs rewritten!
	let project = 'coding';
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





















