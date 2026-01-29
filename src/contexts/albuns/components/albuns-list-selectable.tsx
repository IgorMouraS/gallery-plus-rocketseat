import type { Album } from '../models/album';
import type { Photo } from '../../photos/models/photo';
import cx from 'classnames';
import Text from '../../../components/text';
import InputCheckbox from '../../../components/input-checkbox';
import Divider from '../../../components/divider';
import Skeleton from '../../../components/skeleton';
import usePhotoAlbums from '../../photos/hooks/use-photo-albums';
import { useTransition } from 'react';

interface AlbunsListSelectableProps extends React.ComponentProps<'ul'> {
  albums: Album[];
  loading: boolean;
  photo: Photo;
}

export default function AlbunsListSelectable({
  albums,
  loading,
  photo,
  className,
  ...props
}: AlbunsListSelectableProps) {
  const { managePhotoOnAlbum } = usePhotoAlbums();
  const [isUpdatingPhotoOnAlbums, setIsUpdatingPhotoOnAlbums] = useTransition()

  function isChecked(albumId: string) {
    if (!albumId) return false;
    return photo?.albums?.some((album) => album.id === albumId);
  }

  async function handlePhotoOnAlbums(albumId: string) {
    let albumIds = []

    if (isChecked(albumId)) {
      albumIds = photo.albums.filter((album) => album.id !== albumId).map((album) => album.id)
    } else {
      albumIds = [...photo.albums.map((album) => album.id), albumId]
    }

    setIsUpdatingPhotoOnAlbums(async () => {
      await managePhotoOnAlbum(photo.id, albumIds)
    })
  }

  return (
    <ul className={cx('flex flex-col gap-4', className)} {...props}>
      {loading ? (
        Array.from({ length: 5 }).map((_, index) => (
          <li key={index}>
            <Skeleton className=" h-8" />
          </li>
        ))
      ) : (
        <>
          {albums.length > 0 && photo ? (
            <>
              {albums.map((album, index) => (
                <li key={album.id}>
                  <div className="flex items-center justify-between gap-1">
                    <Text variant="paragraph-large" className="truncate">
                      {album.title}
                    </Text>
                    <InputCheckbox
                      defaultChecked={isChecked(album.id)}
                      onChange={() => handlePhotoOnAlbums(album.id)}
                      disabled={isUpdatingPhotoOnAlbums}
                    />
                  </div>
                  {index !== albums.length - 1 && <Divider className="mt-4" />}
                </li>
              ))}
            </>
          ) : (
            <div className="flex justify-center items-center h-full">
              <Text variant="paragraph-large">Nenhum álbum encontrado</Text>
            </div>
          )}
        </>
      )}
    </ul>
  );
}
