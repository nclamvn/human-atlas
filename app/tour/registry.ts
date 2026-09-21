import type {TourCatalog,TourJourney} from './types';
import {isTourCatalog,isTourJourney} from './validate';

async function json(url:string,signal?:AbortSignal){const response=await fetch(url,{signal});if(!response.ok)throw new Error(`HTTP ${response.status}`);return response.json() as Promise<unknown>}
export async function loadTourCatalog(signal?:AbortSignal):Promise<TourCatalog>{
 const value=await json('/content/catalog.json',signal);
 if(!isTourCatalog(value))throw new Error('Danh mục hành trình không hợp lệ.');
 return value;
}
export async function loadTourJourney(item:{path:string},signal?:AbortSignal):Promise<TourJourney>{
 const value=await json(item.path,signal);
 if(!isTourJourney(value))throw new Error('Nội dung hành trình không hợp lệ.');
 return value;
}
