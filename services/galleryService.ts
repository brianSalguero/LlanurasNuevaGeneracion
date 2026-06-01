import { supabase } from '@/lib/supabase';

export const getGalerias = async () => {
  const { data: galerias } = await supabase
    .from('galerias')
    .select('*')
    .order('id', { ascending: false });

  const enriched = await Promise.all(
    (galerias || []).map(async (g) => {
      const { data: imgs } = await supabase
        .from('galeria_imagenes')
        .select('url')
        .eq('galeria_id', g.id);

      const { data: vids } = await supabase
        .from('galeria_videos')
        .select('url')
        .eq('galeria_id', g.id);
      console.log(imgs?.length);
      return {
        ...g,
        imagenes: imgs?.map(i => i.url) || [],
        videos: vids?.map(v => v.url) || [],
      };
    })
  );

  return { data: enriched };
};