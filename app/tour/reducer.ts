import type {TourEvent,TourState} from './types';

export const INITIAL_TOUR_STATE:TourState={status:'idle',catalog:null,journey:null,tourId:null,beatIndex:0,requestId:0,error:null};
export function tourReducer(state:TourState,event:TourEvent):TourState{
 switch(event.type){
  case 'CATALOG_READY':return {...state,catalog:event.catalog};
  case 'OPEN':return {...state,status:'resolving',tourId:event.tourId,journey:null,beatIndex:0,requestId:event.requestId,error:null};
  case 'JOURNEY_READY':return event.requestId===state.requestId?{...state,status:'atlas-loading',journey:event.journey,beatIndex:event.beatIndex,error:null}:state;
  case 'ATLAS_READY':return state.status==='atlas-loading'?{...state,status:'beat-entering'}:state;
  case 'BEAT_READY':return state.status==='beat-entering'?{...state,status:'ready'}:state;
  case 'SELECT_BEAT':return state.journey&&event.index>=0&&event.index<state.journey.beats.length?{...state,status:'beat-entering',beatIndex:event.index,error:null}:state;
  case 'PLAY':return ['ready','paused'].includes(state.status)?{...state,status:'playing'}:state;
  case 'PAUSE':return state.status==='playing'?{...state,status:'paused'}:state;
  case 'COMPLETE':return state.journey?{...state,status:'complete',beatIndex:state.journey.beats.length-1}:state;
  case 'ERROR':return event.requestId!==undefined&&event.requestId!==state.requestId?state:{...state,status:'recoverable-error',error:event.message};
  case 'CLOSE':return {...INITIAL_TOUR_STATE,catalog:state.catalog,requestId:state.requestId};
 }
}
