export type News = {
  id: number;
  titulo: string;
  descripcion: string;
  imagen: string;
  imagen_key: string;
  publicado: boolean;
};

export type Member = {
  id: number;
  nombre: string;
  apellido: string;
  rol: string;
  imagen: string | null;
  imagen_key: string | null;
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
};

export type Gallery = {
  id: number;
  lugar: string;
  fecha: string;
  imagenes: string[];
  videos: string[];
};