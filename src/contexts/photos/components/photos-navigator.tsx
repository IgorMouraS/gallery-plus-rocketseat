import ButtonIcon from '../../../components/button-icon';
import Skeleton from '../../../components/skeleton';
import ArrowLeftIcon from '../../../assets/icons/chevron-left.svg?react';
import Button from '../../../components/button';
import { useNavigate } from 'react-router';
import cx from 'classnames';

interface PhotosNavigatorProps extends React.ComponentProps<'div'> {
  nextPhotoId?: string;
  previousPhotoId?: string;
  loading: boolean;
}
export default function PhotosNavigator({
  nextPhotoId,
  previousPhotoId,
  loading,
  className,
  ...props
}: PhotosNavigatorProps) {
  const navigate = useNavigate();

  return (
    <div className={cx('flex gap-2', className)} {...props}>
      {loading ? (
        <>
          <Skeleton className="w-10 h-10" />
          <Skeleton className="w-30 h-10" />
        </>
      ) : (
        <>
          <ButtonIcon
            icon={ArrowLeftIcon}
            variant="secondary"
            disabled={!previousPhotoId}
            onClick={() => navigate(`/fotos/${previousPhotoId}`)}
          />
          <Button
            variant="secondary"
            disabled={!nextPhotoId}
            onClick={() => navigate(`/fotos/${nextPhotoId}`)}
          >
            Próxima Imagem
          </Button>
        </>
      )}
    </div>
  );
}
