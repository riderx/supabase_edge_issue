-- Create a new storage bucket
insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true);

-- Create storage policy to allow authenticated uploads
create policy "Allow authenticated uploads"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create storage policy to allow authenticated downloads
create policy "Allow authenticated downloads"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text
); 
