(function(w,d){'use strict';
  const e=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const store={rows:[],edit:false};
  w.initNotificationConfigV10=async function(){
    const body=d.getElementById('cesNotificationRowsV10'),foot=d.getElementById('cesNotificationFootV10');if(!body)return;
    body.innerHTML='<tr><td colspan="9">Loading configurations…</td></tr>';
    try{const r=await w.CES_API.callFunction('getNotificationSettingsV10',[],{transport:'jsonp',timeoutMs:35000,module:'settings',userAction:true});if(!r||r.success===false)throw Error(r?.message||'Could not read settings');
    store.rows=r.rows||[];store.edit=r.canEdit===true;
    body.innerHTML=store.rows.map((x,i)=>'<tr data-notify-row="'+i+'"><td><b>'+e(x.module)+'</b><small>'+e(x.id)+'</small></td><td><select data-k="enabled"><option '+(x.enabled?'':'selected')+' value="OFF">Off</option><option '+(x.enabled?'selected':'')+' value="ON">On</option></select></td><td><select data-k="frequency">'+['DAILY','WEEKLY','MONTHLY','ON_DATE'].map(v=>'<option '+(x.frequency===v?'selected':'')+'>'+v+'</option>').join('')+'</select></td><td><input aria-label="Day or date" data-k="day" value="'+e(x.day)+'" placeholder="MON / 15 / 2026-12-01"></td><td><input aria-label="Time" data-k="time" type="time" value="'+e(x.time)+'"></td><td><small class="ces-v10-admin-address">'+e(x.to)+'</small></td><td><input aria-label="Optional CC" data-k="cc" value="'+e(x.cc)+'"></td><td><input aria-label="Subject" data-k="subject" value="'+e(x.subject)+'"></td><td><button type="button" '+(!store.edit?'disabled title="Admin authorization required"':'')+' onclick="cesSaveNotificationV10('+i+')">Save</button></td></tr>').join('');
    foot.textContent=store.edit?'Admin settings enabled. Delivery remains OFF globally.':'Read only: Apps Script requires signed-in Admin identity for editing. Edit the Notification Settings Sheet directly if unavailable.';
    }catch(err){body.innerHTML='<tr><td colspan="9">'+e(err.message||err)+'</td></tr>';}
  };
  w.cesSaveNotificationV10=async function(i){const row=d.querySelector('[data-notify-row="'+i+'"]');const prev=store.rows[i];if(!row||!prev)return;
    const val=k=>row.querySelector('[data-k="'+k+'"]')?.value||'';
    const payload={id:prev.id,enabled:val('enabled')==='ON',frequency:val('frequency'),day:val('day'),time:val('time'),cc:val('cc'),subject:val('subject')};
    try{const r=await w.CES_API.callFunction('saveNotificationSettingsV10',[payload],{transport:'iframe',timeoutMs:45000,module:'settings',userAction:true});if(!r||r.success===false)throw Error(r?.message||'Save failed');if(w.Swal)w.Swal.fire({icon:'success',title:'Saved',text:'Configuration only — no email was sent.'});}catch(err){if(w.Swal)w.Swal.fire('Save failed',String(err.message||err),'error');else alert(err.message||err);}
  };
})(window,document);
