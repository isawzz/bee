async function load_config_new() {      Config 
	= await route_path_yaml_dict('../y/config.yaml');
  let data          = await route_path_yaml_dict(
		'../y/appdata.yaml');  for (const k in data) //das ist echt lustig!!!!!!!!!!
	{    Config.apps[k].data = data[k];
    }
}
function _calculateSymbolPositions(cardWidth, cardHeight, symbolCount) {
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
	let omit1=mitte % 2 && !(aussen %2);
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


function __cardGetSpecial(sym = 'bee', h = 110, n = 2, fg = 'indigo', w) {
	let info = Syms[sym];
	n = 2;
	ensureColorNames();
	if (nundef(fg)) fg = sym == 'spades' || sym == 'clubs' ? 'black' : sym == 'hearts' || sym == 'diamonds' ? 'red' : chooseRandom(Object.keys(ColorNames));
	let cardKey = info.family == 'emoNoto' ? 'card0' : 'card52';
	let basic = {
		card0: `
			<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="card" 
			face="2C" height="100%" preserveAspectRatio="none" viewBox="-120 -168 240 336" width="100%">
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
	};
}


//#region source testing zeug: weg damit!!!!!!!!!!!!
async function loadCode() {
	if (TESTING && !CODE_VERSION) return;
	let url = TESTING && !USE_NON_TESTING_DATA ? TEST_PATH + GAME + '/code' + CODE_VERSION + '.js'
		: '/games/' + GAME + '/_rsg/' + GAME + VERSION + '.js';
	let loader = new ScriptLoader();
	await loader.load(SERVER + url);
	if (TESTING) userCodeC = await vidCache.load('userCode', async () => await route_path_asText_dict(url), true, false);
	else userCodeC = await vidCache.load('userCode', async () => await route_userCode(GAME, GAME + VERSION), !CACHE_CODE, CACHE_CODE);
	userCode = vidCache.asDict('userCode');
	let d = mBy('OLDCODE');
	if (d && SHOW_CODE) { d.innerHTML = '<pre>' + userCode.asText + '</pre>'; }
}
function loadCode_dep(text) {
	if (isdef(text)) text = text.trim();
	if (isEmpty(text)) {
		return;
	}
	var scriptTag = document.createElement("script");
	scriptTag.onload = () => console.log('code loaded.....');
	scriptTag.setAttribute("type", "text/javascript");
	scriptTag.innerHTML = text;
	document.getElementsByTagName("body")[0].appendChild(scriptTag);
}
function loadCode0(text, codeToRunWhenScriptLoaded = null, callback = null) {
	if (isdef(text)) text = text.trim();
	if (isEmpty(text)) {
		console.log('code is empty!!! no script loaded!');
		if (callback) callback();
		return;
	}
	var scriptTag = document.createElement("script");
	scriptTag.setAttribute("type", "text/javascript");
	scriptTag.text = callback ? [text, codeToRunWhenScriptLoaded].join('\n') : text;
	document.getElementsByTagName("body")[0].appendChild(scriptTag);
}
async function loadCorrectWords() {
	CorrectKeysByLanguage = { E: [], EB: [], D: [] };
	CorrectByKey = {};
	let speechZira = await loadYamlDict('/assets/speech/speechZira.yaml');
	for (const k in speechZira) {
		let e = lookup(speechZira, [k, 'E', 'zira']);
		if (e && e.correct) {
			let c = Math.round(e.conf * 100);
			lookupSet(CorrectByKey, [k, 'E'], { r: e.req, c: c });
			addIf(CorrectKeysByLanguage.E, k);
		}
	}
	let speechBritish = await loadYamlDict('/assets/speech/speechBritish.yaml');
	for (const k in speechBritish) {
		let e = lookup(speechBritish, [k, 'E', 'ukMale']);
		if (e && e.correct) {
			let c = Math.round(e.conf * 100);
			lookupSet(CorrectByKey, [k, 'EB'], { r: e.req, c: c });
			addIf(CorrectKeysByLanguage.EB, k);
		}
	}
	let speechDeutsch = await loadYamlDict('/assets/speech/speechDeutsch.yaml');
	for (const k in speechDeutsch) {
		let e = lookup(speechDeutsch, [k, 'D', 'deutsch']);
		if (e && e.correct) {
			let c = Math.round(e.conf * 100);
			lookupSet(CorrectByKey, [k, 'D'], { r: e.req, c: c });
			addIf(CorrectKeysByLanguage.D, k);
		}
	}
}
async function loadCorrectWords_dep() {
	CorrectWords = await loadYamlDict('/assets/correctWordsX.yaml');
	CorrectWordsCorrect = { E: {}, D: {} };
	CorrectWordsExact = { E: {}, D: {} };
	CorrectWordsFailed = { E: {}, D: {} };
	if (isdef(CorrectWords) && isdef(CorrectWords.data)) {
		for (const cwentry of CorrectWords.data) {
			let key = cwentry.key;
			for (const lang of ['E', 'D']) {
				let cw = cwentry[lang];
				if (cw.isCorrect) {
					if (cw.answer == cw.req && !(cw.danger == true)) CorrectWordsExact[lang][key] = cw;
					else CorrectWordsCorrect[lang][key] = cw;
				} else CorrectWordsFailed[lang][key] = cw;
			}
		}
	}
}
function loader_off() { let d = mBy('loader_holder'); if (isdef(d)) d.className = 'loader_off'; }
function loader_on() { let d = mBy('loader_holder'); if (isdef(d)) d.className = 'loader_on'; }
function loadExerciser(dParent, row, col) {
	loadPic('exercises', 100, 100, dParent, { row: row, col: col, scale: 1.5 }, 'gif');
}
function loadGame(id) {
	if (nundef(id)) id = localStorage.getItem('game');
	if (nundef(id)) id = Object.keys(DB.games)[0];
	G = lookup(DB, ['games', id]);
	G.color = getColorDictColor(G.color);
	G.id = Gamename = id;
	updateGamenameUi(id, G.color);
}
async function loadGameInfo(useAllGamesStub = true) {
	if (useAllGamesStub) {
		allGames = {
			ttt: {
				name: 'TicTacToe',
				long_name: 'Tic-Tac-Toe',
				short_name: 'ttt',
				num_players: [2],
				player_names: ['Player1', 'Player2'],
			},
			s1: {
				name: 's1',
				long_name: 's1',
				short_name: 's1',
				num_players: [2, 3, 4, 5],
				player_names: ['Player1', 'Player2', 'Player3', 'Player4', 'Player5'],
			},
			starter: {
				name: 'Starter',
				long_name: 'Starter',
				short_name: 'starter',
				num_players: [2],
				player_names: ['Player1', 'Player2'],
			},
			catan: {
				name: 'Catan',
				long_name: 'The Settlers of Catan',
				short_name: 'catan',
				num_players: [3, 4],
				player_names: ['White', 'Red', 'Blue', 'Orange'],
			},
			aristocracy: {
				name: 'Aristocracy',
				long_name: 'Aristocracy',
				short_name: 'aristocracy',
				num_players: [2, 3, 4, 5],
				player_names: ['Player1', 'Player2', 'Player3', 'Player4', 'Player5'],
			}
		};
	} else {
		allGamesC = await vidCache.load('allGames', route_allGames);
		allGames = vidCache.asDict('allGames');
	}
	playerConfig = stubPlayerConfig(allGames);
}
async function loadGerman(justNouns = false) {
	let root = justNouns ? 'Nouns' : 'Dict';
	let ed = await route_path_yaml_dict('../assets/speech/ed' + root + '.yaml');
	let de = await route_path_yaml_dict('../assets/speech/de' + root + '.yaml');
	return [ed, de];
}
function loadHistoryExp() {
	let hist = localStorage.getItem('history');
	if (isdef(hist)) {
		HistoryOfStates = JSON.parse(hist);
		console.log('history loaded successfully...', HistoryOfStates);
	} else {
		console.log('no history found!!!');
	}
}
async function loadIcon_dep(key) {
	if (!iconChars) iconChars = await route_iconChars();
	return iconChars[key];
}
async function loadGerman(justNouns = false) {
	let root = justNouns ? 'Nouns' : 'Dict';
	let ed = await route_path_yaml_dict('../assets/speech/ed' + root + '.yaml');
	let de = await route_path_yaml_dict('../assets/speech/de' + root + '.yaml');
	return [ed, de];
}
function loadHistoryExp() {
	let hist = localStorage.getItem('history');
	if (isdef(hist)) {
		HistoryOfStates = JSON.parse(hist);
		console.log('history loaded successfully...', HistoryOfStates);
	} else {
		console.log('no history found!!!');
	}
}
function loadIconChars(callbacks = []) {
	loadYML('/frontend/static/rsg/assets/gameIconCodes.yml', dga => {
		gaChars = dga;
		loadYML('/frontend/static/rsg/assets/faIconCodes.yml', dfa => {
			faChars = dfa;
			iconChars = {};
			faKeys = [];
			for (const k in faChars) {
				iconChars[k] = faChars[k];
			}
			for (const k in gaChars) {
				if (isdef(faChars[k])) faKeys.push(k);
				iconChars[k] = gaChars[k];
			}
			timit.showTime('loaded icons codes')
			if (!isEmpty(callbacks)) callbacks[0](arrFromIndex(callbacks, 1));
		});
	});
}
function loadIcons(callback) {
	let faChars, gaChars;
	loadYML('/_lib/assets/icons/gameIconCodes.yml', dga => {
		gaChars = dga;
		loadYML('/_lib/assets/icons/faIconCodes.yml', dfa => {
			faChars = dfa;
			iconChars = {};
			for (const k in faChars) {
				iconChars[k] = faChars[k];
			}
			for (const k in gaChars) {
				iconChars[k] = gaChars[k];
			}
			timit.showTime('loaded icons codes');
			callback();
		});
	});
}
function mDropImage(e, img) {
	var dt = e.dataTransfer;
	console.log('dropped', dt)
	var files = dt.files;
	if (files.length) {
		let imgFile = files[0];
		var reader = new FileReader();
		reader.onload = function (e) {
			img.src = e.target.result;
			imgFile.data = e.target.result;
		}
		reader.readAsDataURL(imgFile);
	} else {
		console.log('dropped on', e.target, 'img', img);
		clearElement(img);
		var html = dt.getData('text/html');
		console.log('__________dataTransfer', html);
		let match = html && /\bsrc="?([^"\s]+)"?\s*/.exec(html);
		let url = match && match[1];
		if (url) {
			console.log('JA!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
			img.onerror = function () {
				alert("Error in uploading");
			}
			img.crossOrigin = "";
			img.src = url;
		}
	}
}
function mMenu(dParent, styles) {
	let menuStyles = isdef(styles) ? styles : { bg: wblack, alpha: .65 };
	let dMenu = mDiv(dParent, menuStyles);
	let s = "noch einer!!!```";
	let x = `hallo \'weired\'`;
	return dMenu;
}












function mMenuLine(dParent, styles) {
	let menuStyles = isdef(styles) ? styles : { bg: wblack, alpha: .65 };
	let dMenu = mDiv(dParent, menuStyles);
	let s = "hallo 'das' ist \"ein\" `langer` string!!!"
	return dMenu;
}
function parseComplexStyleProperty(str) {
	var regex = /(\w+)\((.+?)\)/g,
		transform = {},
		match;
	while (match = regex.exec(str))
		transform[match[1]] = match[2];
	return transform;
}
//#endregion







