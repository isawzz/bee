
async function start() {
	initCodingUI();

	// let [g, f, old] = await codebaseExtendFromProject('coding');
	// let csstext = await cssbaseExtend('coding');
	// let csstext = await cssSelectFrom('../base/alibs/transition.css',['keyframes']);
	// let csstext = await cssSelectFrom('../base/alibs/bs4/bootstrap.css',['class']);
	// let csstext = await cssSelectFrom('../base/alibs/w3.css',['root','class','keyframes']);
	let [text, css] = await closureFromProject('nature');
	//downloadAsText(text, 'closure', 'js');
	//downloadAsText(css, 'final', 'css');
	AU.ta.value = text; //css; //'hallo, na ENDLICH!!!!!!!!!!';

}




















