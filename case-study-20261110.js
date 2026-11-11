/* Progressive enhancement for the existing CUT + SHIFT project overlay. */
(()=>{
 'use strict';
 const overlay=document.getElementById('project-overlay');
 if(!overlay || !('showModal' in document.createElement('dialog')))return;
 const nav=overlay.querySelector('.overlay-nav');
 const close=overlay.querySelector('#overlay-close');
 const footerPrev=overlay.querySelector('#overlay-prev');
 const footerNext=overlay.querySelector('#overlay-next');
 if(nav&&close&&footerPrev&&footerNext){
   const navTools=document.createElement('div');
   navTools.className='overlay-nav-tools';
   const mk=(label,arrow,target)=>{
     const button=document.createElement('button');
     button.type='button';button.textContent=arrow;button.title=label;button.setAttribute('aria-label',label);
     button.addEventListener('click',()=>target.click());
     return button;
   };
   navTools.append(mk('Projet précédent / Previous project','←',footerPrev),
     mk('Projet suivant / Next project','→',footerNext));
   nav.insertBefore(navTools,close);
 }
 const viewer=document.createElement('dialog');
 viewer.id='portfolio-image-viewer';
 viewer.setAttribute('aria-label','Visionneuse / Image viewer');
 const el=(tag,cls,txt)=>{
   const n=document.createElement(tag);n.className=cls;
   if(txt!==undefined)n.textContent=txt;
   return n;
 };
 const exit=el('button','viewer-close','FERMER ✕');
 const back=el('button','viewer-prev','←');
 const forward=el('button','viewer-next','→');
 const picture=el('img','viewer-image');
 const counter=el('span','viewer-counter');
 [exit,back,forward].forEach(b=>b.type='button');
 exit.setAttribute('aria-label','Fermer / Close');
 back.setAttribute('aria-label','Image précédente / Previous image');
 forward.setAttribute('aria-label','Image suivante / Next image');
 viewer.append(exit,back,picture,forward,counter);
 document.body.append(viewer);
 let images=[],current=0,opener=null;
 const sourceImages=()=>Array.from(overlay.querySelectorAll('.overlay-hero img, .overlay-gallery img'));
 function show(){
   if(!images.length)return;
   const item=images[current];
   picture.src=item.currentSrc||item.src;
   picture.alt=item.alt||'Portfolio image';
   counter.textContent=String(current+1).padStart(2,'0')+' / '+String(images.length).padStart(2,'0');
   back.disabled=forward.disabled=images.length<2;
 }
 const move=d=>{ if(!images.length)return; current=(current+d+images.length)%images.length;show(); };
 function open(image){
   images=sourceImages();
   current=images.indexOf(image);
   if(current<0)return;
   opener=image;
   show();
   viewer.showModal();
   exit.focus();
 }
 function closeViewer(){viewer.close();}
 exit.addEventListener('click',closeViewer);
 back.addEventListener('click',()=>move(-1));
 forward.addEventListener('click',()=>move(1));
 viewer.addEventListener('click',e=>{if(e.target===viewer)closeViewer();});
 viewer.addEventListener('close',()=>opener?.focus());
 overlay.addEventListener('click',e=>{
   const img=e.target.closest?.('.overlay-hero img, .overlay-gallery img');
   if(img)open(img);
 });
 overlay.addEventListener('keydown',e=>{
   if(e.key!=='Enter'&&e.key!==' ')return;
   if(!e.target.matches?.('.overlay-hero img, .overlay-gallery img'))return;
   e.preventDefault();open(e.target);
 });
 // The portfolio already uses left/right for switching projects. Suppress that
 // shortcut while image zoom is open and use the arrows to browse images instead.
 document.addEventListener('keydown',e=>{
   if(!viewer.open)return;
   if(['ArrowLeft','ArrowRight','Escape'].includes(e.key)){
     e.preventDefault();e.stopImmediatePropagation();
     if(e.key==='Escape')closeViewer();
     else move(e.key==='ArrowRight'?1:-1);
   }
 },true);
 const makeFocusable=()=>{
   sourceImages().forEach(img=>{
     img.setAttribute('role','button');
     img.tabIndex=0;
     img.setAttribute('aria-label','Agrandir : '+(img.alt||'image'));
   });
 };
 const observer=new MutationObserver(makeFocusable);
 observer.observe(overlay.querySelector('.overlay-inner'),{childList:true,subtree:true});
 makeFocusable();
})();

/* AUTO-FIT PROJECT ARTWORK — 2026-11-11 */
(()=>{
  'use strict';
  const gallery=document.getElementById('overlay-gallery');
  if(!gallery)return;
  const seen=new WeakSet();
  let queued=false;
  const portrait=figure=>{
    const image=figure.querySelector('img');
    return !!(image && image.naturalWidth>0 && image.naturalHeight>0 &&
      image.naturalWidth/image.naturalHeight<0.96);
  };
  function layout(){
    queued=false;
    const figures=[...gallery.querySelectorAll(':scope > figure')];
    for(const figure of figures) {
      figure.classList.remove('adaptive-pair','adaptive-solo','adaptive-portrait','adaptive-landscape');
      figure.classList.add(portrait(figure)?'adaptive-portrait':'adaptive-landscape','adaptive-solo');
      const img=figure.querySelector('img');
      if(img&&!seen.has(img)){
        seen.add(img);
        img.addEventListener('load',schedule,{once:true});
        img.addEventListener('error',schedule,{once:true});
      }
    }
    for(let i=0;i<figures.length-1;i++){
      if(portrait(figures[i])&&portrait(figures[i+1])){
        figures[i].classList.replace('adaptive-solo','adaptive-pair');
        figures[i+1].classList.replace('adaptive-solo','adaptive-pair');
        i++;
      }
    }
  }
  function schedule(){
    if(queued)return;
    queued=true;
    requestAnimationFrame(layout);
  }
  const observer=new MutationObserver(schedule);
  observer.observe(gallery,{childList:true,subtree:true});
  schedule();
})();
