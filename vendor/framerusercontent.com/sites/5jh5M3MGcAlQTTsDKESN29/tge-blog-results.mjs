import {d as h,I as useState,P as useEffect,F as Fragment,R as init} from './react.DwKF3UUh.mjs';
init();
export function OverlayEvents({open,hide}){
 useEffect(()=>{if(!open)return;const close=()=>{hide();document.querySelector('.framer-n5qI4')?.focus({preventScroll:true})},key=e=>{if(e.key==='Escape'){e.preventDefault();close()}};window.addEventListener('category-filter-change',close);window.addEventListener('keydown',key,true);return()=>{window.removeEventListener('category-filter-change',close);window.removeEventListener('keydown',key,true)}},[open,hide]);return null;
}
export function BlogResults({rows=[],render}){
 const [category,setCategory]=useState(''),[search,setSearch]=useState(''),[limit,setLimit]=useState(13);
 useEffect(()=>{
  const filter=e=>{const slug=(e.detail.slug||'').toLowerCase();setCategory(old=>old===slug?'':slug);setLimit(13)},find=e=>{setSearch(e.detail.trim().toLowerCase());setLimit(13)};
  window.addEventListener('category-filter-change',filter);window.addEventListener('tge-blog-search',find);
  return()=>{window.removeEventListener('category-filter-change',filter);window.removeEventListener('tge-blog-search',find)};
 },[]);
 const matches=rows.filter(row=>(!category||row.CUh8yohpy?.some(x=>x.WbuzYqEln.toLowerCase()===category))&&(!search||(row.ouq_M5Lqq+' '+row.QgMyr27Ty+' '+row.CUh8yohpy?.map(x=>x.WbuzYqEln).join(' ')).toLowerCase().includes(search)));
 useEffect(()=>{const label=document.querySelector('.framer-19ivqx1 p');if(label)label.textContent=category||'All categories';window.TGEScroll?.resize?.()},[category,search,limit]);
 return h(Fragment,null,render(matches.slice(0,limit)),h('div',{className:'tge-blog-pagination'},h('p',{'aria-live':'polite',role:'status'},matches.length?`${Math.min(limit,matches.length)} of ${matches.length} articles`:'No articles match your search. Try another term or category.'),limit<matches.length&&h('button',{type:'button',onClick:()=>setLimit(n=>n+12)},'Show more articles')));
}
