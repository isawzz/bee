function ademoTrigger(ev) {
	let id = evToId(ev);
	console.log('clicked id', id);
	let demo = getDemoById(id);
	console.log('demo', demo)
	let [canRestart, isNew, ulEl] = demo.highlight();
	if (isNew) {
		let [demoCode, demoTitle, demoDescription, demoColorClass] = [demo.demoCode,demo.demoTitle,demo.demoDescription,demo.demoColorClass];
		outputCode(demoCode, demoTitle, demoDescription, demoColorClass);
		scrollTo('#' + id, 60, function () { toggleSectionLink(ulEl); if (canRestart) demo.restart(); });

	} else if (canRestart) demo.restart();

}
function _outputCode(demoCode, demoTitle, demoDecription, demoColorClass, id) {
	console.log('id', id);

	var js = document.createTextNode(parseJS(demoCode));
	demoInfoEl.classList.remove(demoInfoEl.classList[2]);
	demoInfoEl.classList.add(demoColorClass);
	descriptionEl.innerHTML = demoDecription;
	descriptionEl.appendChild(createCodePreview(js));
	descriptionTitleEl.innerHTML = demoTitle;
	codeEls = descriptionEl.querySelectorAll('code');
	for (var i = 0; i < codeEls.length; i++) {
		hljs.highlightBlock(codeEls[i]);
	}

	let ta = document.createElement('textarea');
	ta.style = "width:100%;height:500px;padding:10px;outline:none";//	ta.row=10;ta.cols=60;
	let code = demoCode.substring(demoCode.indexOf('/*DEMO*/') + 8);
	code = code.substring(0, code.indexOf('/*DEMO*/'))
	ta.value = code;

	let button = document.createElement('button');
	button.innerHTML = 'rerun';
	button.onclick = () => ademoRerun(ta.value);
	button.style = 'padding:4px 10px;margin-bottom:4px';
	descriptionEl.appendChild(button);
	descriptionEl.appendChild(ta);

}
function _createDemo(el) {
	var demo = {};
	var demoColorClass = el.parentNode.classList[0];
	var scriptEl = el.querySelector('script');
	var demoContentEl = el.querySelector('.demo-content');
	var descriptionContentEl = el.querySelector('.demo-description');
	var demoTitle = el.querySelector('h3').innerHTML;
	var id = el.id;
	var demoAnim = window[id];
	var demoCode = scriptEl ? scriptEl.innerHTML : '';
	var demoDescription = descriptionContentEl ? descriptionContentEl.innerHTML : '';
	console.log('description',demoDescription);
	function restart() {
		ademoRerun(getDemoById(id).demoCode);
		// resetDemo();
		// demoAnim();
	}
	function highlightDemo(e, push) {
		var canRestart = !el.classList.contains('controls');
		if (e) {
			e.preventDefault();
			if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') {
				canRestart = false;
			}
		}
		let isNew = !el.classList.contains('active')
		if (isNew) {
			resetDemos();
			var linkEls = document.querySelectorAll('.demo-link');
			for (var i = 0; i < demos.length; i++) {
				var d = demos[i];
				d.el.classList.remove('active');
				linkEls[i].parentNode.classList.remove('active');
				//d.anim.pause();
			}
			// outputCode(demoCode, demoTitle, demoDescription, demoColorClass);
			var linkEl = document.querySelector('a[href="#' + id + '"]');
			var ulEl = linkEl.parentNode.parentNode;
			linkEl.parentNode.classList.add('active');
			el.classList.add('active');
			// scrollTo('#' + id, 60, function () { toggleSectionLink(ulEl); if (canRestart) restart(); });
		}
		return [canRestart, isNew, ulEl];
	}
	el.addEventListener('click', function (e) {
		ademoTrigger(e); //highlightDemo(e, true);
	});
	resetDemos();
	return {
		id: id,
		el: el,
		demoCode: demoCode,
		demoTitle: demoTitle,
		demoDescription: demoDescription,
		demoColorClass: demoColorClass,
		anim: demoAnim,
		title: demoTitle,
		highlight: highlightDemo,
		restart: restart
	}
}
