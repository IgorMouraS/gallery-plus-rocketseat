import { useQueryClient } from '@tanstack/react-query'
import { api } from '../../../helpers/api'
import { toast } from 'sonner'

export default function usePhotoAlbums() {
  const queryClient = useQueryClient()

  async function managePhotoOnAlbum(photoId: string, albumsIds: string[]) {
    try {
      await api.put(`/photos/${photoId}/albums`, { albumsIds })
      queryClient.invalidateQueries({ queryKey: ['photo', photoId] })
      queryClient.invalidateQueries({ queryKey: ['albums'] })

      toast.success('Album adicionado na foto com sucesso')
    } catch (error) {
      toast.error('Erro ao adicionar album na foto')
    }
  }

  return { managePhotoOnAlbum }
}