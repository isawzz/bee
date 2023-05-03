function createDemo(el) {
	var demo = {};
	var demoColorClass = el.parentNode.classList[0];
	var scriptEl = el.querySelector('script');
	var demoContentEl = el.querySelector('.demo-content');
	var descriptionContentEl = el.querySelector('.demo-description');
	var demoTitle = el.querySelector('h3').innerHTML;
	var id = el.id;
	var demoAnim = window[id];
	var demoCode = scriptEl ? scriptEl.innerHTML : '';
	//console.log('el',el)
	//console.log('demoCode',demoCode);
	var demoDescription = descriptionContentEl ? descriptionContentEl.innerHTML : '';
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
		highlight: highlightDemo
	}
}
