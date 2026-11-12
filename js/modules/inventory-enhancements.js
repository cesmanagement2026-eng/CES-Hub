/* CES Hub V31 — Stock contract detail, Inventory tab stability, Settings/KPI Drive UI */
(function(){
  'use strict';
  var VERSION='V31';
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function el(id){return document.getElementById(id);}
  function dateObj(v){if(!v)return null;var d=new Date(v);return isNaN(d)?null:d;}
  function fmtDate(v){var d=dateObj(v);return d?d.toLocaleDateString('th-TH',{day:'2-digit',month:'short',year:'numeric'}):'-';}
  function stockRows(){
    try{if(typeof SI!=='undefined'&&Array.isArray(SI.inv)&&SI.inv.length)return SI.inv;}catch(e){}
    var b=window.CES_STOCK_BOOTSTRAP;return b&&Array.isArray(b.devices)?b.devices:[];
  }
  function injectStyle(){
    if(el('ces-v31-style'))return;
    var s=document.createElement('style');s.id='ces-v31-style';s.textContent=`
      #view-report .ces-report-icon-v31{border:0!important;box-shadow:0 5px 14px rgba(15,23,42,.06)!important;background:#fff!important;background-image:none!important;color:#003DA5!important}
      #view-inventory .ces-v31-hidden{display:none!important}
      #view-inventory #siEquipFilters,#view-inventory #siAccFilters,#view-inventory #siEquipKpiGrid,#view-inventory #siAccKpiGrid,#view-inventory #siEquipSection,#view-inventory #siAccSection{transition:none!important}
      .ces-v31-contract-summary{display:grid;grid-template-columns:2fr repeat(3,1fr);gap:10px;margin:0 0 14px;text-align:left}
      .ces-v31-contract-summary>div{background:#f8fafc;border:1px solid #e2e8f0;border-radius:13px;padding:11px 13px;min-width:0}
      .ces-v31-contract-summary small{display:block;color:#64748b;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px}
      .ces-v31-contract-summary strong{display:block;color:#0f172a;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .ces-v31-contract-wrap{border:1px solid #dbe5f1;border-radius:15px;overflow:auto;max-height:520px;background:#fff}
      .ces-v31-contract-table{width:100%;min-width:1050px;border-collapse:separate;border-spacing:0;text-align:left;font-size:12px}
      .ces-v31-contract-table th{position:sticky;top:0;z-index:2;background:#f4f8fc;color:#52647a;text-transform:uppercase;font-size:10px;letter-spacing:.04em;padding:11px 12px;border-bottom:1px solid #dbe5f1;white-space:nowrap}
      .ces-v31-contract-table td{padding:10px 12px;border-bottom:1px solid #edf2f7;color:#334155;vertical-align:middle;white-space:nowrap}
      .ces-v31-contract-table tbody tr:hover td{background:#f8fbff}
      .ces-v31-contract-table .model{white-space:normal;min-width:145px}.ces-v31-contract-table .action{white-space:normal;min-width:180px}
      .ces-v31-contract-status{display:inline-flex;padding:4px 8px;border-radius:999px;font-size:10px;font-weight:900}.ces-v31-contract-status.ok{background:#dcfce7;color:#047857}.ces-v31-contract-status.late{background:#fee2e2;color:#b91c1c}
      @media(max-width:800px){.ces-v31-contract-summary{grid-template-columns:1fr 1fr}}
    `;document.head.appendChild(s);
  }

  function applyInventoryTab(tab){
    tab=tab==='acc'?'acc':'equip';
    try{if(typeof SI!=='undefined')SI.tab=tab;}catch(e){}
    var equip=tab==='equip';
    [['siTabEquip',equip],['siTabAcc',!equip]].forEach(function(x){var n=el(x[0]);if(n)n.classList.toggle('active',x[1]);});
    [['siEquipFilters',equip],['siEquipKpiGrid',equip],['siEquipSection',equip],['siAccFilters',!equip],['siAccKpiGrid',!equip],['siAccSection',!equip]].forEach(function(x){
      var n=el(x[0]);if(!n)return;n.classList.toggle('hidden',!x[1]);n.classList.toggle('ces-v31-hidden',!x[1]);n.style.setProperty('display',x[1]?'grid':'none','important');
    });
  }
  // Rental contract detail is owned by stock-dashboard.js / 991 runtime stock layer.
  // Do not override it in this mixed Stock/Settings/KPI compatibility patch.

  window.CES_KPI_DRIVE_DEFAULTS=window.CES_KPI_DRIVE_DEFAULTS||{};
  var baseKpiSwitch=window.switchKpiTab;
  if(typeof baseKpiSwitch==='function')window.switchKpiTab=function(team){
    var out=baseKpiSwitch.apply(this,arguments);setTimeout(function(){
      var cfg=(typeof globalConfig!=='undefined'&&globalConfig)?globalConfig:{};
      var defaults=window.CES_KPI_DRIVE_DEFAULTS||{};
      var generic=el('kpi-drive-link'),title=el('kpi-drive-title'),ehs=el('kpi-drive-ehs-link'),env=el('kpi-drive-env-link');
      [generic,ehs,env].forEach(function(n){if(n){n.classList.add('hidden');n.classList.remove('flex');}});
      if(team==='EHS'){
        var eu=String(cfg.KPI_DRIVE_EHS||defaults.EHS||'').trim(),vu=String(cfg.KPI_DRIVE_ENV||defaults.ENV||cfg.KPI_DRIVE_EHS||defaults.EHS||'').trim();
        if(ehs&&eu&&eu!=='#'){ehs.href=eu;ehs.classList.remove('hidden');ehs.classList.add('flex');}
        if(env&&vu&&vu!=='#'){env.href=vu;env.classList.remove('hidden');env.classList.add('flex');}
      }else if(generic&&title){
        var url=String(cfg['KPI_DRIVE_'+team]||defaults[team]||'').trim();
        if(url&&url!=='#'){generic.href=url;title.textContent='Drive '+team;generic.classList.remove('hidden');generic.classList.add('flex');}
      }
    },0);return out;
  };

  window.CES_STOCK_SETTINGS_KPI_RECHECK=function(){
    var visible=['siEquipFilters','siAccFilters','siEquipSection','siAccSection'].filter(function(id){var n=el(id);return n&&getComputedStyle(n).display!=='none';});
    var out={version:VERSION,reportIconBorder:el('view-report')?getComputedStyle(document.querySelector('#view-report .ces-report-icon-v31')).borderStyle:'-',inventoryTitle:(document.querySelector('#view-inventory h1')||{}).textContent||'',inventoryVisibleBlocks:visible,contractDetail:typeof window.sd_contractDetail==='function',kpiDriveDefaults:window.CES_KPI_DRIVE_DEFAULTS};console.log('[CES V31 Recheck]',out);return out;
  };
  injectStyle();
  document.addEventListener('DOMContentLoaded',injectStyle);
})();


