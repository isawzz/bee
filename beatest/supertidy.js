// Parameters:
// code 								- (string) code you wish to format
// stripWhiteSpaces			- (boolean) do you wish to remove multiple whitespaces coming after each other?
// stripEmptyLines 			- (boolean) do you wish to remove empty lines?
var formatCode = function (code, stripWhiteSpaces, stripEmptyLines) {
	"use strict";
	var whitespace = ' '.repeat(4);             // Default indenting 4 whitespaces
	var currentIndent = 0;
	var char = null;
	var nextChar = null;


	var result = '';
	for (var pos = 0; pos <= code.length; pos++) {
		char = code.substr(pos, 1);
		nextChar = code.substr(pos + 1, 1);

		// If opening tag, add newline character and indention
		if (char === '<' && nextChar !== '/') {
			result += '\n' + whitespace.repeat(currentIndent);
			currentIndent++;
		}
		// if Closing tag, add newline and indention
		else if (char === '<' && nextChar === '/') {
			// If there're more closing tags than opening
			if (--currentIndent < 0) currentIndent = 0;
			result += '\n' + whitespace.repeat(currentIndent);
		}

		// remove multiple whitespaces
		else if (stripWhiteSpaces === true && char === ' ' && nextChar === ' ') char = '';
		// remove empty lines
		else if (stripEmptyLines === true && char === '\n') {
			//debugger;
			if (code.substr(pos, code.substr(pos).indexOf("<")).trim() === '') char = '';
		}

		result += char;
	}

	return result;
}

var code1 = `
	<div class="row">
			<div class="col-sm-4 menu hidden-xs"><div class="affix-container affix-top" style="width: 360px;"><h1>Test heading</h1></div></div>
	</div>
`;


var code2 = `
	<div class="row"><div>XYZ 14<p>Hello how ya    doin </p></div>

				<div class="affix-container affix-top" style="width: 360px;">
<h1>Test heading</h1>    </div>
</div>
			</div>
`;


var code3 = `<div class="gb_2a"><div class="gb_ha gb_ga gb_ua gb_Aa" aria-label="Google apps" aria-hidden="true" role="region"><ul class="gb_ja gb_ca" aria-dropeffect="move"><li class="gb_Z" aria-grabbed="false"><a class="gb_O" data-pid="192" href="https://myaccount.google.com/?utm_source=OGB" id="gb192" data-ved="0EMEuCAAoAA"><div class="gb_8"></div><div class="gb_9"></div><div class="gb_aa"></div><div class="gb_ba"></div><span class="gb_3" style="background-position:0 -1449px"></span><span class="gb_4">My Account</span></a></li><li class="gb_Z" aria-grabbed="false"><a class="gb_O" data-pid="1" href="https://www.google.sk/webhp?tab=ww&amp;ei=9UVNV_q6HsSnsAGW3YLABQ&amp;ved=0EKkuCAEoAQ" id="gb1"><div class="gb_8"></div><div class="gb_9"></div><div class="gb_aa"></div><div class="gb_ba"></div><span class="gb_3" style="background-position:0 -276px"></span><span class="gb_4">Search</span></a></li><li class="gb_Z" aria-grabbed="false"><a class="gb_O" data-pid="8" href="https://maps.google.sk/maps?hl=en&amp;tab=wl" id="gb8" data-ved="0EMEuCAIoAg"><div class="gb_8"></div><div class="gb_9"></div><div class="gb_aa"></div><div class="gb_ba"></div><span class="gb_3" style="background-position:0 -69px"></span><span class="gb_4">Maps</span></a></li><li class="gb_Z" aria-grabbed="false"><a class="gb_O" data-pid="36" href="https://www.youtube.com/?gl=SK" id="gb36" data-ved="0EMEuCAMoAw"><div class="gb_8"></div><div class="gb_9"></div><div class="gb_aa"></div><div class="gb_ba"></div><span class="gb_3" style="background-position:0 -138px"></span><span class="gb_4">YouTube</span></a></li><li class="gb_Z" aria-grabbed="false"><a class="gb_O" data-pid="78" href="https://play.google.com/?hl=en&amp;tab=w8" id="gb78" data-ved="0EMEuCAQoBA"><div class="gb_8"></div><div class="gb_9"></div><div class="gb_aa"></div><div class="gb_ba"></div><span class="gb_3" style="background-position:0 -1380px"></span><span class="gb_4">Play</span></a></li><li class="gb_Z" aria-grabbed="false"><a class="gb_O" data-pid="23" href="https://mail.google.com/mail/?tab=wm" id="gb23" data-ved="0EMEuCAUoBQ"><div class="gb_8"></div><div class="gb_9"></div><div class="gb_aa"></div><div class="gb_ba"></div><span class="gb_3" style="background-position:0 -621px"></span><span class="gb_4">Gmail</span></a></li><li class="gb_Z" aria-grabbed="false"><a class="gb_O" data-pid="49" href="https://drive.google.com/?tab=wo&amp;authuser=0" id="gb49" data-ved="0EMEuCAYoBg"><div class="gb_8"></div><div class="gb_9"></div><div class="gb_aa"></div><div class="gb_ba"></div><span class="gb_3" style="background-position:0 -1518px"></span><span class="gb_4">Drive</span></a></li><li class="gb_Z" aria-grabbed="false"><a class="gb_O" data-pid="24" href="https://www.google.com/calendar?tab=wc" id="gb24" data-ved="0EMEuCAcoBw"><div class="gb_8"></div><div class="gb_9"></div><div class="gb_aa"></div><div class="gb_ba"></div><span class="gb_3" style="background-position:0 -1794px"></span><span class="gb_4">Calendar</span></a></li><li class="gb_Z" aria-grabbed="false"><a class="gb_O" data-pid="119" href="https://plus.google.com/u/0/?tab=wX" id="gb119" data-ved="0EMEuCAgoCA">`;


console.log(formatCode(code1, true, true));
