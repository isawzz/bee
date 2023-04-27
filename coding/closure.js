const BLUE = '#4363d8';
const BROWN = '#96613d';
const DEF_ORIENTATION = 'v';
const DEF_SPLIT = 0.5;
const FIREBRICK = '#800000';
const GREEN = '#3cb44b';
const BLUEGREEN = '#004054';
const LIGHTBLUE = '#42d4f4';
const LIGHTGREEN = '#afff45'; //'#bfef45';
const names = ['felix', 'amanda', 'sabine', 'tom', 'taka', 'microbe', 'dwight', 'jim', 'michael', 'pam', 'kevin', 'darryl', 'lauren', 'anuj', 'david', 'holly'];
const NATURE = {
	depth: 6,
	branching: [-25, 5, 25],
	lsystems: [
		{
			axiom: 'A',
			rules: [
				{ aus: 'A', wird: 'A+[+A-A]' },
			],
			angle: 25,
			len: 500,
			dlen: .7,
			depth: 6
		},
		{
			axiom: 'F',
			rules: [
				{ aus: 'F', wird: 'F[+F]F[-F]F' },
			],
			angle: 26,
			len: 50,
		},
		{
			axiom: 'F',
			rules: [
				{ aus: 'F', wird: 'F[+F]F[-F][F]' },
			],
			angle: 20,
			len: 200,
		},
		{
			axiom: 'X',
			rules: [
				{ aus: 'X', wird: 'F[+X][-X]FX' },
				{ aus: 'F', wird: 'FF' },
			],
			angle: 26,
			len: 200,
		},
		{
			axiom: 'A',
			rules: [{ aus: 'A', wird: 'AA+[+A-A-A]-[-A+A+A]' }],
			angle: 25,
		},
		{
			axiom: 'A',
			rules: [{ aus: 'F', wird: 'FF' }, { aus: 'A', wird: 'F-[[A]+A]+F[+FA]-A' }],
			angle: 23,
		},
		{
			axiom: 'Y',
			rules: [{ aus: 'X', wird: 'X[-FFF][+FFF]FX' }, { aus: 'Y', wird: 'YFX[+Y][-Y]' }, { aus: 'F', wird: 'X' }],
			angle: 25,
			len: 85,
		},
		{
			axiom: 'F',
			rules: [{ aus: 'F', wird: 'F[+FF][-FF]F[-F][+F]F' }],
			angle: 35,
			len: 70,
		},
		{
			axiom: 'VZFFF',
			rules: [{ aus: 'V', wird: '[+++W][---W]YV' },
			{ aus: 'W', wird: '+X[-W]Z' },
			{ aus: 'Y', wird: 'YZ' },
			{ aus: 'F', wird: 'Y' },
			{ aus: 'Z', wird: '[-FFF][+FFF]F' },
			{ aus: 'X', wird: '-W[+X]Z' }],
			angle: 40,
			len: 100,
		},
		{
			axiom: 'F++F++F',
			rules: [{ aus: 'F', wird: 'F-F++F-F' }],
			angle: 60,
			len: 100,
			depth: 3,
			xstart: 3,
		},
		{
			axiom: 'F+F+F+F',
			rules: [{ aus: 'F', wird: 'FF+F+F+F+FF' }],
			angle: 90,
			len: 100,
			depth: 3,
			xstart: 6,
		},
		{
			axiom: 'F+F+F+F',
			rules: [{ aus: 'F', wird: 'F+F-F-FFF+F+F-F' }],
			angle: 90,
			len: 28,
			depth: 3,
		},
		{
			axiom: 'X',
			rules: [
				{ aus: 'X', wird: '-YF+XFX+FY-' },
				{ aus: 'Y', wird: '+XF-YFY-FX+' },
				{ aus: 'F', wird: 'F' },
			],
			angle: 90,
			len: 150,
			xstart: 1.3,
			depth: 4,
		},
		{
			axiom: 'X',
			rules: [{ aus: 'F', wird: 'FF' },
			{ aus: 'X', wird: 'F[+X]F[-X]+X' }],
			angle: 20,
			len: 200,
		},
	]
};
const OLIVE = '#808000';
const ORANGE = '#f58231';
const NEONORANGE = '#ff6700';
const PURPLE = '#911eb4';
const RED = '#e6194B';
const STYLE_PARAMS = {
	align: 'text-align',
	acontent: 'align-content',
	aitems: 'align-items',
	aspectRatio: 'aspect-ratio',
	bg: 'background-color',
	dir: 'flex-direction',
	fg: 'color',
	hgap: 'column-gap',
	vgap: 'row-gap',
	jcontent: 'justify-content',
	jitems: 'justify-items',
	justify: 'justify-content',
	matop: 'margin-top',
	maleft: 'margin-left',
	mabottom: 'margin-bottom',
	maright: 'margin-right',
	origin: 'transform-origin',
	overx: 'overflow-x',
	overy: 'overflow-y',
	patop: 'padding-top',
	paleft: 'padding-left',
	pabottom: 'padding-bottom',
	paright: 'padding-right',
	place: 'place-items',
	rounding: 'border-radius',
	w: 'width',
	h: 'height',
	wmin: 'min-width',
	hmin: 'min-height',
	hline: 'line-height',
	wmax: 'max-width',
	hmax: 'max-height',
	fontSize: 'font-size',
	fz: 'font-size',
	family: 'font-family',
	weight: 'font-weight',
	x: 'left',
	y: 'top',
	z: 'z-index'
};
const TEAL = '#469990';
const YELLOW = '#ffe119';
const NEONYELLOW = '#efff04';
var _audioSources = {
	incorrect1: '../base/assets/sounds/incorrect1.wav',
	incorrect3: '../base/assets/sounds/incorrect3.mp3',
	goodBye: "../base/assets/sounds/level1.wav",
	down: "../base/assets/sounds/down.mp3",
	levelComplete: "../base/assets/sounds/sound1.wav",
	rubberBand: "../base/assets/sounds/sound2.wav",
	hit: "../base/assets/sounds/hit.wav",
	mozart: "../base/assets/music/mozart_s39_4.mp3",
};
var _idleSound = true;
var _qSound;
var _sndPlayer;
var _TOSound;
var A;
var AREAS = {};
var AU = {};
var C = null;
var ColorDi;
var CV;
var CX;
var DA = {};
var dButtons;
var dCenter;
var dLeft;
var dMain;
var dParent;
var dSidebar;
var dTable;
var F;
var G = null;
var INFO = {};
var lineWidth = 4;
var P;
var PROTO;
var ROOT = null;
var SPEC = null;
var T;
var TO = {};
var UIDCounter = 0;
var UIROOT;
var V = {};
var Z;
function _deqSound() {
	let key = _qSound.shift();
	let url = _audioSources[key];
	_sndPlayer = new Audio(url);
	_sndPlayer.onended = _whenSoundPaused;
	_sndPlayer.onloadeddata = () => { _loaded = true; _sndPlayer.play(); };
	_sndPlayer.load();
}
function _enqSound(key) { if (nundef(_qSound)) _qSound = []; _qSound.push(key); }
function _minimizeCode(di, symlist = ['start'], nogo = []) {
	let done = {};
	let tbd = symlist;
	let MAX = 1000000, i = 0;
	let visited = {
		autocomplete: true, Card: true, change: true, config: true, grid: true, hallo: true,
		jQuery: true, init: true,
		Number: true, sat: true, step: true, PI: true
	};
	while (!isEmpty(tbd)) {
		if (++i > MAX) break;
		let sym = tbd[0];
		if (isdef(visited[sym])) { tbd.shift(); continue; }
		visited[sym] = true;
		let o = di[sym];
		if (nundef(o)) { tbd.shift(); continue; }
		let text = o.code;
		let words = toWords(text, true);
		for (const w of words) {
			if (nogo.some(x => w.startsWith(x))) continue;

			//remove words within quotes that are functions
			let [istart,iend]=[code.indexOf]

			if (nundef(done[w]) && nundef(visited[w]) && w != sym && isdef(di[w])) addIf(tbd, w);
		}
		assertion(sym == tbd[0], 'W T F')
		tbd.shift();
		done[sym] = o;
	}
	return done;
}
function _mPlayPause(dParent, styles = {}, handler = null) {
	if (!handler) handler = audio_onclick_pp;
	let html = `
    <section id="dButtons">
      <a id="bPlay" href="#" }">
        <i class="fa fa-play fa-2x"></i>
      </a>
      <a id="bPause" href="#" style="display: none">
        <i class="fa fa-pause fa-2x"></i>
      </a>
    </section>
  `;
	let pp = mCreateFrom(html);
	mAppend(dParent, pp);
	mStyle(pp, styles);
	mBy('bPlay').onclick = () => { hide0('bPlay'); show0('bPause'); handler(); }
	mBy('bPause').onclick = () => { hide0('bPause'); show0('bPlay'); handler(); }
	return { button: pp, show_play: () => { hide0('bPause'); show0('bPlay'); }, show_pause: () => { hide0('bPlay'); show0('bPause'); } };
}
function _whenSoundPaused() {
	_sndPlayer = null;
	_sndPlayerIdle = true;
	_loaded = false;
	if (!isEmpty(_qSound)) { _deqSound(); } else { _idleSound = true; }
}
function addAREA(id, o) {
	if (AREAS[id]) {
		error('AREAS ' + id + ' exists already!!! ');
		error(o);
		return;
	}
	AREAS[id] = o;
}
function addIf(arr, el) { if (!arr.includes(el)) arr.push(el); }
function addKeys(ofrom, oto) { for (const k in ofrom) if (nundef(oto[k])) oto[k] = ofrom[k]; return oto; }
function allNumbers(s) {
	let m = s.match(/\-.\d+|\-\d+|\.\d+|\d+\.\d+|\d+\b|\d+(?=\w)/g);
	if (m) return m.map(v => +v); else return null;
}
function alphaToHex(zero1) {
	zero1 = Math.round(zero1 * 100) / 100;
	var alpha = Math.round(zero1 * 255);
	var hex = (alpha + 0x10000)
		.toString(16)
		.slice(-2)
		.toUpperCase();
	var perc = Math.round(zero1 * 100);
	return hex;
}
function arrLast(arr) { return arr.length > 0 ? arr[arr.length - 1] : null; }
function arrMinus(a, b) { if (isList(b)) return a.filter(x => !b.includes(x)); else return a.filter(x => x != b); }
function arrRange(from = 1, to = 10, step = 1) { let res = []; for (let i = from; i <= to; i += step)res.push(i); return res; }
function arrRemovip(arr, el) {
	let i = arr.indexOf(el);
	if (i > -1) arr.splice(i, 1);
	return i;
}
function arrShufflip(arr) { if (isEmpty(arr)) return []; else return fisherYates(arr); }
function assertion(cond) {
	if (!cond) {
		let args = [...arguments];
		for (const a of args) {
			console.log('\n', a);
		}
		throw new Error('TERMINATING!!!')
	}
}
function audio_onclick_pp() {
	audio_toggle('mozart');
	if (audio_playing()) { hide0('bPlay'); show0('bPause'); } else { hide0('bPause'); show0('bPlay'); }
}
function audio_pause() {
	_qSound = [];
	if (_loaded && isdef(_sndPlayer)) {
		clearTimeout(_TOSound);
		_sndPlayer.onended = null;
		_sndPlayer.onpause = _whenSoundPaused;
		_sndPlayer.pause();
	}
}
function audio_play(key, wait = true) {
	if (!wait) _qSound = [];
	_enqSound(key);
	if (_idleSound) { _idleSound = false; _deqSound(); }
}
function audio_playing() { return DA.isSound; }
function audio_toggle(key) {
	if (DA.isSound == true) { audio_pause(); DA.isSound = false; return; }
	audio_play(key);
	DA.isSound = true;
}
function branch_draw(o) {
	cStyle({ fg: o.color, thickness: o.thickness, cap: 'round' }, CX);
	if (C.root.jitter) cLine(o.p1.x, o.p1.y, o.p2.x + Math.random() * 2 - 1, o.p2.y + Math.random() * 2 - 1, {}, CX);
	else cLine(o.p1.x, o.p1.y, o.p2.x, o.p2.y, {}, CX);
}
function calc_maxdepth(maxnodes, rules) {
	let laus = rules.map(x => x.aus).join();
	let lwird = rules.map(x => x.wird).join();
	let naus = countAll(laus, 'ABF');
	let nwird = countAll(lwird, 'ABF');
	let ratio = nwird / naus;
	let pow = 2;
	while (Math.pow(ratio, pow) < maxnodes) pow++;
	return pow - 1;
}
function capitalize(s) {
	if (typeof s !== 'string') return '';
	return s.charAt(0).toUpperCase() + s.slice(1);
}
function cEllipse(x, y, w, h, styles = null, angle = 0, ctx = null) {
	if (nundef(ctx)) { ctx = CX; if (!ctx) return; }
	if (styles) cStyle(styles, ctx);
	ctx.beginPath();
	ctx.ellipse(x, y, w / 2, h / 2, -angle, 0, 2 * Math.PI);
	if (isdef(styles.bg) || nundef(styles.fg)) ctx.fill();
	if (isdef(styles.fg)) ctx.stroke();
}
function clear_timeouts() {
	for (const k in TO) clearTimeout(TO[k]);
	stop_simple_timer();
}
function clearElement(elem) {
	if (isString(elem)) elem = document.getElementById(elem);
	if (window.jQuery == undefined) { elem.innerHTML = ''; return elem; }
	while (elem.firstChild) {
		$(elem.firstChild).remove();
	}
	return elem;
}
function cLine(x1, y1, x2, y2, styles = null, ctx = null) {
	if (nundef(ctx)) { ctx = CX; if (!ctx) return; }
	if (styles) cStyle(styles, ctx);
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2)
	ctx.stroke();
}
async function closureFromProject(project) {
	let globlist = await codeParseFile('../allglobals.js');
	let funclist = await codeParseFile('../allfuncs.js');
	let list = globlist.concat(funclist);
	let bykey = list2dict(list, 'key');
	let bytype = {};
	for (const k in bykey) { let o = bykey[k]; lookupAddIfToList(bytype, [o.type], o); }
	let htmlFile = `../${project}/index.html`;
	let html = await route_path_text(htmlFile);
	html = removeCommentLines(html, '<!--', '-->');
	let dirhtml = `../${project}`;
	let files = extractFilesFromHtml(html, htmlFile);
	files = files.filter(x => !x.includes('../all'));
	let olist = [];
	for (const path of files) {
		let opath = await codeParseFile(path);
		olist = olist.concat(opath);
	}
	let mytype = {}, mykey = {};
	for (const o of olist) { mykey[o.key] = o; }
	for (const k in mykey) { let o = mykey[k]; lookupAddIfToList(mytype, [o.type], o); }
	let dupltext = '';
	for (const k in mykey) {
		let onew = mykey[k];
		let oold = bykey[k];
		if (isdef(oold) && onew.code == oold.code) {
		} else if (isdef(oold)) {
			console.log('override w/ DIFFERENT code', k);//override code with new code but keep old code!
			oold.oldcode = oold.code;
			oold.code = onew.code;
			dupltext += oold.oldcode + '\n' + oold.code + '\n';
		} else {
			bykey[k] = onew;
			lookupAddIfToList(bytype, [onew.type], onew);
			list.push(onew);
		}
	}
	let knownNogos = { codingfull: ['uiGetContact'], coding: ['uiGetContact', 'grid'] };
	let seed = ['start'].concat(extractOnclickFromHtml(html)); console.log('seed', seed);
	if (project == 'nature') seed = seed.concat(['branch_draw', 'leaf_draw', 'lsys_init', 'tree_init', 'lsys_add', 'tree_add', 'lsys_draw', 'tree_draw']);
	let byKeyMinimized = _minimizeCode(bykey, seed, valf(knownNogos[project], []));
	for (const k in byKeyMinimized) {
		let code = byKeyMinimized[k].code;
		let lines = code.split('\n');
		let newcode = '';
		for (const l of lines) {
			newcode += removeTrailingComments(l) + '\n';
		}
		byKeyMinimized[k].code = newcode.trim();
	}
	let cvckeys = list.filter(x => isdef(byKeyMinimized[x.key]) && x.type != 'function').map(x => x.key); //in order of appearance!
	let funckeys = list.filter(x => isdef(byKeyMinimized[x.key]) && x.type == 'function').map(x => x.key); //in order of appearance!
	funckeys = sortCaseInsensitive(funckeys);
	let closuretext = '';
	for (const k of cvckeys) { closuretext += byKeyMinimized[k].code + '\n'; }
	for (const k of funckeys) { closuretext += byKeyMinimized[k].code + '\n'; }
	cssfiles = extractFilesFromHtml(html, htmlFile, 'css');
	cssfiles.unshift('../allcss.css');
	let tcss = '';
	for (const path of cssfiles) { tcss += await route_path_text(path) + '\r\n'; }
	let t = replaceAllSpecialChars(tcss, '\t', '  ');
	let lines = t.split('\r\n');
	if (lines.length <= 2) lines = t.split('\n');
	let allkeys = [], newlines = [];
	let di = {};
	let testresult = '';
	for (const line of lines) {
		let type = cssKeywordType(line);
		if (type) {
			testresult += line[0] + '=';//addIf(testresult,line[0]); 
			let newline = isLetter(line[0]) || line[0] == '*' ? line : line[0] == '@' ? stringAfter(line, ' ') : line.substring(1);
			let key = line.includes('{') ? stringBefore(newline, '{') : stringBefore(newline, ','); //firstWordIncluding(newline, '_-: >').trim();
			key = key.trim();
			if (isdef(di[key]) && type != di[key].type) {
				console.log('duplicate key', key, type, di[key].type);
			}
			di[key] = { type: type, key: key }
			newline = key + stringAfter(newline, key);
			if (key == '*') console.log('***', stringAfter(newline, key));
			addIf(allkeys, key);
			newlines.push(newline)
			di[key] = { type: type, key: key }
		} else {
			newlines.push(line);
		}
	}
	let neededkeys = [], code = closuretext;
	for (const k of allkeys) {
		if (['rubberBand'].includes(k)) continue;
		let ktest = k.includes(' ') ? stringBefore(k, ' ') : k.includes(':') ? stringBefore(k, ':') : k;
		if (['root'].some(x => x == k)) addIf(neededkeys, k);
		else if (code.includes(`${ktest}`) || code.includes(`'${ktest}'`) || code.includes(`"${ktest}"`)) addIf(neededkeys, k);
		else if (html.includes(`${ktest}`)) addIf(neededkeys, k);
	}
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
	let csstext = '';
	let types = ['root', 'tag', 'class', 'id', 'keyframes'];
	let ditypes = { root: 58, tag: 't', class: 46, id: 35, keyframes: 64 }; // : tags . # @
	if (types.includes('root')) types = ['root'].concat(arrMinus(types, ['root']));
	types = types.map(x => ditypes[x]);
	for (const type of types) {
		if (nundef(dis[type])) continue;
		let ksorted = sortCaseInsensitive(get_keys(dis[type]));
		let prefix = type == 't' ? '' : String.fromCharCode(type);
		if (prefix == '@') prefix += 'keyframes ';
		for (const kw of ksorted) {
			let startfix = prefix + kw;
			for (const clause of dis[type][kw].clauses) {
				csstext += startfix + clause;
			}
		}
	}
	return [closuretext, csstext];
}
function codeParseBlock(lines, i) {
	let l = lines[i];
	let type = l[0] == 'a' ? ithWord(l, 1) : ithWord(l, 0);
	let key = l[0] == 'a' ? ithWord(l, 2, true) : ithWord(l, 1, true);
	let code = l + '\n'; i++; l = lines[i];
	while (i < lines.length && !(['var', 'const', 'cla', 'func', 'async'].some(x => l.startsWith(x)) && !l.startsWith('}'))) {
		if (!(l.trim().startsWith('//') || isEmptyOrWhiteSpace(l))) code += l + '\n';
		i++; l = lines[i];
	}
	code = replaceAllSpecialChars(code, '\t', '  ');
	code = code.trim();
	return [{ key: key, type: type, code: code }, i];
}
function codeParseBlocks(text) {
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
async function codeParseFile(path) {
	let text = await route_path_text(path);
	let olist = codeParseBlocks(text);
	return olist;
}
function coin(percent = 50) { return Math.random() * 100 < percent; }
function colorChannelMixer(colorChannelA, colorChannelB, amountToMix) {
	var channelA = colorChannelA * amountToMix;
	var channelB = colorChannelB * (1 - amountToMix);
	return parseInt(channelA + channelB);
}
function colorFrom(cAny, a, allowHsl = false) {
	if (isString(cAny)) {
		if (cAny[0] == '#') {
			if (a == undefined) return cAny;
			cAny = cAny.substring(0, 7);
			return cAny + (a == 1 ? '' : alphaToHex(a));
		} else if (isdef(ColorDi) && lookup(ColorDi, [cAny])) {
			let c = ColorDi[cAny].c;
			if (a == undefined) return c;
			c = c.substring(0, 7);
			return c + (a == 1 ? '' : alphaToHex(a));
		} else if (startsWith(cAny, 'rand')) {
			let spec = capitalize(cAny.substring(4));
			if (isdef(window['color' + spec])) {
				c = window['color' + spec]();
			} else c = rColor();
			if (a == undefined) return c;
			return c + (a == 1 ? '' : alphaToHex(a));
		} else if (startsWith(cAny, 'linear')) {
			return cAny;
		} else if (cAny[0] == 'r' && cAny[1] == 'g') {
			if (a == undefined) return cAny;
			if (cAny[3] == 'a') {
				if (a < 1) {
					return stringBeforeLast(cAny, ',') + ',' + a + ')';
				} else {
					let parts = cAny.split(',');
					let r = firstNumber(parts[0]);
					return 'rgb(' + r + ',' + parts[1] + ',' + parts[2] + ')';
				}
			} else {
				if (a < 1) {
					return 'rgba' + cAny.substring(3, cAny.length - 1) + ',' + a + ')';
				} else {
					return cAny;
				}
			}
		} else if (cAny[0] == 'h' && cAny[1] == 's') {
			if (allowHsl) {
				if (a == undefined) return cAny;
				if (cAny[3] == 'a') {
					if (a < 1) {
						return stringBeforeLast(cAny, ',') + ',' + a + ')';
					} else {
						let parts = cAny.split(',');
						let r = firstNumber(parts[0]);
						return 'hsl(' + r + ',' + parts[1] + ',' + parts[2] + ')';
					}
				} else {
					return a == 1 ? cAny : 'hsla' + cAny.substring(3, cAny.length - 1) + ',' + a + ')';
				}
			} else {
				if (cAny[3] == 'a') {
					cAny = HSLAToRGBA(cAny);
				} else {
					cAny = HSLToRGB(cAny);
				}
				return colorFrom(cAny, a, false);
			}
		} else {
			ensureColorDict();
			let c = ColorDi[cAny];
			if (nundef(c)) {
				if (startsWith(cAny, 'rand')) {
					let spec = cAny.substring(4);
					if (isdef(window['color' + spec])) {
						c = window['color' + spec](res);
					} else c = rColor();
				} else {
					console.log('color not available:', cAny);
					throw new Error('color not found: ' + cAny)
					return '#00000000';
				}
			} else c = c.c;
			if (a == undefined) return c;
			c = c.substring(0, 7);
			return c + (a == 1 ? '' : alphaToHex(a));
		}
	} else if (Array.isArray(cAny)) {
		if (cAny.length == 3 && isNumber(cAny[0])) {
			let r = cAny[0];
			let g = cAny[1];
			let b = cAny[2];
			return a == undefined || a == 1 ? `rgb(${r},${g},${b})` : `rgba(${r},${g},${b},${a})`;
		} else {
			return rChoose(cAny);
		}
	} else if (typeof cAny == 'object') {
		if ('h' in cAny) {
			let hslString = '';
			if (a == undefined || a == 1) {
				hslString = `hsl(${cAny.h},${Math.round(cAny.s <= 1.0 ? cAny.s * 100 : cAny.s)}%,${Math.round(cAny.l <= 1.0 ? cAny.l * 100 : cAny.l)}%)`;
			} else {
				hslString = `hsla(${cAny.h},${Math.round(cAny.s <= 1.0 ? cAny.s * 100 : cAny.s)}%,${Math.round(cAny.l <= 1.0 ? cAny.l * 100 : cAny.l)}%,${a})`;
			}
			if (allowHsl) {
				return hslString;
			} else {
				return colorFrom(hslString, a, allowHsl);
			}
		} else if ('r' in cAny) {
			if (a !== undefined && a < 1) {
				return `rgba(${cAny.r},${cAny.g},${cAny.b},${a})`;
			} else {
				return `rgb(${cAny.r},${cAny.g},${cAny.b})`;
			}
		}
	}
}
function colorFromHSL(hue, sat = 100, lum = 50) {
	return hslToHex(valf(hue, rHue()), sat, lum);
}
function colorHex(cAny) {
	let c = colorFrom(cAny);
	if (c[0] == '#') {
		return c;
	} else {
		let res = pSBC(0, c, 'c');
		return res;
	}
}
function colorIdealText(bg, grayPreferred = false) {
	let rgb = colorRGB(bg, true);
	const nThreshold = 105;
	let r = rgb.r;
	let g = rgb.g;
	let b = rgb.b;
	var bgDelta = r * 0.299 + g * 0.587 + b * 0.114;
	var foreColor = 255 - bgDelta < nThreshold ? 'black' : 'white';
	if (grayPreferred) foreColor = 255 - bgDelta < nThreshold ? 'dimgray' : 'snow';
	return foreColor;
}
function colorMix(c1, c2, percent = 50) {
	return pSBC(percent / 100, colorHex(c1), colorHex(c2), true);
	let o1 = colorRGB(c1, true); let rgbA = [o1.r, o1.g, o1.b];
	let o2 = colorRGB(c2, true); let rgbB = [o2.r, o2.g, o2.b];
	amountToMix = percent / 100;
	var r = colorChannelMixer(rgbA[0], rgbB[0], amountToMix);
	var g = colorChannelMixer(rgbA[1], rgbB[1], amountToMix);
	var b = colorChannelMixer(rgbA[2], rgbB[2], amountToMix);
	return "rgb(" + r + "," + g + "," + b + ")";
}
function colorRGB(cAny, asObject = false) {
	let res = colorFrom(cAny);
	let srgb = res;
	if (res[0] == '#') {
		srgb = pSBC(0, res, 'c');
	}
	let n = allNumbers(srgb);
	if (asObject) {
		return { r: n[0], g: n[1], b: n[2], a: n.length > 3 ? n[3] : 1 };
	} else {
		return srgb;
	}
}
function colorsFromBFA(bg, fg, alpha) {
	if (fg == 'contrast') {
		if (bg != 'inherit') bg = colorFrom(bg, alpha);
		fg = colorIdealText(bg);
	} else if (bg == 'contrast') {
		fg = colorFrom(fg);
		bg = colorIdealText(fg);
	} else {
		if (isdef(bg) && bg != 'inherit') bg = colorFrom(bg, alpha);
		if (isdef(fg) && fg != 'inherit') fg = colorFrom(fg);
	}
	return [bg, fg];
}
function colorTrans(cAny, alpha = 0.5) {
	return colorFrom(cAny, alpha);
}
function correctFuncName(specType) {
	switch (specType) {
		case 'list': specType = 'liste'; break;
		case 'dict': specType = 'dicti'; break;
		case undefined: specType = 'panel'; break;
	}
	return specType;
}
function countAll(s, scount) {
	let letters = toLetters(scount);
	function counter(total, ch) { if (letters.includes(ch)) return total + 1; else return total; }
	let res = [...s].reduce(counter, 0);
	return res;
}
function create_branch(b, angle, len, color) {
	let root = C.root;
	let x = b.p2.x + Math.cos(angle) * len;
	let y = b.p2.y - Math.sin(angle) * len;
	let age = b.age + 1;
	let o = {
		done: false,
		p1: b.p2,
		p2: { x: x, y: y },
		x: x,
		y: y,
		t: 'branch',
		age: age,
		angle: angle,
		len: len,
		thickness: b.thickness * root.dthickness,
		color: color,
	};
	b.done = true;
	return o;
}
function create_leaf(b, root) {
	let o = {
		done: true,
		p: b.p2,
		x: b.p2.x,
		y: b.p2.y,
		t: 'leaf',
		age: b.age + 1,
		len: b.len * root.dlen,
		angle: b.angle,
		thickness: 20,
		color: 'lawngreen',
	};
	b.done = true;
	return o;
}
function createcircle(posx, posy, radius, stroke, fill, filter) {
	var circle = document.createElementNS(svgns, "circle");
	circle.setAttributeNS(null, "id", "c" + circles);
	circle.setAttributeNS(null, "cx", posx);
	circle.setAttributeNS(null, "cy", posy);
	circle.setAttributeNS(null, "r", radius);
	circle.setAttributeNS(null, "stroke-width", stroke);
	circle.setAttributeNS(null, "fill", fill);
	circle.setAttributeNS(null, "filter", filter);
	circle.setAttributeNS(null, "data-posx", posx);
	svg.appendChild(circle);
}
function cssCleanupClause(t, kw) {
	let lines = t.split('\n');
	let comment = false;
	let state = 'copy';
	let res = '';
	for (const line of lines) {
		let lt = line.trim();
		let [cstart, cend, mstart] = [lt.startsWith('/*'), lt.endsWith('*/'), line.includes('/*')];
		if (state == 'skip') {
			if (cend) state = 'copy';
			continue;
		} else if (state == 'copy') {
			if (cstart && cend) { continue; }
			else if (cstart) { state = 'skip'; continue; }
			else if (mstart) {
				res += stringBefore(line, '/*') + '\n';
				if (!cend) state = 'skip';
			} else {
				res += line + '\n';
			}
		}
	}
	if (kw == 'bAdd') console.log(res);
	return res;
}
function cssKeywordType(line) {
	if (isLetter(line[0]) || line[0] == '*' && line[1] != '/') return 't';
	else if (toLetters(':.#').some(x => line[0] == x)) return (line.charCodeAt(0)); //[0].charkey());
	else if (line.startsWith('@keyframes')) return (line.charCodeAt(0));
	else return null;
}
function cStyle(styles, ctx) {
	if (nundef(ctx)) { ctx = CX; if (nundef(ctx)) { console.log('ctx undefined!!!!!!!'); return; } }
	const di = { bg: 'fillStyle', fill: 'fillStyle', stroke: 'strokeStyle', fg: 'strokeStyle', thickness: 'lineWidth', thick: 'lineWidth', cap: 'lineCap', ending: 'lineCap' };
	if (isdef(styles)) {
		for (const k in styles) { ctx[isdef(di[k]) ? di[k] : k] = styles[k]; }
	}
}
function dicti(areaName, oSpec, oid, o) {
	let [num, or, split, bg, fg, id, panels, parent] = getParams(areaName, oSpec, oid);
	parent.style.display = 'inline-grid';
	return parent;
}
function dynamicArea(areaName, oSpec, oid, o) {
	func = correctFuncName(oSpec.type);
	oSpec.ui = window[func](areaName, oSpec, oid, o);
}
function endsWith(s, sSub) { let i = s.indexOf(sSub); return i >= 0 && i == s.length - sSub.length; }
function ensureColorDict() {
	if (isdef(ColorDi)) return;
	ColorDi = {};
	let names = getColorNames();
	let hexes = getColorHexes();
	for (let i = 0; i < names.length; i++) {
		ColorDi[names[i].toLowerCase()] = { c: '#' + hexes[i] };
	}
	const newcolors = {
		black: { c: '#000000', D: 'schwarz' },
		blue: { c: '#0000ff', D: 'blau' },
		BLUE: { c: '#4363d8', E: 'blue', D: 'blau' },
		BLUEGREEN: { c: '#004054', E: 'bluegreen', D: 'blaugrün' },
		BROWN: { c: '#96613d', E: 'brown', D: 'braun' },
		deepyellow: { c: '#ffed01', E: 'yellow', D: 'gelb' },
		FIREBRICK: { c: '#800000', E: 'darkred', D: 'rotbraun' },
		gold: { c: 'gold', D: 'golden' },
		green: { c: 'green', D: 'grün' },
		GREEN: { c: '#3cb44b', E: 'green', D: 'grün' },
		grey: { c: 'grey', D: 'grau' },
		lightblue: { c: 'lightblue', D: 'hellblau' },
		LIGHTBLUE: { c: '#42d4f4', E: 'lightblue', D: 'hellblau' },
		lightgreen: { c: 'lightgreen', D: 'hellgrün' },
		LIGHTGREEN: { c: '#afff45', E: 'lightgreen', D: 'hellgrün' },
		lightyellow: { c: '#fff620', E: 'lightyellow', D: 'gelb' },
		NEONORANGE: { c: '#ff6700', E: 'neonorange', D: 'neonorange' },
		NEONYELLOW: { c: '#efff04', E: 'neonyellow', D: 'neongelb' },
		olive: { c: 'olive', D: 'oliv' },
		OLIVE: { c: '#808000', E: 'olive', D: 'oliv' },
		orange: { c: 'orange', D: 'orange' },
		ORANGE: { c: '#f58231', E: 'orange', D: 'orange' },
		PINK: { c: 'deeppink', D: 'rosa' },
		pink: { c: 'pink', D: 'rosa' },
		purple: { c: 'purple', D: 'lila' },
		PURPLE: { c: '#911eb4', E: 'purple', D: 'lila' },
		red: { c: 'red', D: 'rot' },
		RED: { c: '#e6194B', E: 'red', D: 'rot' },
		skyblue: { c: 'skyblue', D: 'himmelblau' },
		SKYBLUE: { c: 'deepskyblue', D: 'himmelblau' },
		teal: { c: '#469990', D: 'blaugrün' },
		TEAL: { c: '#469990', E: 'teal', D: 'blaugrün' },
		transparent: { c: '#00000000', E: 'transparent', D: 'transparent' },
		violet: { c: 'violet', E: 'violet', D: 'violett' },
		VIOLET: { c: 'indigo', E: 'violet', D: 'violett' },
		white: { c: 'white', D: 'weiss' },
		yellow: { c: 'yellow', D: 'gelb' },
		yelloworange: { c: '#ffc300', E: 'yellow', D: 'gelb' },
		YELLOW: { c: '#ffe119', E: 'yellow', D: 'gelb' },
	};
	for (const k in newcolors) {
		let cnew = newcolors[k];
		if (cnew.c[0] != '#' && isdef(ColorDi[cnew.c])) cnew.c = ColorDi[cnew.c].c;
		ColorDi[k] = cnew;
	}
}
function error(msg) {
	let fname = getFunctionsNameThatCalledThisFunction();
	console.log(fname, 'ERROR!!!!! ', msg);
}
function extractFilesFromHtml(html, htmlfile, ext = 'js') {
	let prefix = ext == 'js' ? 'script src="' : 'link rel="stylesheet" href="';
	let dirhtml = stringBeforeLast(htmlfile, '/');
	let project = stringAfter(dirhtml, '/'); if (project.includes('/')) project = stringBefore(project, '/');
	let parts = html.split(prefix);
	parts.shift();
	let files = parts.map(x => stringBefore(x, '"'));
	files = files.filter(x => !x.includes('alibs/') && !x.includes('assets/')); //console.log('files', jsCopy(files))
	let files2 = [];
	for (const f of files) {
		if (f.startsWith(dirhtml)) { files2.push(f); continue; }
		if (f.startsWith('./')) { files2.push(dirhtml + f.substring(1)); continue; }
		if (f.startsWith('../') && stringCount(dirhtml, '../') == 1) {
			files2.push(f); continue;
		}
		if (!f.includes('/')) { files2.push(dirhtml + '/' + f); continue; }
		if (isLetter(f[0])) { files2.push(dirhtml + '/' + f); continue; }
		console.log('PROBLEM!', f)
	}
	files = files2;
	return files;
}
function extractOnclickFromHtml(html) {
	let symlist = [];
	let onclicks = html.split('onclick="'); //.shift();
	onclicks.shift();
	for (const oncl of onclicks) {
		let code = stringBefore(oncl, '(');
		symlist.push(code);
	}
	return symlist;
}
function fireClick(elem) {
	const evt = new Event("click", { "bubbles": true, "cancelable": false });
	elem.dispatchEvent(evt);
}
function firstNumber(s) {
	if (s) {
		let m = s.match(/-?\d+/);
		if (m) {
			let sh = m.shift();
			if (sh) { return Number(sh); }
		}
	}
	return null;
}
function firstWordIncluding(s, allowed = '_-') {
	let res = '', i = 0;
	while (!isLetter(s[i]) && !isDigit(s[i]) && !allowed.includes(s[i])) i++;
	while (isLetter(s[i]) || isDigit(s[i]) || allowed.includes(s[i])) { res += s[i]; i++; }
	return res;
}
function fisherYates(arr) {
	if (arr.length == 2 && coin()) { return arr; }
	var rnd, temp;
	let last = arr[0];
	for (var i = arr.length - 1; i; i--) {
		rnd = Math.random() * i | 0;
		temp = arr[i];
		arr[i] = arr[rnd];
		arr[rnd] = temp;
	}
	return arr;
}
function G_clear() { gameloop_stop(); clear_timeouts(); mClear('dTable'); C = G = CV = CX = null; }
function G_init(name) {
	if (CV) G_clear();
	[dLeft, dCenter] = mColFlex(dTable, [0, 5]);
	let res = mCanvas(dCenter, { w: 500, h: 500, bg: '#222', rounding: 10 });
	[CV, CX] = [res.cv, res.cx];
	let bpp = _mPlayPause(dCenter, { fz: 28, fg: 'lightgreen', display: 'flex', ajcenter: true }, onclick_playpause);
	G = { running: false, bPP: bpp };
	C = { changed: true, name: name, items: {}, root: get_func(name, 'init')() };
}
function gameloop_stop() { clear_timeouts(); if (G) G.running = false; }
function generate() {
	numgen++; if (numgen > system.max) {
		clearInterval(interval_id);
		console.log('done!');
		return;
	}
	len *= factor;
	let nextSentence = '';
	for (let i = 0; i < sentence.length; i++) {
		let current = sentence.charAt(i);
		let done = false;
		for (const rule of rules) {
			if (current == rule.aus) {
				nextSentence += rule.mach;
				done = true;
				break;
			}
		}
		if (!done) nextSentence += current;
	}
	sentence = nextSentence;
	createP(sentence);
	turtle();
}
function get_func(itemtype, cmd) { return window[`${itemtype}_${cmd}`]; }
function get_keys(o) { return Object.keys(o); }
function get_values(o) { return Object.values(o); }
function getColorHexes(x) {
	return [
		'f0f8ff',
		'faebd7',
		'00ffff',
		'7fffd4',
		'f0ffff',
		'f5f5dc',
		'ffe4c4',
		'000000',
		'ffebcd',
		'0000ff',
		'8a2be2',
		'a52a2a',
		'deb887',
		'5f9ea0',
		'7fff00',
		'd2691e',
		'ff7f50',
		'6495ed',
		'fff8dc',
		'dc143c',
		'00ffff',
		'00008b',
		'008b8b',
		'b8860b',
		'a9a9a9',
		'a9a9a9',
		'006400',
		'bdb76b',
		'8b008b',
		'556b2f',
		'ff8c00',
		'9932cc',
		'8b0000',
		'e9967a',
		'8fbc8f',
		'483d8b',
		'2f4f4f',
		'2f4f4f',
		'00ced1',
		'9400d3',
		'ff1493',
		'00bfff',
		'696969',
		'696969',
		'1e90ff',
		'b22222',
		'fffaf0',
		'228b22',
		'ff00ff',
		'dcdcdc',
		'f8f8ff',
		'ffd700',
		'daa520',
		'808080',
		'808080',
		'008000',
		'adff2f',
		'f0fff0',
		'ff69b4',
		'cd5c5c',
		'4b0082',
		'fffff0',
		'f0e68c',
		'e6e6fa',
		'fff0f5',
		'7cfc00',
		'fffacd',
		'add8e6',
		'f08080',
		'e0ffff',
		'fafad2',
		'd3d3d3',
		'd3d3d3',
		'90ee90',
		'ffb6c1',
		'ffa07a',
		'20b2aa',
		'87cefa',
		'778899',
		'778899',
		'b0c4de',
		'ffffe0',
		'00ff00',
		'32cd32',
		'faf0e6',
		'ff00ff',
		'800000',
		'66cdaa',
		'0000cd',
		'ba55d3',
		'9370db',
		'3cb371',
		'7b68ee',
		'00fa9a',
		'48d1cc',
		'c71585',
		'191970',
		'f5fffa',
		'ffe4e1',
		'ffe4b5',
		'ffdead',
		'000080',
		'fdf5e6',
		'808000',
		'6b8e23',
		'ffa500',
		'ff4500',
		'da70d6',
		'eee8aa',
		'98fb98',
		'afeeee',
		'db7093',
		'ffefd5',
		'ffdab9',
		'cd853f',
		'ffc0cb',
		'dda0dd',
		'b0e0e6',
		'800080',
		'663399',
		'ff0000',
		'bc8f8f',
		'4169e1',
		'8b4513',
		'fa8072',
		'f4a460',
		'2e8b57',
		'fff5ee',
		'a0522d',
		'c0c0c0',
		'87ceeb',
		'6a5acd',
		'708090',
		'708090',
		'fffafa',
		'00ff7f',
		'4682b4',
		'd2b48c',
		'008080',
		'd8bfd8',
		'ff6347',
		'40e0d0',
		'ee82ee',
		'f5deb3',
		'ffffff',
		'f5f5f5',
		'ffff00',
		'9acd32'
	];
}
function getColorNames() {
	return [
		'AliceBlue',
		'AntiqueWhite',
		'Aqua',
		'Aquamarine',
		'Azure',
		'Beige',
		'Bisque',
		'Black',
		'BlanchedAlmond',
		'Blue',
		'BlueViolet',
		'Brown',
		'BurlyWood',
		'CadetBlue',
		'Chartreuse',
		'Chocolate',
		'Coral',
		'CornflowerBlue',
		'Cornsilk',
		'Crimson',
		'Cyan',
		'DarkBlue',
		'DarkCyan',
		'DarkGoldenRod',
		'DarkGray',
		'DarkGrey',
		'DarkGreen',
		'DarkKhaki',
		'DarkMagenta',
		'DarkOliveGreen',
		'DarkOrange',
		'DarkOrchid',
		'DarkRed',
		'DarkSalmon',
		'DarkSeaGreen',
		'DarkSlateBlue',
		'DarkSlateGray',
		'DarkSlateGrey',
		'DarkTurquoise',
		'DarkViolet',
		'DeepPink',
		'DeepSkyBlue',
		'DimGray',
		'DimGrey',
		'DodgerBlue',
		'FireBrick',
		'FloralWhite',
		'ForestGreen',
		'Fuchsia',
		'Gainsboro',
		'GhostWhite',
		'Gold',
		'GoldenRod',
		'Gray',
		'Grey',
		'Green',
		'GreenYellow',
		'HoneyDew',
		'HotPink',
		'IndianRed',
		'Indigo',
		'Ivory',
		'Khaki',
		'Lavender',
		'LavenderBlush',
		'LawnGreen',
		'LemonChiffon',
		'LightBlue',
		'LightCoral',
		'LightCyan',
		'LightGoldenRodYellow',
		'LightGray',
		'LightGrey',
		'LightGreen',
		'LightPink',
		'LightSalmon',
		'LightSeaGreen',
		'LightSkyBlue',
		'LightSlateGray',
		'LightSlateGrey',
		'LightSteelBlue',
		'LightYellow',
		'Lime',
		'LimeGreen',
		'Linen',
		'Magenta',
		'Maroon',
		'MediumAquaMarine',
		'MediumBlue',
		'MediumOrchid',
		'MediumPurple',
		'MediumSeaGreen',
		'MediumSlateBlue',
		'MediumSpringGreen',
		'MediumTurquoise',
		'MediumVioletRed',
		'MidnightBlue',
		'MintCream',
		'MistyRose',
		'Moccasin',
		'NavajoWhite',
		'Navy',
		'OldLace',
		'Olive',
		'OliveDrab',
		'Orange',
		'OrangeRed',
		'Orchid',
		'PaleGoldenRod',
		'PaleGreen',
		'PaleTurquoise',
		'PaleVioletRed',
		'PapayaWhip',
		'PeachPuff',
		'Peru',
		'Pink',
		'Plum',
		'PowderBlue',
		'Purple',
		'RebeccaPurple',
		'Red',
		'RosyBrown',
		'RoyalBlue',
		'SaddleBrown',
		'Salmon',
		'SandyBrown',
		'SeaGreen',
		'SeaShell',
		'Sienna',
		'Silver',
		'SkyBlue',
		'SlateBlue',
		'SlateGray',
		'SlateGrey',
		'Snow',
		'SpringGreen',
		'SteelBlue',
		'Tan',
		'Teal',
		'Thistle',
		'Tomato',
		'Turquoise',
		'Violet',
		'Wheat',
		'White',
		'WhiteSmoke',
		'Yellow',
		'YellowGreen'
	];
}
function getDynId(loc, oid) { return loc + '@' + oid; }
function getFunctionsNameThatCalledThisFunction() {
	let c1 = getFunctionsNameThatCalledThisFunction.caller;
	if (nundef(c1)) return 'no caller!';
	let c2 = c1.caller;
	if (nundef(c2)) return 'no caller!';
	return c2.name;
}
function getParams(areaName, oSpec, oid) {
	let params = oSpec.params ? oSpec.params : {};
	let panels = oSpec.panels ? oSpec.panels : [];
	let num = panels.length;
	let or = params.orientation ? params.orientation == 'h' ? 'rows'
		: 'columns' : DEF_ORIENTATION;
	let split = params.split ? params.split : DEF_SPLIT;
	let bg = oSpec.color ? oSpec.color : randomColor();
	let fg = bg ? colorIdealText(bg) : null;
	let id = oSpec.id ? oSpec.id : areaName;
	if (oid) { id = getDynId(id, oid); }
	let parent = mBy(areaName);
	if (oSpec.id) {
		parent.id = id;
		addAREA(id, oSpec);
		parent.innerHTML = id;
	}
	if (bg) { mColor(parent, bg, fg); }
	return [num, or, split, bg, fg, id, panels, parent];
}
function getRect(elem, relto) {
	if (isString(elem)) elem = document.getElementById(elem);
	let res = elem.getBoundingClientRect();
	if (isdef(relto)) {
		let b2 = relto.getBoundingClientRect();
		let b1 = res;
		res = {
			x: b1.x - b2.x,
			y: b1.y - b2.y,
			left: b1.left - b2.left,
			top: b1.top - b2.top,
			right: b1.right - b2.right,
			bottom: b1.bottom - b2.bottom,
			width: b1.width,
			height: b1.height
		};
	}
	let r = { x: res.left, y: res.top, w: res.width, h: res.height };
	addKeys({ l: r.x, t: r.y, r: r.x + r.w, b: r.t + r.h }, r);
	return r;
}
function getUID(pref = '') {
	UIDCounter += 1;
	return pref + '_' + UIDCounter;
}
function hide0(id) { mBy(id).style.display = "none"; }
function HSLAToRGBA(hsla, isPct) {
	let ex = /^hsla\(((((([12]?[1-9]?\d)|[12]0\d|(3[0-5]\d))(\.\d+)?)|(\.\d+))(deg)?|(0|0?\.\d+)turn|(([0-6](\.\d+)?)|(\.\d+))rad)(((,\s?(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2},\s?)|((\s(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2}\s\/\s))((0?\.\d+)|[01]|(([1-9]?\d(\.\d+)?)|100|(\.\d+))%)\)$/i;
	if (ex.test(hsla)) {
		let sep = hsla.indexOf(',') > -1 ? ',' : ' ';
		hsla = hsla
			.substr(5)
			.split(')')[0]
			.split(sep);
		if (hsla.indexOf('/') > -1) hsla.splice(3, 1);
		isPct = isPct === true;
		let h = hsla[0],
			s = hsla[1].substr(0, hsla[1].length - 1) / 100,
			l = hsla[2].substr(0, hsla[2].length - 1) / 100,
			a = hsla[3];
		if (h.indexOf('deg') > -1) h = h.substr(0, h.length - 3);
		else if (h.indexOf('rad') > -1) h = Math.round((h.substr(0, h.length - 3) / (2 * Math.PI)) * 360);
		else if (h.indexOf('turn') > -1) h = Math.round(h.substr(0, h.length - 4) * 360);
		if (h >= 360) h %= 360;
		let c = (1 - Math.abs(2 * l - 1)) * s,
			x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
			m = l - c / 2,
			r = 0,
			g = 0,
			b = 0;
		if (0 <= h && h < 60) {
			r = c;
			g = x;
			b = 0;
		} else if (60 <= h && h < 120) {
			r = x;
			g = c;
			b = 0;
		} else if (120 <= h && h < 180) {
			r = 0;
			g = c;
			b = x;
		} else if (180 <= h && h < 240) {
			r = 0;
			g = x;
			b = c;
		} else if (240 <= h && h < 300) {
			r = x;
			g = 0;
			b = c;
		} else if (300 <= h && h < 360) {
			r = c;
			g = 0;
			b = x;
		}
		r = Math.round((r + m) * 255);
		g = Math.round((g + m) * 255);
		b = Math.round((b + m) * 255);
		let pctFound = a.indexOf('%') > -1;
		if (isPct) {
			r = +((r / 255) * 100).toFixed(1);
			g = +((g / 255) * 100).toFixed(1);
			b = +((b / 255) * 100).toFixed(1);
			if (!pctFound) {
				a *= 100;
			} else {
				a = a.substr(0, a.length - 1);
			}
		} else if (pctFound) {
			a = a.substr(0, a.length - 1) / 100;
		}
		return 'rgba(' + (isPct ? r + '%,' + g + '%,' + b + '%,' + a + '%' : +r + ',' + +g + ',' + +b + ',' + +a) + ')';
	} else {
		return 'Invalid input color';
	}
}
function hslToHex(h, s, l) {
	l /= 100;
	const a = s * Math.min(l, 1 - l) / 100;
	const f = n => {
		const k = (n + h / 30) % 12;
		const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
		return Math.round(255 * color).toString(16).padStart(2, '0');
	};
	return `#${f(0)}${f(8)}${f(4)}`;
}
function HSLToRGB(hsl, isPct) {
	let ex = /^hsl\(((((([12]?[1-9]?\d)|[12]0\d|(3[0-5]\d))(\.\d+)?)|(\.\d+))(deg)?|(0|0?\.\d+)turn|(([0-6](\.\d+)?)|(\.\d+))rad)((,\s?(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2}|(\s(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2})\)$/i;
	if (ex.test(hsl)) {
		let sep = hsl.indexOf(',') > -1 ? ',' : ' ';
		hsl = hsl
			.substr(4)
			.split(')')[0]
			.split(sep);
		isPct = isPct === true;
		let h = hsl[0],
			s = hsl[1].substr(0, hsl[1].length - 1) / 100,
			l = hsl[2].substr(0, hsl[2].length - 1) / 100;
		if (h.indexOf('deg') > -1) h = h.substr(0, h.length - 3);
		else if (h.indexOf('rad') > -1) h = Math.round((h.substr(0, h.length - 3) / (2 * Math.PI)) * 360);
		else if (h.indexOf('turn') > -1) h = Math.round(h.substr(0, h.length - 4) * 360);
		if (h >= 360) h %= 360;
		let c = (1 - Math.abs(2 * l - 1)) * s,
			x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
			m = l - c / 2,
			r = 0,
			g = 0,
			b = 0;
		if (0 <= h && h < 60) {
			r = c;
			g = x;
			b = 0;
		} else if (60 <= h && h < 120) {
			r = x;
			g = c;
			b = 0;
		} else if (120 <= h && h < 180) {
			r = 0;
			g = c;
			b = x;
		} else if (180 <= h && h < 240) {
			r = 0;
			g = x;
			b = c;
		} else if (240 <= h && h < 300) {
			r = x;
			g = 0;
			b = c;
		} else if (300 <= h && h < 360) {
			r = c;
			g = 0;
			b = x;
		}
		r = Math.round((r + m) * 255);
		g = Math.round((g + m) * 255);
		b = Math.round((b + m) * 255);
		if (isPct) {
			r = +((r / 255) * 100).toFixed(1);
			g = +((g / 255) * 100).toFixed(1);
			b = +((b / 255) * 100).toFixed(1);
		}
		return 'rgb(' + (isPct ? r + '%,' + g + '%,' + b + '%' : +r + ',' + +g + ',' + +b) + ')';
	} else {
		return 'Invalid input color';
	}
}
function hue(h) {
	var r = Math.abs(h * 6 - 3) - 1;
	var g = 2 - Math.abs(h * 6 - 2);
	var b = 2 - Math.abs(h * 6 - 4);
	return [Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)];
}
function initCodingUI() {
	mStyle('dMain', { bg: 'silver' });
	[dTable, dSidebar] = mCols100('dMain', '1fr auto', 0);
	let [dtitle, dta] = mRows100(dTable, 'auto 1fr', 2);
	mDiv(dtitle, { padding: 10, fg: 'white', fz: 24 }, null, 'OUTPUT:');
	AU.ta = mTextArea100(dta, { fz: 20, padding: 10, family: 'opensans' });
}
function isdef(x) { return x !== null && x !== undefined; }
function isDict(d) { let res = (d !== null) && (typeof (d) == 'object') && !isList(d); return res; }
function isDigit(s) { return /^[0-9]$/i.test(s); }
function isEmpty(arr) {
	return arr === undefined || !arr
		|| (isString(arr) && (arr == 'undefined' || arr == ''))
		|| (Array.isArray(arr) && arr.length == 0)
		|| Object.entries(arr).length === 0;
}
function isEmptyOrWhiteSpace(s) { return isEmpty(s.trim()); }
function isLetter(s) { return /^[a-zA-Z]$/i.test(s); }
function isList(arr) { return Array.isArray(arr); }
function isNumber(x) { return x !== ' ' && x !== true && x !== false && isdef(x) && (x == 0 || !isNaN(+x)); }
function isString(param) { return typeof param == 'string'; }
function ithWord(s, n, allow_) {
	let ws = toWords(s, allow_);
	return ws[Math.min(n, ws.length - 1)];
}
function jsCopy(o) { return JSON.parse(JSON.stringify(o)); }
function last(arr) {
	return arr.length > 0 ? arr[arr.length - 1] : null;
}
function leaf_draw(o) {
	let [x, y] = [o.p.x, o.p.y];
	let [w, h] = [o.len * 1.5, o.len];
	cEllipse(x, y, w, h, { bg: o.color }, o.angle);
}
function list2dict(arr, keyprop = 'id', uniqueKeys = true) {
	let di = {};
	for (const a of arr) {
		if (uniqueKeys) lookupSet(di, [a[keyprop]], a);
		else lookupAddToList(di, [a[keyprop]], a);
	}
	return di;
}
function liste(areaName, oSpec, oid, o) {
	let [num, or, split, bg, fg, id, panels, parent] = getParams(areaName, oSpec, oid);
	parent.style.display = 'inline-grid';
	return parent;
}
function lookup(dict, keys) {
	let d = dict;
	let ilast = keys.length - 1;
	let i = 0;
	for (const k of keys) {
		if (k === undefined) break;
		let e = d[k];
		if (e === undefined || e === null) return null;
		d = d[k];
		if (i == ilast) return d;
		i += 1;
	}
	return d;
}
function lookupAddIfToList(dict, keys, val) {
	let lst = lookup(dict, keys);
	if (isList(lst) && lst.includes(val)) return;
	lookupAddToList(dict, keys, val);
}
function lookupAddToList(dict, keys, val) {
	let d = dict;
	let ilast = keys.length - 1;
	let i = 0;
	for (const k of keys) {
		if (i == ilast) {
			if (nundef(k)) {
				console.assert(false, 'lookupAddToList: last key indefined!' + keys.join(' '));
				return null;
			} else if (isList(d[k])) {
				d[k].push(val);
			} else {
				d[k] = [val];
			}
			return d[k];
		}
		if (nundef(k)) continue;
		if (d[k] === undefined) d[k] = {};
		d = d[k];
		i += 1;
	}
	return d;
}
function lookupSet(dict, keys, val) {
	let d = dict;
	let ilast = keys.length - 1;
	let i = 0;
	for (const k of keys) {
		if (nundef(k)) continue;
		if (d[k] === undefined) d[k] = (i == ilast ? val : {});
		if (nundef(d[k])) d[k] = (i == ilast ? val : {});
		d = d[k];
		if (i == ilast) return d;
		i += 1;
	}
	return d;
}
function lsys_add() {
	C.items = {};
	let root = C.root; root.gen++;
	let [stack, gen, b, sentence, x, y, angle, len, id] = [[], root.gen, root, root.sentence, root.p2.x, root.p2.y, root.angle, root.len, root.id++];
	for (let i = 0; i < gen; i++) { len *= root.dlen; sentence = generate(sentence); }
	let step = 0;
	for (var i = 0; i < sentence.length; i++) {
		var ch = sentence[i];
		if ('ABCFVWXYZ'.includes(ch)) {
			b = create_branch(b, angle, len, b.color); lookupAddToList(C.items, ['branch'], b); b.id = id++;
		} else if (ch == '+') {
			angle -= root.dangle;
		} else if (ch == '-') {
			angle += root.dangle;
		} else if (ch == '[') {
			stack.push({ x: b.p2.x, y: b.p2.y, angle: angle, b: b });
		} else if (ch == ']') {
			let o = stack.pop();
			angle = o.angle; x = o.x; y = o.y; b = o.b;
		}
	}
	C.changed = true;
	if (root.gen < root.depth) TO.iv1 = setTimeout(lsys_add, 100); else TO.iv1 = setTimeout(() => G_init('lsys'), 5000);
}
function lsys_init(offx = 0, offy = 0, options = {}) {
	let n = NATURE.lsystems.length;
	let i = DA.isystem = (DA.isystem + 1) % n;
	let system = NATURE.lsystems[i];
	let maxdepth = calc_maxdepth(12000, system.rules);
	let root = {
		axiom: system.axiom, //'F',
		sentence: system.axiom,
		rules: system.rules,
		t: 'root',
		p2: { x: CV.width / valf(system.xstart, 2), y: CV.height },
		angle: toRadian(90),
		len: valf(system.len, 100),
		age: 0,
		gen: 0,
		id: 0,
		dangle: toRadian(valf(system.angle, 25)),
		dlen: valf(system.dlen, .5),
		thickness: valf(options.thick, 1),
		dthickness: 1,
		color: rColor(70), //'seagreen',
		depth: Math.min(valf(system.depth, NATURE.depth), maxdepth),
		animated: false,
		jitter: false,
		done: true,
	};
	return root;
}
function makeUnitString(nOrString, unit = 'px', defaultVal = '100%') {
	if (nundef(nOrString)) return defaultVal;
	if (isNumber(nOrString)) nOrString = '' + nOrString + unit;
	return nOrString;
}
function mAppend(d, child) { toElem(d).appendChild(child); return child; }
function mBy(id) { return document.getElementById(id); }
function mCanvas(dParent, styles = {}, bstyles = {}, play = null, pause = null, origin = 'tl') {
	let cv = mCreate('canvas');
	mAppend(toElem(dParent), cv);
	addKeys({ w: 500, h: 500, bg: '#222', rounding: 10 }, styles);
	mStyle(cv, styles);
	let [w, h] = [cv.width, cv.height] = [styles.w, styles.h];
	let cx = cv.getContext('2d');
	let [x, y] = posToPoint(origin, w, h);
	cx.translate(x, y);
	if (!play) return { cv: cv, cx: cx, origin: { x: x, y: y }, x: 0, y: 0, w: w, h: h };
	mLinebreak(dParent)
	addKeys({ fz: 28, fg: 'skyblue', display: 'flex', ajcenter: true, w: styles.w }, bstyles)
	let controls = mPlayPause(dParent, bstyles, play, pause);
	return { cv: cv, cx: cx, origin: { x: x, y: y }, x: 0, y: 0, w: w, h: h, controls: controls.ui, play: controls.play, pause: controls.pause, stop: controls.play, stop: controls.pause };
}
function mCenterCenterFlex(d, gap) { mCenterFlex(d, true, true, true, gap); }
function mCenterFlex(d, hCenter = true, vCenter = false, wrap = true, gap = null) {
	let styles = { display: 'flex' };
	if (hCenter) styles['justify-content'] = 'center';
	styles['align-content'] = vCenter ? 'center' : 'flex-start';
	if (wrap) styles['flex-wrap'] = 'wrap';
	if (gap) styles.gap = gap;
	mStyle(d, styles);
}
function mClass(d) {
	d = toElem(d);
	if (arguments.length == 2) {
		let arg = arguments[1];
		if (isString(arg) && arg.indexOf(' ') > 0) { arg = [toWords(arg)]; }
		else if (isString(arg)) arg = [arg];
		if (isList(arg)) {
			for (let i = 0; i < arg.length; i++) {
				d.classList.add(arg[i]);
			}
		}
	} else for (let i = 1; i < arguments.length; i++) d.classList.add(arguments[i]);
}
function mClear(d) { clearElement(toElem(d)); }
function mColFlex(dParent, chflex = [1, 5, 1], bgs) {
	let styles = { opacity: 1, display: 'flex', aitems: 'stretch', 'flex-flow': 'nowrap' };
	mStyle(dParent, styles);
	let res = [];
	for (let i = 0; i < chflex.length; i++) {
		let bg = isdef(bgs) ? bgs[i] : null;
		let d1 = mDiv(dParent, { flex: chflex[i], bg: bg });
		res.push(d1);
	}
	return res;
}
function mColor(d, bg, fg) { return mStyle(d, { 'background-color': bg, 'color': fg }); }
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
function mCreate(tag, styles, id) { let d = document.createElement(tag); if (isdef(id)) d.id = id; if (isdef(styles)) mStyle(d, styles); return d; }
function mCreateFrom(htmlString) {
	var div = document.createElement('div');
	div.innerHTML = htmlString.trim();
	return div.firstChild;
}
function mDiv(dParent, styles, id, inner, classes, sizing) {
	dParent = toElem(dParent);
	let d = mCreate('div');
	if (dParent) mAppend(dParent, d);
	if (isdef(styles)) mStyle(d, styles);
	if (isdef(classes)) mClass(d, classes);
	if (isdef(id)) d.id = id;
	if (isdef(inner)) d.innerHTML = inner;
	if (isdef(sizing)) { setRect(d, sizing); }
	return d;
}
function mDiv100(dParent, styles, id, sizing = false) { let d = mDiv(dParent, styles, id); mSize(d, 100, 100, '%', sizing); return d; }
function mLinebreak(dParent, gap) {
	dParent = toElem(dParent);
	let d;
	let display = getComputedStyle(dParent).display;
	if (display == 'flex') {
		d = mDiv(dParent, { fz: 2, 'flex-basis': '100%', h: 0, w: '100%' }, null, ' &nbsp; ');
	} else {
		d = mDiv(dParent, {}, null, '<br>');
	}
	if (isdef(gap)) { d.style.minHeight = gap + 'px'; d.innerHTML = ' &nbsp; '; d.style.opacity = .2; }
	return d;
}
function moveTo(card, dx, dy) { card.animateTo({ delay: 1000, duration: 500, ease: 'quartOut', x: dx, y: dy }) }
function mPlayPause(dParent, styles = {}, handle_play = null, handle_pause = null) {
	if (!handle_play) handle_play = audio_onclick_pp;
	if (!handle_pause) handle_pause = handle_play;
	let html = `
    <div id="dButtons">
      <a id="bPlay" href="#">
        <i class="fa fa-play fa-2x"></i>
      </a>
      <a id="bPause" href="#" style="display: none">
        <i class="fa fa-pause fa-2x"></i>
      </a>
    </div>
  `;
	let pp = mCreateFrom(html);
	mAppend(dParent, pp);
	addKeys({ fz: 28, fg: 'lightgreen', display: 'flex', ajcenter: true, w: getRect(dParent).w }, styles);
	mStyle(pp, styles);
	mBy('bPlay').onclick = () => { hide0('bPlay'); show0('bPause'); handle_play(); }
	mBy('bPause').onclick = () => { hide0('bPause'); show0('bPlay'); handle_pause(); }
	let [fg, fz] = [styles.fg, styles.fz];
	mStyle(mBy('bPlay'), { fg: fg, fz: fz })
	mStyle(mBy('bPause'), { fg: fg, fz: fz })
	return { ui: pp, play: () => fireClick(mBy('bPlay')), pause: () => fireClick(mBy('bPause')) };
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
function mSize(d, w, h, unit = 'px', sizing) { if (nundef(h)) h = w; mStyle(d, { width: w, height: h }, unit); if (isdef(sizing)) setRect(d, sizing); }
function mStyle(elem, styles, unit = 'px') {
	elem = toElem(elem);
	if (isdef(styles.whrest)) { delete styles.whrest; styles.w = styles.h = 'rest'; } else if (isdef(styles.wh100)) { styles.w = styles.h = '100%'; delete styles.wh100; }
	if (isdef(styles.w100)) styles.w = '100%'; else if (isdef(styles.wrest)) styles.w = 'rest';
	if (isdef(styles.h100)) styles.h = '100%'; else if (isdef(styles.hrest)) styles.h = 'rest';
	let dParent = elem.parentNode;
	let pad = parseInt(valf(dParent.style.padding, '0'));
	let rp = getRect(dParent);
	let r = getRect(elem, dParent);
	if (styles.w == 'rest') {
		let left = r.l;
		let w = rp.w;
		let wrest = w - left - pad;
		styles.w = wrest;
	}
	if (styles.h == 'rest') {
		let r1 = getRect(dParent.lastChild, dParent);
		let hrest = rp.h - (r1.y) - pad;
		styles.h = hrest;
	}
	let bg, fg;
	if (isdef(styles.bg) || isdef(styles.fg)) {
		[bg, fg] = colorsFromBFA(styles.bg, styles.fg, styles.alpha);
	}
	if (isdef(styles.vpadding) || isdef(styles.hpadding)) {
		styles.padding = valf(styles.vpadding, 0) + unit + ' ' + valf(styles.hpadding, 0) + unit;
	}
	if (isdef(styles.vmargin) || isdef(styles.hmargin)) {
		styles.margin = valf(styles.vmargin, 0) + unit + ' ' + valf(styles.hmargin, 0) + unit;
	}
	if (isdef(styles.upperRounding) || isdef(styles.lowerRounding)) {
		let rtop = '' + valf(styles.upperRounding, 0) + unit;
		let rbot = '' + valf(styles.lowerRounding, 0) + unit;
		styles['border-radius'] = rtop + ' ' + rtop + ' ' + rbot + ' ' + rbot;
	}
	if (isdef(styles.box)) styles['box-sizing'] = 'border-box';
	if (isdef(styles.round)) styles['border-radius'] = '50%';
	for (const k in styles) {
		let val = styles[k];
		let key = k;
		if (isdef(STYLE_PARAMS[k])) key = STYLE_PARAMS[k];
		else if (k == 'font' && !isString(val)) {
			let fz = f.size; if (isNumber(fz)) fz = '' + fz + 'px';
			let ff = f.family;
			let fv = f.variant;
			let fw = isdef(f.bold) ? 'bold' : isdef(f.light) ? 'light' : f.weight;
			let fs = isdef(f.italic) ? 'italic' : f.style;
			if (nundef(fz) || nundef(ff)) return null;
			let s = fz + ' ' + ff;
			if (isdef(fw)) s = fw + ' ' + s;
			if (isdef(fv)) s = fv + ' ' + s;
			if (isdef(fs)) s = fs + ' ' + s;
			elem.style.setProperty(k, s);
			continue;
		} else if (k == 'classname') {
			mClass(elem, styles[k]);
		} else if (k == 'border') {
			if (isNumber(val)) val = `solid ${val}px ${isdef(styles.fg) ? styles.fg : '#ffffff80'}`;
			if (val.indexOf(' ') < 0) val = 'solid 1px ' + val;
		} else if (k == 'ajcenter') {
			elem.style.setProperty('justify-content', 'center');
			elem.style.setProperty('align-items', 'center');
		} else if (k == 'layout') {
			if (val[0] == 'f') {
				val = val.slice(1);
				elem.style.setProperty('display', 'flex');
				elem.style.setProperty('flex-wrap', 'wrap');
				let hor, vert;
				if (val.length == 1) hor = vert = 'center';
				else {
					let di = { c: 'center', s: 'start', e: 'end' };
					hor = di[val[1]];
					vert = di[val[2]];
				}
				let justStyle = val[0] == 'v' ? vert : hor;
				let alignStyle = val[0] == 'v' ? hor : vert;
				elem.style.setProperty('justify-content', justStyle);
				elem.style.setProperty('align-items', alignStyle);
				switch (val[0]) {
					case 'v': elem.style.setProperty('flex-direction', 'column'); break;
					case 'h': elem.style.setProperty('flex-direction', 'row'); break;
				}
			} else if (val[0] == 'g') {
				val = val.slice(1);
				elem.style.setProperty('display', 'grid');
				let n = allNumbers(val);
				let cols = n[0];
				let w = n.length > 1 ? '' + n[1] + 'px' : 'auto';
				elem.style.setProperty('grid-template-columns', `repeat(${cols}, ${w})`);
				elem.style.setProperty('place-content', 'center');
			}
		} else if (k == 'layflex') {
			elem.style.setProperty('display', 'flex');
			elem.style.setProperty('flex', '0 1 auto');
			elem.style.setProperty('flex-wrap', 'wrap');
			if (val == 'v') { elem.style.setProperty('writing-mode', 'vertical-lr'); }
		} else if (k == 'laygrid') {
			elem.style.setProperty('display', 'grid');
			let n = allNumbers(val);
			let cols = n[0];
			let w = n.length > 1 ? '' + n[1] + 'px' : 'auto';
			elem.style.setProperty('grid-template-columns', `repeat(${cols}, ${w})`);
			elem.style.setProperty('place-content', 'center');
		}
		if (key == 'font-weight') { elem.style.setProperty(key, val); continue; }
		else if (key == 'background-color') elem.style.background = bg;
		else if (key == 'color') elem.style.color = fg;
		else if (key == 'opacity') elem.style.opacity = val;
		else if (key == 'wrap') { if (val == 'hard') elem.setAttribute('wrap', 'hard'); else elem.style.flexWrap = 'wrap'; }
		else if (startsWith(k, 'dir')) {
			isCol = val[0] == 'c';
			elem.style.setProperty('flex-direction', 'column');
		} else if (key == 'flex') {
			if (isNumber(val)) val = '' + val + ' 1 0%';
			elem.style.setProperty(key, makeUnitString(val, unit));
		} else {
			elem.style.setProperty(key, makeUnitString(val, unit));
		}
	}
}
function mTextArea100(dParent, styles = {}) {
	mCenterCenterFlex(dParent)
	let html = `<textarea style="width:100%;height:100%;box-sizing:border-box" wrap="hard"></textarea>`;
	let t = mCreateFrom(html);
	mStyle(t, styles);
	mAppend(dParent, t);
	return t;
}
function mutate_colors(type, colors) {
	let items = C.items[type];
	let changed = false;
	let lastcolor = arrLast(colors);
	for (const item of items) {
		if (item.color == lastcolor) continue;
		changed = true;
		if (coin()) continue;
		let i = colors.indexOf(item.color) + 1;
		item.color = colors[i];
		if (type == 'branch') item.thickness -= 1.5;
	}
	return changed;
}
function nundef(x) { return x === null || x === undefined; }
function panel(areaName, oSpec, oid, o) {
	let [num, or, split, bg, fg, id, panels, parent] = getParams(areaName, oSpec, oid);
	if (num > 0) {
		parent.style.display = 'grid';
		clearElement(parent);
		for (let i = 0; i < num; i++) {
			let d = mDiv100(parent);
			d.id = getUID();
			if (panels.length > i) {
				if (oid) dynamicArea(d.id, panels[i], oid, o); else staticArea(d.id, panels[i]);
			}
		}
		if (or == 'rows') {
			console.log('====', split * 100);
			parent.style.gridTemplateColumns = `${split * 100}% 1fr`;
		}
	}
	return parent;
}
function posToPoint(pos = 'cc', w, h, offx = 0, offy = 0) {
	let di = { t: 0, b: h, l: 0, r: w };
	let py = pos[0] == 'c' ? h / 2 : di[pos[0]];
	let px = pos[1] == 'c' ? w / 2 : di[pos[1]];
	return [px + offx, py + offy];
}
function pSBC(p, c0, c1, l) {
	let r, g, b, P, f, t, h, i = parseInt, m = Math.round, a = typeof c1 == 'string';
	if (typeof p != 'number' || p < -1 || p > 1 || typeof c0 != 'string' || (c0[0] != 'r' && c0[0] != '#') || (c1 && !a)) return null;
	h = c0.length > 9;
	h = a ? (c1.length > 9 ? true : c1 == 'c' ? !h : false) : h;
	f = pSBCr(c0);
	P = p < 0;
	t = c1 && c1 != 'c' ? pSBCr(c1) : P ? { r: 0, g: 0, b: 0, a: -1 } : { r: 255, g: 255, b: 255, a: -1 };
	p = P ? p * -1 : p;
	P = 1 - p;
	if (!f || !t) return null;
	if (l) { r = m(P * f.r + p * t.r); g = m(P * f.g + p * t.g); b = m(P * f.b + p * t.b); }
	else { r = m((P * f.r ** 2 + p * t.r ** 2) ** 0.5); g = m((P * f.g ** 2 + p * t.g ** 2) ** 0.5); b = m((P * f.b ** 2 + p * t.b ** 2) ** 0.5); }
	a = f.a;
	t = t.a;
	f = a >= 0 || t >= 0;
	a = f ? (a < 0 ? t : t < 0 ? a : a * P + t * p) : 0;
	if (h) return 'rgb' + (f ? 'a(' : '(') + r + ',' + g + ',' + b + (f ? ',' + m(a * 1000) / 1000 : '') + ')';
	else return '#' + (4294967296 + r * 16777216 + g * 65536 + b * 256 + (f ? m(a * 255) : 0)).toString(16).slice(1, f ? undefined : -2);
}
function pSBCr(d) {
	let i = parseInt, m = Math.round, a = typeof c1 == 'string';
	let n = d.length,
		x = {};
	if (n > 9) {
		([r, g, b, a] = d = d.split(',')), (n = d.length);
		if (n < 3 || n > 4) return null;
		(x.r = parseInt(r[3] == 'a' ? r.slice(5) : r.slice(4))), (x.g = parseInt(g)), (x.b = parseInt(b)), (x.a = a ? parseFloat(a) : -1);
	} else {
		if (n == 8 || n == 6 || n < 4) return null;
		if (n < 6) d = '#' + d[1] + d[1] + d[2] + d[2] + d[3] + d[3] + (n > 4 ? d[4] + d[4] : '');
		d = parseInt(d.slice(1), 16);
		if (n == 9 || n == 5) (x.r = (d >> 24) & 255), (x.g = (d >> 16) & 255), (x.b = (d >> 8) & 255), (x.a = m((d & 255) / 0.255) / 1000);
		else (x.r = d >> 16), (x.g = (d >> 8) & 255), (x.b = d & 255), (x.a = -1);
	}
	return x;
}
function randomColor() { return rColor(); }
function range(f, t, st = 1) {
	if (nundef(t)) {
		t = f - 1;
		f = 0;
	}
	let arr = [];
	for (let i = f; i <= t; i += st) {
		arr.push(i);
	}
	return arr;
}
function rChoose(arr, n = 1, func = null, exceptIndices = null) {
	let indices = arrRange(0, arr.length - 1);
	if (isdef(exceptIndices)) {
		for (const i of exceptIndices) removeInPlace(indices, i);
	}
	if (isdef(func)) indices = indices.filter(x => func(arr[x]));
	if (n == 1) {
		let idx = Math.floor(Math.random() * indices.length);
		return arr[indices[idx]];
	}
	arrShufflip(indices);
	return indices.slice(0, n).map(x => arr[x]);
}
function rColor(cbrightness, c2, alpha = null) {
	if (isdef(c2)) {
		let c = colorMix(cbrightness, c2, rNumber(0, 100));
		return colorTrans(c, alpha ?? Math.random());
	}
	if (isdef(cbrightness)) {
		let hue = rHue();
		let sat = 100;
		let b = isNumber(cbrightness) ? cbrightness : cbrightness == 'dark' ? 25 : cbrightness == 'light' ? 75 : 50;
		return colorFromHSL(hue, sat, b);
	}
	let s = '#';
	for (let i = 0; i < 6; i++) {
		s += rChoose(['f', 'c', '9', '6', '3', '0']);
	}
	return s;
}
function removeCommentLines(text, cstart, cend) {
	let lines = text.split('\n');
	let inComment = false, res = '';
	for (const line of lines) {
		let lt = line.trim();
		if (lt.startsWith(cstart) && lt.endsWith(cend)) { continue; }
		if (lt.startsWith(cstart)) { inComment = true; continue; }
		if (lt.endsWith(cend)) { inComment = false; continue; }
		res += line + '\n';
	}
	return res;
}
function removeInPlace(arr, el) {
	arrRemovip(arr, el);
}
function removeTrailingComments(line) {
	let icomm = line.indexOf('//');
	if (icomm <= 0 || ':"`\''.includes(line[icomm - 1])) return line;
	if ([':', '"', "'", '`'].some(x => line.indexOf(x) >= 0 && line.indexOf(x) < icomm)) return line;
	return line.substring(0, icomm);
}
function replaceAllSpecialChars(str, sSub, sBy) { return str.split(sSub).join(sBy); }
function rest() { }
function rHue() { return (rNumber(0, 36) * 10) % 360; }
function rNumber(min = 0, max = 100) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
function root(areaName) {
	setTableSize(areaName, 400, 300);
	UIROOT = jsCopy(SPEC.staticSpec.root);
	for (const k in AREAS) delete AREAS[k];
	PROTO = {};
	INFO = {};
	staticArea(areaName, UIROOT);
	addAREA('root', UIROOT);
}
async function route_path_text(url) {
	let data = await fetch(url);
	let text = await data.text();
	return text;
}
function setRect(elem, options) {
	let r = getRect(elem);
	elem.rect = r;
	elem.setAttribute('rect', `${r.w} ${r.h} ${r.t} ${r.l} ${r.b} ${r.r}`);
	if (isDict(options)) {
		if (options.hgrow) mStyle(elem, { hmin: r.h });
		else if (options.hfix) mStyle(elem, { h: r.h });
		else if (options.hshrink) mStyle(elem, { hmax: r.h });
		if (options.wgrow) mStyle(elem, { wmin: r.w });
		else if (options.wfix) mStyle(elem, { w: r.w });
		else if (options.wshrink) mStyle(elem, { wmax: r.w });
	}
	return r;
}
function setTableSize(w, h, unit = 'px') {
	let d = mBy('areaTable');
	mStyle(d, { 'min-width': w, 'min-height': h }, unit);
}
function show0(id) { mBy(id).style.display = "block"; }
function sortCaseInsensitive(list) {
	list.sort((a, b) => { return a.toLowerCase().localeCompare(b.toLowerCase()); });
	return list;
}
async function start() {
	initCodingUI();
	let [text, css] = await closureFromProject('coding');
	AU.ta.value = text;
}
function startsWith(s, sSub) {
	return s.substring(0, sSub.length) == sSub;
}
function staticArea(areaName, oSpec) {
	func = correctFuncName(oSpec.type);
	oSpec.ui = window[func](areaName, oSpec);
}
function stop_simple_timer() { if (isdef(DA.timer)) { DA.timer.clear(); DA.timer = null; } }
function stringAfter(sFull, sSub) {
	let idx = sFull.indexOf(sSub);
	if (idx < 0) return '';
	return sFull.substring(idx + sSub.length);
}
function stringBefore(sFull, sSub) {
	let idx = sFull.indexOf(sSub);
	if (idx < 0) return sFull;
	return sFull.substring(0, idx);
}
function stringBeforeLast(sFull, sSub) {
	let parts = sFull.split(sSub);
	return sFull.substring(0, sFull.length - arrLast(parts).length - 1);
}
function stringCount(s, sSub, caseInsensitive = true) {
	let temp = "Welcome to W3Docs";
	let m = new RegExp(sSub, 'g' + (caseInsensitive ? 'i' : ''));
	let count = (s.match(m)).length;
	return count;
}
function test() {
	for (i = 0; i < 10; i++) {
		circles += 1;
		createcircle((i * w / 10), "50%", "100", "0", "hsla(" + (i * 36) + ",100%,50%,0.5)", "url(#f" + circles + ")"); createfilter("-50%", "-50%", "200%", "200%", ["feGaussianBlur"], ["stdDeviation", "5"]);
	}
}
function toElem(d) { return isString(d) ? mBy(d) : d; }
function toLetters(s) { return [...s]; }
function toRadian(deg) { return deg * (Math.PI / 180); }
function toWords(s, allow_ = false) {
	let arr = allow_ ? s.split(/[\W]+/) : s.split(/[\W|_]+/);
	return arr.filter(x => !isEmpty(x));
}
function tree_add() {
	let root = C.root;
	if (root.phase == 'spring') {
		C.changed = false;
		assertion(root, 'ROOT IS NULL BEI TREE_ADD!!!!!!!!!!!!!')
		if (!root.done) {
			let b = create_branch(root, root.angle, root.len * root.dlen, root.color);
			lookupAddToList(C.items, [b.t], b);
			C.changed = true;
		} else {
			for (const b of C.items.branch.filter(x => !x.done)) {
				if (b.age < root.depth) {
					let br = root.branching;
					for (const a of br) {
						let o = create_branch(b, b.angle + toRadian(a), b.len * root.dlen, colorMix(b.color, 'lime', 3)); lookupAddToList(C.items, [o.t], o);
					}
				} else {
					let o = create_leaf(b, root); lookupAddToList(C.items, [o.t], o);
				}
				C.changed = true;
				root.maxage = b.age + 1;
				b.done = true;
			}
		}
		if (!C.changed) { root.minage = 0; root.phase = 'summer'; }
	}
	else if (root.phase == 'summer') {
		let colors = ['darkgreen', 'olive', '#8B9216', '#A79F0F', '#EDA421', '#E98604', '#DF3908', '#C91E0A', '#8C584A'];
		let changed = mutate_colors('leaf', colors);
		if (!changed) root.phase = 'autumn';
		root.jitter = true;
		C.changed = true;
	}
	else if (root.phase == 'autumn') {
		root.jitter = false;
		C.changed = true;
		let falling = C.items.leaf.filter(l => l.p.y < CV.height);
		if (isEmpty(falling)) {
			C.changed = false; root.phase = 'winter';
		} else {
			for (const b of falling) { b.p = { x: b.p.x + Math.random() * .51, y: b.p.y + Math.random() * 3 }; }
		}
	}
	else if (root.phase == 'winter') {
		let colors = ['#8E2100', '#5C1306', '#371C0F', '#1C1B19'];
		let changed = mutate_colors('branch', colors);
		if (!changed) root.phase = 'over';
		C.changed = true;
	}
	else if (root.phase == 'over') { root.animated = false; }
	if (root.animated) TO.iv1 = setTimeout(tree_add, root.speed[root.phase]); else TO.iv1 = setTimeout(() => G_init('tree'), 3000);
}
function tree_init(offx = 0, offy = 0, options = {}) {
	let root = {
		done: false,
		t: 'root',
		age: 0,
		p2: { x: offx + CV.width / 2, y: offy + CV.height },
		len: valf(options.len, 100),
		angle: toRadian(90),
		thickness: valf(options.thick, 20),
		color: valf(options.color, 'sienna'),
		depth: NATURE.depth,
		branching: NATURE.branching,
		dlen: .7,
		dthickness: .7,
		phase: 'spring',
		speed: { spring: 100, summer: 100, autumn: 25, winter: 100, over: 2000 },
		animated: false,
		jitter: false,
	};
	return root;
}
function trim(str) {
	return str.replace(/^\s+|\s+$/gm, '');
}
function turtle() {
	background(51);
	stroke(255);
	translate(width / 2, height);
	for (let i = 0; i < sentence.length; i++) {
		let x = sentence.charAt(i);
		if ('ABF'.includes(x)) { line(0, 0, 0, -len); translate(0, -len); }
		else if (x == '+') rotate(angle);
		else if (x == '-') rotate(-angle);
		else if (x == '[') push();
		else if (x == ']') pop();
	}
}
function valf() {
	for (const arg of arguments) if (isdef(arg)) return arg;
	return null;
}
