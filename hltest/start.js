
async function start() {
	let d = mBy('code1');
	let html = `
	function stringCount(s, sSub, caseInsensitive = true) {
		let temp = "Welcome to W3Docs";
		let m = new RegExp(sSub, 'g' + (caseInsensitive ? 'i' : ''));
		let count = (s.match(m)).length;
		return count;
	}
	`;
	html=replaceAllSpecialChars(html,'\t','  '); //+'\n\n';
	d.innerHTML = html; 

	d = mBy('code2');
	html = `
	<svg height="210" width="400">
		<path d="M150 0 L75 200 L225 200 Z" />
	</svg>	
	`;
	html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
	// html = html_beautify(html, {
	// 	'indent_inner_html': false,
	// 	'indent_size': 4,
	// 	'indent_char': ' ',
	// 	'wrap_line_length': 78,
	// 	'brace_style': 'expand',
	// 	'preserve_newlines': true,
	// 	'max_preserve_newlines': 5,
	// 	'indent_handlebars': false,
	// 	'extra_liners': ['/html']
	// });
	html = replaceAllSpecialChars(html, '\t', '  ');// + '\n\n';
	d.innerHTML = html;

	d = mBy('code3');
	html = `
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
	html = replaceAllSpecialChars(html, '\t', '  ');// + '\n\n';
	d.innerHTML = html;



	codeEls = document.querySelectorAll('code');
	for (var i = 0; i < codeEls.length; i++) {
		//hljs.highlightBlock(codeEls[i]);
		let x = codeEls[i];
		hljs.highlightElement(x);
		mClass(x, 'myfont');

	}


	// hljs.highlightAll();
}















