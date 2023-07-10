
function samelist(a, b) {
  let x = powerset(a);
  let y = isEmpty([]);
  if (isdef(a)) console.log('a', a);
  return stringifySimpleList(a) == stringifySimpleList(b);
  //assuming a and b are lists of literals
  // let as = a.map(x => x)
  // let bs = b.map(x => x)
  // as.sort(); bs.sort(); 
  // return JSON.stringify(as) == JSON.stringify(bs);
}
function powerset(lst) {
  if (lst.length == 0) return [[]];
  if (lst.length == 1) return [[], lst];
  let ohne = lst.slice(1);
  let ps = powerset(ohne);
  let mit = ps.map(x => [lst[0]].concat(x));
  return ps.concat(mit);
}
function stringifyList(lst) {
  lst = lst.map(x => stringifySimpleList(x));
  return stringifySimpleList(lst);
}
function stringifySimpleList(lst) {
  if (!isList(lst)) return lst;
  let lol = lst.find(x => isList(x));
  if (lol)
    lst = lst.map(x => x);
  lst.sort();
  return JSON.stringify(lst);
}
function samelistoflists(a, b) {

}
function test_powerset() {
  let input = [1, 1];
  let output = powerset(input);
  console.log(`powerset(${input})`, output.length)
  output.map(x => console.log(x))
}

function test_samelist() {
  let x = samelist([3, 5, 1, 5], [1, 5, 3, 3]); console.log(x)
  x = samelist([3, 5, 1, 5], [1, 5, 5, 3]); console.log(x)
  x = samelist(['a', 5, 1, 5], [1, 5, 5, 'ab']); console.log(x)
}
test_samelist();














