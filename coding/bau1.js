function _assemble_code_sorted(list, di, preserveRegions = false) {
	let text = '';
	for (const k of list) {
		assertion(isdef(k), `KEY UNDEFINED ${k}`);
		if (nundef(di[k])) continue;
		let o = di[k];
		text += o.code;
	}
	return text;
}















