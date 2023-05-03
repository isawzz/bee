
function ademoTrigger(ev) {
	let id = evToId(ev);
	console.log('clicked id', id);
	let demo = getDemoById(id);
	console.log('demo', demo)
	let [canRestart, isNew, ulEl] = demo.highlight();
	if (isNew) {
		let [demoCode, demoTitle, demoDecription, demoColorClass] = [demo.demoCode,demo.demoTitle,demo.demoDescription,demo.demoColorClass];
		outputCode(demoCode, demoTitle, demoDescription, demoColorClass);
		scrollTo('#' + id, 60, function () { toggleSectionLink(ulEl); if (canRestart) demo.restart(); });

	} else if (canRestart) demo.restart();

}



function outputCode(demoCode, demoTitle, demoDecription, demoColorClass, id) {
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



