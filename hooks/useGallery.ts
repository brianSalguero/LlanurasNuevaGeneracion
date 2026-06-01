import { useState } from 'react';
import { Gallery } from '@/types/types';
import { getGalerias } from '@/services/supabaseService';

export const useGallery = () => {
  const [galerias, setGalerias] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchGalerias = async () => {
    setLoading(true);
    const { data } = await getGalerias();
    setGalerias(data || []);
    setLoading(false);
  };

  return { galerias, setGalerias, fetchGalerias, loading };
};