
async function start() {
	test_ui_extended();
	//await load_Codebase('../basejs/cb1');
	//await load_assets_fetch('../base/', '../games/')
	let [bundle, closure, csstext, html] = await bundleGenFromProject('game', false);
	AU.ta.value = closure; 
}
