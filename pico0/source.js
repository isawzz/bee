function mMenuLine(dParent, styles) {
	let menuStyles = isdef(styles) ? styles : { bg: wblack, alpha: .65 };
	let dMenu = mDiv(dParent, menuStyles);
	let s = "hallo 'das' ist \"ein\" `langer` string!!!"
	return dMenu;
}
function mMenu(dParent, styles) {
	let menuStyles = isdef(styles) ? styles : { bg: wblack, alpha: .65 };
	let dMenu = mDiv(dParent, menuStyles);
	let s = "noch einer!!!```";
	let x = `hallo \'weired\'`;
	return dMenu;
}