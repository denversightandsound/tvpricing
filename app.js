/* DS&S client TV pricing widget. Loaded by the WordPress page. */
(function(){
var host=document.getElementById('dss-tv');if(!host)return;
host.innerHTML="\n<div class=\"in\">\n  <div>\n    <p class=\"eyebrow\">Denver Sight and Sound \u00b7 Client pricing</p>\n    <h2>DS&amp;S TV Pricing</h2>\n    <p class=\"lede\">Check out our prices compared to the big box stores! We try to beat or match all authorized dealers. If you see better pricing, share the link and we can see what we can do!</p>\n    <p class=\"lede\" style=\"margin-top:12px\">We strive to get you the best tech at the best prices!</p>\n    <p class=\"lede\" style=\"margin-top:12px;font-style:italic\">Call us to confirm pricing and inventory.</p>\n  </div>\n  <div class=\"controls\">\n    <div class=\"grp\"><span class=\"lbl\">Brand</span><div class=\"chips\" data-f=\"brand\"></div></div>\n    <div class=\"grp\"><span class=\"lbl\">Type</span><div class=\"chips\" data-f=\"tech\"></div></div>\n    <div class=\"grp\"><label class=\"lbl\" for=\"dss-size\">Size</label>\n      <select id=\"dss-size\"><option value=\"\">All sizes</option><option value=\"0-50\">Up to 50\"</option><option value=\"51-65\">55\" \u2013 65\"</option><option value=\"66-85\">75\" \u2013 85\"</option><option value=\"86-999\">97\" and up</option></select></div>\n    <div class=\"grp\"><label class=\"lbl\" for=\"dss-sort\">Sort</label>\n      <select id=\"dss-sort\"><option value=\"size-asc\">Size: small to large</option><option value=\"size-desc\">Size: large to small</option><option value=\"price-asc\">Price: low to high</option><option value=\"price-desc\">Price: high to low</option><option value=\"save-desc\">Biggest savings</option></select></div>\n    <span class=\"count\" id=\"dss-count\" aria-live=\"polite\"></span>\n  </div>\n  <div class=\"grid\" id=\"dss-grid\"><div class=\"empty\">Loading current pricing\u2026</div></div>\n  <p class=\"fine\">Best Buy prices checked <span id=\"dss-checked\">recently</span> and may change. Pricing is for Denver Sight and Sound clients and subject to availability. Questions? Call <a href=\"tel:3032091038\">303-209-1038</a>.</p>\n</div>";

var BASE="https://denversightandsound.github.io/tvpricing/";
fetch(BASE+"data.json?v="+Date.now(),{cache:"no-store"}).then(function(r){return r.json()}).then(function(D){
var TVS=D.tvs;
var ck=document.getElementById("dss-checked");if(ck&&D.checked)ck.textContent=D.checked;
var root=document.getElementById("dss-tv"),st={brand:"",tech:""};
var TYPES=["OLED","Mini-LED","RGB","Art","LED","Outdoor"];
function money(v){return "$"+v.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}
root.querySelectorAll(".chips").forEach(function(box){
  var f=box.getAttribute("data-f"),vals=f==="tech"?TYPES.filter(function(t){return TVS.some(function(r){return r.tech===t})}):Array.from(new Set(TVS.map(function(r){return r.brand}))).sort();
  ["All"].concat(vals).forEach(function(v){var b=document.createElement("button");b.type="button";b.className="chip";b.textContent=v;
    b.setAttribute("aria-pressed",v==="All"?"true":"false");
    b.onclick=function(){st[f]=v==="All"?"":v;box.querySelectorAll(".chip").forEach(function(c){c.setAttribute("aria-pressed",c===b?"true":"false")});draw()};box.appendChild(b)});
});
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function draw(){
  var sz=document.getElementById("dss-size").value,so=document.getElementById("dss-sort").value.split("-");
  var rows=TVS.filter(function(r){if(st.brand&&r.brand!==st.brand)return false;if(st.tech&&r.tech!==st.tech)return false;
    if(sz){var a=sz.split("-").map(Number);if(r.size<a[0]||r.size>a[1])return false}return true});
  rows.sort(function(a,b){var k=so[0],d=so[1]==="asc"?1:-1,x=k==="size"?a.size:k==="price"?a.ours:a.bb-a.ours,y=k==="size"?b.size:k==="price"?b.ours:b.bb-b.ours;return (x-y)*d||a.size-b.size});
  document.getElementById("dss-count").textContent=rows.length+(rows.length===1?" TV":" TVs");
  document.getElementById("dss-grid").innerHTML=rows.length?rows.map(function(r){var sv=Math.round((r.bb-r.ours)*100)/100;
    return '<article class="card">'+(r.img?'<div class="pic"><img src="'+BASE+'img/'+encodeURIComponent(r.img)+'.jpg'+'" alt="'+esc(r.brand+' '+r.series)+'" loading="lazy" onerror="this.parentNode.remove()"></div>':'')+'<div class="top"><span class="brand">'+esc(r.brand)+'</span><span class="tag">'+esc(r.tech)+'</span></div>'+
    '<h3 class="name">'+r.size+'" '+esc(r.series)+'</h3><p class="model">Model '+esc(r.model)+'</p>'+(r.details&&r.details.length?'<details><summary>TV details</summary><ul>'+r.details.map(function(d){return '<li>'+esc(d)+'</li>'}).join('')+'</ul></details>':'')+
    '<div class="prices"><div><div class="ourlbl">Our price</div><div class="ours">'+money(r.ours)+'</div></div>'+
    '<div><div class="bb">Best Buy <s>'+money(r.bb)+'</s></div>'+(sv>0?'<div class="save">Save '+money(sv)+'</div>':'<div class="match">Price matched</div>')+'</div></div></article>'}).join(""):
    '<div class="empty">No TVs match those filters.</div>';
}
document.getElementById("dss-size").onchange=draw;document.getElementById("dss-sort").onchange=draw;draw();
}).catch(function(){document.getElementById("dss-grid").innerHTML='<div class="empty">Pricing is loading slowly right now. Please refresh, or call us at 303-209-1038.</div>';});
})();
