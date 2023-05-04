
function outputCode(demoCode, demoTitle, demoDecription, demoColorClass) {
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
}