(function(){
  'use strict';
  var teamChart=null,statusChart=null;
  function esc_(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function acc_(){return(typeof SI!=='undefined'&&Array.isArray(SI.acc))?SI.acc:[];}
  function applySourceLink_(){var a=document.getElementById('siInventorySourceLink');if(!a)return;var id=String((window.CES_CONFIG&&window.CES_CONFIG.EXPECTED_SHEETS&&window.CES_CONFIG.EXPECTED_SHEETS.STOCK)||'').trim();if(id){a.href='https://docs.google.com/spreadsheets/d/'+encodeURIComponent(id)+'/edit';a.classList.remove('opacity-40');}else{a.removeAttribute('href');a.classList.add('opacity-40');a.title='Upload NO SHARED Inventory to Google Sheets, then configure CES_STOCK_SPREADSHEET_ID';}}
  function qty_(x){return Number(x.stockQty||x.stock_qty||x.qty||0)||0;}
  function min_(x){return Number(x.minStockQty||x.min_stock_qty||x.minStock||x.min_stock||0)||0;}
  function cost_(x){var v=x.cost!=null?x.cost:(x.unitCost!=null?x.unitCost:(x.unit_cost!=null?x.unit_cost:(x.costea!=null?x.costea:(x['Cost/ea']!=null?x['Cost/ea']:(x.totalCost||x.total_cost||0)))));return Number(String(v==null?'':v).replace(/[฿,\s]/g,''))||0;}
  function totalCost_(x){var v=x.totalCost!=null?x.totalCost:(x.total_cost!=null?x.total_cost:x.inventoryValue);var n=Number(String(v==null?'':v).replace(/[฿,\s]/g,''))||0;return n||qty_(x)*cost_(x);}
  function team_(x){var t=String(x.allocationTeam||x.team||'OTHER').trim().toUpperCase();return ['MED','LAB','EHS','TES','OTHER'].includes(t)?t:'OTHER';}
  function type_(x){return String(x.type||x.accessoriesType||x.accessories_type||x['Accessories Type']||x.category||'GENERAL').trim()||'GENERAL';}
  function status_(x){var raw=String(x.status||'').toUpperCase(),q=qty_(x),m=min_(x);if(raw.indexOf('PENDING')>=0)return'PENDING_APPROVAL';if(q===0&&m===0)return'UNALLOCATED';if(q===0)return'OUT_OF_STOCK';return m>0&&q<=m?'LOW_STOCK':'STOCK';}
  function updated_(x){return String(x.lastCheckTimestamp||x.last_check_timestamp||x.lastCheckDate||x.last_check_date||x.addStockDate||x['Add Stock Date']||'').trim();}
  function unique_(rows,fn){var m={};(rows||[]).forEach(function(x){var v=fn(x);if(v)m[v]=1;});return Object.keys(m).sort(function(a,b){return a.localeCompare(b);});}
  function filtered_(){
    var a=acc_(),t=(document.getElementById('siDashFilterTeamV3031')||{}).value||'all',ty=(document.getElementById('siDashFilterTypeV3031')||{}).value||'all',st=(document.getElementById('siDashFilterStatusV3031')||{}).value||'all';
    return a.filter(function(x){return(t==='all'||team_(x)===t)&&(ty==='all'||type_(x)===ty)&&(st==='all'||status_(x)===st);});
  }
  function fillFilters_(){
    var a=acc_(),defs=[['siDashFilterTeamV3031',['MED','LAB','EHS','TES','OTHER'],'All Teams'],['siDashFilterTypeV3031',unique_(a,type_),'All Accessories Type']];
    defs.forEach(function(d){var el=document.getElementById(d[0]);if(!el)return;var cur=el.value||'all';el.innerHTML='<option value="all">'+d[2]+'</option>'+d[1].map(function(v){return'<option value="'+esc_(v)+'">'+esc_(v)+'</option>';}).join('');el.value=d[1].indexOf(cur)>=0?cur:'all';});
  }
  function card_(id,label,value,sub,icon,cls,prefix){return'<div class="si-dash-kpi-icon-v3031 '+cls+'"><i class="fas '+icon+'"></i></div><div class="si-dash-kpi-copy-v3031"><span>'+label+'</span><b id="'+id+'">'+(prefix||'')+Number(value||0).toLocaleString('en-US',{maximumFractionDigits:2})+'</b><small>'+sub+'</small></div>';}
  function renderKpi_(rows){
    var types=unique_(rows,type_),allocated=rows.reduce(function(s,x){return s+qty_(x);},0),showPending=rows.length===acc_().length,pending=(typeof SI!=='undefined'&&SI.raw&&SI.raw.kpi)?Number(SI.raw.kpi.pendingStock||0):0,total=allocated+(showPending?pending:0),low=rows.filter(function(x){return ['LOW_STOCK','OUT_OF_STOCK'].includes(status_(x));}).length,cost=rows.reduce(function(s,x){return s+totalCost_(x);},0);if(showPending&&typeof SI!=='undefined'&&SI.raw&&SI.raw.costSummary)cost=Number(SI.raw.costSummary.sum||cost);
    var vals=[['siDashTotalAccCurrent',card_('siDashTotalAccCurrent','SKU Allocations',rows.length,'Item / team rows in filter','fa-layer-group','blue')],['siDashTotalStockCurrent',card_('siDashTotalStockCurrent','Team Stock',allocated,'Allocated units in filter','fa-boxes-stacked','green')],['siDashLowAccCurrent',card_('siDashLowAccCurrent','Low / Out Stock',low,'Items at / below minimum','fa-triangle-exclamation','amber')],['siDashCostCurrent',card_('siDashCostCurrent','Stock Value',cost,'Stock value by vendor unit cost','fa-coins','violet','฿')]];
    vals.forEach(function(x){var n=document.getElementById(x[0]);if(!n)return;var host=n.closest('.stockpro-card')||n.parentElement;if(!host)return;host.classList.add('si-dash-kpi-card-v3031');host.innerHTML=x[1];});
    var r=document.getElementById('siDashFilterResultV3031');if(r)r.textContent=rows.length.toLocaleString('en-US')+' team rows · '+allocated.toLocaleString('en-US')+' allocated units'+(showPending?' · '+pending.toLocaleString('en-US')+' pending':'');
  }
   function renderCharts_(rows){
     var palette={MED:'#004aad',LAB:'#19a7ce',EHS:'#0fc1a1',TES:'#ffde59',OTHER:'#b4b4b4',SHARED:'#94a3b8'};Object.keys(palette).forEach(function(k){if(k!=='SHARED'&&typeof window.cesGetTeamColor==='function')palette[k]=window.cesGetTeamColor(k)||palette[k];});
     var teams=['MED','LAB','EHS','TES','OTHER'],kinds=unique_(rows,type_).sort(function(a,b){return ['General','Other','Report'].indexOf(a)-['General','Other','Report'].indexOf(b);});
     var quantities={},summaries={};rows.forEach(function(x){var team=team_(x),type=type_(x),q=qty_(x);quantities[type+'|'+team]=(quantities[type+'|'+team]||0)+q;var item=summaries[team]||(summaries[team]={qty:0,items:0});item.qty+=q;item.items++;});
     var tc=document.getElementById('siAccessoriesTeamChartV3028'),sc=document.getElementById('siAccessoriesStatusChartV3028');
     if(teamChart)try{teamChart.destroy();}catch(e){}if(statusChart)try{statusChart.destroy();}catch(e){}
     if(tc&&typeof Chart!=='undefined')teamChart=new Chart(tc,{type:'bar',data:{labels:kinds,datasets:teams.map(function(team){return{label:team,data:kinds.map(function(type){return quantities[type+'|'+team]||0;}),backgroundColor:palette[team],borderRadius:5,maxBarThickness:46};})},options:{responsive:true,maintainAspectRatio:false,interaction:{mode:'index',intersect:false},plugins:{legend:{position:'bottom',labels:{boxWidth:10,usePointStyle:true,padding:12}}},scales:{x:{stacked:true,grid:{display:false}},y:{stacked:true,beginAtZero:true,ticks:{precision:0}}}}});
     var statuses=['STOCK','LOW_STOCK','OUT_OF_STOCK','UNALLOCATED'],counts=statuses.map(function(st){return rows.filter(function(x){return status_(x)===st;}).length;});
     if(sc&&typeof Chart!=='undefined')statusChart=new Chart(sc,{type:'doughnut',data:{labels:['In stock','Low stock','Out of stock','Not allocated'],datasets:[{data:counts,backgroundColor:['#10b981','#f59e0b','#dc2626','#94a3b8'],borderWidth:0,hoverOffset:4}]},options:{responsive:true,maintainAspectRatio:false,cutout:'68%',plugins:{legend:{position:'bottom',labels:{boxWidth:10,usePointStyle:true,padding:12}}}}});
     var strip=document.getElementById('siAllocationStrip');if(strip){var p=typeof SI!=='undefined'&&SI.raw&&SI.raw.kpi?Number(SI.raw.kpi.pendingStock||0):0;strip.innerHTML=teams.map(function(team){var x=summaries[team]||{qty:0,items:0};return'<div class="ces-team-stock-chip"><span class="ces-team-dot" style="background:'+palette[team]+'"></span><div><b>'+team+'</b><small>Team stock</small></div><strong>'+x.qty.toLocaleString('en-US')+' <small>units</small></strong></div>';}).join('')+'<div class="ces-team-stock-chip shared"><span class="ces-team-dot" style="background:#94a3b8"></span><div><b>Pending Allocation</b><small>Not available for checkout</small></div><strong>'+p.toLocaleString('en-US')+' <small>units</small></strong></div>';}
   }
  function renderSummary_(rows){
    var map={};rows.forEach(function(x){var k=team_(x)+'||'+type_(x);if(!map[k])map[k]={team:team_(x),type:type_(x),items:0,stock:0,min:0,low:0,cost:0,updated:''};var q=qty_(x),m=min_(x),u=updated_(x);map[k].items++;map[k].stock+=q;map[k].min+=m;map[k].cost+=totalCost_(x);if(['LOW_STOCK','OUT_OF_STOCK'].includes(status_(x)))map[k].low++;if(u&&(!map[k].updated||String(u).localeCompare(String(map[k].updated))>0))map[k].updated=u;});
    var root=document.getElementById('siAccessoriesSummaryV3028');if(!root)return;
    var list=Object.keys(map).map(function(k){return map[k];}).sort(function(a,b){return a.team.localeCompare(b.team)||a.type.localeCompare(b.type);});
    root.innerHTML='<div class="si-accessories-summary-wrap-v3031"><table><thead><tr><th>Team</th><th>Accessories Type</th><th>SKU rows</th><th>Stock Qty</th><th>Min Stock</th><th>Status</th><th>Last Stock Update</th><th>Cost</th></tr></thead><tbody>'+list.map(function(x){var low=x.low>0,empty=x.stock===0&&x.min===0;return'<tr><td><b>'+esc_(x.team)+'</b></td><td>'+esc_(x.type)+'</td><td>'+x.items.toLocaleString('en-US')+'</td><td><b>'+x.stock.toLocaleString('en-US')+'</b></td><td>'+x.min.toLocaleString('en-US')+'</td><td><span class="'+(low?'low':empty?'pending':'ok')+'">'+(low?'LOW / OUT':empty?'UNALLOCATED':'STOCK')+'</span></td><td>'+esc_(x.updated||'-')+'</td><td><b>฿'+x.cost.toLocaleString('en-US',{maximumFractionDigits:2})+'</b></td></tr>';}).join('')+'</tbody></table></div>'+(list.length?'':'<div class="si-dash-empty-v3031">No accessory data for current filter.</div>');
  }
  function render(){applySourceLink_();fillFilters_();var rows=filtered_();renderKpi_(rows);renderCharts_(rows);renderSummary_(rows);}
  window.si_renderAccessoriesDashboard=render;
  window.si_resetDashboardFilters=function(){['siDashFilterTeamV3031','siDashFilterTypeV3031','siDashFilterStatusV3031'].forEach(function(id){var e=document.getElementById(id);if(e)e.value='all';});render();};
  var prior=window.si_switchTab;
  window.si_switchTab=function(t){var r=prior?prior.apply(this,arguments):undefined;if(String(t||'')==='dashboard')setTimeout(render,20);return r;};
  var init=window.initStockInventoryModule;
  if(typeof init==='function')window.initStockInventoryModule=function(){var r=init.apply(this,arguments);if(r&&typeof r.then==='function')return r.then(function(v){setTimeout(render,30);return v;});setTimeout(render,160);return r;};
  var st=document.createElement('style');st.textContent=`
    #view-inventory .si-dash-filter-card-v3031{background:#fff;border:1px solid #dbe5f0;border-radius:16px;padding:12px 14px;box-shadow:0 5px 18px rgba(15,23,42,.045)}
    #view-inventory .si-dash-filter-title-v3031{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:9px;color:#334155;font-size:11px;font-weight:950}.si-dash-filter-title-v3031 span:last-child{font-size:9px;color:#64748b;font-weight:800}
    #view-inventory .si-dash-filter-grid-v3031{display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:8px}.si-dash-filter-grid-v3031 select{height:36px;border:1px solid #d5e0eb;border-radius:10px;background:#f8fbff;padding:0 10px;font-size:10px;font-weight:800;color:#334155;min-width:0}
    #view-inventory .si-dash-kpi-card-v3031{display:flex!important;align-items:center;gap:10px;padding:13px 14px!important;min-height:86px!important}.si-dash-kpi-icon-v3031{width:40px;height:40px;border-radius:13px;display:grid;place-items:center;flex:none;font-size:15px}.si-dash-kpi-icon-v3031.blue{background:#dbeafe;color:#2563eb}.si-dash-kpi-icon-v3031.green{background:#dcfce7;color:#059669}.si-dash-kpi-icon-v3031.amber{background:#fef3c7;color:#d97706}.si-dash-kpi-icon-v3031.violet{background:#ede9fe;color:#7c3aed}.si-dash-kpi-icon-v3031.cyan{background:#cffafe;color:#0891b2}.si-dash-kpi-copy-v3031 span{display:block;font-size:9px;color:#64748b;font-weight:900}.si-dash-kpi-copy-v3031 b{display:block;font-size:24px;line-height:1.05;color:#0f172a;margin-top:3px}.si-dash-kpi-copy-v3031 small{display:block;font-size:8px;color:#94a3b8;margin-top:4px;white-space:nowrap}.si-accessories-summary-wrap-v3031{max-height:430px;overflow:auto;border:1px solid #e2e8f0;border-radius:14px}.si-accessories-summary-wrap-v3031 table{width:100%;border-collapse:collapse;font-size:10px;min-width:860px}.si-accessories-summary-wrap-v3031 th{position:sticky;top:0;background:#edf4fb;color:#415b76;text-align:left;padding:10px;border-bottom:1px solid #dbe5f0;z-index:2}.si-accessories-summary-wrap-v3031 td{padding:9px 10px;border-bottom:1px solid #edf2f7}.si-accessories-summary-wrap-v3031 span{display:inline-flex;border-radius:999px;padding:4px 8px;font-weight:900}.si-accessories-summary-wrap-v3031 .low{background:#fee2e2;color:#b91c1c}.si-accessories-summary-wrap-v3031 .pending{background:#ede9fe;color:#6d28d9}.si-accessories-summary-wrap-v3031 .ok{background:#dcfce7;color:#047857}.si-accessories-summary-wrap-v3031 .gap-bad{background:#fee2e2;color:#b91c1c;border-radius:999px;padding:4px 8px;font-weight:900}.si-accessories-summary-wrap-v3031 .gap-ok{background:#dcfce7;color:#047857;border-radius:999px;padding:4px 8px;font-weight:900}.si-dash-empty-v3031{padding:28px;text-align:center;color:#64748b;font-size:11px}@media(max-width:760px){#view-inventory .si-dash-filter-grid-v3031{grid-template-columns:1fr 1fr}.si-dash-filter-grid-v3031 button{grid-column:1/-1}}
  `;document.head.appendChild(st);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(render,120);});else setTimeout(render,120);
})();


