import Container from '../components/container';
import AlbunsFilter from '../contexts/albuns/components/albuns-filter';
import PhotoList from '../contexts/photos/components/photo-list';
import useAlbuns from '../contexts/albuns/hooks/use-albuns';
import usePhotos from '../contexts/photos/hooks/use-photos';

export default function PageHome() {
  const { data: albums, loading: albumsLoading } = useAlbuns();
  const { data: photos, loading: photosLoading } = usePhotos();

  return (
    <Container>
      <AlbunsFilter albums={albums} loading={albumsLoading} className="mb-9" />
      <PhotoList photos={photos} loading={photosLoading} />
    </Container>
  );
}
