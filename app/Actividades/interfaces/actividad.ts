export interface Actividad {
    id: number;
    title: string;
    desc: string;
    nivelMin: number;
    tipo: string;
    exp: number;
    evento?: string;
    imageUrl?: string;
    completada?: boolean;
}
