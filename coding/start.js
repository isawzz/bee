
async function start() {
	initCodingUI();

	//#region tests

	// let text=await intersectAnimeAndAllfuncs();
	// let [g, text, old] = await codebaseExtendFromProject('hltest');
	let [text, css] = await closureFromProject('pico0');

	// let csstext = await cssbaseExtend('coding');
	// let csstext = await cssSelectFrom('../base/alibs/transition.css',['keyframes']);
	// let csstext = await cssSelectFrom('../base/alibs/bs4/bootstrap.css',['class']);
	// let csstext = await cssSelectFrom('../base/alibs/w3.css',['root','class','keyframes']);
	//downloadAsText(text, 'closure', 'js');
	//downloadAsText(css, 'final', 'css');
	//#endregion
	AU.ta.value = text; //css; //'hallo, na ENDLICH!!!!!!!!!!';

}

async function extractKeywords(path,trimmedlines=false) {
	let text = await route_path_text(path);
	let lines = text.split('\n');
	// console.log('lines',lines);
	let kws = [];
	for (const line of lines) {
		let l=trimmedlines?line.trim():line;
		if (l.startsWith('function')) kws.push(ithWord(l, 1, true));
		if (l.startsWith('async')) kws.push(ithWord(l, 2, true));
		if (l.startsWith('const')) kws.push(ithWord(l, 1, true));
		if (l.startsWith('var')) kws.push(ithWord(l, 1, true));
		if (l.startsWith('class')) kws.push(ithWord(l, 1, true));
	}
	return kws;
}
async function intersectAnimeAndAllfuncs(){
	let kws = await extractKeywords('../animex/anime.js',true);
	console.log('kws',kws); //return;
	let kws1 = await extractKeywords('../allf.js');
	let inter = intersection(kws, kws1);
	console.log('keywords', inter);
	text=inter.join()
	return text
}



