// ===== Accessories inventory and allocation =====
/* CES Hub — Accessories allocation, checkout and inventory dashboard. */
(function(w,d){'use strict';
 const $=id=>d.getElementById(id),esc=v=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const n=v=>Number(v||0)||0, money=v=>'฿'+n(v).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
 const call=(method,payload,timeout=35000)=>w.CES_API.callFunction(method,payload==null?[]:[payload],{transport:/^(si_get|getInventory)/.test(method)?'jsonp':'iframe',timeoutMs:timeout,dedupe:/^(si_get|getInventory)/.test(method),priority:'active',userAction:!/^(si_get|getInventory)/.test(method),silentLoading:/^(si_get|getInventory)/.test(method),module:'inventory'});
 const state={pending:null,detail:null,selected:{},dash:null,chart:null,sourceMode:'server'};
 function style(){if($('cesHub-style'))return;const st=d.createElement('style');st.id='cesHub-style';st.textContent=`
 #view-inventory .cesHub-access-table-scroll{overflow:auto;max-width:100%;max-height:68vh;scrollbar-gutter:stable;border-radius:14px;border:1px solid #dbe6f4;background:white}
 #view-inventory .cesHub-access-table{width:100%;min-width:670px;border-collapse:separate;border-spacing:0;font:12px 'Prompt',sans-serif}
 #view-inventory .cesHub-access-table th{position:sticky;top:0;background:#eef5ff;color:#365578;font-size:11px;text-align:left;z-index:2;padding:13px 11px;border-bottom:1px solid #dbe5f0;white-space:nowrap}
 #view-inventory .cesHub-access-table td{padding:12px 11px;border-bottom:1px solid #edf2f7;vertical-align:middle;color:#27364b}
 #view-inventory #siCartFab,#view-inventory .sp-cart-fab{position:fixed!important;right:22px!important;bottom:100px!important;z-index:2147483000!important}#view-inventory .cesHub-access-table tr:hover td{background:#f8fbff}#view-inventory .cesHub-access-table tbody tr{border-left:3px solid var(--ces-row-team,#94a3b8)}#view-inventory .cesHub-item b{display:block;font-size:13px;color:#14345b}#view-inventory .cesHub-item small{display:block;font-size:10px;color:#8391a3;margin-top:4px}#view-inventory .cesHub-team{border-left:4px solid var(--team-color,#94a3b8);background:#f6f9fd;color:#183553;border-radius:8px;padding:6px 8px;font-weight:800}#view-inventory .cesHub-access-table td:nth-child(4){font-variant-numeric:tabular-nums}#view-inventory .ces-restock-footer{display:flex;gap:12px;align-items:center;justify-content:space-between;padding:15px;border-top:1px solid #e2e8f0;background:#f8fbff;position:sticky;bottom:0;z-index:3}#view-inventory .ces-restock-footer p{color:#60758b;font-size:11px}
 #view-inventory .cesHub-access-table .cesHub-muted{font-size:10px;color:#6b7f9a}
 .cesHub-pill{display:inline-block;border-radius:999px;padding:5px 10px;font-size:10px;font-weight:800;white-space:nowrap}.cesHub-pill.ok{background:#dcfce7;color:#047857}.cesHub-pill.low{background:#fee2e2;color:#b91c1c}.cesHub-pill.zero{background:#f1f5f9;color:#475569}
 .cesHub-btn{border:1px solid #d4e3f3;border-radius:9px;padding:7px 10px;background:white;color:#0b4daf;font-size:11px;font-weight:800;cursor:pointer}.cesHub-btn.primary{background:#004aad;color:white;border-color:#004aad}.cesHub-btn.warn{background:#fff7ed;border-color:#fed7aa;color:#c2410c}
 .cesHub-qty{width:55px;border:1px solid #d4e1ef;border-radius:8px;padding:8px;text-align:center}
 .cesHub-subteam{max-width:125px;width:100%;border:1px solid #bfdbfe;border-radius:9px;padding:7px;color:#104c9a;background:#fff;font-size:11px;font-weight:700}
 .cesHub-filters{display:flex;gap:7px;flex-wrap:wrap;align-items:center;padding:9px 0}.cesHub-filters select{border:1px solid #d4e1ef;background:white;color:#334155;padding:8px;border-radius:9px;font-size:11px}
 .cesHub-dashboard{padding:15px;background:#fff;border:1px solid #e0e9f4;border-radius:16px;margin-top:14px}.cesHub-dashboard select{padding:8px;border:1px solid #dae5f2;border-radius:8px}
 .cesHub-flex{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px}.cesHub-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px}.cesHub-kpi{background:#f7faff;border:1px solid #e2edfa;border-radius:12px;padding:14px}.cesHub-kpi b{display:block;color:#0349a6;font-size:23px;margin-top:4px}.cesHub-mini-table{width:100%;border-collapse:collapse;font-size:11px}.cesHub-mini-table th,.cesHub-mini-table td{padding:8px;border-bottom:1px solid #e4eaf2;text-align:left}
 @media(max-width:800px){.cesHub-grid{grid-template-columns:repeat(2,minmax(0,1fr))}#view-inventory .cesHub-dashboard,#view-inventory .cesHub-access-table-scroll{max-width:100%;overflow-x:auto}#view-inventory .ces-restock-footer{min-width:520px}}
 `;d.head.appendChild(st);}
 function profile(){const u=w.currentUser||w.CES_CURRENT_USER||w.loggedInUser||{};return{name:u.name_th||u.nameTh||u.thaiName||u.name||u.name_eng||u.nameEng||'',id:u.employeeId||u.empId||u.id||u.userId||'',team:u.team||u.mainTeam||'',costCenter:u.costCenter||u.cost_center||'',email:u.email||''};}
 function fillCheckout(){const u=profile(),fields={siBorrower:u.name,siCheckoutEmployeeId:String(u.id),siCheckoutTeam:u.team,siCheckoutLocation:'Warehouse',siCheckoutCostCenter:String(u.costCenter),siBorrowDate:new Date().toLocaleDateString('en-CA')};Object.keys(fields).forEach(id=>{const el=$(id);if(!el||String(el.value||'').trim()||!fields[id])return;if(el.tagName==='SELECT'&&!Array.from(el.options).some(o=>o.value===fields[id]))el.add(new Option(fields[id],fields[id]));el.value=fields[id];});if($('siCheckoutTeam'))$('siCheckoutTeam').readOnly=false;}
 let staffLookupPending=null,staffLookupDone='';
 function loadStaffFromSheet(){const p=profile();if(!p.id||staffLookupPending||staffLookupDone===String(p.id))return;staffLookupPending=w.CES_API?.callFunction('getStaffProfile',[{employeeId:String(p.id)}],{transport:'jsonp',timeoutMs:26000,dedupe:true,module:'inventory',silentLoading:true});staffLookupPending?.then(r=>{if(r?.success){staffLookupDone=String(p.id);[['siBorrower',r.employeeName],['siCheckoutEmployeeId',r.employeeId],['siCheckoutCostCenter',r.costCenter],['siCheckoutTeam',r.team]].forEach(([id,val])=>{const el=$(id);if(el&&!String(el.value||'').trim()&&val){if(el.tagName==='SELECT'&&!Array.from(el.options).some(o=>o.value===val))el.add(new Option(val,val));el.value=val;}});}}).catch(()=>{}).finally(()=>staffLookupPending=null);}

 function groups(){const map=new Map();(w.SI?.acc||[]).forEach(a=>{const key=a.itemGroupId||a.accessoryId||a.itemName;if(!map.has(key))map.set(key,[]);map.get(key).push(a);});return Array.from(map.entries()).map(([id,items])=>({id,items,total:items.reduce((s,x)=>s+n(x.stockQty),0),name:items[0].itemName||items[0].name,kind:items[0].type||'',low:items.some(x=>n(x.minStockQty)>0&&n(x.stockQty)<=n(x.minStockQty))}));}
 function pick(g){const selected=g.items.find(a=>a.accessoryId===state.selected[g.id]);const team=$('siAccTeam')?.value||'all';if(team!=='all'){return selected&&selected.team===team?selected:(g.items.find(a=>a.team===team&&n(a.stockQty)>0)||g.items.find(a=>a.team===team)||g.items[0]);}return selected&&selected.team!=='SHARED'?selected:(g.items.find(a=>a.team!=='SHARED'&&n(a.stockQty)>0)||g.items.find(a=>a.team!=='SHARED')||g.items[0]);}
 function opt(id,values,label){const element=$(id);if(!element)return;const old=element.value;element.innerHTML='<option value="all">'+label+'</option>'+values.filter(Boolean).sort().map(v=>'<option value="'+esc(v)+'">'+esc(v)+'</option>').join('');element.value=values.includes(old)?old:'all';}
 function filters(){const acc=w.SI?.acc||[],teams=[...new Set(acc.map(a=>a.team).filter(t=>String(t).toUpperCase()!=='SHARED'))],items=[...new Set(acc.map(a=>a.itemName))],types=[...new Set(acc.map(a=>a.type))],vendors=[...new Set(acc.map(a=>a.vendor1))],status=['STOCK','LOW_STOCK','UNALLOCATED'];opt('siAccTeam',teams,'All Teams');opt('siAccItem',items,'All Items');opt('siAccStatus',status,'All Status');opt('si69Type',types,'All Types');opt('si69Vendor',vendors,'All Vendors');}
 function ensureFilters(){if($('si69Type'))return;const bar=$('siAccFilters');if(!bar)return;bar.insertAdjacentHTML('beforeend','<select id="si69Type" onchange="siInventory_renderAccessories()"><option value="all">All Types</option></select><select id="si69Vendor" onchange="siInventory_renderAccessories()"><option value="all">All Vendors</option></select><button type="button" class="cesHub-btn warn" onclick="siInventory_batchRestock()">+ Batch Restock</button>');}
 function badges(a){const low=n(a.minStockQty)>0&&n(a.stockQty)<=n(a.minStockQty),empty=n(a.stockQty)===0&&n(a.minStockQty)===0;return'<span class="cesHub-pill '+(low?'low':empty?'zero':'ok')+'">'+(low?'LOW STOCK':empty?'UNALLOCATED':'STOCK')+'</span>';}
 function visible(g){const q=String($('siAccSearch')?.value||'').toLowerCase(),team=$('siAccTeam')?.value||'all',item=$('siAccItem')?.value||'all',status=$('siAccStatus')?.value||'all',type=$('si69Type')?.value||'all',vendor=$('si69Vendor')?.value||'all',action=$('siAccAction')?.value||'all';return (!q||[g.id,g.name,g.kind,...g.items.map(x=>[x.vendor1,x.itemDetail,x.team].join(' '))].join(' ').toLowerCase().includes(q))&&(team==='all'||g.items.some(x=>x.team===team))&&(item==='all'||g.name===item)&&(type==='all'||g.kind===type)&&(vendor==='all'||g.items.some(x=>x.vendor1===vendor))&&(status==='all'||g.items.some(x=>(x.status||'').toUpperCase()===status))&&(action==='all'||g.items.some(x=>x.actionRequired===action));}
 w.siInventory_select=function(id,value,silent){state.selected[id]=value;if(!silent)w.siInventory_renderAccessories();};
 w.siInventory_renderAccessories=function(){
  style();ensureFilters();
  const all=groups(),byGroup=all.reduce((out,g)=>(out[g.id]=g,out),{});
  const rowFilter=a=>{const val=id=>String($(id)?.value||'all'),q=String($('siAccSearch')?.value||'').trim().toLowerCase();
    const status=n(a.stockQty)<=0?'UNALLOCATED':n(a.stockQty)-n(a.minStockQty)<=1?'LOW_STOCK':'STOCK';
    return String(a.team||'').toUpperCase()!=='SHARED'&& (val('siAccTeam')==='all'||a.team===val('siAccTeam'))&&
     (val('siAccItem')==='all'||a.itemName===val('siAccItem'))&&
     (val('siAccStatus')==='all'||status===val('siAccStatus'))&&
     (val('si69Type')==='all'||a.type===val('si69Type'))&&
     (val('si69Vendor')==='all'||a.vendor1===val('si69Vendor'))&&
     (!q||[a.accessoryId,a.itemName2,a.itemName,a.itemDetail,a.team,a.vendor1].join(' ').toLowerCase().includes(q));};
  const rows=all.flatMap(g=>g.items.map(a=>({a,g}))).filter(x=>rowFilter(x.a));
  w.SI.accFiltered=rows.map(x=>x.a);
  const pageCount=Math.max(1,Math.ceil(rows.length/40));w.SI.accPage=Math.min(pageCount,Math.max(1,w.SI.accPage||1));
  const page=rows.slice((w.SI.accPage-1)*40,w.SI.accPage*40);
  const tbody=page.map(({a,g})=>{
    const q=n(a.stockQty),min=n(a.minStockQty),available=Math.max(0,q-min-1),id=esc(a.accessoryId),selected=esc(g.id),team=String(a.team||'SHARED').toUpperCase();
    const color=typeof w.cesGetTeamColor==='function'?w.cesGetTeamColor(team):(team==='SHARED'?'#94a3b8':'#64748b');
    const low=available===0,st=q<=0?(min>0?'OUT OF STOCK':'UNALLOCATED'):(low?'LOW STOCK':'STOCK');
    const qty='<input type="number" class="cesHub-qty" id="cesHubq-'+id+'" min="1" max="'+Math.max(1,available)+'" value="1" '+(low?'disabled':'')+' aria-label="Issue quantity">';
    const action='<div class="cesHub-row-actions cesHub-actions-v4">'+qty+
      '<button type="button" class="cesHub-btn cesHub-cart-v4" '+(low?'disabled aria-disabled="true"':'')+' onclick="siInventory_select(\''+selected+'\',\''+id+'\',true);siInventory_add(\''+selected+'\')" title="'+(low?'Restock before issue':'Add to cart')+'" aria-label="Add to cart"><i class="fas fa-cart-plus"></i></button>'+
      '<button type="button" class="cesHub-btn cesHub-restock-v4" onclick="siInventory_select(\''+selected+'\',\''+id+'\',true);siInventory_restock(\''+selected+'\')" title="Restock" aria-label="Restock"><i class="fas fa-box-open"></i></button>'+
      '<button type="button" class="cesHub-btn cesHub-detail-v4" onclick="siInventory_select(\''+selected+'\',\''+id+'\',true);siInventory_detail(\''+selected+'\')" title="Details" aria-label="Details"><i class="fas fa-circle-info"></i></button>'+
      '<button type="button" class="cesHub-btn cesHub-edit-v4" onclick="siInventory_edit(\''+id+'\')" title="Edit" aria-label="Edit"><i class="fas fa-pen"></i></button></div>';
    return '<tr style="--ces-row-team:'+esc(color)+'">'+[
      '<div class="cesHub-item"><b>'+esc(a.itemName||a.itemName2||'—')+'</b><small>'+id+' · '+esc(a.itemGroupId||g.id||'')+'</small></div>',
      '<span class="cesHub-team" style="--team-color:'+esc(color)+'">'+esc(team)+'</span>',
      '<div class="cesHub-detail"><b>'+esc(a.vendor1||'—')+'</b><small>'+esc(a.type||'General')+' · '+esc(a.itemDetail||'—')+'</small></div>',
      '<b class="cesHub-stock">'+q.toLocaleString()+'</b>',
      '<b>'+available.toLocaleString()+'</b><small>Min '+min.toLocaleString()+'</small>',
      '<span class="cesHub-pill '+(low?'low':'ok')+'">'+st+'</span>',
      action
    ].map(x=>'<td>'+x+'</td>').join('')+'</tr>';
  }).join('');
  const headers=['Item / ID','Team','Vendor / Detail','Stock','Available / Min','Status','Actions'];
  const node=$('siAccCards');if(node){node.innerHTML='<div class="cesHub-access-table-scroll"><table class="cesHub-access-table cesHub-v4"><thead><tr>'+headers.map(x=>'<th scope="col">'+esc(x)+'</th>').join('')+'</tr></thead><tbody>'+(tbody||'<tr><td colspan="7" style="text-align:center;padding:28px">No matching inventory rows</td></tr>')+'</tbody></table></div>';}

  if($('siAccCount'))$('siAccCount').textContent=rows.length+' team item rows';
  if($('siAccPagination'))$('siAccPagination').innerHTML='<span>Page '+w.SI.accPage+' / '+pageCount+'</span> <button class="cesHub-btn" onclick="SI.accPage=Math.max(1,SI.accPage-1);siInventory_renderAccessories()">Previous</button> <button class="cesHub-btn" onclick="SI.accPage=Math.min('+pageCount+',SI.accPage+1);siInventory_renderAccessories()">Next</button>';
 };
 w.siInventory_edit=function(id){const row=(w.SI?.acc||[]).find(x=>String(x.accessoryId)===String(id));if(!row)return; if(typeof w.si_editAccessoryPrompt==='function')return w.si_editAccessoryPrompt(row);if(w.Swal)return w.Swal.fire('Edit unavailable','Missing edit handler. Reload Inventory and try again.','warning');};
 w.siInventory_add=function(id){const g=groups().find(x=>x.id===id);if(!g)return;const a=pick(g),qty=Number($('cesHubq-'+a.accessoryId)?.value||1);if(String(a.team||'').toUpperCase()==='SHARED'){w.Swal?.fire('Choose a team','Allocate pending stock to MED/LAB/EHS/TES before checkout.','warning');return;}if(!Number.isInteger(qty)||qty<=0||qty>Math.max(0,n(a.stockQty)-n(a.minStockQty)-1)){w.Swal?.fire('จำนวนไม่ถูกต้อง','เลือกจำนวนไม่เกินยอดคงเหลือ','warning');return;}if(!Array.isArray(w.SI.cart))w.SI.cart=[];let old=w.SI.cart.find(x=>x.kind==='accessory'&&x.accessoryId===a.accessoryId);if(old){const total=n(old.issueQty||old.qty)+qty;if(total>Math.max(0,n(a.stockQty)-n(a.minStockQty)-1)){w.Swal?.fire('Insufficient stock','','warning');return;}old.issueQty=old.qty=total;}else w.SI.cart.push(Object.assign({},a,{kind:'accessory',qty,issueQty:qty}));w.si_updateCart?.();w.Swal?.fire({toast:true,position:'top-end',icon:'success',title:esc(a.itemName2||a.itemName)+' added',showConfirmButton:false,timer:1100});};
 async function refresh(){state.dash=null;await w.initStockInventoryModule(true);}
 w.siInventory_restock=async function(id){const g=groups().find(x=>x.id===id);if(!g)return;const a=pick(g);const res=await w.Swal.fire({title:'Restock · '+esc(a.itemName2||a.itemName),html:'<div style="text-align:left"><label>Quantity<input id="cesHubrQty" class="swal2-input" type="number" min="1" value="1"></label><label>Lot<input id="cesHubrLot" class="swal2-input" placeholder="Optional lot"></label><label>Date<input id="cesHubrDate" class="swal2-input" type="date" value="'+new Date().toISOString().slice(0,10)+'"></label></div>',showCancelButton:true,preConfirm:()=>({qty:Number($('cesHubrQty').value),lot:$('cesHubrLot').value,date:$('cesHubrDate').value})});if(!res.isConfirmed)return;try{const out=await call('saveInventoryRestockBatch',{items:[{id:a.accessoryId,...res.value}],user:profile().email});if(!out.success)throw Error(out.message);await w.Swal.fire('Saved',esc(a.itemName2||a.itemName)+' · New '+n(out.items?.[0]?.newQty),'success');refresh();}catch(e){w.Swal.fire('Restock failed',e.message,'error');}};
 w.siInventory_batchRestock=async function(){const selected=groups().filter(visible).map(pick);if(!selected.length)return;const html='<div style="text-align:left;max-height:360px;overflow:auto">'+selected.map((a,i)=>'<label style="display:flex;justify-content:space-between;padding:7px;border-bottom:1px solid #eee;align-items:center"><span>'+esc(a.itemName2||a.itemName)+' · '+esc(a.team)+'</span><input style="max-width:85px" type="number" min="0" value="0" data-stock-id="'+esc(a.accessoryId)+'" class="cesHub-batch-qty"></label>').join('')+'</div>';const r=await w.Swal.fire({title:'Batch Restock',width:670,html,showCancelButton:true,preConfirm:()=>Array.from(d.querySelectorAll('.cesHub-batch-qty')).map(x=>({id:x.dataset.stockId,qty:Number(x.value)})).filter(x=>Number.isInteger(x.qty)&&x.qty>0)});if(!r.isConfirmed||!r.value.length)return;try{const out=await call('saveInventoryRestockBatch',{items:r.value,user:profile().email},120000);if(!out.success)throw Error(out.message);w.Swal.fire('Saved',out.items.length+' items · '+out.added+' units','success');refresh();}catch(e){w.Swal.fire('Batch Restock',e.message,'error');}};
 w.siInventory_detail=function(id){const g=groups().find(x=>x.id===id);if(!g)return;const a=pick(g),pool=(w.SI?.raw?.pendingAllocation||[]).find(x=>x.groupId===g.id),pending=n(pool?.qty),target=String(a.team||'').toUpperCase();const allocate=pending>0?'<hr><div style="text-align:left;padding:8px"><b>Allocate pending stock to '+esc(target)+'</b><p style="margin:7px 0;color:#526987">'+pending.toLocaleString()+' unit(s) available in central pool</p><input id="cesHubtransferqty" class="cesHub-qty" type="number" min="1" max="'+pending+'" value="1"><button type="button" class="cesHub-btn primary" onclick="siInventory_allocate(\''+esc(g.id)+'\',\''+esc(a.accessoryId)+'\')">Allocate</button></div>':'';w.Swal.fire({title:esc(a.itemName2||a.itemName),width:610,html:'<div style="text-align:left;line-height:1.9"><b>Item ID:</b> '+esc(a.accessoryId)+'<br><b>Detail:</b> '+esc(a.itemDetail||'—')+'<br><b>Vendor:</b> '+esc(a.vendor1||'—')+'<br><b>Team:</b> '+esc(target)+'<br><b>Product total:</b> '+(g.total+pending)+'<br><b>Team stock:</b> '+n(a.stockQty)+'<br><b>Minimum:</b> '+n(a.minStockQty)+'<br><b>Pending allocation:</b> '+pending+'<br><b>Unit cost:</b> '+money(a.costPerEa||a.unitCost||a.cost)+'</div>'+allocate,confirmButtonText:'Close'});};
 w.siInventory_allocate=async function(sourceId,targetId){const qty=Number($('cesHubtransferqty')?.value);if(!Number.isInteger(qty)||qty<1)return w.Swal.fire('Invalid quantity','Enter a positive whole number','warning');const confirmation=await w.Swal.fire({title:'Confirm team allocation',text:'Move '+qty+' units from pending stock to this team? Product total will stay unchanged.',icon:'question',showCancelButton:true,confirmButtonText:'Allocate stock'});if(!confirmation.isConfirmed)return;try{const r=await call('transferInventoryAllocation',{sourceId,groupId:sourceId,targetId,qty,pending:true,user:profile().email});if(!r?.success)throw Error(r?.message||'Allocation failed');await w.Swal.fire({icon:'success',title:'Stock allocated',text:qty+' units moved without changing overall stock'});await refresh();}catch(e){w.Swal.fire('Allocation failed',e.message||String(e),'error');}};
 w.siInventory_transfer=async function(sourceId){const targetId=$('cesHubto')?.value,qty=Number($('cesHubtransferqty')?.value);if(!targetId||!qty)return;try{const r=await call('transferInventoryAllocation',{sourceId,groupId:sourceId,targetId,qty,pending:true,user:profile().email});if(!r.success)throw Error(r.message);w.Swal.fire('Stock allocated',qty+' units transferred','success');refresh();}catch(e){w.Swal.fire('Transfer failed',e.message,'error');}};
 w.siInventory_checkout=async function(button){const cart=(w.SI?.cart||[]).filter(x=>x.kind==='accessory');if(!cart.length){w.Swal.fire('Empty cart','','info');return;}fillCheckout();const borrow=$('siBorrower')?.value?.trim(),emp=$('siCheckoutEmployeeId')?.value?.trim(),team=$('siCheckoutTeam')?.value?.trim(),cost=$('siCheckoutCostCenter')?.value?.trim(),loc=$('siCheckoutLocation')?.value?.trim(),date=$('siBorrowDate')?.value||new Date().toISOString().slice(0,10);if(!borrow||!emp||!team||!cost||!loc){w.Swal.fire('Missing information','Name / Employee ID / Team / Cost Center / Location are required','warning');return;}const byId=new Map((w.SI?.acc||[]).map(a=>[String(a.accessoryId),a]));
  const prepared=cart.map(a=>{const live=byId.get(String(a.accessoryId))||a,qty=n(a.issueQty||a.qty),allowed=Math.max(0,n(live.stockQty)-n(live.minStockQty)-1),cost=n(live.costPerEa||live.unitCost||live.cost);return {id:String(a.accessoryId),name:live.itemName||live.itemName2||a.itemName,team:live.team,qty,remaining:n(live.stockQty)-qty,allowed,unitCost:cost,lineCost:qty*cost};});
  if(prepared.some(x=>!Number.isInteger(x.qty)||x.qty<1||x.qty>x.allowed)){await w.Swal.fire('Insufficient available stock','A cart line would reduce balance below Minimum Stock. Refresh stock and update cart.','warning');return;}
  const subtotal=prepared.reduce((s,x)=>s+x.lineCost,0),vat=Math.round(subtotal*.07*100)/100;
  const review=await w.Swal.fire({title:'Confirm Accessories Check-Out',icon:'question',width:840,showCancelButton:true,confirmButtonText:'Confirm & Issue',html:'<div style="text-align:left"><p><b>'+esc(borrow)+'</b> · '+esc(emp)+' · '+esc(team)+' · '+esc(cost)+'</p><div class="cesHub-access-table-scroll" style="max-height:270px"><table class="cesHub-mini-table"><thead><tr><th>Item</th><th>Team</th><th>Qty</th><th>Balance</th><th>Unit</th><th>Line</th></tr></thead><tbody>'+prepared.map(x=>'<tr><td>'+esc(x.name)+'</td><td>'+esc(x.team)+'</td><td>'+x.qty+'</td><td>'+x.remaining+'</td><td>'+money(x.unitCost)+'</td><td>'+money(x.lineCost)+'</td></tr>').join('')+'</tbody></table></div><p><b>Subtotal:</b> '+money(subtotal)+' · <b>VAT 7%:</b> '+money(vat)+' · <b>Total:</b> '+money(subtotal+vat)+'</p></div>'});if(!review.isConfirmed)return;
  if(button)button.disabled=true;try{const res=await call('si_checkoutCart' ,{equipment:[],accessories:cart,borrower:borrow,employeeId:emp,team:team,costCenter:cost,location:loc,borrowDate:date,note:$('siNote')?.value||'',requester:{name:borrow,id:emp,email:profile().email,team}},120000);if(!res||res.success===false)throw Error(res?.message||'Check-Out failed');w.SI.cart=w.SI.cart.filter(x=>x.kind!=='accessory');w.si_updateCart?.();w.si_closeCart?.();const items=res.receiptItems||cart.map(x=>({id:x.accessoryId,name:x.itemName,team:x.team,qty:x.issueQty||x.qty,unitCost:x.cost,lineCost:n(x.cost)*n(x.issueQty||x.qty)}));const html='<div style="text-align:left;font-size:12px"><p><b>'+esc(borrow)+'</b> · '+esc(emp)+' · '+esc(team)+' · '+esc(cost)+'</p><table class="cesHub-mini-table"><tr><th>Item</th><th>Team</th><th>Qty</th><th>Remaining</th><th>Cost</th></tr>'+items.map(x=>'<tr><td>'+esc(x.name||x.id)+'</td><td>'+esc(x.team)+'</td><td>'+n(x.qty)+'</td><td>'+n(x.balance)+'</td><td>'+money(x.lineCost)+'</td></tr>').join('')+'</table><p style="margin-top:12px"><b>Subtotal:</b> '+money(res.accessorySubtotal)+' | <b>VAT 7%:</b> '+money(res.accessoryVat)+'</p><p style="font-size:17px;color:#004aad"><b>Total:</b> '+money(res.accessoryGrandTotal)+'</p></div>';await w.Swal.fire({icon:'success',title:'Accessories Check-Out Summary',html,width:730,confirmButtonText:'Done'});refresh();return res;}catch(e){w.Swal.fire('Check-Out failed',e.message,'error');return{success:false,message:e.message};}finally{if(button)button.disabled=false;}};
 function dashboardShell(){if($('cesHubDashboard'))return;const base=$('siInventoryDashboardCurrent');if(!base)return;
  base.insertAdjacentHTML('beforeend',`<section id="cesHubDashboard" class="cesHub-dashboard ces-movement-panel" aria-label="Inventory Movement Analytics">
    <div class="ces-movement-head"><div class="ces-movement-title"><span class="ces-movement-symbol"><i class="fas fa-arrow-right-arrow-left"></i></span><div><b>Inventory Movement Analytics</b><small>Actual issue, restock and balance records from Stock transactionhistory</small></div></div>
    <div class="ces-movement-filters"><label>Period<select id="cesHubPeriod" onchange="siInventory_renderDashboard()"><option value="month">Monthly</option><option value="day">Daily</option><option value="year">Yearly</option></select></label><label>Cost Center<select id="cesHubCost" onchange="siInventory_renderDashboard()"><option value="all">All cost centers</option></select></label><label>Vendor<select id="cesHubVendor" onchange="siInventory_renderDashboard()"><option value="all">All vendors</option></select></label><label>Team<select id="cesHubTeam" onchange="siInventory_renderDashboard()"><option value="all">All teams</option></select></label><button class="cesHub-btn" type="button" onclick="siInventory_loadDashboard(true)" title="Refresh ledger"><i class="fas fa-arrows-rotate"></i> Refresh</button></div></div>
    <div id="cesHubDashKpis" class="cesHub-grid ces-movement-kpis"></div>
    <div class="ces-movement-card"><div class="ces-movement-card-head"><b>Issued vs Restocked</b><small>Quantity of units by selected period</small></div><div class="ces-movement-chart"><canvas id="cesHubUsageChart"></canvas></div></div>
    <div class="ces-inventory-chart-grid"><div class="ces-movement-card"><div class="ces-movement-card-head"><b>Current Stock by Team</b><small id="cesMovementSharedNote">SHARED is displayed separately</small></div><div class="ces-movement-chart ces-movement-chart-small"><canvas id="cesInventoryTeamChart"></canvas></div></div><div class="ces-movement-card"><div class="ces-movement-card-head"><b>Issued Cost by Vendor</b><small>Based on recorded transactions</small></div><div class="ces-movement-chart ces-movement-chart-small"><canvas id="cesInventoryVendorChart"></canvas></div></div></div>
    <div class="ces-movement-card"><div class="ces-movement-card-head"><b>Recent Transactions</b><small id="cesRecentCount">Latest recorded activities</small></div><div id="cesHubRecent" class="ces-movement-table-wrap"></div></div></section>`);
  if(!$('ces-movement-visual-style')){const st=d.createElement('style');st.id='ces-movement-visual-style';st.textContent=`
   #view-inventory .ces-movement-panel{display:grid;gap:14px;padding:0;margin-top:18px;background:transparent;border:0;box-shadow:none}
   #view-inventory .ces-movement-head,#view-inventory .ces-movement-card{background:#fff;border:1px solid #dce7f5;border-radius:16px;box-shadow:0 4px 18px rgba(25,63,112,.04)}
   #view-inventory .ces-movement-head{padding:17px;display:grid;gap:14px}
   #view-inventory .ces-movement-title{display:flex;gap:12px;align-items:center;min-width:0}.ces-movement-title b{display:block;color:#0b3d92;font-weight:850;font-size:15px}.ces-movement-title small{display:block;color:#64748b;margin-top:3px;font-size:11px}
   #view-inventory .ces-movement-symbol{background:#e8f1ff;color:#0756b8;width:39px;height:39px;display:grid;place-items:center;border-radius:12px;flex-shrink:0}
   #view-inventory .ces-movement-filters{display:flex;flex-wrap:wrap;gap:8px;align-items:end}.ces-movement-filters label{display:grid;gap:5px;color:#64748b;font-weight:800;font-size:10px;flex:1 1 135px}.ces-movement-filters select{width:100%;height:39px;padding:0 10px;border:1px solid #d9e5f1;border-radius:10px;background:#f8fbff;font-size:12px;color:#1e3a5f}
   #view-inventory .ces-movement-filters .cesHub-btn{height:39px;white-space:nowrap;background:#0a4ba6;color:#fff;border:0;border-radius:10px;font-size:11px;padding:0 15px}
   #view-inventory .ces-movement-kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px!important}.ces-movement-kpis .cesHub-kpi{padding:14px 16px;border:1px solid #dce7f5;background:linear-gradient(150deg,#fff,#f5f9ff);border-radius:14px;color:#58708b;font-size:11px;font-weight:700}.ces-movement-kpis .cesHub-kpi b{display:block;font-size:25px;color:#004aad;margin-top:5px;font-weight:900;letter-spacing:-.5px}
   #view-inventory .ces-movement-card{padding:15px;min-width:0}.ces-movement-card-head{display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:8px;margin-bottom:12px}.ces-movement-card-head b{color:#153b68;font-size:13px}.ces-movement-card-head small{color:#8395aa;font-size:10px}
   #view-inventory .ces-movement-chart{height:240px;position:relative}.ces-movement-chart-small{height:210px}.ces-inventory-chart-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
   #view-inventory .ces-movement-table-wrap{overflow:auto;max-height:340px;border:1px solid #edf2f7;border-radius:11px}.ces-movement-table-wrap .cesHub-mini-table{width:100%;min-width:770px;border-collapse:collapse;font-size:11px}.ces-movement-table-wrap th{position:sticky;top:0;background:#eef4fd;color:#4b6686;text-align:left;padding:11px;white-space:nowrap}.ces-movement-table-wrap td{padding:10px 11px;border-bottom:1px solid #eef2f7;vertical-align:top}.ces-movement-table-wrap tbody tr:hover{background:#f6faff}
   #view-inventory .ces-team-stock-strip{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;margin:12px 0 18px}.ces-team-stock-chip{display:flex;gap:10px;align-items:center;border:1px solid #dce7f5;background:#fff;border-radius:12px;padding:12px;min-width:0}.ces-team-stock-chip.shared{background:#f1f5f9}.ces-team-stock-chip .ces-team-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0}.ces-team-stock-chip div{min-width:0}.ces-team-stock-chip b{color:#183a60;font-size:11px;display:block}.ces-team-stock-chip small{color:#94a3b8;font-size:9px}.ces-team-stock-chip strong{color:#0f3870;font-size:15px;margin-left:auto;white-space:nowrap}.ces-team-stock-chip strong small{font-weight:500}
   @media(max-width:820px){#view-inventory .ces-movement-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}.ces-inventory-chart-grid{grid-template-columns:1fr!important}#view-inventory .ces-team-stock-strip{grid-template-columns:repeat(2,minmax(0,1fr))}}
   @media(max-width:520px){#view-inventory .ces-movement-head{padding:13px}#view-inventory .ces-movement-filters label{flex:1 1 42%}#view-inventory .ces-movement-kpis .cesHub-kpi{padding:11px}#view-inventory .ces-team-stock-strip{grid-template-columns:1fr 1fr}}
  `;d.head.appendChild(st);}
 }

 w.siInventory_loadDashboard=async function(force){
  dashboardShell();if(state.dash&&!force){w.siInventory_renderDashboard();return;}
  const host=$('cesHubRecent');if(host)host.innerHTML='<p role="status">Loading live transaction ledger…</p>';
  try{const data=await call('getInventoryMovementDashboard',{force:!!force},35000);if(!data?.success)throw Error(data?.message||'Inventory ledger unavailable');state.dash=data;
    opt('cesHubCost',Object.keys(data.costCenters||{}),'All Cost Centers');opt('cesHubVendor',Object.keys(data.vendors||{}),'All Vendors');opt('cesHubTeam',(data.stocks||[]).map(x=>x.team).concat(['OTHER']),'All Teams');w.siInventory_renderDashboard();
  }catch(error){const rows=w.SI?.acc||[];if(!rows.length){if(host)host.textContent='Live ledger unavailable: '+error.message;return;}
    const items=rows.map(a=>({id:a.accessoryId,team:a.team,qty:n(a.stockQty),min:n(a.minStockQty),cost:n(a.costPerEa||a.unitCost||a.cost),vendor:a.vendor1||''}));
    const byTeam={};items.forEach(a=>{const o=byTeam[a.team]||(byTeam[a.team]={team:a.team,qty:0,value:0,items:0,low:0});o.qty+=a.qty;o.value+=a.qty*a.cost;o.items++;if(a.min>0&&a.qty<=a.min)o.low++;});
    state.dash={success:true,items,transactions:[],segments:[],costCenters:{},vendors:{},stocks:Object.values(byTeam),degraded:true};
    opt('cesHubTeam',Object.keys(byTeam),'All Teams');w.siInventory_renderDashboard();if(host)host.innerHTML='<p role="alert" style="color:#b45309">Stock totals come from the live Accessories Data sheet. Movement ledger is unavailable: '+esc(error.message)+'</p>';
  }
 };
 w.siInventory_renderDashboard=function(){
  const data=state.dash;if(!data)return;const team=$('cesHubTeam')?.value||'all',cc=$('cesHubCost')?.value||'all',vendor=$('cesHubVendor')?.value||'all',p=$('cesHubPeriod')?.value||'month',items=data.items||[],byId={};items.forEach(x=>byId[x.id]=x);
  const tx=(data.transactions||[]).filter(x=>(team==='all'||x.team===team)&&(cc==='all'||(x.costCenter||x.note||'').includes(cc==='all'?'':cc))&&(vendor==='all'||(x.vendor||byId[x.id]?.vendor)===vendor));
  const movement=(data.segments||[]).filter(x=>(team==='all'||x.team===team)&&(cc==='all'||x.costCenter===cc)&&(vendor==='all'||x.vendor===vendor));
  const period=v=>p==='year'?String(v).slice(0,4):p==='day'?String(v):String(v).slice(0,7),bins={};
  movement.forEach(x=>{const key=period(x.date);if(!key)return;const b=bins[key]||(bins[key]={period:key,issued:0,restocked:0});b.issued+=n(x.issued);b.restocked+=n(x.restocked);});
  const series=Object.values(bins).sort((a,b)=>a.period.localeCompare(b.period));
  const issued=movement.reduce((a,x)=>a+n(x.issued),0),restocked=movement.reduce((a,x)=>a+n(x.restocked),0),spent=movement.reduce((a,x)=>a+n(x.issuedCost),0),currentStock=(data.stocks||[]).filter(x=>team==='all'||x.team===team);
  const teamNames=['MED','LAB','EHS','TES','OTHER'],teamColors={MED:'#004aad',LAB:'#19a7ce',EHS:'#0fc1a1',TES:'#ffde59',OTHER:'#b4b4b4'};teamNames.forEach(t=>{if(typeof w.cesGetTeamColor==='function')teamColors[t]=w.cesGetTeamColor(t)||teamColors[t];});const stockTotals={};currentStock.forEach(x=>stockTotals[x.team]=(stockTotals[x.team]||0)+n(x.qty));
  const sharedNote=$('cesMovementSharedNote');if(sharedNote)sharedNote.textContent='Pending allocation: '+n(data.kpi?.pendingQty).toLocaleString()+' units (not available for checkout)';
  const byVendor={};movement.forEach(x=>{const name=String(x.vendor||'Unspecified');byVendor[name]=(byVendor[name]||0)+n(x.issuedCost);});
  function bar(id,labels,values,label,color){const canvas=$(id);if(!canvas||!w.Chart)return;try{w.Chart.getChart?.(canvas)?.destroy();}catch(e){}new w.Chart(canvas,{type:'bar',data:{labels,datasets:[{label,data:values,backgroundColor:color,borderRadius:6,maxBarThickness:52}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{display:false}},y:{beginAtZero:true}}}});}
  bar('cesInventoryTeamChart',teamNames,teamNames.map(x=>n(stockTotals[x])),'Units',teamNames.map(x=>teamColors[x]));const topV=Object.keys(byVendor).sort((a,b)=>byVendor[b]-byVendor[a]).slice(0,8);bar('cesInventoryVendorChart',topV,topV.map(x=>byVendor[x]),'Issued cost','#2563eb');
  const kpis=[['Issued units',issued],['Restocked units',restocked],['Issued cost',money(spent)],['Transactions',tx.length]];const box=$('cesHubDashKpis');if(box)box.innerHTML=kpis.map(([l,v])=>'<div class="cesHub-kpi">'+esc(l)+'<b>'+esc(v)+'</b></div>').join('');
  const cv=$('cesHubUsageChart');if(w.Chart&&cv){try{state.chart?.destroy();}catch(e){}state.chart=new w.Chart(cv,{type:'bar',data:{labels:series.map(x=>x.period),datasets:[{label:'Issued',data:series.map(x=>x.issued),backgroundColor:'#2563eb',borderRadius:5},{label:'Restocked',data:series.map(x=>x.restocked),backgroundColor:'#10b981',borderRadius:5}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{usePointStyle:true,boxWidth:10}}},scales:{x:{grid:{display:false}},y:{beginAtZero:true,ticks:{precision:0}}}}});}
  const fields=['Date','Action','Team','Item','Qty','Balance','Cost center','Value (THB)','Note'];const host=$('cesHubRecent');if(host){const body=tx.slice(0,50).map(x=>{const line=[x.date,x.type,x.team,x.item||byId[x.id]?.name||x.id,x.qty,x.after,x.costCenter||'—',money(x.lineCost||0),x.note||'—'];return'<tr>'+line.map((v,i)=>'<td>'+((i===1)?'<b>'+esc(v)+'</b>':esc(v))+'</td>').join('')+'</tr>';}).join('');host.innerHTML=tx.length?'<table class="cesHub-mini-table"><thead><tr>'+fields.map(x=>'<th>'+esc(x)+'</th>').join('')+'</tr></thead><tbody>'+body+'</tbody></table>':'<p style="padding:20px;text-align:center;color:#64748b">No recorded movements for the selected filters.</p>';}const count=$('cesRecentCount');if(count)count.textContent=tx.length+' matching transaction(s)';
 };

 w.siInventory_allocatePending=async function(){
   const pending=w.SI?.raw?.pendingAllocation||[];if(!pending.length)return w.Swal?.fire('No pending stock','All stock is allocated to teams','info');
   const options=pending.filter(x=>n(x.qty)>0).map(x=>'<option value="'+esc(x.groupId)+'">'+esc(x.itemName||x.groupId)+' — '+n(x.qty)+' units</option>').join('');
   if(!options)return w.Swal?.fire('No pending stock','No unassigned balance remains','info');
   const result=await w.Swal?.fire({title:'Allocate stock to a team',width:550,showCancelButton:true,confirmButtonText:'Transfer stock',html:'<div style="text-align:left;display:grid;gap:10px"><label>Item<select id="cesAllocItem" class="swal2-input" style="width:100%;margin:4px 0">'+options+'</select></label><label>Receiving team<select id="cesAllocTeam" class="swal2-input" style="width:100%;margin:4px 0"><option>MED</option><option>LAB</option><option>EHS</option><option>TES</option></select></label><label>Quantity<input id="cesAllocQty" class="swal2-input" type="number" step="1" min="1" value="1" style="width:100%;margin:4px 0"></label><p style="color:#64748b;font-size:12px">Moves real stock; it does not create additional units.</p></div>',preConfirm:()=>{const groupId=$('cesAllocItem')?.value,team=$('cesAllocTeam')?.value,qty=Number($('cesAllocQty')?.value),source=pending.find(x=>x.groupId===groupId);if(!groupId||!Number.isInteger(qty)||qty<1||qty>n(source?.qty)){w.Swal.showValidationMessage('Select a valid quantity');return false;}return {sourceId:groupId,groupId,team,qty,user:w.currentUser?.email||''};}});
   if(!result?.isConfirmed)return;
   try{const out=await call('transferInventoryAllocation',result.value,90000);if(!out?.success)throw Error(out?.message||'Allocation failed');await w.Swal.fire('Stock allocated',out.qty+' units → '+out.to,'success');state.dash=null;await w.initStockInventoryModule(true);if($('siInventoryDashboardCurrent')?.offsetParent!==null)await w.siInventory_loadDashboard(true);}
   catch(e){w.Swal?.fire('Allocation failed',String(e.message||e),'error');}
 };
 // Lightweight initial read: inventory page does not need infusion/equipment, approvals and history.
 w.initStockInventoryModule=async function(force=false){if(state.pending)return state.pending;if(force)state.dash=null;style();ensureFilters();const previous=(w.SI&&w.SI.acc||[]);if(previous.length&&!force){filters();w.siInventory_renderAccessories();dashboardShell();if(w.siInventory_loadDashboard&&$('siInventoryDashboardCurrent')?.offsetParent!==null)w.siInventory_loadDashboard(false);return Promise.resolve({success:true,cached:true});}state.pending=call('si_getAccessoriesDashboardFast',force===true,75000).then(data=>{if(!data||!data.success)throw Error(data?.message||'Accessories unavailable');w.SI=w.SI||{};w.SI.loaded=true;w.SI.acc=data.accessories||[];w.SI.raw=data;if(!w.SI.acc.length){const host=$('siAccCards');if(host)host.innerHTML='<p role="status" style="padding:22px;color:#b45309">No Accessories Data rows were returned. Verify SPREADSHEET_ID, source sheet "Accessories Data", sharing permissions, and import the cleaned stock sheet before retrying.</p>';}w.SI.accPage=1;w.SI.cart=w.SI.cart||[];const teams=[...new Set(w.SI.acc.map(x=>x.team).concat(['OTHER']))],items=[...new Set(w.SI.acc.map(x=>x.itemName))],statuses=['STOCK','LOW_STOCK','UNALLOCATED'],actions=[...new Set(w.SI.acc.map(x=>x.actionRequired))];data.filters={accessoryTeams:teams,accessoryItems:items,accessoryStatuses:statuses,accessoryActions:actions};filters();opt('siAccAction',actions,'All Actions');w.siInventory_renderAccessories();dashboardShell();if(w.si_renderAccessoriesDashboard)w.si_renderAccessoriesDashboard();var alertHost=$('siInventoryDashboardCurrent');if(alertHost){var button=alertHost.querySelector('#cesAllocatePending');if(!button&&data.kpi?.pendingStock>0){var b=d.createElement('button');b.id='cesAllocatePending';b.type='button';b.className='cesHub-btn primary';b.textContent='Allocate Pending Stock ('+Number(data.kpi.pendingStock).toLocaleString()+' units)';b.style.cssText='margin:10px 0;';b.onclick=w.siInventory_allocatePending;alertHost.prepend(b);}} if($('siInventoryDashboardCurrent')&&$('siInventoryDashboardCurrent').offsetParent!==null)w.siInventory_loadDashboard();w.si_updateCart?.();const info=$('siDataFreshness');if(info)info.textContent='Updated '+new Date().toLocaleTimeString();return data;}).catch(e=>{if($('siAccCards'))$('siAccCards').innerHTML='<div role="alert" style="padding:22px;color:#a11">'+esc(e.message)+' <button class="cesHub-btn" onclick="initStockInventoryModule(true)">Retry</button></div>';return{success:false,message:e.message};}).finally(()=>state.pending=null);return state.pending;};
 const cesHubOriginalFastInit=w.initStockInventoryModule;
 w.installInventoryNotificationOverrides=function(){
   w.initStockInventoryModule=cesHubOriginalFastInit;
   w.si_renderAccCards=w.siInventory_renderAccessories;
   w.si_applyFilters=w.siInventory_renderAccessories;
   w.si_submitCheckout=w.siInventory_checkout;
   if(typeof w.si_switchTab==='function'&&!w.si_switchTab.cesHubWrapped){
     const base=w.si_switchTab;
     const patched=function(tab){const out=base.apply(this,arguments);if(tab==='dashboard')w.siInventory_loadDashboard(false);if(tab==='acc'){w.siInventory_renderAccessories();fillCheckout();}return out;};
     patched.cesHubWrapped=true;w.si_switchTab=patched;
   }
   if(typeof w.si_toggleCart==='function'&&!w.si_toggleCart.cesHubWrapped){
     const base=w.si_toggleCart;
     const patched=function(){const out=base.apply(this,arguments);fillCheckout();loadStaffFromSheet();return out;};
     patched.cesHubWrapped=true;w.si_toggleCart=patched;
   }
 };
 w.installInventoryNotificationOverrides();
})(window,document);

