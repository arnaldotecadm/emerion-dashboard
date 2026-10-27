() => {
  const parse = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[ ,\/]+/).filter(Boolean).map(Number); return {r:p[0],g:p[1],b:p[2],a:p.length>3?p[3]:1}; };
  const lum = ({r,g,b}) => { const f = v => { v/=255; return v<=0.03928? v/12.92 : Math.pow((v+0.055)/1.055,2.4); }; return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b); };
  const effBg = (el) => { while (el) { const c = parse(getComputedStyle(el).backgroundColor); if (c && c.a > 0.5) return c; el = el.parentElement; } return {r:10,g:18,b:29,a:1}; };
  const white = []; const low = [];
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect(); if (r.width < 4 || r.height < 4) continue;
    const cs = getComputedStyle(el); if (cs.visibility==='hidden' || cs.display==='none' || +cs.opacity===0) continue;
    const bg = parse(cs.backgroundColor);
    if (bg && bg.a > 0.5 && lum(bg) > 0.7 && r.width > 40 && r.height > 20) white.push((el.tagName+'.'+(el.className.baseVal??el.className)).slice(0,120) + ' ' + cs.backgroundColor);
    const txt = [...el.childNodes].filter(n => n.nodeType===3).map(n=>n.textContent.trim()).join('');
    if (txt.length > 1 && el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE') {
      const fg = parse(cs.color); const b = effBg(el);
      if (fg) { const L1 = lum(fg), L2 = lum(b); const cr = (Math.max(L1,L2)+0.05)/(Math.min(L1,L2)+0.05); if (cr < 3) low.push(txt.slice(0,40)+' | '+cs.color+' on '+`rgb(${b.r},${b.g},${b.b})`+' cr='+cr.toFixed(2)); }
    }
  }
  return {white: [...new Set(white)].slice(0,15), low: [...new Set(low)].slice(0,20)};
}
