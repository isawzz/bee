async function loadCode() {
	if (TESTING && !CODE_VERSION) return;
	let url = TESTING && !USE_NON_TESTING_DATA ? TEST_PATH + GAME + '/code' + CODE_VERSION + '.js'
		: '/games/' + GAME + '/_rsg/' + GAME + VERSION + '.js';
	let loader = new ScriptLoader();
	await loader.load(SERVER + url);
	if (TESTING) userCodeC = await vidCache.load('userCode', async () => await route_path_asText_dict(url), true, false);
	else userCodeC = await vidCache.load('userCode', async () => await route_userCode(GAME, GAME + VERSION), !CACHE_CODE, CACHE_CODE);
	userCode = vidCache.asDict('userCode');
	let d = mBy('OLDCODE');
	if (d && SHOW_CODE) { d.innerHTML = '<pre>' + userCode.asText + '</pre>'; }
}
function loadCode_dep(text) {
	if (isdef(text)) text = text.trim();
	if (isEmpty(text)) {
		return;
	}
	var scriptTag = document.createElement("script");
	scriptTag.onload = () => console.log('code loaded.....');
	scriptTag.setAttribute("type", "text/javascript");
	scriptTag.innerHTML = text;
	document.getElementsByTagName("body")[0].appendChild(scriptTag);
}
function loadCode0(text, codeToRunWhenScriptLoaded = null, callback = null) {
	if (isdef(text)) text = text.trim();
	if (isEmpty(text)) {
		console.log('code is empty!!! no script loaded!');
		if (callback) callback();
		return;
	}
	var scriptTag = document.createElement("script");
	scriptTag.setAttribute("type", "text/javascript");
	scriptTag.text = callback ? [text, codeToRunWhenScriptLoaded].join('\n') : text;
	document.getElementsByTagName("body")[0].appendChild(scriptTag);
}
async function loadCorrectWords() {
	CorrectKeysByLanguage = { E: [], EB: [], D: [] };
	CorrectByKey = {};
	let speechZira = await loadYamlDict('/assets/speech/speechZira.yaml');
	for (const k in speechZira) {
		let e = lookup(speechZira, [k, 'E', 'zira']);
		if (e && e.correct) {
			let c = Math.round(e.conf * 100);
			lookupSet(CorrectByKey, [k, 'E'], { r: e.req, c: c });
			addIf(CorrectKeysByLanguage.E, k);
		}
	}
	let speechBritish = await loadYamlDict('/assets/speech/speechBritish.yaml');
	for (const k in speechBritish) {
		let e = lookup(speechBritish, [k, 'E', 'ukMale']);
		if (e && e.correct) {
			let c = Math.round(e.conf * 100);
			lookupSet(CorrectByKey, [k, 'EB'], { r: e.req, c: c });
			addIf(CorrectKeysByLanguage.EB, k);
		}
	}
	let speechDeutsch = await loadYamlDict('/assets/speech/speechDeutsch.yaml');
	for (const k in speechDeutsch) {
		let e = lookup(speechDeutsch, [k, 'D', 'deutsch']);
		if (e && e.correct) {
			let c = Math.round(e.conf * 100);
			lookupSet(CorrectByKey, [k, 'D'], { r: e.req, c: c });
			addIf(CorrectKeysByLanguage.D, k);
		}
	}
}
async function loadCorrectWords_dep() {
	CorrectWords = await loadYamlDict('/assets/correctWordsX.yaml');
	CorrectWordsCorrect = { E: {}, D: {} };
	CorrectWordsExact = { E: {}, D: {} };
	CorrectWordsFailed = { E: {}, D: {} };
	if (isdef(CorrectWords) && isdef(CorrectWords.data)) {
		for (const cwentry of CorrectWords.data) {
			let key = cwentry.key;
			for (const lang of ['E', 'D']) {
				let cw = cwentry[lang];
				if (cw.isCorrect) {
					if (cw.answer == cw.req && !(cw.danger == true)) CorrectWordsExact[lang][key] = cw;
					else CorrectWordsCorrect[lang][key] = cw;
				} else CorrectWordsFailed[lang][key] = cw;
			}
		}
	}
}
function loader_off() { let d = mBy('loader_holder'); if (isdef(d)) d.className = 'loader_off'; }
function loader_on() { let d = mBy('loader_holder'); if (isdef(d)) d.className = 'loader_on'; }
function loadExerciser(dParent, row, col) {
	loadPic('exercises', 100, 100, dParent, { row: row, col: col, scale: 1.5 }, 'gif');
}
function loadGame(id) {
	if (nundef(id)) id = localStorage.getItem('game');
	if (nundef(id)) id = Object.keys(DB.games)[0];
	G = lookup(DB, ['games', id]);
	G.color = getColorDictColor(G.color);
	G.id = Gamename = id;
	updateGamenameUi(id, G.color);
}
async function loadGameInfo(useAllGamesStub = true) {
	if (useAllGamesStub) {
		allGames = {
			ttt: {
				name: 'TicTacToe',
				long_name: 'Tic-Tac-Toe',
				short_name: 'ttt',
				num_players: [2],
				player_names: ['Player1', 'Player2'],
			},
			s1: {
				name: 's1',
				long_name: 's1',
				short_name: 's1',
				num_players: [2, 3, 4, 5],
				player_names: ['Player1', 'Player2', 'Player3', 'Player4', 'Player5'],
			},
			starter: {
				name: 'Starter',
				long_name: 'Starter',
				short_name: 'starter',
				num_players: [2],
				player_names: ['Player1', 'Player2'],
			},
			catan: {
				name: 'Catan',
				long_name: 'The Settlers of Catan',
				short_name: 'catan',
				num_players: [3, 4],
				player_names: ['White', 'Red', 'Blue', 'Orange'],
			},
			aristocracy: {
				name: 'Aristocracy',
				long_name: 'Aristocracy',
				short_name: 'aristocracy',
				num_players: [2, 3, 4, 5],
				player_names: ['Player1', 'Player2', 'Player3', 'Player4', 'Player5'],
			}
		};
	} else {
		allGamesC = await vidCache.load('allGames', route_allGames);
		allGames = vidCache.asDict('allGames');
	}
	playerConfig = stubPlayerConfig(allGames);
}
async function loadGerman(justNouns = false) {
	let root = justNouns ? 'Nouns' : 'Dict';
	let ed = await route_path_yaml_dict('../assets/speech/ed' + root + '.yaml');
	let de = await route_path_yaml_dict('../assets/speech/de' + root + '.yaml');
	return [ed, de];
}
function loadHistoryExp() {
	let hist = localStorage.getItem('history');
	if (isdef(hist)) {
		HistoryOfStates = JSON.parse(hist);
		console.log('history loaded successfully...', HistoryOfStates);
	} else {
		console.log('no history found!!!');
	}
}
async function loadIcon_dep(key) {
	if (!iconChars) iconChars = await route_iconChars();
	return iconChars[key];
}
async function loadGerman(justNouns = false) {
	let root = justNouns ? 'Nouns' : 'Dict';
	let ed = await route_path_yaml_dict('../assets/speech/ed' + root + '.yaml');
	let de = await route_path_yaml_dict('../assets/speech/de' + root + '.yaml');
	return [ed, de];
}
function loadHistoryExp() {
	let hist = localStorage.getItem('history');
	if (isdef(hist)) {
		HistoryOfStates = JSON.parse(hist);
		console.log('history loaded successfully...', HistoryOfStates);
	} else {
		console.log('no history found!!!');
	}
}
function loadIconChars(callbacks = []) {
	loadYML('/frontend/static/rsg/assets/gameIconCodes.yml', dga => {
		gaChars = dga;
		loadYML('/frontend/static/rsg/assets/faIconCodes.yml', dfa => {
			faChars = dfa;
			iconChars = {};
			faKeys = [];
			for (const k in faChars) {
				iconChars[k] = faChars[k];
			}
			for (const k in gaChars) {
				if (isdef(faChars[k])) faKeys.push(k);
				iconChars[k] = gaChars[k];
			}
			timit.showTime('loaded icons codes')
			if (!isEmpty(callbacks)) callbacks[0](arrFromIndex(callbacks, 1));
		});
	});
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
function mDropImage(e, img) {
	var dt = e.dataTransfer;
	console.log('dropped', dt)
	var files = dt.files;
	if (files.length) {
		let imgFile = files[0];
		var reader = new FileReader();
		reader.onload = function (e) {
			img.src = e.target.result;
			imgFile.data = e.target.result;
		}
		reader.readAsDataURL(imgFile);
	} else {
		console.log('dropped on', e.target, 'img', img);
		clearElement(img);
		var html = dt.getData('text/html');
		console.log('__________dataTransfer', html);
		let match = html && /\bsrc="?([^"\s]+)"?\s*/.exec(html);
		let url = match && match[1];
		if (url) {
			console.log('JA!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
			img.onerror = function () {
				alert("Error in uploading");
			}
			img.crossOrigin = "";
			img.src = url;
		}
	}
}
function mMenu(dParent, styles) {
	let menuStyles = isdef(styles) ? styles : { bg: wblack, alpha: .65 };
	let dMenu = mDiv(dParent, menuStyles);
	let s = "noch einer!!!```";
	let x = `hallo \'weired\'`;
	return dMenu;
}












function mMenuLine(dParent, styles) {
	let menuStyles = isdef(styles) ? styles : { bg: wblack, alpha: .65 };
	let dMenu = mDiv(dParent, menuStyles);
	let s = "hallo 'das' ist \"ein\" `langer` string!!!"
	return dMenu;
}
function parseComplexStyleProperty(str) {
	var regex = /(\w+)\((.+?)\)/g,
		transform = {},
		match;
	while (match = regex.exec(str))
		transform[match[1]] = match[2];
	return transform;
}
