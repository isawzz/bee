
async function start() {
	let d1 = mBy('code1');
	let d2 = mBy('code2');
	//testjs();

	//mStyle(d1,{bg:'#333'})

	let html = `<div  > <pre><code id="code1" class="js" /></pre><pre><code id="code2" class="html"></code></pre></div>`;

	let html1 = formathtml(html, true, true);
	html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");

	d1.innerHTML = html;

	html1 = replaceAllSpecialChars(html1, ' >', '>')
	html1 = html1.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
	d2.innerHTML = html1;


}
function testhtml() {

}
function testjs(d1, d2) {
	let js = `
	// This is just a sample script. Paste your real code (javascript or HTML) here.

	if ('this_is'==/an_example/){of_beautifier();}else{var a=b?(c%d):e[f];}	`;

	d1.innerHTML = js;
	js = js_beautify(js);
	d2.innerHTML = js;
}

function formathtml(code, stripWhiteSpaces, stripEmptyLines, whitespace, maxlen) {
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
	i=0;
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














function smallestAkku(qlines, istart) {
	let o = qlines[istart];
	let o2 = qlines[istart];
	let akku = '';
	let level = o.level;
	i++;
	let o1 = qlines[i];
	let level1 = o1.level;
	if (level1 < level) return i - 1;
	else if (level1 == level) return i;
	else return smallestAkku(qlines, i + 1) + 1;
}




















