import {d as createElement,R as initialiseReact} from './react.DwKF3UUh.mjs';
import records from './tge-blog-records.mjs';
initialiseReact();
// Framer's database interface lets the original layout and motion consume local data.
export function collection(schema,kind='posts'){
 const rows=kind==='posts'?records:[...new Set(records.flatMap(x=>x.JeyCdBEOL))].sort().map(name=>({id:name,WbuzYqEln:name,yBU0WAcIF:name.toLowerCase()}));
 const typed=(value,definition)=>value==null?null:{type:definition.type,value:definition.type==='array'?value.map(v=>typed(v,definition.definition)):value};
 const item=(row,index)=>({pointer:String(index),data:Object.fromEntries(Object.entries(schema).filter(([key])=>row[key]!=null).map(([key,definition])=>[key,typed(row[key],definition)]))});
 const db={id:'tge-blog-'+kind,schema,indexes:[],async scanItems(){return rows.map(item)},async resolveItems(pointers){return pointers.map(i=>item(rows[Number(i)],Number(i)))},compareItems(a,b){return Number(a.pointer)-Number(b.pointer)},compareValues(a,b){return a?.value<b?.value?-1:a?.value>b?.value?1:0},async resolveRichText(slug){const response=await fetch('/tge/blog/articles/'+slug+'.json');if(!response.ok)throw Error('Article unavailable: '+slug);const {html}=await response.json();return createElement('div',{className:'tge-article-body',dangerouslySetInnerHTML:{__html:html}})}};
 return {collectionByLocaleId:{default:db},displayName:kind==='posts'?'TGE articles':'Categories',id:db.id};
}