/* Existing inventory module: dedicated restock tab, no separate release script. */
(function(w,d){'use strict';function el(id){return d.getElementById(id);}function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
 function fill(id,items,caption){const s=el(id);if(!s)return;let old=s.value;s.innerHTML='<option value="all">'+caption+'</option>'+[...new Set(items.filter(Boolean))].sort().map(x=>'<option value="'+esc(x)+'">'+esc(x)+'</option>').join('');s.value=[...s.options].some(x=>x.value===old)?old:'all';}
 w.siLatestRestockRender=function(){const data=w.SI?.acc||[];fill('siRestockTeam',data.map(x=>x.team),'All Teams');fill('siRestockType',data.map(x=>x.type),'All types');const t=el('siRestockTeam')?.value||'all',k=el('siRestockType')?.value||'all',q=(el('siRestockSearch')?.value||'').toLowerCase();const matches=data.filter(x=>(t==='all'||x.team===t)&&(k==='all'||x.type===k)&&(!q||[x.itemName,x.itemName2,x.accessoryId,x.itemDetail].join(' ').toLowerCase().includes(q)));const host=el('siRestockTable');if(!host)return;host.innerHTML='<table style="border-collapse:collapse;width:100%;min-width:900px;font-size:12px"><thead><tr style="position:sticky;top:0;background:#eaf2ff;text-align:left"><th style="padding:12px">Item / ID</th><th>Team</th><th>Type</th><th>Current</th><th>Min</th><th>Unit cost</th><th>Restock qty</th><th>Action</th></tr></thead><tbody>'+matches.map(a=>'<tr style="border-top:1px solid #e6ebf2"><td style="padding:10px"><b>'+esc(a.itemName2||a.itemName)+'</b><div style="color:#64748b">'+esc(a.accessoryId)+'</div></td><td>'+esc(a.team)+'</td><td>'+esc(a.type)+'</td><td>'+Number(a.stockQty||0)+'</td><td>'+Number(a.minStockQty||0)+'</td><td>'+Number(a.costPerEa||a.unitCost||0)+'</td><td><input class="ces-restock-qty stockpro-control" data-cost="'+Number(a.costPerEa||a.unitCost||a.cost||0)+'" data-id="'+esc(a.accessoryId)+'" type="number" min="0" step="1" value="0" style="width:85px"></td><td><button class="sp-btn ghost" data-id="'+esc(a.accessoryId)+'" onclick="siLatestSingleRestock(this.dataset.id)">Single</button></td></tr>').join('')+'</tbody></table><div class="ces-restock-footer"><p>Showing '+matches.length+' allocations · 0 = skip item</p><button class="cesHub-btn primary" type="button" onclick="siLatestBatchRestock()"><i class="fas fa-floppy-disk"></i> Review & Save Selected</button></div>';};
 w.siLatestBatchRestock=async function(){
  const list=[...d.querySelectorAll('#siRestockTable .ces-restock-qty')].map(x=>({id:x.dataset.id,qty:Number(x.value),unitCost:Number(x.dataset.cost||0)})).filter(x=>x.qty>0);
  if(!list.length)return w.Swal?.fire('Select items','Enter quantity for one or more items','info');
  if(list.some(x=>!Number.isInteger(x.qty)||!Number.isFinite(x.unitCost)||x.unitCost<0))return w.Swal?.fire('Invalid amount','Quantities must be whole numbers and costs nonnegative','warning');
  const form=await w.Swal?.fire({title:'Confirm stock replenishment',width:580,showCancelButton:true,confirmButtonText:'Save & log',html:
    '<div class="ces-restock-confirm"><p><b>'+list.length+' item(s)</b> · '+list.reduce((sum,x)=>sum+x.qty,0)+' units · ฿'+list.reduce((sum,x)=>sum+x.qty*x.unitCost,0).toLocaleString()+'</p><div class="cesHub-access-table-scroll" style="max-height:220px"><table class="cesHub-mini-table"><thead><tr><th>Item</th><th>Team</th><th>Qty</th><th>New Stock</th><th>Cost</th></tr></thead><tbody>'+list.map(x=>{const a=(w.SI?.acc||[]).find(r=>r.accessoryId===x.id)||{};return '<tr><td>'+esc(a.itemName||x.id)+'</td><td>'+esc(a.team)+'</td><td>'+x.qty+'</td><td>'+((Number(a.stockQty)||0)+x.qty)+'</td><td>฿'+(x.qty*x.unitCost).toLocaleString()+'</td></tr>';}).join('')+'</tbody></table></div><label>Restock date<input id="ces-restock-date" class="swal2-input" type="date" value="'+new Date().toLocaleDateString('en-CA')+'"></label><label>Lot / Receipt No.<input id="ces-restock-lot" class="swal2-input" placeholder="Optional"></label><label>Remark<input id="ces-restock-note" class="swal2-input" placeholder="Optional"></label></div>',
     preConfirm:()=>({date:el('ces-restock-date')?.value||'',lot:el('ces-restock-lot')?.value||'',note:el('ces-restock-note')?.value||''})});
  if(!form?.isConfirmed)return;
  try{const items=list.map(x=>({...x,...form.value}));const out=await w.CES_API.callFunction('saveInventoryRestockBatch',[{items,user:w.currentUser?.email||''}],{transport:'iframe',timeoutMs:120000,module:'inventory',userAction:true});
    if(!out?.success)throw Error(out?.message||'Restock failed');
    const detail=(out.items||[]).map(x=>'<tr><td>'+esc(x.name||x.id)+'</td><td>'+esc(x.team)+'</td><td>'+x.added+'</td><td>'+x.newQty+'</td><td>฿'+Number(x.lineCost||0).toLocaleString()+'</td></tr>').join('');
    await w.Swal.fire({icon:'success',title:'Restock completed',width:700,html:'<div class="cesHub-access-table-scroll"><table class="cesHub-access-table"><tr><th>Item</th><th>Team</th><th>Added</th><th>Balance</th><th>Cost</th></tr>'+detail+'</table></div><p>Total '+out.added+' units · ฿'+Number(out.totalCost||0).toLocaleString()+'</p>'});
    await w.initStockInventoryModule(true);w.siLatestRestockRender();
  }catch(e){w.Swal?.fire('Restock failed',e.message,'error');}
 };
 function tab(t){if(t!=='restock')return;['siInventoryDashboardCurrent','siAccFilters','siAccSection'].forEach(id=>{const node=el(id);if(node){node.style.display='none';node.classList.add('hidden');}});let n=el('siRestockSection');if(n){n.style.display='block';n.classList.remove('hidden');}['siTabDashboardCurrent','siTabAcc','siTabRestock'].forEach(id=>el(id)?.classList.toggle('active',id==='siTabRestock'));w.siLatestRestockRender();}
 const original=w.si_switchTab;w.si_switchTab=function(t){if(t==='restock')return tab(t);const node=el('siRestockSection');if(node){node.classList.add('hidden');node.style.display='none';}el('siTabRestock')?.classList.remove('active');return original?.apply(this,arguments);};
 const init=w.initStockInventoryModule;if(typeof init==='function')w.initStockInventoryModule=function(){const output=init.apply(this,arguments);const then=()=>{if(el('siRestockSection')?.style.display==='block')tab('restock');};if(output?.then)return output.then(v=>{then();return v;});then();return output;};
})(window,document);

