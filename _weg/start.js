async function start() {
  //await loadAll();
  setTimeout();
}


function startWithAssets() {
  console.log('Config', Config);

}

function prom1(){
  let resolve = x=>console.log('resolved to',x);
  let reject = x=>console.log('rejected! ERROR',x);
  const prom = new Promise((res,rej)=>{
    setTimeout(res,1000);

  });
  prom.then(resolve).catch(reject);
}






































function fetchData(url){
  const prom = new Promise((f1,f2)=>{

  })
  if (url != "https://api.example.com/data"){

  }
}



















