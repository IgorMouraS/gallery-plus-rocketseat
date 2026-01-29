import Text from '../components/text';
import Container from '../components/container';
import Skeleton from '../components/skeleton';
import PhotosNavigator from '../contexts/photos/components/photos-navigator';
import ImagePreview from '../components/image-preview';
import Button from '../components/button';
import AlbunsListSelectable from '../contexts/albuns/components/albuns-list-selectable';
import useAlbuns from '../contexts/albuns/hooks/use-albuns';
import { useNavigate, useParams } from 'react-router';
import usePhoto from '../contexts/photos/hooks/use-photo';
import { useTransition } from 'react';

export default function PagePhotoDetails() {
  const { id } = useParams();
  const [isDeletingPhoto, setIsDeletingPhoto] = useTransition()
  const { data: albums, loading: albumsLoading } = useAlbuns();
  const { data: photo, nextPhotoId, previousPhotoId, loading: photoLoading, deletePhoto } = usePhoto(id);
  const navigate = useNavigate();

  function handleDeletePhoto() {
    setIsDeletingPhoto(async () => {
      await deletePhoto(photo)
      const nextPhoto = nextPhotoId ? nextPhotoId : previousPhotoId ? previousPhotoId : '/'
      navigate(`/fotos/${nextPhoto}`)
    })

  }

  return (
    <Container>
      <header className="flex items-center justify-between gap-8 mb-8">
        {photoLoading ? (
          <Skeleton className="w-48 h-8" />
        ) : (
          <>
            <Text as="h2" variant="heading-large">
              {photo?.title}
            </Text>
          </>
        )}
        <PhotosNavigator
          nextPhotoId={nextPhotoId}
          previousPhotoId={previousPhotoId}
          loading={photoLoading}
        />
      </header>
      <div className="grid grid-cols-[21rem_1fr] gap-24">
        <div className="space-y-3">
          {photoLoading ? (
            <Skeleton className="h-[21rem]" />
          ) : (
            <ImagePreview
              src={`${import.meta.env.VITE_IMAGES_URL}/${photo?.imageId}`}
              title={photo?.title}
              imageClassName="h-[21rem] rounded-lg"
            />
          )}
          {photoLoading ? (
            <Skeleton className="w-20 h-10" />
          ) : (
            <Button onClick={handleDeletePhoto} variant="destructive" disabled={isDeletingPhoto}> {isDeletingPhoto ? 'Excluindo...' : 'Excluir'}</Button>
          )}
        </div>

        <div className="py-3">
          <Text as="h3" variant="heading-medium" className="mb-7">
            Álbuns
          </Text>
          <AlbunsListSelectable
            albums={albums}
            loading={photoLoading || albumsLoading}
            photo={photo}
          />
        </div>
      </div>
    </Container>
  );
}
