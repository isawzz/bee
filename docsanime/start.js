onload = start;

function start() {

	var fragment = document.createDocumentFragment();

	for (var i = 0; i < articleEls.length; i++) {
		var articleEl = articleEls[i];
		var linksSectionEl = createLinksSection(articleEl);
		var demoEls = articleEl.querySelectorAll('.demo');
		for (var d = 0; d < demoEls.length; d++) {
			var demo = createDemo(demoEls[d]);
			var demoLinkEl = createDemoLink(demo);
			linksSectionEl.appendChild(demoLinkEl);
			demos.push(demo);
		}
		fragment.appendChild(linksSectionEl);
	}
	//console.log('demos', demos[0])
	navigationEl.appendChild(fragment);

	// Init
	updateDemos();
	window.onhashchange = updateDemos;
	document.onkeydown = keyboardNavigation;


}

function ademoRerun(code){
	DA[animeSelectedId]=code;
	resetDemos();
	resetDemo();
	eval(code);
}
function ademoUpdateVersion() {

	// Update date and version number

	var versionNumerEls = document.querySelectorAll('.version-number');
	var dateEl = document.querySelector('.date');
	var date = new Date();

	for (var i = 0; i < versionNumerEls.length; i++) {
		versionNumerEls[i].innerHTML = anime.version;
	}




}

