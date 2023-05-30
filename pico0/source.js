function __pictoG(key, x, y, w, h, fg, bg) {
  let ch = iconChars[key];
  let family = (ch[0] == 'f' || ch[0] == 'F') ? 'pictoFa' : 'pictoGame';
  let text = String.fromCharCode('0x' + ch);
}
async function __start() {
	//hallo
  set_run_state_no_server();
  onpagedeactivated(() => { fiddleSave(); dbSave(); }); //hallo
  await load_syms();
  await load_db(); //hallo 'das' ist /MIST/
  let dicode = CODE.di = await route_path_yaml_dict('../basejs/z_all.yaml');
  let dijustcode = CODE.justcode = await route_path_yaml_dict('../basejs/z_allcode.yaml');
  dTable = mSection({ h: window.innerHeight - 68 }, 'dTable');
  computeClosure();
}
function _addFilterHighlight(mobj) { mobj.highC('green'); }
function _addOnelineVars(superdi, o) {
  let [code, type] = [o.code, o.type];
  let crn = (code.match(/\r\n/g) || []).length;
  let oneliner = crn == 1;
  if (oneliner && type == 'var' && code.includes(',') && !code.includes('[') && !code.includes('{ ')) {
    let othervars = stringAfter(code, 'var').trim().split(',');
    othervars = othervar