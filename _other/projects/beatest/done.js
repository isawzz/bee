


function arrFlatten(arr) {
	if (!Array.isArray(arr)) return arr;
	let res = [];
	for (let i = 0; i < arr.length; i++) {
		let el = arr[i];
		if (Array.isArray(el)) {
			let f = arrFlatten(el);
			f.map(x => res.push(x));
		} else res.push(el);
	}
	return res;
}

function consume(code, idx, s) {
	for (let i = 0; i < s.length; i++) { if (code[idx + i] !== s[i]) { return undefined; } }
	return { parsed: s, newIndex: idx + s.length };
}
function consumeWhile(code, idx, f) {
	let i = idx;
	while (code[i] != null && f(code[i], i)) { i++; }

	if (i > idx) { return { parsed: code.substring(idx, i), newIndex: i } }
}
function consumeWhitespace(code, idx) { return consumeWhile(code, idx, ch => /[\s]/.test(ch))?.newIndex ?? idx; }
function consumeOtherThan(code, idx, arr) { return consumeWhile(code, idx, ch => !arr.includes(ch))?.newIndex ?? idx; }
function optional(x) { return { parsed: x?.parsed, newIndex: x?.newIndex }; }
function series(code, index, itemParseFn, delimiter) {
	const items = [];

	index = consumeWhitespace(code, index);
	let itemResult = itemParseFn(code, index);
	while (itemResult != null && index < code.length) {
		index = itemResult.newIndex;
		items.push(itemResult.parsed);

		itemResult =
			delimiter !== undefined
				? given(consumeWhitespace(code, index), index =>
					given(consume(code, index, delimiter), ({ newIndex: index }) =>
						given(consumeWhitespace(code, index), index =>
							itemParseFn(code, index))))
				: given(consumeWhitespace(code, index), index =>
					itemParseFn(code, index))
	}

	return { parsed: items, newIndex: index }
}




//#region format html code: WORKS!!!
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
//#endregion


