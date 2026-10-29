(function(){
  var NS='http://www.w3.org/2000/svg';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if(document.getElementById('colloids')){
  /* Brownian colloids drifting in the dusk sky */
  var cv = document.getElementById('colloids'), ctx = cv.getContext('2d');
  var W=0,H=0,dpr=Math.min(window.devicePixelRatio||1,2),parts=[];
  function size(){
    var r = cv.getBoundingClientRect(); W=r.width; H=r.height;
    cv.width=W*dpr; cv.height=H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
    var n = Math.round(Math.min(90, W*H/14000));
    parts=[];
    for(var i=0;i<n;i++){
      var rad = Math.random()<.12 ? 2.2+Math.random()*2.6 : .6+Math.random()*1.4;
      parts.push({x:Math.random()*W, y:Math.random()*H*.72, r:rad, a:.25+Math.random()*.55});
    }
  }
  function draw(){
    ctx.clearRect(0,0,W,H);
    for(var i=0;i<parts.length;i++){
      var p=parts[i];
      if(!reduce){
        var k = 0.55/Math.sqrt(p.r); // smaller particles diffuse faster
        p.x += (Math.random()-.5)*k*2 + 0.04;
        p.y += (Math.random()-.5)*k*2;
        if(p.x>W+6)p.x=-6; if(p.x<-6)p.x=W+6;
        if(p.y<-6)p.y=H*.72; if(p.y>H*.75)p.y=0;
      }
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle='rgba(255,240,236,'+p.a+')'; ctx.fill();
      if(p.r>2){ ctx.beginPath(); ctx.arc(p.x,p.y,p.r+3,0,Math.PI*2); ctx.fillStyle='rgba(255,220,215,.06)'; ctx.fill(); }
    }
    if(!reduce) requestAnimationFrame(draw);
  }
  size(); draw();
  var t; window.addEventListener('resize',function(){clearTimeout(t);t=setTimeout(function(){size(); if(reduce)draw();},150);});

  /* Prayer flags strung across the mid ridge */
  var g=document.getElementById('flags'), NS='http://www.w3.org/2000/svg';
  var cols=['#3B6FB6','#F4F4F0','#C8423B','#3E8B55','#E6B93A'];
  var x0=1110,y0=246,x1=1400,y1=228,sag=26,n=16;
  var path=document.createElementNS(NS,'path');
  var mx=(x0+x1)/2, my=(y0+y1)/2+sag*2;
  path.setAttribute('d','M'+x0+','+y0+' Q'+mx+','+my+' '+x1+','+y1);
  path.setAttribute('stroke','#E9D9D4'); path.setAttribute('stroke-width','1'); path.setAttribute('fill','none'); path.setAttribute('opacity','.7');
  g.appendChild(path);
  [[x0,y0],[x1,y1]].forEach(function(p){var l=document.createElementNS(NS,'line');l.setAttribute('x1',p[0]);l.setAttribute('x2',p[0]);l.setAttribute('y1',p[1]);l.setAttribute('y2',p[1]+40);l.setAttribute('stroke','#1E2F3C');l.setAttribute('stroke-width','2');g.appendChild(l);});
  for(var i=1;i<n;i++){
    var s=i/n, x=(1-s)*(1-s)*x0+2*(1-s)*s*mx+s*s*x1, y=(1-s)*(1-s)*y0+2*(1-s)*s*my+s*s*y1;
    var r=document.createElementNS(NS,'rect');
    r.setAttribute('x',x-5); r.setAttribute('y',y); r.setAttribute('width',10); r.setAttribute('height',13);
    r.setAttribute('fill',cols[(i-1)%5]); r.setAttribute('opacity','.88');
    g.appendChild(r);
  }

  }

  /* Past venues as a polymer chain */
  if(document.getElementById('chain')){
  var edLinks={"2020": "https://sites.google.com/view/smyim2020", "2021": "http://home.phy.iitb.ac.in/~smyim/index.html", "2022": "https://sites.google.com/view/smyim2022", "2023": "https://www.iitk.ac.in/smyim/", "2025": "https://sites.google.com/view/smyim-2025/home", "2026": "https://sites.google.com/view/smyim-2026/home"};
  var eds=[['2014','Pondicherry'],['2015','Pondicherry'],['2016','Goa'],['2018','Shimla'],['2019','Shillong'],['2020','Virtual'],['2021','Virtual'],['2022','Mysuru'],['2023','Jim Corbett'],['2024','Kodaikanal'],['2025','Shimla'],['2026','Goa'],['2027','Kalimpong']];
  var svg=document.getElementById('chain'), step=96, left=46, mid=82;
  var pts=eds.map(function(e,i){return [left+i*step, mid+(i%2?22:-22)];});
  var d='M'+pts[0][0]+','+pts[0][1];
  for(var j=1;j<pts.length;j++){
    var a=pts[j-1],b=pts[j], cx=(a[0]+b[0])/2;
    d+=' C'+cx+','+a[1]+' '+cx+','+b[1]+' '+b[0]+','+b[1];
  }
  var bond=document.createElementNS(NS,'path');
  bond.setAttribute('d',d); bond.setAttribute('fill','none'); bond.setAttribute('stroke','var(--line)'); bond.setAttribute('stroke-width','3');
  svg.appendChild(bond);
  pts.forEach(function(p,i){
    var last=i===pts.length-1, gg=document.createElementNS(NS,'g');
    if(last) gg.setAttribute('class','now');
    var c=document.createElementNS(NS,'circle');
    c.setAttribute('cx',p[0]); c.setAttribute('cy',p[1]); c.setAttribute('r', last?17:10);
    c.setAttribute('fill', last?'var(--glow)':(eds[i][1]==='Virtual'?'var(--bg)':'var(--ridge)'));
    c.setAttribute('stroke', last?'var(--glow-soft)':'var(--ridge)'); c.setAttribute('stroke-width', last?6:2);
    gg.appendChild(c);
    var up = p[1]<mid, ty = up? p[1]-34 : p[1]+40;
    var t1=document.createElementNS(NS,'text'); t1.setAttribute('x',p[0]); t1.setAttribute('y',ty); t1.setAttribute('text-anchor','middle'); t1.setAttribute('class','yr'); t1.textContent=eds[i][0];
    var t2=document.createElementNS(NS,'text'); t2.setAttribute('x',p[0]); t2.setAttribute('y',ty+17); t2.setAttribute('text-anchor','middle'); t2.textContent=eds[i][1];
    if(up){ t1.setAttribute('y',ty-14); t2.setAttribute('y',ty+3); }
    gg.appendChild(t1); gg.appendChild(t2);
    var url=edLinks[eds[i][0]];
    if(url){
      var ln=document.createElementNS(NS,'a'); ln.setAttribute('href',url); ln.setAttributeNS('http://www.w3.org/1999/xlink','xlink:href',url);
      ln.setAttribute('target','_blank'); ln.setAttribute('rel','noopener'); ln.setAttribute('class','ed-link');
      ln.setAttribute('aria-label','SMYIM '+eds[i][0]+' website, '+eds[i][1]);
      var title=document.createElementNS(NS,'title'); title.textContent='SMYIM '+eds[i][0]+' website'; ln.appendChild(title);
      ln.appendChild(gg); svg.appendChild(ln);
    } else svg.appendChild(gg);
  });

  }

  /* Committee */
  if(document.getElementById('organisers')){
  var hues=['#2E5A5B','#5A6E9A','#9A5B70','#4F7A5E','#7D6496','#A0704B','#3F6C8C','#6B7F3C'];
  function initials(n){var w=n.replace(/\./g,' ').trim().split(/\s+/);return (w[0][0]+w[w.length-1][0]).toUpperCase();}
  function slug(n){return n.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');}
  function fill(id,list){
    var ul=document.getElementById(id);
    list.forEach(function(p,i){
      var li=document.createElement('li');
      var dot=document.createElement('span'); dot.className='dot'; dot.style.setProperty('--c',hues[(i+id.length)%hues.length]); dot.textContent=initials(p[0]); dot.setAttribute('aria-hidden','true');
      var img=new Image(); img.className='dot photo'; img.alt='Photo of '+p[0]; img.width=108; img.height=108;
      img.onload=(function(d,im){return function(){ if(d.parentNode) d.parentNode.replaceChild(im,d); };})(dot,img);
      img.src=p[3]||('images/'+slug(p[0])+'.jpg');
      var box=document.createElement('div');
      var a; if(p[2]){ a=document.createElement('a'); a.href=p[2]; a.target='_blank'; a.rel='noopener'; } else { a=document.createElement('span'); a.style.fontWeight='500'; }
      a.textContent=p[0]; box.appendChild(a);
      if(p[1]){ var sm=document.createElement('small'); sm.textContent=p[1]; box.appendChild(sm); } li.appendChild(dot); li.appendChild(box); ul.appendChild(li);
    });
  }
  fill('organisers',[
    ['Aishani Ghosal','NISER Bhubaneswar'],
    ['Manoj Kumar','SNU Delhi'],
    ['Pritha Dolai','NITK Surathkal'],
    ['Raj Kumar Manna','IIT Kharagpur'],
    ['Samudrajit Thapa','IIT Guwahati'],
    ['Sourav Chowdhury','BITS Hyderabad'],
    ['Sreeja Sasidharan','Lehigh University'],
    ['Ushasi Roy','IISER Pune']
  ]);
  fill('advisors',[
    ['P. B. Sunil Kumar','IIT Madras','https://home.iitm.ac.in/sunil/'],
    ['Guruswamy Kumaraswamy','IIT Bombay','https://www.che.iitb.ac.in/faculty-page/guruswamy-kumaraswamy']
  ]);
  }
})();
(function(){var a=document.querySelector('nav.links a[aria-current="page"]'); if(a&&a.scrollIntoView&&window.innerWidth<720){a.scrollIntoView({block:'nearest',inline:'center'});}})();

/* Institute logos in the footer: files in images/, missing ones are hidden */
(function(){
  var box=document.getElementById('logos'); if(!box) return;
  var logos=[
    ['niser.png','NISER Bhubaneswar'],
    ['snu.png','Shiv Nadar University, Delhi NCR'],
    ['nitk.png','NITK Surathkal'],
    ['iitkgp.png','IIT Kharagpur'],
    ['iitg.png','IIT Guwahati'],
    ['bitsh.png','BITS Pilani, Hyderabad Campus'],
    ['lehigh.png','Lehigh University'],
    ['iiserp.png','IISER Pune']
  ];
  logos.forEach(function(l){
    var img=new Image(); img.alt=l[1]||'Institute logo'; img.loading='lazy'; img.decoding='async';
    img.onerror=function(){ img.remove(); if(!box.querySelector('img')) box.hidden=true; };
    img.src='images/'+l[0]; box.appendChild(img);
  });
})();
