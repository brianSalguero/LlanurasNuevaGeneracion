import { supabase } from '@/lib/supabase';

export const getNews = async () =>
  supabase.from('noticias').select('*').order('created_at', { ascending: false });

export const deleteNews = async (id: number) => {
  return supabase.from('noticias').delete().eq('id', id);
};

export const getMembers = async () =>
  supabase.from('integrantes').select('*').order('created_at', { ascending: false });

export const deleteMember = async (id: number) => {
  return supabase.from('integrantes').delete().eq('id', id);
};

export const getGalerias = async () => {
  const { data: galerias } = await supabase
    .from('galerias')
    .select('*')
    .order('id', { ascending: false });

  const enriched = await Promise.all(
    (galerias || []).map(async (g) => {
      const { data: imgs } = await supabase
        .from('galeria_imagenes')
        .select('url, imagen_key')
        .eq('galeria_id', g.id);

      const { data: vids } = await supabase
        .from('galeria_videos')
        .select('url')
        .eq('galeria_id', g.id);

      return {
        ...g,
        imagenes: imgs || [],
        videos: vids?.map(v => v.url) || [],
      };
    })
  );

  return { data: enriched };
};