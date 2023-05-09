
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
	html = replaceAllSpecialChars(html, '\t', '  '); //+'\n\n';
	d.innerHTML = html;

	d = mBy('code2');
	html = `
	<svg height="210" width="400">
		<path d="M150 0 L75 200 L225 200 Z" />
	</svg>	
	`;
	html = formathtml(html) + '\n';
	html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
	// html = replaceAllSpecialChars(html, '\t', '  ');// + '\n\n';
	d.innerHTML = html;
	d.style.paddingLeft = '22px'

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


function formathtml(code, stripWhiteSpaces = true, stripEmptyLines = true, whitespace = '  ', maxlen = 60) {
	if (whitespace === undefined) whitespace = ' '.repeat(2); // Default indenting 2 whitespaces
	if (maxlen === undefined) maxlen = 80; // Default max line length

	function acollect(qlines, i) {
		let o = qlines[i];
		let level = o.level;
		let indent = level > 0 ? whitespace.repeat(level - 1) : '';
		let res = indent + o.lt;

		while (++i < qlines.length && qlines[i].level > level) {
			res += qlines[i].lt;
		}

		if (i < qlines.length && qlines[i].level == level && !qlines[i].isStart) {
			res += qlines[i].lt;
			i++;
		}

		// console.log('res', res)
		return [res, i];

	}

	code = stripHtmlComments(code);
	code = replaceAllSpecialChars(code, '\t', whitespace);

	var currentIndent = 0;
	var ch, chNext, chPrev;

	var result = '';
	for (var i = 0; i <= code.length; i++) {
		ch = code.substr(i, 1);
		chNext = code.substr(i + 1, 1);
		chPrev = code.substr(i - 1, 1);

		if (ch === '<' && chNext !== '/') {
			result += '\n' + whitespace.repeat(currentIndent);
			numch = currentIndent;
			currentIndent++;
		} else if (ch === '<' && chNext === '/') {
			// If there're more closing tags than opening
			if (--currentIndent < 0) currentIndent = 0;
			result += '\n' + whitespace.repeat(currentIndent);
		} else if (ch === '>' && chPrev === '/') {
			if (--currentIndent < 0) currentIndent = 0;
		} else if (stripWhiteSpaces === true && ch === ' ' && chNext === ' ') {
			ch = '';
		} else if (stripEmptyLines === true && ch === '\n') {
			if (code.substr(i, code.substr(i).indexOf("<")).trim() === '') ch = '';
		}
		result += ch;
	}

	//bring to maxlinelength
	let lines = result.split('\n');
	let level = 0, qlines = [];
	i = 0;
	while (i < lines.length) {
		let l = lines[i];
		let lt = l.trim();
		let lrev = lt.split("").reverse().join(""); //console.log('reverse',lrev);
		let isStart = lt[0] == '<' && lt[1] != '/';
		let isEnd = lt[0] == '<' && lt[1] == '/' || lrev[0] == '>' && lrev[1] == '/';

		if (isStart) level++;

		// console.log('line', level, l)
		qlines.push({ l: l, level: level, isStart: isStart, isEnd: isEnd, lt: lt, len: l.length });


		if (isEnd) level--;

		i++;
	}
	let akku = '';
	i = 0;
	while (i < qlines.length) {
		let [aknew, inew] = acollect(qlines, i);
		if (aknew.length <= maxlen) {
			assertion(inew > i, 'ERROR inew!!!!!!!!!!')
			akku += aknew; i = inew;
		} else {
			akku += qlines[i].l;
			i++;
		}
		akku += '\n';
	}
	return akku;
}

function stripHtmlComments(code) {
	while (code.includes('<!--')) {
		code = stringBefore(code, '<!--') + stringAfter(code, '-->');
	}
	return code;
}
















