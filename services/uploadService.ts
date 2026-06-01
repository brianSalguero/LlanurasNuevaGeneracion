export const uploadFile = async (file: File) => {
  const form = new FormData();
  form.append('file', file);

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: form,
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error);
  return data; // { url, key }
};