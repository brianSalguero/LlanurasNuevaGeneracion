import { useState } from 'react';
import { News } from '@/types/types';
import { getNews } from '@/services/supabaseService';

export const useNews = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNews = async () => {
    setLoading(true);
    const { data, error } = await getNews();
    if (!error) setNews(data || []);
    setLoading(false);
  };

  return {
    news,
    setNews,
    fetchNews,
    loading,
  };
};