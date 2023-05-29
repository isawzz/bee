
function splitAtAnyString(s,list){
	let res=[];
	let rest = s;
	while(rest.length>0){
		let imin=s.length+100;
		let best=null;
		for(const kw of list){
			let i=rest.indexOf(kw);
			if (i>=0 && i<imin){best=kw;imin=i;}
		}
		if (best){
			let prefix = stringBefore(rest,best);
			rest=stringAfter(rest,best);
			res.push(prefix);
		}else {res.push(rest);return res;}
	}
}

function codePP1(ast, ind = 0) {
	if (Array.isArray(ast)) return ast.map(x => codePP1(x, ind)).join('');

	let t = ast.type;
	if (t == 'eof') {
		return '';
	} else if (t == 'Braced') {
		let st = codePP1(ast.m, ind + 2);
		//return '\n' + ' '.repeat(ind) + '{\n' + st + '\n' + ' '.repeat(ind) + '}\n';
		return ' {\n' + st + '\n' + ' '.repeat(ind) + '}';
	} else if (t == 'C') {
		let s = ast.val.trim();
		return (s.length == 1) ? s : ' '.repeat(ind) + s;
	}
}
function codePP(ast, ind = 0) {
	if (Array.isArray(ast)) return ast.map(x => codePP(x, ind)).join('');

	let t = ast.type;
	if (t == 'eof') {
		return '';
	} else if (t == 'Braced') {
		let st = codePP(ast.m, ind + 2);
		//return '\n' + ' '.repeat(ind) + '{\n' + st + '\n' + ' '.repeat(ind) + '}\n';
		return ' {\n' + st + '\n' + ' '.repeat(ind) + '}';
	} else if (t == 'C') {
		let s = ast.val.trim();
		return (s.length == 1) ? s : ' '.repeat(ind) + s;
	}
}
async function codeFromFile(path){
	input = await route_path_text(path);
	input = replaceAllSpecialChars(input, '\t', '  ');
	input = replaceAllSpecialChars(input, '\r', '');
	return input;
}
function codeToTokens(input, braceTokens = false) {
	console.clear();
	//let s = ` hallo das "hallo ist ein "w"ort" aber 123 nicht!`
	//input = `let match = html && /\bsrc="?([^"\s]+)"?\s*/.exec(html);`
	let tok = tokutils(input);
	let prev = null;
	var tokenlist = []; let rcount = 0;
	while (tok.get() !== undefined) {
		let token = braceTokens ? (tok.string() ?? tok.code_nobrace() ?? tok.lexchar('{}') ?? tok.regexp() ?? tok.comment())
			: (tok.string() ?? tok.code() ?? tok.regexp() ?? tok.comment());
		if (token === true) { prev = null; continue; } //break;
		if (token) {
			if (prev && prev.type == token.type) { console.log('BAD!!!', token, prev, tok.getpos()); break; }
			prev = token;
			token.line = tok.getpos().line;
			tokenlist.push(token);
			//if (token.type == 'R') { rcount++; if (rcount > 1300) break; }
		} else { error('unexpected char ' + tok.get() + ', pos:' + tok.getpos().line); tok.next(); break; }
	}
	//tokenlist.map(x => {if (x.type == 'R') console.log(x)});
	// tokenlist.map(x => console.log(x));
	console.log('stopped at', tok.getpos(), tok.peekstr(20))
	tokenlist.push({ type: 'eof', val: null });
	return tokenlist;
}
function codeAstFromTokens(tokenlist) {
	var tokens, token, idx = 0;
	function nextToken() { token = tokens[idx++]; }
	function guess(type) { return token && token.type == type ? token : null; }
	function P() {
		nextToken();
		let x = EMPTY() ?? Lit() ?? Braced();
		if (!x) return [];
		if (x.type == 'eof') return [x]; else return [x].concat(P());
	}
	function EMPTY() { return guess('eof'); }
	function Lit() { return R() ?? S() ?? C(); }
	function C() { return guess('C'); }
	function R() { return guess('R'); }
	function S() { return guess('S'); }
	function Braced() {
		let left = guess('{'); if (!left) return null;
		let m = P(); if (!m) return null;
		let right = guess('}');
		if (right) return { type: 'Braced', left, m, right };
		return null;
	}

	tokens = tokenlist;
	let ast = P(); //classic function P
	return ast;

}
function codeFromTokens(tokenlist) {
	// console.log('tokens:', tokenlist.length);
	let code = '';
	for (const t of tokenlist) {
		if (t.type == 'C') {
			code += t.val;
		} else if (t.type == 'R' || t.type == 'S') {
			code += `${t.sep}${t.val}${t.sep}`;
		} else break;
	}
	return code;
}



