async function start() {
  dMain = mBy('dMain'); mFlexWrap(dMain); mStyle(dMain, { padding: 10, gap: 10 });

  //setTimeout(printHallo,1000); printNope(); // not waiting!

  mSleep(1000).then(printHallo).then(printHallo); //YES!

  await mSleep(2000); printGeh(); printGeh(); //YES!!!

  await mSetTimeout(2000); printHallo(); //YES!!!

  mFetch(); 
}
function mFetch(url,o){
  let sess = detectSessionType();
  mDom(dMain,{fg:ORANGE},{html:`session: ${sess}`});
  console.log('session type',sess)
}
function mSetTimeout(ms) { return mSleep(ms); }
function mSleep(ms) {
  return new Promise(
    (res, rej) => {
      if (ms <= 3000) {
        setTimeout(res, ms);
      } else {
        printNope();
      }
    });
}
function printHallo() { mDom(dMain, { fg: GREEN }, { html: 'hallo' }); }
function printGeh() { mDom(dMain, { fg: BLUE }, { html: 'geh' }); }
function printNope() { mDom(dMain, { fg: RED }, { html: 'nope' }); }
function print0() { }
function hallo() {
  const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('Operation completed successfully!');
    }, 1000);
  }).then(printNope).then(printGeh);
  const prom = new Promise(() => {
    setTimeout(printHallo, 1000);
  }).then(printGeh).then(printGeh);
}

















