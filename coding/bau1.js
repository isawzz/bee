
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









