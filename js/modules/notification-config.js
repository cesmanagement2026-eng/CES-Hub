(function (window, document) {
  'use strict';
  var state = {rows:[], admin:'Siripak.Ch@nhealth-asia.com', loading:null, loadedAt:0, dirty:false};
  var days = ['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY'];
  function el(id){return document.getElementById(id);}
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function n(v,fallback){var x=Number(v);return Number.isFinite(x)?x:(fallback||0);}
  function message(t,error){var x=el('ncMessage');if(x){x.textContent=t;x.style.color=error?'#b91c1c':'#526b85';}}
  function select(field,options,current){return '<select data-field="'+field+'">'+options.map(function(x){return '<option value="'+esc(x[0])+'" '+(String(x[0])===String(current)?'selected':'')+'>'+esc(x[1])+'</option>';}).join('')+'</select>';}
  function api(name,args,read){if(!window.CES_API||typeof window.CES_API.callFunction!=='function')return Promise.reject(new Error('Backend API has not loaded. Refresh CES Hub and try again.'));
    return window.CES_API.callFunction(name,args,{transport:read?'jsonp':'iframe',timeoutMs:65000,dedupe:read,priority:'active',userAction:!read,module:'notification_config',silentLoading:read});}
  function syncInput(card,row){card.querySelectorAll('[data-field]').forEach(function(input){row[input.dataset.field]=input.type==='checkbox'?input.checked:input.value;});row.hour=Math.max(0,Math.min(23,n(row.hour,9)));row.minute=Math.max(0,Math.min(59,n(row.minute,0)));row.day=Math.max(1,Math.min(28,n(row.day,1)));row.weekOfMonth=Math.max(1,Math.min(5,n(row.weekOfMonth,1)));if(row.kind==='FIRST_MONDAY')row.weekday='MONDAY';}
  function validEmails(value){return !value||String(value).split(/[;,\s]+/).filter(Boolean).every(function(mail){return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mail);});}
  function markDirty(){state.dirty=true;var b=el('ncSummary');if(b)b.textContent='Unsaved changes · '+state.rows.length+' schedules';}
  function updateScheduleVisibility(card){var kind=card.querySelector('[data-field="kind"]')?.value||'';card.querySelectorAll('[data-schedule-for]').forEach(function(node){node.hidden=!node.dataset.scheduleFor.split(' ').includes(kind);});}

  function card(row){var subject=String(row.subject||row.name||'').replace(/^\s*\[CES HUB\]\s*/i,'');return '<article class="nc-card" data-id="'+esc(row.id)+'">'+
    '<div class="nc-card-header"><div><div class="nc-module">'+esc(row.module||'System')+'</div><h3>'+esc(row.name||row.id)+'</h3><small class="nc-card-id">'+esc(row.id)+'</small></div><label class="nc-switch"><input data-field="enabled" type="checkbox" '+(row.enabled!==false?'checked':'')+'> <span>Enabled</span></label></div>'+
    '<div class="nc-card-grid">'+
    '<label>Team / Scope<input data-field="team" value="'+esc(row.team||'')+'" placeholder="All / MED / LAB / EHS / TES"></label>'+
    '<label>Frequency'+select('kind',[['DAILY','Daily'],['WEEKLY','Weekly'],['BIWEEKLY','Every 2 weeks'],['MONTHLY','Monthly'],['WEEK_OF_MONTH','Specific week of month'],['FIRST_MONDAY','First Monday of month'],['MONTH_END','Last day of month']],row.kind||'MONTHLY')+'</label>'+
    '<label data-schedule-for="WEEKLY BIWEEKLY WEEK_OF_MONTH">Weekday'+select('weekday',days.map(function(x){return[x,x.charAt(0)+x.slice(1).toLowerCase()];}),row.weekday||'MONDAY')+'</label>'+
    '<label data-schedule-for="WEEK_OF_MONTH">Week of month'+select('weekOfMonth',[[1,'First'],[2,'Second'],[3,'Third'],[4,'Fourth'],[5,'Fifth']],row.weekOfMonth||1)+'</label>'+
    '<label data-schedule-for="FIRST_MONDAY">First Monday<input value="First Monday · monthly" disabled></label>'+
    '<label data-schedule-for="MONTHLY">Day of month<input data-field="day" min="1" max="28" type="number" value="'+n(row.day,1)+'"></label>'+
    '<label>Hour (24h)<input data-field="hour" min="0" max="23" type="number" value="'+n(row.hour,9)+'"></label>'+
    '<label>Minute<input data-field="minute" min="0" max="59" type="number" value="'+n(row.minute,0)+'"></label>'+
    '<label class="wide">To<input data-field="to" type="text" value="'+esc(row.to||'')+'" placeholder="Default recipient if empty"></label>'+
    '<label class="wide">CC<input data-field="cc" type="text" value="'+esc(row.cc||'')+'" placeholder="Optional CC"></label>'+
    '<label class="wide">Subject (prefix [CES HUB] automatically)<input data-field="subject" type="text" value="'+esc(subject)+'"></label></div></article>';}
  function ensureLayout(){var x=el('ncCards');if(!x)return false;var v=el('view-notification_config');if(v){v.style.minWidth='0';v.style.width='100%';}return true;}
  function render(){if(!ensureLayout())return;var q=String(el('ncSearch')?.value||'').toLowerCase(),mod=el('ncModuleFilter')?.value||'all';
    var filtered=state.rows.filter(function(row){return(mod==='all'||row.module===mod)&&(!q||[row.name,row.module,row.team,row.subject].join(' ').toLowerCase().includes(q));});
    el('ncCards').innerHTML=filtered.length?filtered.map(card).join(''):'<div class="nc-card" style="grid-column:1/-1;padding:22px;color:#64748b">'+(state.rows.length?'No schedules match these filters.':'No notification configurations were returned. Check backend Setup and Refresh.')+'</div>';
    el('ncCards').querySelectorAll('.nc-card[data-id]').forEach(updateScheduleVisibility);
    if(el('ncSummary'))el('ncSummary').textContent=filtered.length+' shown / '+state.rows.length+' schedules'+(state.dirty?' · Unsaved changes':'');}

  function bind(){var host=el('ncCards');if(!host||host.dataset.bound==='1')return;host.dataset.bound='1';['input','change'].forEach(function(evt){host.addEventListener(evt,function(event){var card=event.target.closest('.nc-card[data-id]');if(!card)return;var row=state.rows.find(function(x){return String(x.id)===card.dataset.id;});if(!row)return;syncInput(card,row);markDirty();if(event.target.dataset.field==='kind')updateScheduleVisibility(card);});});}

  function waitForView(next,tries){if(ensureLayout()){bind();next();return;}if(tries>25)return;setTimeout(function(){waitForView(next,tries+1);},120);}
  window.cesNotifyRender=render;
  window.cesNotifyLoad=function(force){return new Promise(function(resolve){waitForView(resolve,0);}).then(function(){
    if(state.loading)return state.loading;
    if(force&&state.dirty&&!window.confirm('Discard unsaved changes and reload notification settings?'))return {success:false,cancelled:true};
    if(!force&&state.rows.length&&(state.dirty||Date.now()-state.loadedAt<300000)){render();return{success:true,source:'cache'};}
    message('Loading notification settings…');el('ncCards').innerHTML='<div class="nc-card" style="grid-column:1/-1">Loading configurations…</div>';
    state.loading=api('getNotificationAutomationConfig',[{force:!!force}],true).then(function(response){if(!response||response.success===false)throw Error(response?.message||'Notification API returned no data');
      state.rows=Array.isArray(response.rows)?response.rows.map(function(r){return Object.assign({},r);}):[];
      state.admin=response.adminTo||'Siripak.Ch@nhealth-asia.com';if(el('ncDefaultTo'))el('ncDefaultTo').value=state.admin;
      var previous=el('ncModuleFilter')?.value||'all',modules=Array.from(new Set(state.rows.map(function(x){return x.module;}).filter(Boolean))).sort();
      if(el('ncModuleFilter')){el('ncModuleFilter').innerHTML='<option value="all">All modules</option>'+modules.map(function(x){return'<option value="'+esc(x)+'">'+esc(x)+'</option>';}).join('');el('ncModuleFilter').value=modules.includes(previous)?previous:'all';}
      state.loadedAt=Date.now();state.dirty=false;render();message(state.rows.length+' notifications loaded. Changes apply only after Save.');return{success:true,count:state.rows.length};
    }).catch(function(error){message('Cannot load notifications: '+error.message,true);el('ncCards').innerHTML='<div class="nc-card" style="grid-column:1/-1"><b>Notification data unavailable</b><p>'+esc(error.message)+'</p><button type="button" class="nc-primary" onclick="cesNotifyLoad(true)">Retry</button></div>';return{success:false,message:error.message};
    }).finally(function(){state.loading=null;});return state.loading;});};
  window.cesNotifyReviewAndSave=async function(){
    if(!state.rows.length){message('No notification data loaded; Refresh first.',true);return;}
    document.querySelectorAll('#ncCards .nc-card[data-id]').forEach(function(card){var row=state.rows.find(function(x){return String(x.id)===card.dataset.id;});if(row)syncInput(card,row);});
    var admin=String(el('ncDefaultTo')?.value||'').trim();if(!validEmails(admin)||!admin){message('Invalid default admin email.',true);return;}
    var invalid=state.rows.find(function(r){return !validEmails(r.to)||!validEmails(r.cc)||!String(r.subject||r.name||'').trim();});
    if(invalid){message('Invalid To, CC or Subject for '+(invalid.name||invalid.id),true);return;}
    var active=state.rows.filter(function(x){return x.enabled!==false;}).length;
    var approved=window.Swal?await window.Swal.fire({icon:'question',title:'Save notification schedules?',text:active+' enabled of '+state.rows.length+'. No messages are sent immediately.',showCancelButton:true,confirmButtonText:'Save settings'}):{isConfirmed:window.confirm('Save '+state.rows.length+' notification schedules?')};
    if(!approved.isConfirmed)return;message('Saving '+state.rows.length+' notification schedules…');
    try{var out=await api('saveNotificationAutomationConfig',[{adminTo:admin,rows:state.rows}],false);if(!out||out.success===false)throw Error(out?.message||'Save failed');state.dirty=false;message('Saved successfully. Scheduler: '+(out.schedulerTriggerId?'Configured':'check trigger configuration')+'.');if(window.Swal)await window.Swal.fire({icon:'success',title:'Notification settings saved'});await window.cesNotifyLoad(true);
    }catch(error){message('Unable to save: '+error.message,true);if(window.Swal)window.Swal.fire('Save failed',error.message,'error');}
  };
  window.initNotificationConfig=function(){return window.cesNotifyLoad(false);};
})(window,document);
