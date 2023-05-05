function mBy(id) { return document.getElementById(id); }
function stringCount(s, sSub, caseInsensitive = true) {
  let temp = "Welcome to W3Docs";
  let m = new RegExp(sSub, 'g' + (caseInsensitive ? 'i' : ''));
  let count = (s.match(m)).length;
  return count;
}