//#region super cards!!!
function cardGetObject(sym, n, pos, sz) {
	let h = 110, fg = 'indigo', w;
	let info = Syms[sym];
	ensureColorNames();
	if (nundef(fg)) fg = sym == 'spades' || sym == 'clubs' ? 'black' : sym == 'hearts' || sym == 'diamonds' ? 'red' : chooseRandom(Object.keys(ColorNames));

	let di = { 10: 'T', 11: 'E', 12: 't', 13: 'H', 14: 'F', 15: 'f', 16: 'S', 17: 's', 18: 'e', 19: 'N', 20: 'W' };
	let num = n;
	n = valf(di[n], n);

	let cardKey = info.family == 'emoNoto' ? `card${n}` : 'card52';

	let ssv = `
		<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="card" 
		face="${info.E}${n}" height="100%" preserveAspectRatio="none" viewBox="-120 -168 240 336" width="100%">
			<symbol id="${fg}${n}" viewBox="-500 -500 1000 1000" preserveAspectRatio="xMinYMid">
				<text text-anchor="middle" dominant-baseline="middle" x="0" y="0" fill="${fg}" style="font-size:1000px;font-weight:bold;">${num}</text>        
			</symbol>
			<symbol id="${info.E}" viewBox="-500 -500 1000 1000" preserveAspectRatio="xMinYMid">
				<text text-anchor="middle" dominant-baseline="middle" x="0" y="-150" fill="red" style="font-size:750px;font-family:${info.family};">${info.text}</text>        
			</symbol>
			<rect width="239" height="335" x="-119.5" y="-167.5" rx="12" ry="12" fill="white" stroke="black"></rect>
			<use xlink:href="#${fg}${n}" height="42" x="-118" y="-156"></use>
			<use xlink:href="#${info.E}" height="26.769" x="-111.784" y="-119"></use>`;

	//hier muss die use symbol dinger machen!!!			
	for (const p of pos) {
		ssv += `<use xlink:href="#${info.E}" height="${sz}" x="${p.x}" y="${p.y}"></use>`;
	}

	ssv += `
			<g transform="rotate(180)">
			<use xlink:href="#${fg}${n}" height="42" x="-118" y="-156"></use><use xlink:href="#${info.E}" height="26.769" x="-111.784" y="-119"></use></g></svg>`;

	let svgCode = ssv;
	svgCode = '<div>' + svgCode + '</div>';
	let el = mCreateFrom(svgCode);
	if (nundef(w)) w = h * .7;
	if (isdef(h) || isdef(w)) { mSize(el, w, h); }
	return { key: getUID(), div: el, w: w, h: h, faceUp: true, key: cardKey, num: num };

}
function calcSpecialPos(num, cols, sz = 70) {
	let [l, m] = [cols[0], cols[1]]
	//middle of card is 0,0 daher muss middle pos = -sz/2,-sz/2 sein!
	let pos = [];
	let offs = sz / 2;
	let dy = 0;
	let [x1, y1] = [-52, -100];
	let [x, y] = [x1 - offs, y1 - offs];
	if (l >= 2) {
		dy = 200 / (l - 1);
		while (y <= 100) {
			pos.push({ x, y });
			pos.push({ x: 52 - offs, y });
			y += dy;
		}
	}
	if (m >= 1 && num < 12) {
		//wann gibt es ein mittleres???
		x = 0;
		if (l % 2 == 0 && m % 2 == 1) { pos.push({ x: x - offs, y: 0 - offs }); m--; }


		let [t, b] = [100 - dy / 2, -100 + dy / 2];
		while (m > 0) {
			if (m > 0) { pos.push({ x: x - offs, y: b - offs }); m--; }
			if (m > 0) { pos.push({ x: x - offs, y: t - offs }); m--; }
			b += dy; t -= dy;
		}
	} else if (m >= 1 && num >= 12) {
		// let [t, b] = [100 - dy / 2, -100 + dy / 2];
		// let [t, gap] = [-100 + dy / 2, (200 - dy) / m - 1]; x = 0 - offs; y = t - offs; while (m > 0) { pos.push({ x, y }); m--; y += gap; }

		let brauche = dy * (m - 1);
		[x, y] = [0 - offs, -(brauche / 2) - offs];
		//if (l%2 == 0) y-=dy/2;
		while (m > 0) { pos.push({ x, y }); m--; y += dy; }

		//let [t, gap] = [-100 + dy / 2, (200 - dy) / m - 1]; x = 0 - offs; y = t - offs; while (m > 0) { pos.push({ x, y }); m--; y += gap; }

		//hier nehm ich einfach eine etwas kleinere col

	}
	// [x, y] = [0, m % 2 == 1 ? 0 : dy / 2];
	// while (y <= 100 && m > 0) {
	// 	let o1 = l % 2 ? dy / 2 : 0;
	// 	pos.push({ x: x - offs, y: y - offs - o1 }); m--;
	// 	if (m <= 0) break;

	// 	if (y > 0) { pos.push({ x: x - offs, y: -y - offs - o1 }); m--; }
	// 	y += dy;
	// }

	return pos;
	let center = { x: -sz / 2, y: -sz / 2 }; return [center];
	let [lx, mx, rx] = [-87.5, -35, 17.5];



	let [lstart, mstart] = [-135, -35];
}
function calcSpecialCols(num) {
	// let [top, bot, le, mi, ri, hsym, tot] = [-135, -35, -87.5, -35, 17.5, 70, 100];
	// if (isNumber(num) && num > 12 && num <= 20) {
	// 	let dd = Math.ceil(num / 12);
	// 	hsym -= hsym * .1 * dd;
	// }

	let dicols = { 1: '010', 2: '020', 3: '030', 4: '202', 5: '212' };
	let cols, d = 0, pl = 0, tot = 100;
	if (num > 5) {
		let l = num - 6;
		pl = Math.floor(l / 3);
		let nleft = 3 + pl;
		let m = num % 3 + pl;
		cols = [nleft, m]; //`${nleft},${m},${nleft}`;
		//assertion((pl-1) >= 1,'DIV BY 0!!!!!')
		d = tot / (pl + 1); //pl<1>?tot:(tot / (pl - 1));
		//if (num>=9) d=tot/pl
		// lookupSet(coldi,[num],nleft)
		//coldi[`${num}`]=`${nleft}${m}${nleft}`;
		//console.log(num, cols);//pl,nleft,m)
	} else cols = dicols[num];

	//jetzt hab ich fuer jedes das cols also das x
	//jetzt brauch ich noch die dist
	//console.log('cols', num, cols, 'pl=' + pl, 'd=' + d);
	return cols;

}
//#endregion

