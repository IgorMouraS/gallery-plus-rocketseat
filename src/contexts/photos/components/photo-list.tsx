import type { Photo } from '../models/photo';
import PhotoWidget from './photo-widget';
import Text from '../../../components/text';
import Skeleton from '../../../components/skeleton';

interface PhotoListProps {
  photos: Photo[];
  loading: boolean;
}

export default function PhotoList({ photos, loading }: PhotoListProps) {
  return (
    <div className="space-y-6">
      <Text
        as="div"
        variant="paragraph-large"
        className="flex items-center justify-end gap-1 text-accent-span"
      >
        Total: {loading ? <Skeleton className="w-6 h-6" /> : <div>{photos.length}</div>}
      </Text>

      {loading ? (
        <div className="grid grid-cols-5 gap-9">
          {Array.from({ length: 5 }).map((_, index) => (
            <PhotoWidget key={index} photo={{} as Photo} loading={true} />
          ))}
        </div>
      ) : (
        <>
          {photos.length > 0 ? (
            <div className="grid grid-cols-5 gap-9">
              {photos.map((photo) => (
                <PhotoWidget key={photo.id} photo={photo} loading={loading} />
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-full">
              <Text variant="paragraph-large">Nenhuma foto encontrada</Text>
            </div>
          )}
        </>
      )}
    </div>
  );
}
