// Load the shared native compiler only when a flexible object appears in the main editor.
(() => {
  const bundleURL = new URL('flexible-core.js', document.currentScript.src).href;
  let bundle, worker, pending, nextId = 0;

  function loadCore() {
    if (!bundle) bundle = new Promise((resolve, reject) => {
      const tag = document.createElement('script');
      tag.src = bundleURL;
      tag.onload = resolve;
      tag.onerror = () => { tag.remove(); bundle = null; reject(Error('The flexible compiler could not load.')); };
      document.head.append(tag);
    });
    return bundle;
  }

  function cancel() {
    ++nextId;
    if (pending) { pending.resolve(null); pending = null; }
    if (worker) { worker.terminate(); worker = null; }
  }
  function accepts(source) {
    const code = source.replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*|#[^\n]*/g,' ');
    return /\bI\s*\(\s*(?:FlexibleWire|FlexibleBelt|ElasticSheet)\b|\bFlex(?:Dimensions|Material|Grid|Pin|BeltSpeed|GuideRadius)\s*\(/.test(code);
  }
  function itemFor(part, floats, number) {
    const verts = [], uv = [], indices = [], edges = [];
    for (let i=0; i<part.count; ++i) {
      const base=8*(part.first+i);
      verts.push([floats[base],floats[base+1],floats[base+2]]);
      uv.push(floats[base+6],floats[base+7]); indices.push(i);
      if (i%3===2) edges.push(i-2,i-1,i-1,i,i,i-2);
    }
    return {type:part.type, material:part.material, mass:part.mass, verts, flexUV:uv, flexIndices:indices,
      flexEdges:edges, texIndex:number%3, texRepeat:1, arg:1, val:1,
      transform:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]};
  }
  async function compile(source,time) {
    if (!Number.isFinite(time) || time<0 || time>60) throw Error('Physics time must be between 0 and 60 seconds.');
    if (pending) cancel();
    const id=++nextId;
    await loadCore();
    if(id!==nextId) return null;
    if(!worker) {
      const nextWorker=await globalThis.createProGenFlexibleWorker();
      if (id!==nextId) { nextWorker.terminate(); return null; }
      worker=nextWorker;
      worker.onmessage=({data})=>{
        if(!pending || data.id!==pending.id) return;
        const request=pending; pending=null;
        if(data.error) { request.reject(Error(data.error)); return; }
        try {
          const stream=new Float32Array(data.buffer);
          request.resolve(data.parts.map((part,i)=>itemFor(part,stream,i)));
        } catch(err) { request.reject(err); }
      };
      worker.onerror=(event)=>{
        const request=pending; pending=null; worker.terminate(); worker=null;
        request?.reject(Error(event.message || 'Flexible compiler failed.'));
      };
    }
    return new Promise((resolve,reject)=>{
      pending={id,resolve,reject}; worker.postMessage({id,source,time});
    });
  }
  function controls(button, input, setSource, run) {
    const example = document.createElement('button');
    example.type='button'; example.className=button.className; example.textContent='Wire, belt and sheet';
    const label=document.createElement('label');
    label.textContent='Physics time (s) ';
    const time=document.createElement('input');
    time.type='number'; time.min='0'; time.max='60'; time.step='0.05'; time.value='0'; time.style.width='5em';
    label.append(time); button.after(example,label);
    const refresh=()=>{ label.hidden=!accepts(input.value); };
    input.addEventListener('input',()=>{cancel();refresh();});
    example.addEventListener('click',()=>{
      setSource(globalThis.ProGenFlexible.example); time.value='0'; refresh(); run();
    });
    time.addEventListener('change',run); refresh();
    return {seconds:()=>{refresh();return time.valueAsNumber;}};
  }
  globalThis.ProGenFlexible={accepts,compile,cancel,controls,example:"# Z up, length in metres. Play Physics or Step, then Reset Sim to replay.\nStart -> G(9.81 0 0 -1) [ T(-1.4 0 0.7) Harness(1.0) ] [ T(0 0 0.55) ReturnBelt(0.65) ] [ T(1.05 0 0.7) Membrane(0.65) ]\n\nHarness(span) ->\n    FlexDimensions(span 0.012 0.025) FlexGrid(20 0)\n    FlexMaterial(1150 8000000 2.5)\n    FlexPin(0 0) FlexPin(20 0)\n    I(FlexibleWire material(copper) 1 1)\n\nReturnBelt(centres) ->\n    FlexDimensions(centres 0.09 0.003) FlexGuideRadius(0.14) FlexGrid(32 2) FlexBeltSpeed(0.3)\n    FlexMaterial(1100 1600000 2)\n    I(FlexibleBelt material(graphite) 1 1)\n\nMembrane(length) ->\n    FlexDimensions(length 0.45 0.003) FlexGrid(12 8)\n    FlexMaterial(1080 1200000 2.5)\n    FlexPin(0 0) FlexPin(0 8) FlexPin(12 0) FlexPin(12 8)\n    I(ElasticSheet material(tealmatteceramic) 1 1)\n"};
})();