//#region older code
function calculateSymbolPositions(cardWidth, cardHeight, symbolCount) {
	const positions = [];
	const padding = 0.1; // 10% padding from edges
	const horizontalPadding = cardWidth * padding;
	const verticalPadding = cardHeight * padding;
	const availableWidth = cardWidth - (2 * horizontalPadding);
	const availableHeight = cardHeight - (2 * verticalPadding);
	const columns = Math.ceil(Math.sqrt(symbolCount));
	const rows = Math.ceil(symbolCount / columns);
	const columnSpacing = availableWidth / (columns + 1);
	const rowSpacing = availableHeight / (rows + 1);

	for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
		for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
			const symbolIndex = rowIndex * columns + columnIndex;
			if (symbolIndex < symbolCount) {
				const x = horizontalPadding + (columnIndex + 1) * columnSpacing;
				const y = verticalPadding + (rowIndex + 1) * rowSpacing;
				positions.push({ x, y });
			}
		}
	}

	return positions;
}
function cardGetPrimitive(sym = 'bee', h = 110, n = 2, fg = 'indigo', w) {
	let info = Syms[sym];
	ensureColorNames();
	if (nundef(fg)) fg = sym == 'spades' || sym == 'clubs' ? 'black' : sym == 'hearts' || sym == 'diamonds' ? 'red' : chooseRandom(Object.keys(ColorNames));

	let di = { 10: 'T', 11: 'E', 12: 't', 13: 'H', 14: 'F', 15: 'f', 16: 'S', 17: 's', 18: 'e', 19: 'N', 20: 'W' };
	let num = n;
	n = valf(di[n], n);

	let cardKey = info.family == 'emoNoto' ? `card${n}` : 'card52';
	let basic = {
		card2: `
			<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="card" 
			face="${info.E}${n}" height="100%" preserveAspectRatio="none" viewBox="-120 -168 240 336" width="100%">
				<symbol id="${fg}${n}" viewBox="-500 -500 1000 1000" preserveAspectRatio="xMinYMid">
					<text text-anchor="middle" dominant-baseline="middle" x="0" y="0" fill="${fg}" style="font-size:1000px;font-weight:bold;">${n}</text>        
				</symbol>
				<symbol id="${info.E}" viewBox="-500 -500 1000 1000" preserveAspectRatio="xMinYMid">
					<text text-anchor="middle" dominant-baseline="middle" x="0" y="-150" fill="red" style="font-size:750px;font-family:${info.family};">${info.text}</text>        
				</symbol>
				<rect width="239" height="335" x="-119.5" y="-167.5" rx="12" ry="12" fill="white" stroke="black"></rect>
				<use xlink:href="#${fg}${n}" height="42" x="-118" y="-156"></use>
				<use xlink:href="#${info.E}" height="26.769" x="-111.784" y="-119"></use>
				<use xlink:href="#${info.E}" height="70" x="-35" y="-135.588"></use>
				<g transform="rotate(180)">
					<use xlink:href="#${fg}${n}" height="42" x="-118" y="-156"></use>
					<use xlink:href="#${info.E}" height="26.769" x="-111.784" y="-119"></use>
					<use xlink:href="#${info.E}" height="70" x="-35" y="-135.588"></use>
				</g>
			</svg>`,
		card3: `
		<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="card" 
		face="${info.E}${n}" height="100%" preserveAspectRatio="none" viewBox="-120 -168 240 336" width="100%">
			<symbol id="${fg}${n}" viewBox="-500 -500 1000 1000" preserveAspectRatio="xMinYMid">
				<text text-anchor="middle" dominant-baseline="middle" x="0" y="0" fill="${fg}" style="font-size:1000px;font-weight:bold;">${n}</text>        
			</symbol>
			<symbol id="${info.E}" viewBox="-500 -500 1000 1000" preserveAspectRatio="xMinYMid">
				<text text-anchor="middle" dominant-baseline="middle" x="0" y="-150" fill="red" style="font-size:750px;font-family:${info.family};">${info.text}</text>        
			</symbol>
			<rect width="239" height="335" x="-119.5" y="-167.5" rx="12" ry="12" fill="white" stroke="black"></rect>
			<use xlink:href="#${fg}${n}" height="42" x="-118" y="-156"></use>
			<use xlink:href="#${info.E}" height="26.769" x="-111.784" y="-119"></use>
			<use xlink:href="#${info.E}" height="70" x="-35" y="-135.588"></use>
			<use xlink:href="#${info.E}" height="70" x="-35" y="-35"></use>
			<g transform="rotate(180)">
				<use xlink:href="#${fg}${n}" height="42" x="-118" y="-156"></use>
				<use xlink:href="#${info.E}" height="26.769" x="-111.784" y="-119"></use>
				<use xlink:href="#${info.E}" height="70" x="-35" y="-135.588"></use>
			</g>
		</svg>`,
		card4: `
		<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="card" 
		face="${info.E}${n}" height="100%" preserveAspectRatio="none" viewBox="-120 -168 240 336" width="100%">
			<symbol id="${fg}${n}" viewBox="-500 -500 1000 1000" preserveAspectRatio="xMinYMid">
				<text text-anchor="middle" dominant-baseline="middle" x="0" y="0" fill="${fg}" style="font-size:1000px;font-weight:bold;">${n}</text>        
			</symbol>
			<symbol id="${info.E}" viewBox="-500 -500 1000 1000" preserveAspectRatio="xMinYMid">
				<text text-anchor="middle" dominant-baseline="middle" x="0" y="-150" fill="red" style="font-size:750px;font-family:${info.family};">${info.text}</text>        
			</symbol>
			<rect width="239" height="335" x="-119.5" y="-167.5" rx="12" ry="12" fill="white" stroke="black"></rect>
			<use xlink:href="#${fg}${n}" height="42" x="-118" y="-156"></use>
			<use xlink:href="#${info.E}" height="26.769" x="-111.784" y="-119"></use>
			<use xlink:href="#${info.E}" height="70" x="-87.501" y="-135.588"></use>
			<use xlink:href="#${info.E}" height="70" x="17.501" y="-135.588"></use>
					<g transform="rotate(180)">
				<use xlink:href="#${fg}${n}" height="42" x="-118" y="-156"></use>
				<use xlink:href="#${info.E}" height="26.769" x="-111.784" y="-119"></use>
				<use xlink:href="#${info.E}" height="70" x="-87.501" y="-135.588"></use>
				<use xlink:href="#${info.E}" height="70" x="17.501" y="-135.588"></use>
				</g>
		</svg>`,
		card5: `
		<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="card" 
		face="${info.E}${n}" height="100%" preserveAspectRatio="none" viewBox="-120 -168 240 336" width="100%">
			<symbol id="${fg}${n}" viewBox="-500 -500 1000 1000" preserveAspectRatio="xMinYMid">
				<text text-anchor="middle" dominant-baseline="middle" x="0" y="0" fill="${fg}" style="font-size:1000px;font-weight:bold;">${n}</text>        
			</symbol>
			<symbol id="${info.E}" viewBox="-500 -500 1000 1000" preserveAspectRatio="xMinYMid">
				<text text-anchor="middle" dominant-baseline="middle" x="0" y="-150" fill="red" style="font-size:750px;font-family:${info.family};">${info.text}</text>        
			</symbol>
			<rect width="239" height="335" x="-119.5" y="-167.5" rx="12" ry="12" fill="white" stroke="black"></rect>
			<use xlink:href="#${fg}${n}" height="42" x="-118" y="-156"></use>
			<use xlink:href="#${info.E}" height="26.769" x="-111.784" y="-119"></use>
			<use xlink:href="#${info.E}" height="70" x="-87.501" y="-135.588"></use>
			<use xlink:href="#${info.E}" height="70" x="17.501" y="-135.588"></use>
			<use xlink:href="#${info.E}" height="70" x="-35" y="-35"></use>
			<g transform="rotate(180)">
				<use xlink:href="#${fg}${n}" height="42" x="-118" y="-156"></use>
				<use xlink:href="#${info.E}" height="26.769" x="-111.784" y="-119"></use>
				<use xlink:href="#${info.E}" height="70" x="-87.501" y="-135.588"></use>
				<use xlink:href="#${info.E}" height="70" x="17.501" y="-135.588"></use>
				</g>
		</svg>`,
		card6: `
		<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="card" 
		face="${info.E}${n}" height="100%" preserveAspectRatio="none" viewBox="-120 -168 240 336" width="100%">
			<symbol id="${fg}${n}" viewBox="-500 -500 1000 1000" preserveAspectRatio="xMinYMid">
				<text text-anchor="middle" dominant-baseline="middle" x="0" y="0" fill="${fg}" style="font-size:1000px;font-weight:bold;">${n}</text>        
			</symbol>
			<symbol id="${info.E}" viewBox="-500 -500 1000 1000" preserveAspectRatio="xMinYMid">
				<text text-anchor="middle" dominant-baseline="middle" x="0" y="-150" fill="red" style="font-size:750px;font-family:${info.family};">${info.text}</text>        
			</symbol>
			<rect width="239" height="335" x="-119.5" y="-167.5" rx="12" ry="12" fill="white" stroke="black"></rect>
			<use xlink:href="#${fg}${n}" height="42" x="-118" y="-156"></use>
			<use xlink:href="#${info.E}" height="26.769" x="-111.784" y="-119"></use>
			<use xlink:href="#${info.E}" height="70" x="-87.501" y="-135.588"></use>
			<use xlink:href="#${info.E}" height="70" x="17.501" y="-135.588"></use>
			<use xlink:href="#${info.E}" height="70" x="-87.501" y="-35"></use>
			<use xlink:href="#${info.E}" height="70" x="17.501" y="-35"></use>
				<g transform="rotate(180)">
				<use xlink:href="#${fg}${n}" height="42" x="-118" y="-156"></use>
				<use xlink:href="#${info.E}" height="26.769" x="-111.784" y="-119"></use>
				<use xlink:href="#${info.E}" height="70" x="-87.501" y="-135.588"></use>
				<use xlink:href="#${info.E}" height="70" x="17.501" y="-135.588"></use>
				</g>
		</svg>`,
		card7: `
		<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="card" 
		face="${info.E}${n}" height="100%" preserveAspectRatio="none" viewBox="-120 -168 240 336" width="100%">
			<symbol id="${fg}${n}" viewBox="-500 -500 1000 1000" preserveAspectRatio="xMinYMid">
				<text text-anchor="middle" dominant-baseline="middle" x="0" y="0" fill="${fg}" style="font-size:1000px;font-weight:bold;">${n}</text>        
			</symbol>
			<symbol id="${info.E}" viewBox="-500 -500 1000 1000" preserveAspectRatio="xMinYMid">
				<text text-anchor="middle" dominant-baseline="middle" x="0" y="-150" fill="red" style="font-size:750px;font-family:${info.family};">${info.text}</text>        
			</symbol>
			<rect width="239" height="335" x="-119.5" y="-167.5" rx="12" ry="12" fill="white" stroke="black"></rect>
			<use xlink:href="#${fg}${n}" height="42" x="-118" y="-156"></use>
			<use xlink:href="#${info.E}" height="26.769" x="-111.784" y="-119"></use>
			<use xlink:href="#${info.E}" height="70" x="-87.501" y="-135.588"></use>
			<use xlink:href="#${info.E}" height="70" x="17.501" y="-135.588"></use>
			<use xlink:href="#${info.E}" height="70" x="-87.501" y="-35"></use>
			<use xlink:href="#${info.E}" height="70" x="17.501" y="-35"></use>
			<use xlink:href="#${info.E}" height="70" x="-35" y="-85.294"></use>
				<g transform="rotate(180)">
				<use xlink:href="#${fg}${n}" height="42" x="-118" y="-156"></use>
				<use xlink:href="#${info.E}" height="26.769" x="-111.784" y="-119"></use>
				<use xlink:href="#${info.E}" height="70" x="-87.501" y="-135.588"></use>
				<use xlink:href="#${info.E}" height="70" x="17.501" y="-135.588"></use>
				</g>
		</svg>`,
		card8: `
		<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="card" 
		face="${info.E}${n}" height="100%" preserveAspectRatio="none" viewBox="-120 -168 240 336" width="100%">
			<symbol id="${fg}${n}" viewBox="-500 -500 1000 1000" preserveAspectRatio="xMinYMid">
				<text text-anchor="middle" dominant-baseline="middle" x="0" y="0" fill="${fg}" style="font-size:1000px;font-weight:bold;">${n}</text>        
			</symbol>
			<symbol id="${info.E}" viewBox="-500 -500 1000 1000" preserveAspectRatio="xMinYMid">
				<text text-anchor="middle" dominant-baseline="middle" x="0" y="-150" fill="red" style="font-size:750px;font-family:${info.family};">${info.text}</text>        
			</symbol>
			<rect width="239" height="335" x="-119.5" y="-167.5" rx="12" ry="12" fill="white" stroke="black"></rect>
			<use xlink:href="#${fg}${n}" height="42" x="-118" y="-156"></use>
			<use xlink:href="#${info.E}" height="26.769" x="-111.784" y="-119"></use>
			<use xlink:href="#${info.E}" height="70" x="-87.501" y="-135.588"></use>
			<use xlink:href="#${info.E}" height="70" x="17.501" y="-135.588"></use>
			<use xlink:href="#${info.E}" height="70" x="-87.501" y="-35"></use>
			<use xlink:href="#${info.E}" height="70" x="17.501" y="-35"></use>
			<use xlink:href="#${info.E}" height="70" x="-35" y="-85.294"></use>
				<g transform="rotate(180)">
				<use xlink:href="#${fg}${n}" height="42" x="-118" y="-156"></use>
				<use xlink:href="#${info.E}" height="26.769" x="-111.784" y="-119"></use>
				<use xlink:href="#${info.E}" height="70" x="-87.501" y="-135.588"></use>
				<use xlink:href="#${info.E}" height="70" x="17.501" y="-135.588"></use>
				<use xlink:href="#${info.E}" height="70" x="-35" y="-85.294"></use>
				</g>
		</svg>`,
		card9: `
		<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="card" 
		face="${info.E}${n}" height="100%" preserveAspectRatio="none" viewBox="-120 -168 240 336" width="100%">
			<symbol id="${fg}${n}" viewBox="-500 -500 1000 1000" preserveAspectRatio="xMinYMid">
				<text text-anchor="middle" dominant-baseline="middle" x="0" y="0" fill="${fg}" style="font-size:1000px;font-weight:bold;">${n}</text>        
			</symbol>
			<symbol id="${info.E}" viewBox="-500 -500 1000 1000" preserveAspectRatio="xMinYMid">
				<text text-anchor="middle" dominant-baseline="middle" x="0" y="-150" fill="red" style="font-size:750px;font-family:${info.family};">${info.text}</text>        
			</symbol>
			<rect width="239" height="335" x="-119.5" y="-167.5" rx="12" ry="12" fill="white" stroke="black"></rect>
			<use xlink:href="#${fg}${n}" height="42" x="-118" y="-156"></use>
			<use xlink:href="#${info.E}" height="26.769" x="-111.784" y="-119"></use>
			<use xlink:href="#${info.E}" height="70" x="-87.501" y="-135.588"></use>
			<use xlink:href="#${info.E}" height="70" x="17.501" y="-135.588"></use>
			<use xlink:href="#${info.E}" height="70" x="-87.501" y="-68.529"></use>
			<use xlink:href="#${info.E}" height="70" x="17.501" y="-68.529"></use>
			<use xlink:href="#${info.E}" height="70" x="-35" y="-42"></use>
				<g transform="rotate(180)">
				<use xlink:href="#${fg}${n}" height="42" x="-118" y="-156"></use>
				<use xlink:href="#${info.E}" height="26.769" x="-111.784" y="-119"></use>
				<use xlink:href="#${info.E}" height="70" x="-87.501" y="-135.588"></use>
				<use xlink:href="#${info.E}" height="70" x="17.501" y="-135.588"></use>
				<use xlink:href="#${info.E}" height="70" x="-87.501" y="-68.529"></use>
				<use xlink:href="#${info.E}" height="70" x="17.501" y="-68.529"></use>
				</g>
		</svg>`,
		cardT: `
		<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="card" 
		face="${info.E}${n}" height="100%" preserveAspectRatio="none" viewBox="-120 -168 240 336" width="100%">
			<symbol id="${fg}${n}" viewBox="-500 -500 1000 1000" preserveAspectRatio="xMinYMid">
				<text text-anchor="middle" dominant-baseline="middle" x="0" y="0" fill="${fg}" style="font-size:1000px;font-weight:bold;">${num}</text>        
			</symbol>
			<symbol id="${info.E}" viewBox="-500 -500 1000 1000" preserveAspectRatio="xMinYMid">
				<text text-anchor="middle" dominant-baseline="middle" x="0" y="-150" fill="red" style="font-size:750px;font-family:${info.family};">${info.text}</text>        
			</symbol>
			<rect width="239" height="335" x="-119.5" y="-167.5" rx="12" ry="12" fill="white" stroke="black"></rect>
			<use xlink:href="#${fg}${n}" height="42" x="-118" y="-156"></use>
			<use xlink:href="#${info.E}" height="26.769" x="-111.784" y="-119"></use>
			<use xlink:href="#${info.E}" height="70" x="-87.501" y="-135.588"></use>
			<use xlink:href="#${info.E}" height="70" x="17.501" y="-135.588"></use>
			<use xlink:href="#${info.E}" height="70" x="-87.501" y="-68.529"></use>
			<use xlink:href="#${info.E}" height="70" x="17.501" y="-68.529"></use>
			<use xlink:href="#${info.E}" height="70" x="-35" y="-102.058"></use>
			<g transform="rotate(180)">
				<use xlink:href="#${fg}${n}" height="42" x="-118" y="-156"></use>
				<use xlink:href="#${info.E}" height="26.769" x="-111.784" y="-119"></use>
				<use xlink:href="#${info.E}" height="70" x="-87.501" y="-135.588"></use>
				<use xlink:href="#${info.E}" height="70" x="17.501" y="-135.588"></use>
				<use xlink:href="#${info.E}" height="70" x="-87.501" y="-68.529"></use>
				<use xlink:href="#${info.E}" height="70" x="17.501" y="-68.529"></use>
				<use xlink:href="#${info.E}" height="70" x="-35" y="-102.058"></use>
				</g>
		</svg>`,
		cardE: `
		<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="card" 
		face="${info.E}${n}" height="100%" preserveAspectRatio="none" viewBox="-120 -168 240 336" width="100%">
			<symbol id="${fg}${n}" viewBox="-500 -500 1000 1000" preserveAspectRatio="xMinYMid">
				<text text-anchor="middle" dominant-baseline="middle" x="0" y="0" fill="${fg}" style="font-size:1000px;font-weight:bold;">${num}</text>        
			</symbol>
			<symbol id="${info.E}" viewBox="-500 -500 1000 1000" preserveAspectRatio="xMinYMid">
				<text text-anchor="middle" dominant-baseline="middle" x="0" y="-150" fill="red" style="font-size:750px;font-family:${info.family};">${info.text}</text>        
			</symbol>
			<rect width="239" height="335" x="-119.5" y="-167.5" rx="12" ry="12" fill="white" stroke="black"></rect>
			<use xlink:href="#${fg}${n}" height="42" x="-118" y="-156"></use>
			<use xlink:href="#${info.E}" height="26.769" x="-111.784" y="-119"></use>
			<use xlink:href="#${info.E}" height="70" x="-87.501" y="-135.588"></use>
			<use xlink:href="#${info.E}" height="70" x="17.501" y="-135.588"></use>
			<use xlink:href="#${info.E}" height="70" x="-87.501" y="-68.529"></use>
			<use xlink:href="#${info.E}" height="70" x="17.501" y="-68.529"></use>
			<use xlink:href="#${info.E}" height="70" x="-35" y="-102.058"></use>
			<use xlink:href="#${info.E}" height="70" x="-35" y="-35"></use>
			<g transform="rotate(180)">
				<use xlink:href="#${fg}${n}" height="42" x="-118" y="-156"></use>
				<use xlink:href="#${info.E}" height="26.769" x="-111.784" y="-119"></use>
				<use xlink:href="#${info.E}" height="70" x="-87.501" y="-135.588"></use>
				<use xlink:href="#${info.E}" height="70" x="17.501" y="-135.588"></use>
				<use xlink:href="#${info.E}" height="70" x="-87.501" y="-68.529"></use>
				<use xlink:href="#${info.E}" height="70" x="17.501" y="-68.529"></use>
				<use xlink:href="#${info.E}" height="70" x="-35" y="-102.058"></use>
				</g>
		</svg>`,
		cardE: `
		<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="card" 
		face="${info.E}${n}" height="100%" preserveAspectRatio="none" viewBox="-120 -168 240 336" width="100%">
			<symbol id="${fg}${n}" viewBox="-500 -500 1000 1000" preserveAspectRatio="xMinYMid">
				<text text-anchor="middle" dominant-baseline="middle" x="0" y="0" fill="${fg}" style="font-size:1000px;font-weight:bold;">${num}</text>        
			</symbol>
			<symbol id="${info.E}" viewBox="-500 -500 1000 1000" preserveAspectRatio="xMinYMid">
				<text text-anchor="middle" dominant-baseline="middle" x="0" y="-150" fill="red" style="font-size:750px;font-family:${info.family};">${info.text}</text>        
			</symbol>
			<rect width="239" height="335" x="-119.5" y="-167.5" rx="12" ry="12" fill="white" stroke="black"></rect>
			<use xlink:href="#${fg}${n}" height="42" x="-118" y="-156"></use>
			<use xlink:href="#${info.E}" height="26.769" x="-111.784" y="-119"></use>
			<use xlink:href="#${info.E}" height="60" x="-87.501" y="-135.588"></use>
			<use xlink:href="#${info.E}" height="60" x="17.501" y="-135.588"></use>
			<use xlink:href="#${info.E}" height="60" x="-87.501" y="-68.529"></use>
			<use xlink:href="#${info.E}" height="60" x="17.501" y="-68.529"></use>
			<use xlink:href="#${info.E}" height="60" x="-35" y="-102.058"></use>
			<use xlink:href="#${info.E}" height="60" x="-35" y="-35"></use>
			<g transform="rotate(180)">
				<use xlink:href="#${fg}${n}" height="42" x="-118" y="-156"></use>
				<use xlink:href="#${info.E}" height="26.769" x="-111.784" y="-119"></use>
				<use xlink:href="#${info.E}" height="60" x="-87.501" y="-135.588"></use>
				<use xlink:href="#${info.E}" height="60" x="17.501" y="-135.588"></use>
				<use xlink:href="#${info.E}" height="60" x="-87.501" y="-68.529"></use>
				<use xlink:href="#${info.E}" height="60" x="17.501" y="-68.529"></use>
				<use xlink:href="#${info.E}" height="60" x="-35" y="-102.058"></use>
				</g>
		</svg>`,
		card0: `
			<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="card" 
			face="${info.E}${n}" height="100%" preserveAspectRatio="none" viewBox="-120 -168 240 336" width="100%">
				<symbol id="${fg}${n}" viewBox="-500 -500 1000 1000" preserveAspectRatio="xMinYMid">
					<text text-anchor="middle" dominant-baseline="middle" x="0" y="0" fill="${fg}" style="font-size:1000px;font-weight:bold;">${n}</text>        
				</symbol>
				<symbol id="${info.E}" viewBox="-500 -500 1000 1000" preserveAspectRatio="xMinYMid">
					<text text-anchor="middle" dominant-baseline="middle" x="0" y="-150" fill="red" style="font-size:750px;font-family:${info.family};">${info.text}</text>        
				</symbol>
				<rect width="239" height="335" x="-119.5" y="-167.5" rx="12" ry="12" fill="white" stroke="black"></rect>
				<use xlink:href="#${fg}${n}" height="42" x="-118" y="-156"></use>
				<use xlink:href="#${info.E}" height="26.769" x="-111.784" y="-119"></use>
				<use xlink:href="#${info.E}" height="70" x="-35" y="-135.588"></use>
				<g transform="rotate(180)">
					<use xlink:href="#${fg}${n}" height="42" x="-118" y="-156"></use>
					<use xlink:href="#${info.E}" height="26.769" x="-111.784" y="-119"></use>
					<use xlink:href="#${info.E}" height="70" x="-35" y="-135.588"></use>
				</g>
			</svg>`,
		card52: `
			<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="card" 
			face="2C" height="100%" preserveAspectRatio="none" viewBox="-120 -168 240 336" width="100%">
				<symbol id="${fg}${n}" viewBox="-500 -500 1000 1000" preserveAspectRatio="xMinYMid">
					<text text-anchor="middle" dominant-baseline="middle" x="0" y="0" fill="${fg}" style="font-size:1000px;font-family:opensans;">${n}</text>        
				</symbol>
				<symbol id="${info.E}" viewBox="-500 -500 1000 1000" preserveAspectRatio="xMinYMid">
					<text text-anchor="middle" dominant-baseline="middle" x="0" y="50" fill="${fg}" style="font-size:800px;font-family:${info.family};">${info.text}</text>        
				</symbol>
				<rect width="239" height="335" x="-119.5" y="-167.5" rx="12" ry="12" fill="white" stroke="black"></rect>
				<use xlink:href="#${fg}${n}" height="40" x="-116.4" y="-156"></use>
				<use xlink:href="#${info.E}" height="26.769" x="-111.784" y="-119"></use>
				<use xlink:href="#${info.E}" height="70" x="-35" y="-135.588"></use>
				<g transform="rotate(180)">
					<use xlink:href="#${fg}${n}" height="40" x="-116.4" y="-156"></use>
					<use xlink:href="#${info.E}" height="26.769" x="-111.784" y="-119"></use>
					<use xlink:href="#${info.E}" height="70" x="-35" y="-135.588"></use>
				</g>
			</svg>`,
	};
	let svgCode = basic[cardKey];
	svgCode = '<div>' + svgCode + '</div>';
	let el = mCreateFrom(svgCode);
	if (nundef(w)) w = h * .7;
	if (isdef(h) || isdef(w)) { mSize(el, w, h); }
	return { key: getUID(), div: el, w: w, h: h, faceUp: true, key: cardKey, num: num };
}
function cardGetSpecial(sym = 'bee', h = 110, n = 2, fg = 'indigo', w) {
	let info = Syms[sym];
	ensureColorNames();
	if (nundef(fg)) fg = sym == 'spades' || sym == 'clubs' ? 'black' : sym == 'hearts' || sym == 'diamonds' ? 'red' : chooseRandom(Object.keys(ColorNames));

	let di = { 10: 'T', 11: 'E', 12: 't', 13: 'H', 14: 'F', 15: 'f', 16: 'S', 17: 's', 18: 'e', 19: 'N', 20: 'W' };
	let num = n;
	n = valf(di[n], n);

	let cardKey = info.family == 'emoNoto' ? `card${n}` : 'card52';

	let ssv = `
		<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="card" 
		face="${info.E}${n}" height="100%" preserveAspectRatio="none" viewBox="-120 -168 240 336" width="100%">
			<symbol id="${fg}${n}" viewBox="-500 -500 1000 1000" preserveAspectRatio="xMinYMid">
				<text text-anchor="middle" dominant-baseline="middle" x="0" y="0" fill="${fg}" style="font-size:1000px;font-weight:bold;">${num}</text>        
			</symbol>
			<symbol id="${info.E}" viewBox="-500 -500 1000 1000" preserveAspectRatio="xMinYMid">
				<text text-anchor="middle" dominant-baseline="middle" x="0" y="-150" fill="red" style="font-size:750px;font-family:${info.family};">${info.text}</text>        
			</symbol>
			<rect width="239" height="335" x="-119.5" y="-167.5" rx="12" ry="12" fill="white" stroke="black"></rect>
			<use xlink:href="#${fg}${n}" height="42" x="-118" y="-156"></use>
			<use xlink:href="#${info.E}" height="26.769" x="-111.784" y="-119"></use>`;
	//upper symbols
	//calc top
	//2-12 soll 70 sein
	//12-22 soll 60 sein
	//22-32 soll 52 sein...
	//roughly soll es
	let [top, bot, le, mi, ri, hsym, tot] = [-135, -35, -87.5, -35, 17.5, 70, 100];
	if (isNumber(num) && num > 12 && num <= 20) {
		let dd = Math.ceil(num / 12);
		hsym -= hsym * .1 * dd;
	}

	let dicols = { 1: '010', 2: '020', 3: '030', 4: '202', 5: '212' };
	let cols, d = 0, pl = 0;
	if (num > 5) {
		let l = num - 6;
		pl = Math.floor(l / 3);
		let nleft = 3 + pl;
		let m = num % 3 + pl;
		cols = `${nleft}${m}${nleft}`;
		//assertion((pl-1) >= 1,'DIV BY 0!!!!!')
		d = tot / (pl + 1); //pl<1>?tot:(tot / (pl - 1));
		//if (num>=9) d=tot/pl
		// lookupSet(coldi,[num],nleft)
		//coldi[`${num}`]=`${nleft}${m}${nleft}`;
		//console.log(num,cols[num]);//pl,nleft,m)
	} else cols = dicols[num];

	//jetzt hab ich fuer jedes das cols also das x
	//jetzt brauch ich noch die dist
	console.log('cols', num, cols, 'pl=' + pl, 'd=' + d);
	//figured out d
	//print:
	let aussen = Number(cols[0]);
	let obenaussen = Math.ceil(aussen / 2);
	let untenaussen = aussen - obenaussen;
	let y = 0;
	while (obenaussen > 0) {
		ssv += `<use xlink:href="#${info.E}" height="${hsym}" x="${le}" y="${top + y}"></use>`;
		ssv += `<use xlink:href="#${info.E}" height="${hsym}" x="${ri}" y="${top + y}"></use>`;
		obenaussen--;
		y += d;
	}

	let mitte = Number(cols[1]);
	let obenmitte = Math.ceil(mitte / 2);
	let untenmitte = mitte - obenmitte;
	y = d / 2;
	let omit1 = mitte % 2 && !(aussen % 2);
	if (omit1) obenmitte--;
	while (obenmitte > 0) {
		ssv += `<use xlink:href="#${info.E}" height="${hsym}" x="${mi}" y="${top + y}"></use>`;
		obenmitte--;
		y += d;
	}
	if (omit1) ssv += `<use xlink:href="#${info.E}" height="${hsym}" x="${mi}" y="${bot}"></use>`;

	ssv += `
		<g transform="rotate(180)">
		<use xlink:href="#${fg}${n}" height="42" x="-118" y="-156"></use><use xlink:href="#${info.E}" height="26.769" x="-111.784" y="-119"></use>`;
	// //lower syms
	y = 0;
	while (untenaussen > 0) {
		ssv += `<use xlink:href="#${info.E}" height="${hsym}" x="${le}" y="${top + y}"></use>`;
		ssv += `<use xlink:href="#${info.E}" height="${hsym}" x="${ri}" y="${top + y}"></use>`;
		untenaussen--;
		y += d;
	}
	y = d / 2;
	while (untenmitte > 0) {
		ssv += `<use xlink:href="#${info.E}" height="${hsym}" x="${mi}" y="${top + y}"></use>`;
		untenmitte--;
		y += d;
	}
	// //end
	ssv += `</g></svg>`;
	// ssv += `</svg>`;
	let svgCode = ssv;
	svgCode = '<div>' + svgCode + '</div>';
	let el = mCreateFrom(svgCode);
	if (nundef(w)) w = h * .7;
	if (isdef(h) || isdef(w)) { mSize(el, w, h); }
	return { key: getUID(), div: el, w: w, h: h, faceUp: true, key: cardKey, num: num };
}

//#endregion