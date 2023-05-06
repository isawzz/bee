function isEmpty(arr) {
  return arr === undefined || !arr
    || (isString(arr) && (arr == 'undefined' || arr == ''))
    || (Array.isArray(arr) && arr.length == 0)
    || Object.entries(arr).length === 0;
}
function isList(arr) { return Array.isArray(arr); }
function isString(param) { return typeof param == 'string'; }
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
function stringCount(s, sSub, caseInsensitive = true) {
  let temp = "Welcome to W3Docs";
  let m = new RegExp(sSub, 'g' + (caseInsensitive ? 'i' : ''));
  let count = (s.match(m)).length;
  return count;
}
function toElem(d) { return isString(d) ? mBy(d) : d; }
function toWords(s, allow_ = false) {
  let arr = allow_ ? s.split(/[\W]+/) : s.split(/[\W|_]+/);
  return arr.filter(x => !isEmpty(x));
}
