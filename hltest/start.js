
async function start(){
	let d=mBy('code1');
	d.innerHTML = `
	function stringCount(s, sSub, caseInsensitive = true) {
		let temp = "Welcome to W3Docs";
		let m = new RegExp(sSub, 'g' + (caseInsensitive ? 'i' : ''));
		let count = (s.match(m)).length;
		return count;
	}
		
	`;
	d=mBy('code2');
	let html = `
	<svg height="210" width="400">
		<path d="M150 0 L75 200 L225 200 Z" />
	</svg>	`;
	html=html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
	d.innerHTML = html; 

	d=mBy('code3');
	d.innerHTML = `
	body {
		margin: 0;
		padding: 0;
		font-family: opensans;
	}
	html {
		margin: 0;
		padding: 0;
	}
	.a {
		text-decoration: none;
		padding: 1rem;
		color: inherit;
	}
	.a:hover {
		color: white;
	}
		`;



	codeEls = document.querySelectorAll('code');
	for (var i = 0; i < codeEls.length; i++) {
		//hljs.highlightBlock(codeEls[i]);
		let x=codeEls[i];
		hljs.highlightElement(x);
		mClass(x,'myfont');

	}


	// hljs.highlightAll();
}















