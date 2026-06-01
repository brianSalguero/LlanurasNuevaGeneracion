import { useState } from 'react';
import { Member } from '@/types/types';
import { getMembers } from '@/services/supabaseService';

export const useMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMembers = async () => {
    setLoading(true);
    const { data } = await getMembers();
    setMembers(data || []);
    setLoading(false);
  };

  return { members, setMembers, fetchMembers, loading };
};