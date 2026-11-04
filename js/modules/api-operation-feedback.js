(function(w,d){'use strict';
function ready(){if(!w.CES_API||typeof w.CES_API.callFunction!=='function'||w.CES_API.__feedbackReady)return;
 const original=w.CES_API.callFunction.bind(w.CES_API);w.CES_API.__feedbackReady=true;
 const banner=d.createElement('div');banner.id='ces-operation-feedback';banner.setAttribute('role','status');banner.setAttribute('aria-live','polite');banner.hidden=true;d.body.appendChild(banner);
 let active=0,seq=0;
 function show(text,type){banner.hidden=false;banner.textContent=text;banner.dataset.state=type||'loading';}
 w.CES_API.callFunction=function(name,args,options){const opts=options||{};
  const isWrite=opts.userAction===true && (opts.transport==='iframe'||/^(save|create|delete|update|import|upload|sync|transfer|approve|submit|runNotification)/i.test(String(name)));
  if(!isWrite)return original(name,args,options);
  const id=++seq;active++;show('กำลังบันทึกข้อมูล · '+String(name).replace(/([A-Z])/g,' $1').slice(0,50),'loading');
  return Promise.resolve(original(name,args,options)).then(function(result){
    active=Math.max(0,active-1);if(result&&result.success===false)throw Error(result.message||'Operation failed');
    if(!active){show('บันทึกข้อมูลสำเร็จ','success');setTimeout(function(){if(!active&&id===seq)banner.hidden=true;},1500);}return result;
  },function(error){active=Math.max(0,active-1);if(!active){show('ไม่สำเร็จ: '+String(error?.message||error).slice(0,110),'error');setTimeout(function(){if(!active&&id===seq)banner.hidden=true;},4500);}throw error;});
 };
}
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})(window,document);
