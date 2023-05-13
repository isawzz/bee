
const input = "7737";
function* lexer(s) {

	for (let i = 0; i <= s.length; i++) {
		let ch = s[i];

		function number(value) {
			for (; i <= s.length; i++) {
				//ch = s[i];
				if (ch == '7') { value += ch; }
				else { break; }
			}
			return { type: 'number', value: 7 }
		}

		if (ch === '7') { yield number(ch); } // { type: 'number', value: 7 } }
		else if (ch === undefined) { yield { type: 'EOF' } }
		else { yield { type: `ERROR at char ${i}`, value: ch } }

	}

}

console.log('start');
for (const token of lexer(input)) {
	console.log(token);
}
console.log('finish');










var count_checks = 0;
function trace(name, v) { console.log('check', count_checks++, name); return v; }
function* lexer_trace_throw(s) {

	for (let i = 0; i <= s.length; i++) {
		let ch = s[i];
		if (trace('7', ch === '7')) { yield { type: 'number', value: 7 } }
		else if (trace('undefined', ch === undefined)) { yield { type: 'EOF' } }
		else throw new SyntaxError(`unexpected char ${ch} at position ${i}`)
	}

}