/* Canonical Inventory navigation. Replaces obsolete 2-tab and equipment-oriented overrides. */
(function(w,d){'use strict';
 function node(id){return d.getElementById(id);}
 function visible(id,yes){const x=node(id);if(!x)return;x.classList.toggle('hidden',!yes);x.style.display=yes?'':'none';}
 w.si_switchTab=function(mode){mode=mode==='acc'?'acc':mode==='restock'?'restock':'dashboard';
   if(w.SI)w.SI.tab=mode;
   visible('siInventoryDashboardCurrent',mode==='dashboard');visible('siAccFilters',mode==='acc');visible('siAccKpiGrid',mode==='acc');visible('siAccSection',mode==='acc');visible('siRestockSection',mode==='restock');
   ['siTabDashboardCurrent','siTabAcc','siTabRestock'].forEach((id,i)=>{const b=node(id);if(b){b.classList.toggle('active',i===(mode==='dashboard'?0:mode==='acc'?1:2));b.setAttribute('aria-selected',String(i===(mode==='dashboard'?0:mode==='acc'?1:2)));}});
   if(mode==='restock'&&typeof w.siLatestRestockRender==='function')w.siLatestRestockRender();
   if(mode==='acc'&&typeof w.siInventory_renderAccessories==='function')w.siInventory_renderAccessories();
   if(mode==='dashboard'){if(typeof w.si_renderAccessoriesDashboard==='function')w.si_renderAccessoriesDashboard();if(typeof w.siInventory_loadDashboard==='function')w.siInventory_loadDashboard(false);}
 };
 if(w.SI)w.SI.tab='dashboard';
 d.addEventListener('DOMContentLoaded',function(){w.si_switchTab('dashboard');},{once:true});
})(window,document);
