
function outputCode(demoCode, demoTitle, demoDecription, demoColorClass) {
	//console.log('selected', animeSelectedId)
	//var js = document.createTextNode(parseJS(demoCode));
	demoInfoEl.classList.remove(demoInfoEl.classList[2]);
	demoInfoEl.classList.add(demoColorClass);
	descriptionEl.innerHTML = demoDecription;
	descriptionEl.appendChild(createTextarea(demoCode)); //parseJS(demoCode)));
	// descriptionEl.appendChild(createCodePreview(js));
	descriptionTitleEl.innerHTML = demoTitle;
	//codeEls = descriptionEl.querySelectorAll('code');
	//for (var i = 0; i < codeEls.length; i++) { hljs.highlightBlock(codeEls[i]); }
}

function createTextarea(js) {
	var previewEl = document.createElement('div');
	var ta = document.createElement('textarea');
	let button = document.createElement('button');
	previewEl.appendChild(button);
	previewEl.appendChild(ta);
	// console.log('code', js, typeof js);
	let numlines = stringCount(js, '\n'); // console.log('code has', numlines, 'lines');
	ta.value = js;
	ta.rows = numlines + 1;
	mStyle(ta, { padding: 10, w: '100%', rounding: 4, outline: 'none' }); //	ta.style.width = '100%';

	button.innerHTML = 'rerun';
	button.onclick = () => ademoRerun(ta.value);
	mStyle(button, { mabottom: 10, hpadding: 10, vpadding: 4, cursor: 'pointer', w: 120, bg: GREEN, rounding: 4, outline: 'none' }); //	ta.style.width = '100%';	//button.style = 'padding:4px 10px;margin-bottom:4px';

	return previewEl;

	var codeEl = document.createElement('code');
	previewEl.classList.add('code-preview');
	previewEl.innerHTML = '<h2>Code example</h2>';
	codeEl.appendChild(code);
	preEl.appendChild(codeEl);
	previewEl.appendChild(preEl);
	return previewEl;

}









