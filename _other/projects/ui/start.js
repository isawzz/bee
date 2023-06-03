function start() {
	dTable = mBy('dTable'); mFlexWrap(dTable);

	dTest = mBy('dTest');
	for (const i of range(89, 97)) {
		mButton(i,window[`animetest${i}`],dTest,{maright:10});
	}











}