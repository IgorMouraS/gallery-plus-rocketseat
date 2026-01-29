import { useQuery } from '@tanstack/react-query';
import { fetcher } from '../../../helpers/api';
import type { Photo } from '../models/photo';
import { useQueryState, createSerializer, parseAsString } from 'nuqs';

const toSearchParams = createSerializer({
  albumId: parseAsString.withDefault(''),
  q: parseAsString.withDefault(''),
});

export default function usePhotos() {
  const [albumId, setAlbumId] = useQueryState('albumId');
  const [q, setQ] = useQueryState('q');

  const { data, isLoading, error } = useQuery<Photo[]>({
    queryKey: ['photos', albumId, q],
    queryFn: () => fetcher(`/photos${toSearchParams({ albumId, q })}`),
  });

  return { data: data || [], loading: isLoading, error, filters: { albumId, setAlbumId, q, setQ } };
}
