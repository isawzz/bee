
function _minimizeCode(di, symlist = ['start'], nogo = []) {
	let done = {};
	let tbd = symlist; //console.log('symlist', symlist)
	let MAX = 1000000, i = 0;
	let visited = {
		autocomplete: true, Card: true, change: true, config: true, grid: true, hallo: true,
		jQuery: true, init: true,
		Number: true, sat: true, step: true, PI: true
	};

	while (!isEmpty(tbd)) {
		if (++i > MAX) break; //else console.log('i',i)
		let sym = tbd[0]; //console.log('sym', sym, i);
		if (isdef(visited[sym])) { tbd.shift(); continue; }
		visited[sym] = true;
		let o = di[sym];
		// if (sym == 'mToolbar') console.log('!!!!!!!!!!o', o)
		if (nundef(o)) { tbd.shift(); continue; } //console.log('not def',sym);
		let text = o.code; //always using last function body!!!
		//if (text.includes('NATURE')) console.log('text NATURE found in', sym)
		let words = toWords(text, true);
		//if (words.includes('NATURE')) console.log('words NATURE found in', sym)
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






