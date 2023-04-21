
async function start() {
	test_ui_extended();
	let x=await load_Codebase('../base/codebase','../allcode.js');
	console.log('CODE',x)
	//await load_assets_fetch('../base/', '../games/')
	//let [bundle, closure, csstext, html] = await bundleGenFromProject('game', false);
	// AU.ta.value = closure; 
}
