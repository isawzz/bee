
async function codeUpdateCodebase(project) {
	
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
	lines = lines.map(x=>removeTrailingComments(x));
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
	while (i<lines.length && !(['var', 'const', 'cla', 'func', 'async'].some(x => l.startsWith(x)) && !l.startsWith('}'))) {
		if (!l.trim().startsWith('//') || isEmptyOrWhiteSpace(l)) code += l + '\n';
		i++; l = lines[i];
	}

	code = replaceAllSpecialChars(code,'\t','  ');
	code = code.trim();

	return [{key:key,type:type,code:code},i];
}
function removeTrailingComments(line){
	let icomm=line.indexOf('//');
	if (icomm<=0 || ':"`\''.includes(line[icomm-1])) return line;
	if ([':','"',"'",'`'].some(x=>line.indexOf(x)<icomm)) return line;

	return line.substring(0,icomm);
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
	mDiv(dtitle, { padding: 10, fg: 'white' }, null, 'OUTPUT:');
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





