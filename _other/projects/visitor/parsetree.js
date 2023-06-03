

function pt0(code, tree) {
	//aus einem string mach einen tree
	code = code.trim();

	console.log('code', code)

	if (code.includes('{')) {
		tree.left = stringBefore(code, '{');
		tree.right = stringAfterLast(code, '}');
		let newtree = {};
		let rest = stringAfter(code, '{');
		pt0(stringBeforeLast(rest, '}'), newtree);
		tree.middle = newtree;
	} else {
		tree.middle = code;
	}
}













