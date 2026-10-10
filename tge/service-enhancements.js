/* Local illustrative service interactions. No network requests or customer data. */
(()=>{'use strict';
 if(window.__tgenServiceDemos)return;
 window.__tgenServiceDemos=true;
 const config=[
  {label:'Choose a campaign route',options:['Meta','Google','LinkedIn','TikTok','YouTube'],states:[['Meta campaign','Enquiry captured','Source retained for your team'],['Google campaign','Enquiry captured','Search context retained'],['LinkedIn campaign','Enquiry captured','Business context retained'],['TikTok campaign','Enquiry captured','Creative source retained'],['YouTube campaign','Enquiry captured','Video campaign source retained']]},
  {label:'Explore qualification steps',options:['Ask','Qualify','Book'],states:[['Ask a useful question','What would you like to improve?','Example answer: more qualified enquiries.'],['Check the agreed criteria','Does the enquiry fit your service?','Unclear answers go to a person.'],['Offer the next conversation','Show suitable appointment options','Illustrative step only; no calendar is connected.']]},
  {label:'Choose a creative placement',options:['Vertical 9:16','Square 1:1','Wide 16:9'],states:[['Vertical video','Lead with one clear message','Reframe for the tall mobile screen.'],['Square creative','Give the idea a clear focal point','Adapt the crop and keep the call to action legible.'],['Wide creative','Use the horizontal space','Recompose the same idea rather than stretching it.']]},
  {label:'Explore the CRM handoff',options:['New','Assigned','Conversation','Outcome'],states:[['New enquiry','Source + contact + request','Next action: assign an owner.'],['Assigned','A named team member owns the enquiry','Next action: review the context and respond.'],['Conversation','The history stays with the enquiry','Next action: record the agreed follow-up.'],['Outcome recorded','The team records what happened','Next action: review source and progression together.']]},
  {label:'Choose a prospect behaviour',options:['New enquiry','No response','Booked'],states:[['Enquiry received','Acknowledge the request','Assign the next response to a person.'],['No response recorded','Follow up through a permitted channel','Stop or change the journey when the prospect responds.'],['Appointment booked','Pause the enquiry chase','Send agreed reminders without duplicate messages.']]}
 ];
 function render(host,index,choice){
  const c=config[index],s=c.states[choice];host.dataset.choice=String(choice);
  host.innerHTML='<div class="tgen-demo-controls" role="group" aria-label="'+c.label+'">'+c.options.map((label,i)=>'<button type="button" data-tgen-demo-choice="'+i+'" aria-pressed="'+(i===choice)+'">'+label+'</button>').join('')+'</div><div class="tgen-demo-result" aria-live="polite"><strong>'+s[0]+'</strong><p>'+s[1]+'</p><small>'+s[2]+'</small></div>';
  const original=host.parentElement.querySelector('.tgen-placements');
  if(original)original.querySelectorAll('.tgen-placement').forEach((el,i)=>{el.hidden=i!==choice;});
  const flow=host.parentElement.querySelector('.tgen-flow');if(flow)flow.hidden=true;
 }
 function mount(){
  document.querySelectorAll('.tgen-service-list').forEach(list=>{
   [...list.querySelectorAll('.tgen-service')].slice(0,5).forEach((service,index)=>{
    const area=service.querySelector('.tgen-demonstration');if(!area||area.querySelector('[data-tgen-service-demo]'))return;
    const host=document.createElement('div');host.dataset.tgenServiceDemo=String(index);area.prepend(host);render(host,index,0);
   });
  });
 }
 document.addEventListener('click',event=>{
  const button=event.target.closest('[data-tgen-demo-choice]');if(!button)return;
  const host=button.closest('[data-tgen-service-demo]');if(!host)return;
  const index=Number(host.dataset.tgenServiceDemo),choice=Number(button.dataset.tgenDemoChoice);
  if(!config[index]?.states[choice])return;
  render(host,index,choice);host.querySelector('[data-tgen-demo-choice="'+choice+'"]').focus({preventScroll:true});
 });
 const style=document.createElement('style');style.id='tgen-service-demo-style';style.textContent='.tgen-demo-controls{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:22px}.tgen-demo-controls button{font:inherit;font-size:12px;padding:9px 13px;border:1px solid currentColor;border-radius:30px;background:transparent;color:inherit;cursor:pointer}.tgen-demo-controls button[aria-pressed=true]{background:#c1a4d2;color:#201a25;border-color:#c1a4d2}.tgen-demo-controls button:focus-visible{outline:2px solid currentColor;outline-offset:4px}.tgen-demo-result{min-height:126px;border-left:2px solid #c1a4d2;padding:5px 0 5px 20px}.tgen-demo-result strong{display:block;font-size:21px;line-height:1.25}.tgen-demo-result p{margin:12px 0;font-size:14px}.tgen-demo-result small{display:block;font-size:12px;line-height:1.6;opacity:.78}.tgen-demonstration [hidden]{display:none!important}.tgen-demonstration .tgen-placements{margin-top:20px}';document.head.appendChild(style);
 let observer;function observe(){if(observer)return;observer=new MutationObserver(mount);observer.observe(document.body,{childList:true,subtree:true});mount();}
 window.addEventListener('pagehide',()=>{observer?.disconnect();observer=null;});window.addEventListener('pageshow',observe);observe();
})();
