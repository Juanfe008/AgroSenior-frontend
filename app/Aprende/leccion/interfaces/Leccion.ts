import { Card } from "./Card";

export interface LeccionData {
    id: number;
    title: string;
    desc: string;
    imgUrl?: string;  
    tipo: 'texto' | 'infografia';  
    nivelId?: number;
    cards?: Card[]; 
}
