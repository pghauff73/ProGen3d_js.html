// Static, same-origin script assets also work when an offline reader is opened from disk.
(() => {
  const root = new URL('solver/', document.currentScript.src);
  const files = ["worker-5b8c1c0b9c6d.js", "solver-0c8ec6e4444e-0.js", "solver-0c8ec6e4444e-1.js", "solver-0c8ec6e4444e-2.js", "solver-0c8ec6e4444e-3.js", "solver-0c8ec6e4444e-4.js", "solver-0c8ec6e4444e-5.js", "solver-0c8ec6e4444e-6.js", "solver-0c8ec6e4444e-7.js", "solver-0c8ec6e4444e-8.js", "solver-0c8ec6e4444e-9.js", "solver-0c8ec6e4444e-10.js", "solver-0c8ec6e4444e-11.js", "solver-0c8ec6e4444e-12.js", "solver-0c8ec6e4444e-13.js"];
  globalThis.progenFlexChunks = new Map();
  let loaded;
  function load(name) {
    return new Promise((resolve,reject)=>{
      const script=document.createElement('script');
      script.src=new URL(name,root);
      script.onload=()=>{script.remove();resolve();};
      script.onerror=()=>{script.remove();reject(Error('Could not load the bundled flexible solver: '+name));};
      document.head.append(script);
    });
  }
  globalThis.createProGenFlexibleWorker=async function(){
    if(!loaded) loaded=Promise.all(files.map(load)).catch(err=>{loaded=null;throw err;});
    await loaded;
    const chunks=globalThis.progenFlexChunks;
    const parts=Array.from({length:files.length-1},(_,i)=>Uint8Array.from(atob(chunks.get(String(i))),c=>c.charCodeAt(0)));
    const binary=new Uint8Array(parts.reduce((n,part)=>n+part.length,0));
    let offset=0; for(const part of parts){ binary.set(part,offset); offset+=part.length; }
    const url=URL.createObjectURL(new Blob([atob(chunks.get('worker'))],{type:'text/javascript'}));
    const worker=new Worker(url); URL.revokeObjectURL(url);
    worker.postMessage({binary:binary.buffer},[binary.buffer]);
    return worker;
  };
})();
