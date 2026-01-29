import { useQueryClient } from '@tanstack/react-query'
import type { AlbumNewFormSchema } from '../schemas'
import type { Album } from '../models/album'
import { api } from '../../../helpers/api'
import { toast } from 'sonner'
import usePhotos from '../../photos/hooks/use-photos'
import usePhotoAlbums from '../../photos/hooks/use-photo-albums'

export default function useAlbum() {
  const { managePhotoOnAlbum } = usePhotoAlbums()
  const queryClient = useQueryClient()
  const { data: photos } = usePhotos()

  async function createAlbum(payload: AlbumNewFormSchema) {
    try {
      const { data: album } = await api.post<Album>('albums', { title: payload.title })
      await Promise.all(
        payload.photosIds?.map((photoId) => {
          const albumsIds = photos?.find((photo) => photo.id === photoId)?.albums.map((album) => album.id) || []
          return managePhotoOnAlbum(photoId, [...albumsIds, album.id])
        }) || []
      )

      queryClient.invalidateQueries({ queryKey: ['albuns'] })
      queryClient.invalidateQueries({ queryKey: ['photos'] })
      toast.success('Album criado com sucesso')
    } catch (error) {
      toast.error('Erro ao criar Album')
    }
  }
  return { createAlbum }
}