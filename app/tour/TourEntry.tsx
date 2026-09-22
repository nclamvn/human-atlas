import {ArrowRight} from 'lucide-react';
import type {CSSProperties} from 'react';
import type {TourCatalogItem} from './types';

export function TourEntry({tour,onOpen,disabled}:{tour:TourCatalogItem;onOpen:()=>void;disabled:boolean}){
 const [count,...unit]=tour.hero.countLabel.trim().split(/\s+/);
 return <button className="abdomen-entry" style={{'--entry-accent':tour.hero.accent} as CSSProperties} onClick={onOpen} disabled={disabled} aria-label={`Mở hành trình ${tour.title}`}>
  <span className="abdomen-entry-index"><span>{count}</span>{unit.length>0&&<span>{unit.join(' ')}</span>}</span>
  <span><small>{tour.eyebrow}</small><strong>{tour.title}</strong><em>{tour.summary}</em></span>
  <ArrowRight size={17}/>
 </button>;
}
