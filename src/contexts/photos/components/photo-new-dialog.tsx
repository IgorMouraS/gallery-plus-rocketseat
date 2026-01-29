import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogClose,
} from '../../../components/dialog';
import InputText from '../../../components/input-text';
import Button from '../../../components/button';
import Alert from '../../../components/alert';
import InputSingleFile from '../../../components/input-single-file';
import ImagePreview from '../../../components/image-preview';
import Text from '../../../components/text';
import Skeleton from '../../../components/skeleton';
import { useForm } from 'react-hook-form';
import useAlbuns from '../../albuns/hooks/use-albuns';
import { photoNewFormSchema, type PhotoNewFormSchema } from '../schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, useTransition } from 'react';
import usePhoto from '../hooks/use-photo';

interface PhotoNewDialogProps {
  trigger: React.ReactNode;
}

export default function PhotoNewDialog({ trigger }: PhotoNewDialogProps) {
  const { data: albums, loading: albumsLoading } = useAlbuns();
  const { createPhoto } = usePhoto();

  const [isCreatingPhoto, setIsCreatingPhoto] = useTransition()
  const [modalOpen, setModalOpen] = useState(false);
  const form = useForm<PhotoNewFormSchema>({
    resolver: zodResolver(photoNewFormSchema),
  });
  const file = form.watch('file');
  const fileSource = file?.[0] ? URL.createObjectURL(file[0]) : undefined;

  useEffect(() => {
    if (!modalOpen) form.reset();
  }, [modalOpen, form]);

  function handleSubmit(payload: PhotoNewFormSchema) {
    setIsCreatingPhoto(async () => {
      await createPhoto(payload)
      setModalOpen(false)
    })
  }

  function handleSelectAlbum(albumId: string) {
    const currentForm = form.getValues('albumsIds') ?? [];

    if (currentForm.includes(albumId)) {
      form.setValue(
        'albumsIds',
        currentForm.filter((id) => id !== albumId),
        { shouldDirty: true },
      );
    } else {
      form.setValue('albumsIds', [...currentForm, albumId], { shouldDirty: true });
    }
  }
  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <DialogHeader>Adicionar Foto</DialogHeader>

          <DialogBody className="flex flex-col gap-5">
            <InputText
              placeholder="Adicione um título"
              maxLength={255}
              error={form.formState.errors.title?.message}
              {...form.register('title')}
            />

            <Alert>
              Tamanho máximo: 50MB
              <br />
              Você pode selecionar arquivos em PNG, JPG, JPEG ou WEBP
            </Alert>

            <InputSingleFile
              form={form}
              allowedExtensions={['png', 'jpg', 'jpeg', 'webp']}
              maxFileSize={50}
              replaceBy={
                <ImagePreview src={fileSource} alt="Imagem do arquivo" className="w-full h-56" />
              }
              error={form.formState.errors.file?.message}
              {...form.register('file')}
            />

            <div className="flex flex-col gap-3">
              <Text variant="label-small">Selecionar albúm</Text>

              <div className="flex flex-wrap gap-3">
                {albumsLoading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="w-20 h-7" />
                  ))
                ) : albums.length > 0 ? (
                  albums.map((album) => {
                    return (
                      <Button
                        key={album.id}
                        type="button"
                        variant={form.watch('albumsIds')?.includes(album.id) ? 'primary' : 'ghost'}
                        size="sm"
                        className="truncate"
                        onClick={() => handleSelectAlbum(album.id)}
                      >
                        {album.title}
                      </Button>
                    );
                  })
                ) : (
                  <Text variant="paragraph-small">Nenhum albúm encontrado</Text>
                )}
              </div>
            </div>
          </DialogBody>

          <DialogFooter>
            <DialogClose asChild>
              <Button disabled={isCreatingPhoto} variant="secondary">Cancelar</Button>
            </DialogClose>
            <Button disabled={isCreatingPhoto} handling={isCreatingPhoto} type="submit">{isCreatingPhoto ? 'Adicionando...' : 'Adicionar'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
