-- Add photo columns to pesantren table
ALTER TABLE pesantren
  ADD COLUMN foto_utama VARCHAR(500) DEFAULT NULL AFTER deskripsi,
  ADD COLUMN foto_galeri JSON DEFAULT NULL AFTER foto_utama;

-- Update existing pesantren with placeholder photos
UPDATE pesantren SET
  foto_utama = 'https://placehold.co/600x400/e2e8f0/64748b?text=Pesantren',
  foto_galeri = '["https://placehold.co/800x600/e2e8f0/64748b?text=Foto+1","https://placehold.co/800x600/e2e8f0/64748b?text=Foto+2","https://placehold.co/800x600/e2e8f0/64748b?text=Foto+3"]'
WHERE foto_utama IS NULL;
