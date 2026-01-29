import { useQuery } from '@tanstack/react-query';
import { fetcher } from '../../../helpers/api';
import type { Album } from '../models/album';

export default function useAlbuns() {
  const { data, isLoading, error } = useQuery<Album[]>({
    queryKey: ['albuns'],
    queryFn: () => fetcher('/albums'),
  });


  return { data: data || [], loading: isLoading, error };
}
