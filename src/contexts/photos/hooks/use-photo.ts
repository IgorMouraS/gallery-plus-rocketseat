import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Photo } from '../models/photo';
import { api, fetcher } from '../../../helpers/api';
import type { PhotoNewFormSchema } from '../schemas';
import { toast } from 'sonner';
import usePhotoAlbums from './use-photo-albums';

interface PhotoDetailResponse extends Photo {
  nextPhotoId: string;
  previousPhotoId: string;
}

export default function usePhoto(id?: string) {
  const { managePhotoOnAlbum } = usePhotoAlbums();

  const { data, isLoading, error } = useQuery<PhotoDetailResponse>({
    queryKey: ['photo', id],
    queryFn: () => fetcher(`/photos/${id}`),
    enabled: !!id,
  });

  const queryClient = useQueryClient()

  async function createPhoto(payload: PhotoNewFormSchema) {
    try {
      const { data: photo } = await api.post<Photo>('photos', { title: payload.title })
      await api.post(`/photos/${photo.id}/image`, { file: payload.file[0] }, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      if (payload.albumsIds && payload.albumsIds.length > 0) {
        await managePhotoOnAlbum(photo.id, payload.albumsIds)
      }
      queryClient.invalidateQueries({ queryKey: ['photos'] })
      toast.success('Foto criada com sucesso')

    } catch (error) {
      toast.error('Erro ao criar foto')
    }
  }

  async function deletePhoto(photo: Photo) {
    try {
      await api.delete(`/photos/${photo.id}`, { data: { title: photo.title } })
      queryClient.invalidateQueries({ queryKey: ['photos'] })
    } catch (error) {
      toast.error('Erro ao deletar foto')
    }
  }

  return {
    data: data || ({} as Photo),
    nextPhotoId: data?.nextPhotoId,
    previousPhotoId: data?.previousPhotoId,
    loading: isLoading,
    error,
    createPhoto,
    deletePhoto
  };
}