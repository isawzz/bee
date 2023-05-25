async function testDirList() {
	let x = await (await fetch('/RSG/js')).text();
	while (!isEmpty(x)) {
		word = stringBefore(x, '"');
		console.log('______________word:', word);
		x = stringAfter(x, '<a href="/');
	}
	return;
	var regexp = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i;
	var match, files = [];
	let max = 5;
	while ((match = regexp.exec(x)) != null) {
		files.push(match.index);
		max -= 1; if (max <= 0) break;
	}
	console.log('________________', files);
	return;
	var request = new XMLHttpRequest();
	request.open('GET', '/RSG/', true);
	let resp;
	request.onload = function () {
		if (request.status >= 200 && request.status < 400) {
			resp = request.responseText;
		}
	};
	request.send();
	let directory_listing = resp;
	var regexp = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i;
	var match, files = [];
	while ((match = regexp.exec(resp)) != null) {
		files.push(match.index);
	}
	console.log(files);
}
function toHTMLString(msg) {
	msg = JSON.stringify(msg);
	msg = msg.replace(/(?:\r\n|\r|\n)/g, '<br>');
	msg = msg.replace('\\n', '<br>');
	msg = msg.replace(/\\n/g, '<br>');
	msg = replaceAllSafe(msg,'"',''); msg.replace(/"/g, '');
	return msg.trim();
}
function loadIcons(callback) {
	let faChars, gaChars;
	loadYML('/_lib/assets/icons/gameIconCodes.yml', dga => {
		gaChars = dga;
		loadYML('/_lib/assets/icons/faIconCodes.yml', dfa => {
			faChars = dfa;
			iconChars = {};
			for (const k in faChars) {
				iconChars[k] = faChars[k];
			}
			for (const k in gaChars) {
				iconChars[k] = gaChars[k];
			}
			timit.showTime('loaded icons codes');
			callback();
		});
	});
}