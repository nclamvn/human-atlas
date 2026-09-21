export interface TourLocation{tourId:string|null;beatId:string|null}
export function readTourLocation(search=location.search):TourLocation{const query=new URLSearchParams(search);return{tourId:query.get('tour'),beatId:query.get('beat')}}
export function tourUrl(next:TourLocation,current=location.href){
 const url=new URL(current);if(next.tourId)url.searchParams.set('tour',next.tourId);else url.searchParams.delete('tour');
 if(next.tourId&&next.beatId)url.searchParams.set('beat',next.beatId);else url.searchParams.delete('beat');
 return url.pathname+url.search+url.hash;
}
export function writeTourLocation(next:TourLocation,mode:'push'|'replace'='push'){history[mode==='push'?'pushState':'replaceState'](null,'',tourUrl(next));}
