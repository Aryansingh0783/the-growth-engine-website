(()=>{'use strict';if(window.__tgenSections)return;window.__tgenSections=true;
const steps=[["See what each lead costs.", "Campaign performance", "Compare campaign spend, lead volume and cost per lead. See which channels bring enquiries.", ["Campaign spend", "Leads generated", "Cost per lead"]], ["Follow each enquiry.", "Pipeline performance", "Track sales opportunities, conversion rates and pipeline value. Use stages that match your team’s sales process.", ["Sales opportunities", "Conversion rates", "Pipeline value"]], ["See which channels bring sales.", "Revenue attribution", "Compare recorded sales and revenue by channel. Trace each sale back to its source where tracking is available.", ["Recorded sales", "Revenue by channel", "Source attribution"]]];
function status(root,text){root.querySelector('[data-tgen-status]').textContent=text;}
document.addEventListener('click',e=>{const target=e.target.closest('[data-tgen-step]');if(!target)return;
const root=target.closest('.tgen-report'),i=Number(target.dataset.tgenStep),s=steps[i];if(!root||!s)return;
root.querySelectorAll('[data-tgen-step]').forEach(b=>b.setAttribute('aria-pressed',String(b===target)));root.dataset.lens=String(i);
root.querySelector('[data-tgen-title]').textContent=s[0];root.querySelector('[data-tgen-stage]').textContent=s[1];root.querySelector('[data-tgen-description]').textContent=s[2];root.querySelectorAll('[data-tgen-measure]').forEach((node,j)=>node.textContent=s[3][j]);});
document.addEventListener('submit',e=>{const root=e.target.closest('.tgen-planner');if(!root)return;e.preventDefault();
if(!root.reportValidity())return;const email=root.querySelector('#tgen-email'),name=root.querySelector('#tgen-name').value.trim(),need=root.querySelector('#tgen-need').value,msg=root.querySelector('#tgen-message').value.trim();const body='Name: '+(name||'Not supplied')+'\nEmail: '+(email.value||'Not supplied')+'\nInterested in: '+need+'\n\n'+(msg||'I would like to discuss where to start.');
status(root,'Opening your email app…');location.href='mailto:info@thegrowthengine.net?subject='+encodeURIComponent('TGE enquiry — '+need)+'&body='+encodeURIComponent(body);
});
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),faqStates=new Set();
function animateFaq(state,expanded){
 const {details,summary,body}=state,start=details.getBoundingClientRect().height;
 if(state.animation){state.animation.onfinish=null;state.animation.cancel();state.animation=null;}
 state.expanded=expanded;summary.setAttribute('aria-expanded',String(expanded));body.inert=!expanded;
 const finish=()=>{details.open=state.expanded;details.style.height='';details.style.overflow='';state.animation=null;};
 details.open=true;details.style.height='';
 const style=getComputedStyle(details),border=(parseFloat(style.borderTopWidth)||0)+(parseFloat(style.borderBottomWidth)||0);
 const end=expanded?details.getBoundingClientRect().height:summary.getBoundingClientRect().height+border;
 if(reduced.matches||!details.animate||Math.abs(end-start)<1){finish();return;}
 details.style.overflow='hidden';
 state.animation=details.animate([{height:start+'px'},{height:end+'px'}],{duration:Math.max(160,Math.min(360,Math.abs(end-start)*1.8)),easing:'cubic-bezier(.22,.68,0,1)'});
 state.animation.onfinish=finish;
}
function mountFaq(){document.querySelectorAll('.tgen-faq details:not([data-tgen-faq-mounted])').forEach(details=>{
 details.dataset.tgenFaqMounted='true';const summary=details.querySelector('summary'),body=document.createElement('div');body.className='tgen-faq-body';
 for(const node of [...details.childNodes])if(node!==summary)body.append(node);details.append(body);
 const state={details,summary,body,expanded:details.open,animation:null};faqStates.add(state);summary.setAttribute('aria-expanded',String(details.open));body.inert=!details.open;
 summary.addEventListener('click',e=>{e.preventDefault();animateFaq(state,!state.expanded);});
});}
reduced.addEventListener('change',()=>{if(reduced.matches)for(const state of faqStates)if(state.animation)animateFaq(state,state.expanded);});
function mount(){mountFaq();document.querySelectorAll('.tgen-service-list:not([data-tgen-mounted])').forEach(list=>{list.dataset.tgenMounted='true';list.addEventListener('toggle',e=>{if(e.target.tagName==='DETAILS'&&e.target.open)list.querySelectorAll('details[open]').forEach(d=>{if(d!==e.target)d.open=false;});},true);});}let observer=null;function observe(){if(observer)return;observer=new MutationObserver(mount);observer.observe(document.documentElement,{childList:true,subtree:true});mount();}window.addEventListener('pagehide',()=>{observer?.disconnect();observer=null;});window.addEventListener('pageshow',observe);observe();})();
