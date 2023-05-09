function assertion(cond) {
  if (!cond) {
    let args = [...arguments];
    for (const a of args) {
      console.log('\n', a);
    }
    throw new Error('TERMINATING!!!')
  }
}
function dict2list(d, keyName = 'id') {
  let res = [];
  for (const key in d) {
    let val = d[key];
    let o;
    if (isDict(val)) { o = jsCopy(val); } else { o = { value: val }; }
    o[keyName] = key;
    res.push(o);
  }
  return res;
}
function formathtml(code, stripWhiteSpaces=true, stripEmptyLines=true, whitespace='  ', maxlen=60) {
  if (whitespace === undefined) whitespace = ' '.repeat(2); // Default indenting 2 whitespaces
  if (maxlen === undefined) maxlen = 80; 
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
      numch = currentIndent;
      currentIndent++;
    } else if (ch === '<' && chNext === '/') {
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
function isDict(d) { let res = (d !== null) && (typeof (d) == 'object') && !isList(d); return res; }
function isEmpty(arr) {
  return arr === undefined || !arr
    || (isString(arr) && (arr == 'undefined' || arr == ''))
    || (Array.isArray(arr) && arr.length == 0)
    || Object.entries(arr).length === 0;
}
function isList(arr) { return Array.isArray(arr); }
function isString(param) { return typeof param == 'string'; }
function jsCopy(o) { return JSON.parse(JSON.stringify(o)); }
function mBy(id) { return document.getElementById(id); }
function mClass(d) {
  d = toElem(d);
  if (arguments.length == 2) {
    let arg = arguments[1];
    if (isString(arg) && arg.indexOf(' ') > 0) { arg = [toWords(arg)]; }
    else if (isString(arg)) arg = [arg];
    if (isList(arg)) {
      for (let i = 0; i < arg.length; i++) {
        d.classList.add(arg[i]);
      }
    }
  } else for (let i = 1; i < arguments.length; i++) d.classList.add(arguments[i]);
}
function replaceAllSpecialChars(str, sSub, sBy) { return str.split(sSub).join(sBy); }
function reverse(x) {
  if (isString(x)) {
    var newString = "";
    for (var i = x.length - 1; i >= 0; i--) {
      newString += x[i];
    }
    return newString;
  }
  if (isList(x)) return x.reverse();
  if (isDict(x)) return dict2list(x, 'value').reverse();
  return x;
}
async function start() {
  let d = mBy('code1');
  let html = `
  function stringCount(s, sSub, caseInsensitive = true) {
    let temp = "Welcome to W3Docs";
    let m = new RegExp(sSub, 'g' + (caseInsensitive ? 'i' : ''));
    let count = (s.match(m)).length;
    return count;
  }
  `;
  html = replaceAllSpecialChars(html, '\t', '  '); //+'\n\n';
  d.innerHTML = html;
  d = mBy('code2');
  html = `
  <svg height="210" width="400">
    <path d="M150 0 L75 200 L225 200 Z" />
  </svg>  
  `;
  html = formathtml(html);
  html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  d.innerHTML = html;
  d = mBy('code3');
  html = `
  body {
    margin: 0;
    padding: 0;
    font-family: opensans;
  }
  html {
    margin: 0;
    padding: 0;
  }
  .a {
    text-decoration: none;
    padding: 1rem;
    color: inherit;
  }
  .a:hover {
    color: white;
  }
    `;
  html = replaceAllSpecialChars(html, '\t', '  ');// + '\n\n';
  d.innerHTML = html;
  codeEls = document.querySelectorAll('code');
  for (var i = 0; i < codeEls.length; i++) {
    let x = codeEls[i];
    hljs.highlightElement(x);
    mClass(x, 'myfont');
  }
}
function stringAfter(sFull, sSub) {
  let idx = sFull.indexOf(sSub);
  if (idx < 0) return '';
  return sFull.substring(idx + sSub.length);
}
function stringBefore(sFull, sSub) {
  let idx = sFull.indexOf(sSub);
  if (idx < 0) return sFull;
  return sFull.substring(0, idx);
}
function stringCount(s, sSub, caseInsensitive = true) {
  let temp = "Welcome to W3Docs";
  let m = new RegExp(sSub, 'g' + (caseInsensitive ? 'i' : ''));
  let count = (s.match(m)).length;
  return count;
}
function stripHtmlComments(code) {
  while (code.includes('<!--')) {
    code = stringBefore(code, '<!--') + stringAfter(code, '-->');
  }
  return code;
}
function toElem(d) { return isString(d) ? mBy(d) : d; }
function toWords(s, allow_ = false) {
  let arr = allow_ ? s.split(/[\W]+/) : s.split(/[\W|_]+/);
  return arr.filter(x => !isEmpty(x));
}
function trim(str) {
  return str.replace(/^\s+|\s+$/gm, '');
}
