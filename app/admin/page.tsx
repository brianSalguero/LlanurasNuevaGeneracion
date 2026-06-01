'use client';

import { useEffect, useState } from 'react';

import AdminLayout from '@/components/Admin/AdminLayout';
import Sidebar from '@/components/Admin/Sidebar';
import MobileNav from '@/components/Admin/MobileNav';

import NewsList from '@/components/Admin/News/NewsList';
import NewsModal from '@/components/Admin/News/NewsModal';

import MembersList from '@/components/Admin/Members/MembersList';
import MembersModal from '@/components/Admin/Members/MembersModal';

import GalleryList from '@/components/Admin/Gallery/GalleryList';
import GalleryModal from '@/components/Admin/Gallery/GalleryModal';

import { useNews } from '@/hooks/useNews';
import { useMembers } from '@/hooks/useMembers';
import { useGallery } from '@/hooks/useGallery';

import { deleteNews, deleteMember } from '@/services/supabaseService';

import { News, Member } from '@/types/types';
import { prepareImage } from '@/utils/image';
import { supabase } from '@/lib/supabase';

import { uploadFile } from '@/services/uploadService';

type Section = 'news' | 'members' | 'gallery';

export default function AdminPage() {
  // =========================
  // AUTH
  // =========================

  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');

  // =========================
  // SECTION
  // =========================

  const [section, setSection] = useState<Section>('news');

  // =========================
  // DATA
  // =========================

  const { news, fetchNews } = useNews();
  const { members, fetchMembers } = useMembers();
  const { galerias, fetchGalerias } = useGallery();

  // =========================
  // MODALS
  // =========================

  const [newsOpen, setNewsOpen] = useState(false);
  const [newsEditing, setNewsEditing] = useState<News | null>(null);

  const [memberOpen, setMemberOpen] = useState(false);
  const [memberEditing, setMemberEditing] = useState<any | null>(null);

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryEditing, setGalleryEditing] = useState<any | null>(null);

  // =========================
  // AUTH LISTENER
  // =========================

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);
      setAuthLoading(false);

      if (session) {
        fetchNews();
        fetchMembers();
        fetchGalerias();
      }
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);

      if (session) {
        fetchNews();
        fetchMembers();
        fetchGalerias();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // =========================
  // LOGIN
  // =========================

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user,
          password,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError('Usuario o contraseña incorrectos');
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: "briansalguero200217@gmail.com",
        password: password,
      });

      if (error) {
        setError('Error iniciando sesión');
      }
    } catch (err) {
      console.log(err);
      setError('Error general');
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  // =========================
  // DELETES
  // =========================

  const handleDeleteNews = async (news: News) => {
    const ok = window.confirm(
      '¿Seguro que deseas eliminar esta noticia?'
    );

    if (!ok) return;

    if (news.imagen_key) {
      await fetch('/api/delete-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: news.imagen_key,
        }),
      });
    }

    await deleteNews(news.id);
    fetchNews();
  };

  const handleDeleteMember = async (member: Member) => {
    const ok = window.confirm(
      '¿Seguro que deseas eliminar este integrante?'
    );

    if (!ok) return;

    if (member.imagen_key) {
      await fetch('/api/delete-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: member.imagen_key,
        }),
      });
    }

    // 2. borrar en Supabase
    await deleteMember(member.id);
    fetchMembers();
  };

  const handleDeleteGallery = async (gallery: any) => {
    const ok = window.confirm(
      '¿Seguro que deseas eliminar esta galería?'
    );

    if (!ok) return;

    try {
      // =========================
      // 1. OBTENER IMÁGENES CON KEY
      // =========================
      const { data: images } = await supabase
        .from('galeria_imagenes')
        .select('imagen_key')
        .eq('galeria_id', gallery.id);

      // =========================
      // 2. BORRAR DE CLOUDFLARE
      // =========================
      if (images && images.length > 0) {
        await Promise.all(
          images.map(async (img) => {
            if (!img.imagen_key) return;

            await fetch('/api/delete-image', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                key: img.imagen_key,
              }),
            });
          })
        );
      }

      // =========================
      // 3. BORRAR IMÁGENES BD
      // =========================
      await supabase
        .from('galeria_imagenes')
        .delete()
        .eq('galeria_id', gallery.id);

      // =========================
      // 4. BORRAR VIDEOS BD
      // =========================
      await supabase
        .from('galeria_videos')
        .delete()
        .eq('galeria_id', gallery.id);

      // =========================
      // 5. BORRAR GALERÍA
      // =========================
      await supabase
        .from('galerias')
        .delete()
        .eq('id', gallery.id);

      // =========================
      // 6. REFRESH UI
      // =========================
      fetchGalerias();
    } catch (err) {
      console.log('Error deleting gallery:', err);
    }
  };

  const handleSaveNews = async (data: {
    id?: number;
    titulo: string;
    descripcion: string;
    image: File | null;
    removeImage?: boolean;
  }) => {
    try {
      let imageUrl = newsEditing?.imagen || null;
      let imageKey = newsEditing?.imagen_key || null;

      // 1. borrar si el usuario quitó imagen
      if (data.removeImage && imageKey) {
        await fetch('/api/delete-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: imageKey }),
        });

        imageUrl = null;
        imageKey = null;
      }

      // 2. subir nueva imagen
      if (data.image) {
        if (imageKey && !data.removeImage) {
          await fetch('/api/delete-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: imageKey }),
          });
        }

        const file = await prepareImage(data.image);
        const uploaded = await uploadFile(file);

        imageUrl = uploaded.url;
        imageKey = uploaded.key;
      }

      const payload = {
        titulo: data.titulo,
        descripcion: data.descripcion,
        imagen: imageUrl,
        imagen_key: imageKey,
        publicado: true,
      };

      if (data.id) {
        await supabase
          .from('noticias')
          .update(payload)
          .eq('id', data.id);
      } else {
        await supabase
          .from('noticias')
          .insert([payload]);
      }

      setNewsOpen(false);
      fetchNews();
    } catch (err) {
      console.log(err);
    }
  };

  const handleSaveMember = async (data: {
    id?: number;
    nombre: string;
    apellido: string;
    rol: string;
    image: File | null;
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    removeImage?: boolean;
  }) => {
    let imageUrl = memberEditing?.imagen || null;
    let imageKey = memberEditing?.imagen_key || null;

    // 1. SOLO eliminar si el usuario pidió quitarla
    if (data.removeImage && imageKey) {
      await fetch('/api/delete-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: imageKey }),
      });

      imageUrl = null;
      imageKey = null;
    }

    // 2. SOLO subir nueva si existe file
    if (data.image) {
      // si había imagen previa y NO fue removida arriba → borrarla
      if (imageKey && !data.removeImage) {
        await fetch('/api/delete-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: imageKey }),
        });
      }

      const file = await prepareImage(data.image);
      const uploaded = await uploadFile(file);

      imageUrl = uploaded.url;
      imageKey = uploaded.key;
    }

    const payload = {
      nombre: data.nombre,
      apellido: data.apellido,
      rol: data.rol,
      imagen: imageUrl,
      imagen_key: imageKey,
      instagram: data.instagram || null,
      facebook: data.facebook || null,
      tiktok: data.tiktok || null,
    };

    if (data.id) {
      await supabase
        .from('integrantes')
        .update(payload)
        .eq('id', data.id);
    } else {
      await supabase
        .from('integrantes')
        .insert([payload]);
    }

    setMemberOpen(false);
    fetchMembers();
  };

  const handleSaveGallery = async (data: {
    id?: number;
    lugar: string;
    fecha: string;
    images: File[];
    existingImages: {
      url: string;
      imagen_key: string | null;
    }[];
    deletedImages: {
      url: string;
      imagen_key: string | null;
    }[];
    videos: string[];
  }) => {
    try {
      const isEdit = typeof data.id === 'number';
      let galleryId = data.id;

      // =========================
      // 1. BORRAR IMÁGENES ELIMINADAS (CLOUD + BD)
      // =========================
      const deletedImages = data.deletedImages ?? [];

      for (const img of deletedImages) {
        if (!img.imagen_key) continue;

        await fetch('/api/delete-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: img.imagen_key }),
        });

        await supabase
          .from('galeria_imagenes')
          .delete()
          .eq('imagen_key', img.imagen_key);
      }

      // =========================
      // 2. CREATE / UPDATE GALERÍA
      // =========================
      if (isEdit && galleryId) {
        const { error } = await supabase
          .from('galerias')
          .update({
            lugar: data.lugar,
            fecha: data.fecha,
          })
          .eq('id', galleryId);

        if (error) throw error;
      } else {
        const { data: inserted, error } = await supabase
          .from('galerias')
          .insert({
            lugar: data.lugar,
            fecha: data.fecha,
          })
          .select()
          .single();

        if (error) throw error;
        galleryId = inserted.id;
      }

      if (!galleryId) throw new Error('Missing galleryId');

      // =========================
      // 3. SI ES EDIT → LIMPIAR RELACIONES ANTES DE RECREAR
      // =========================
      if (isEdit) {
        await supabase
          .from('galeria_imagenes')
          .delete()
          .eq('galeria_id', galleryId);

        await supabase
          .from('galeria_videos')
          .delete()
          .eq('galeria_id', galleryId);
      }

      // =========================
      // 4. SUBIR NUEVAS IMÁGENES
      // =========================
      const uploadedImages = await Promise.all(
        data.images.map(async (file) => {
          const prepared = await prepareImage(file);
          const uploaded = await uploadFile(prepared);

          return {
            galeria_id: galleryId,
            url: uploaded.url,
            imagen_key: uploaded.key,
          };
        })
      );

      // =========================
      // 5. MANTENER EXISTENTES
      // =========================
      const existingRows = data.existingImages.map((img) => ({
        galeria_id: galleryId,
        url: img.url,
        imagen_key: img.imagen_key,
      }));

      const allImages = [...existingRows, ...uploadedImages];

      if (allImages.length > 0) {
        await supabase.from('galeria_imagenes').insert(allImages);
      }

      // =========================
      // 6. VIDEOS
      // =========================
      const videoRows = data.videos.map((url) => ({
        galeria_id: galleryId,
        url,
      }));

      if (videoRows.length > 0) {
        await supabase.from('galeria_videos').insert(videoRows);
      }

      // =========================
      // 7. UI RESET
      // =========================
      setGalleryOpen(false);
      setGalleryEditing(null);
      fetchGalerias();

    } catch (err) {
      console.log('Error saving gallery:', err);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (authLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        Cargando...
      </main>
    );
  }

  // =========================
  // LOGIN SCREEN
  // =========================

  if (!session) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 px-6">

        <form
          onSubmit={handleLogin}
          className="w-full max-w-md bg-slate-100 dark:bg-slate-900 rounded-3xl p-8 shadow-xl"
        >

          <h1 className="text-4xl font-extrabold text-amber-500 text-center mb-2">
            Admin Panel
          </h1>

          <p className="text-center text-slate-500 dark:text-slate-400 mb-8">
            Inicia sesión para continuar
          </p>

          <input
            type="text"
            placeholder="Usuario"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="w-full mb-4 px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-4 px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
          />

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 transition text-white font-bold py-3 rounded-xl"
          >
            Entrar
          </button>

        </form>
      </main>
    );
  }

  // =========================
  // ADMIN
  // =========================

  return (
    <AdminLayout>

      <Sidebar
        section={section}
        setSection={setSection}
        onLogout={handleLogout}
      />

      <MobileNav
        section={section}
        setSection={setSection}
        onLogout={handleLogout}
      />

      <div className="flex-1 md:ml-72 p-6 overflow-x-hidden">

        {section === 'news' && (
          <>
            <NewsList
              news={news}
              onEdit={(item) => {
                setNewsEditing(item);
                setNewsOpen(true);
              }}
              onDelete={(item) => handleDeleteNews(item)}
              onCreate={() => {
                setNewsEditing(null);
                setNewsOpen(true);
              }}
            />

            <NewsModal
              open={newsOpen}
              initialData={newsEditing}
              onClose={() => setNewsOpen(false)}
              onSave={handleSaveNews}
            />
          </>
        )}

        {section === 'members' && (
          <>
            <MembersList
              members={members}
              onEdit={(item) => {
                setMemberEditing(item);
                setMemberOpen(true);
              }}
              onDelete={(item) => handleDeleteMember(item)}
              onCreate={() => {
                setMemberEditing(null);
                setMemberOpen(true);
              }}
            />

            <MembersModal
              open={memberOpen}
              initialData={memberEditing}
              onClose={() => setMemberOpen(false)}
              onSave={handleSaveMember}

            />
          </>
        )}

        {section === 'gallery' && (
          <>
            <GalleryList
              galerias={galerias}
              onCreate={() => {
                setGalleryEditing(null);
                setGalleryOpen(true);
              }}
              onDelete={handleDeleteGallery}
              onEdit={(gallery) => {
                setGalleryEditing(gallery);
                setGalleryOpen(true);
              }}
            />

            <GalleryModal
              open={galleryOpen}
              initialData={
                galleryEditing
                  ? {
                    id: galleryEditing.id,
                    lugar: galleryEditing.lugar,
                    fecha: galleryEditing.fecha,
                    images: (galleryEditing.imagenes || []).map((img: any) => ({
                      url: img.url,
                      imagen_key: img.imagen_key ?? null,
                    })),
                    videos: galleryEditing.videos || [],
                  }
                  : null
              }
              onClose={() => {
                setGalleryOpen(false);
                setGalleryEditing(null);
              }}
              onSave={handleSaveGallery}
            />
          </>
        )}

      </div>
    </AdminLayout>
  );
}