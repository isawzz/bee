

function test1(code) {
	let d1 = mBy('d1'); let code1 = mBy('code1');
	let d2 = mBy('d2'); let code2 = mBy('code2');
	let d3 = mBy('d3'); let code3 = mBy('code3');
	mStyle(d2, { bg: '#aaa', padding: 25 })
	mStyle(d3, { bg: '#eee', padding: 25 })

	//raw
	code1.innerHTML = code;

	//js_beautify
	code = removeCommentLines(code, '//');
	js = js_beautify(code);
	code2.innerHTML = js;

	//meines
	js = formatjs(code);
	code3.innerHTML = js;

	return;

	js = code.split('\n').join(' ');
	js = formatjs(code);
	code2.innerHTML = js;

	let lines = code.split('\n');
	let newtext='';
	for(const l of lines){
		let lt = l.trim();
		if (!lt.endsWith(';')) lt+=';';
		newtext += lt;
	}
	js = js_beautify(newtext);
	code2.innerHTML = js;
}

function testhtml(d1, d2) {
	let html = `<div  > <pre><code id="code1" class="js" /></pre><pre><code id="code2" class="html"></code></pre></div>`;

	let html1 = formathtml(html);
	html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");

	d1.innerHTML = html;

	html1 = replaceAllSpecialChars(html1, ' >', '>')
	html1 = html1.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
	d2.innerHTML = html1;



}
function testjs(d1, d2) {
	let js = `
	// This is just a sample script. Paste your real code (javascript or HTML) here.

	if ('this_is'==/an_example/){of_beautifier();console.log('hello');}else{var a=b?(c%d):e[f];}	`;

	d1.innerHTML = js;
	js = js_beautify(js);
	d2.innerHTML = js;
}
function testjs1(d1, d2) {
	let js = `
	// This is just a sample script. Paste your real code (javascript or HTML) here.

	if ('this_is'==/an_example/){of_beautifier();console.log('hello');}else{var a=b?(c%d):e[f];}	`;

	d1.innerHTML = js;
	js = formatjs(js);
	d2.innerHTML = js;
}

function getCodeSamples() {
	let samples = [
		// 0
		`
		// This is just a sample script. Paste your real code (javascript or HTML) here.
	
		if ('this_is'==/an_example/){of_beautifier();console.log('hello');}else{var a=b?(c%d):e[f];}
		`,
		// 1
		`
		var tidy_html5=function tidy_html5(text,config){FS.writeFile("input.html",text);var cmdlineOptions=[];if(config)for(var i in config)cmdlineOptions.push("--"+i,config[i]);cmdlineOptions.push("-m","input.html");Module.callMain(cmdlineOptions);return FS.readFile("input.html",{encoding:"utf8"})};var Module={noInitialRun:true,noExitRuntime:true};var Module;if(!Module)Module=(typeof Module!=="undefined"?Module:null)||{};var moduleOverrides={};for(var key in Module){if(Module.hasOwnProperty(key)){moduleOverrides[key]=Module[key]}}			
		`,
		// 2
		`
		var tidy_html5=function tidy_html5(text,config){
			FS.writeFile("input.html",text);
			var cmdlineOptions=[];
			if(config)for(var i in config)cmdlineOptions.push("--"+i,config[i]);
			cmdlineOptions.push("-m","input.html");
			Module.callMain(cmdlineOptions);
			return FS.readFile("input.html",{
				encoding:"utf8"
			})
		};
		var Module={			noInitialRun:true,noExitRuntime:true		};
		var Module;
		if(!Module)Module=(typeof Module!=="undefined"?Module:null)||{
			
		};
		var moduleOverrides={
			
		};
		for(var key in Module){
			if(Module.hasOwnProperty(key)){
				moduleOverrides[key]=Module[key]
			}
		}	
	
		`,
		// 3
		`
function collectCode(text, path) {
	let lines = text.split('\r\n');
	for (const l of lines) {
		if (['var', 'const', 'cla', 'func', 'async'].some(x => l.startsWith(x))) {
			let key = ithWord(l, l[0] == 'a' ? 2 : 1, true);
			keysSorted.push(key);
		}
	}
}
		`,
		// 4
		`function removeColNew(board, cClick){return    reduceBoard  (board , board.rows,board.cols - 1, cClick) ;    }

		`,
		// 5
		`
		var tidy_html5 = function tidy_html5(text, config) {
			FS.writeFile("input.html", text);
			var cmdlineOptions = [];
			if (config)
				for (var i in config)
					cmdlineOptions.push("--" + i, config[i]);
			cmdlineOptions.push("-m", "input.html");
			Module.callMain(cmdlineOptions);
			return FS.readFile("input.html", { encoding: "utf8" })
		};
				`,
		`

		`,
	];
	return samples;

}

