import ImagePreview from '../../../components/image-preview';
import Skeleton from '../../../components/skeleton';
import type { Photo } from '../models/photo';
import Text from '../../../components/text';
import Badge from '../../../components/badge';
import { buttonTextVariants, buttonVariants } from '../../../components/button';
import { Link } from 'react-router';

interface PhotoWidgetProps {
  photo: Photo;
  loading: boolean;
}

export default function PhotoWidget({ photo, loading }: PhotoWidgetProps) {
  return (
    <div className="flex flex-col gap-4">
      {loading ? (
        <Skeleton className="w-[10.875rem] h-[10.875rem] rounded-lg" />
      ) : (
        <ImagePreview
          src={`${import.meta.env.VITE_IMAGES_URL}/${photo.imageId}`}
          title={photo.title}
          imageClassName="w-[10.875rem] h-[10.875rem] rounded-lg"
        />
      )}

      <div className="flex flex-col gap-2">
        {loading ? (
          <Skeleton className="w-full h-6" />
        ) : (
          <Text variant="paragraph-large" className="truncate">
            {photo.title}
          </Text>
        )}
        <div className="flex gap-1 min-h-[1.375rem]">
          {loading
            ? Array.from({ length: 1 }).map((_, index) => (
                <Skeleton key={index} className="w-full h-4 rounded-sm" />
              ))
            : photo.albums.length > 0 && (
                <>
                  {photo.albums.slice(0, 1).map((album) => (
                    <Badge key={album.id} className="truncate" size="xs">
                      {album.title}
                    </Badge>
                  ))}
                  {photo.albums.length > 1 && <Badge size="xs">+{photo.albums.length - 1}</Badge>}
                </>
              )}
        </div>
      </div>

      {loading ? (
        <Skeleton className="w-full h-10" />
      ) : (
        <Link
          to={`/fotos/${photo.id}`}
          className={buttonVariants({ variant: 'secondary', className: 'px-2 py-2' })}
        >
          <Text className={buttonTextVariants({ variant: 'secondary', size: 'sm' })}>
            Detalhes da Imagem
          </Text>
        </Link>
      )}
    </div>
  );
}
