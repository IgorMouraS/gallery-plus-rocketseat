import Button from '../../../components/button';
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '../../../components/dialog';
import InputText from '../../../components/input-text';
import Skeleton from '../../../components/skeleton';
import Text from '../../../components/text';
import SelectCheckBoxIllustration from '../../../assets/images/select-checkbox.svg?react';
import PhotoImageSelectable from '../../photos/components/photo-image-selectable';
import usePhotos from '../../photos/hooks/use-photos';
import { useForm } from 'react-hook-form';
import { albumNewFormSchema, type AlbumNewFormSchema } from '../schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, useTransition } from 'react';
import useAlbum from '../hooks/use-album'

interface AlbumNewDialogProps {
  trigger: React.ReactNode;
}

export default function AlbumNewDialog({ trigger }: AlbumNewDialogProps) {
  const { data: photos, loading: photosLoading } = usePhotos();
  const { createAlbum } = useAlbum()

  const [isCreatingAlbum, setIsCreatingAlbum] = useTransition()
  const [modalOpen, setModalOpen] = useState(false);
  const form = useForm<AlbumNewFormSchema>({
    resolver: zodResolver(albumNewFormSchema),
  });

  useEffect(() => {
    if (!modalOpen) form.reset();
  }, [modalOpen, form]);

  function handleTogglePhoto(selected: boolean, photoId: string) {
    const currentForm = form.getValues('photosIds') ?? [];
    let newForm = []
    if (selected) {
      newForm = [...currentForm, photoId]
    } else {
      newForm = currentForm.filter((id) => id !== photoId)
    }
    form.setValue(
      'photosIds',
      newForm,
      { shouldDirty: true },
    );
  }

  function handleSubmit(payload: AlbumNewFormSchema) {
    setIsCreatingAlbum(async () => {
      await createAlbum(payload)
      setModalOpen(false)
    })
  }
  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <DialogHeader>Criar álbum</DialogHeader>

          <DialogBody className="flex flex-col gap-5">
            <InputText
              placeholder="Adicione um título"
              maxLength={255}
              error={form.formState.errors.title?.message}
              {...form.register('title')}
            />

            <div className="flex flex-col gap-3 mb-5">
              <Text variant="label-small" className="mb-3">
                Fotos cadastradas
              </Text>

              {photosLoading ? (
                <div className="flex flex-wrap gap-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="w-20 h-20 rounded-lg" />
                  ))}
                </div>
              ) : photos.length === 0 ? (
                <div className=" w-full flex flex-col items-center justify-center gap-4">
                  <SelectCheckBoxIllustration />
                  <Text variant="paragraph-medium" className="text-center">
                    Nenhuma foto disponível para seleção
                  </Text>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {photos.map((photo) => (
                    <PhotoImageSelectable
                      key={photo.id}
                      src={`${import.meta.env.VITE_IMAGES_URL}/${photo.imageId}`}
                      title={photo.title}
                      imageClassName="w-20 h-20"
                      onSelectImage={(selected) => handleTogglePhoto(selected, photo.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </DialogBody>

          <DialogFooter>
            <DialogClose asChild>
              <Button disabled={isCreatingAlbum} variant="secondary">Cancelar</Button>
            </DialogClose>
            <Button disabled={isCreatingAlbum} handling={isCreatingAlbum} type="submit">{isCreatingAlbum ? 'Criando...' : 'Criar'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
