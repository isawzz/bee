onload = start;

async function prestart() {
	// let d = document.body; mClass(d, 'airport');
	await load_syms();
}
prestart();
async function start() {
	//let dm = mDiv(dTable, { family: 'emoNoto', fz: 30 }, null, Syms.monkey.text);
	// let dm = mDiv(dTable);
	// dm.innerHTML = `<pre class="battery-log">{"charged":"100%","cycles":130}</pre>`;
	var logEl = document.querySelector('.battery-log');
	console.log('logEl',logEl)

	var battery = {
		charged: '0%',
		cycles: 120
	}

	anime({
		targets: battery,
		charged: '100%',
		cycles: 130,
		round: 1,
		easing: 'linear',
		update: function () {
			logEl.innerHTML = JSON.stringify(battery);
		}
	});
	// anime({ targets: [dm], translateX: 270 });
	//anime(dm,1000,()=>console.log('done!'));
}
function rest() {
	dTable = mDiv('dTable');
	console.log('dTable', dTable)
	let d = miPic('monkey', dTable);
	//await testPuppet('dHeader', 'monkey'); 
}
function testNatureAnimations() {
	FR = 25;
	G = null;

	let menulist = ['tree', 'lsys']; //, 'flower', 'spaceco', 'fractal'];
	dToolbar = mToolbar(menulist, onclick_menu_item, 'dToolbar', { padding: 10, display: 'flex', gap: 10, bg: 'orange' });
	mButton('clear', G_clear, dToolbar, { position: 'absolute', right: 10 });

	dTable = mSection({ bg: '#ddd', vpadding: 10, hmin: 400, w: '100vw' }, 'dTable');
	mCenterFlex(dTable);

	onclick_menu_item('lsys');
}

async function testPuppet(dParent, key) {
	//dParent = toElem(dParent); 
	dParent = mSection({ padding: 10, position: 'relative' }, dParent, 'Hello!', 'h1');
	//mPuppet(key, dHeader, { position: 'absolute', top: 6 }, 100);

	let dPuppet = miPic(key, dParent, { position: 'absolute', top: 6 });
	//aFlip(dPuppet, 1200);

}
















