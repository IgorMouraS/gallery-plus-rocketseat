import Button from '../components/button';
import ButtonIcon from '../components/button-icon';
import ChevronLeftIcon from '../assets/icons/chevron-left.svg?react';
import ChevronRightIcon from '../assets/icons/chevron-right.svg?react';
import Badge from '../components/badge';
import Alert from '../components/alert';
import Divider from '../components/divider';
import InputText from '../components/input-text';
import SearchIcon from '../assets/icons/search.svg?react';
import InputCheckbox from '../components/input-checkbox';
import InputSingleFile from '../components/input-single-file';
import { useForm } from 'react-hook-form';
import ImagePreview from '../components/image-preview';
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '../components/dialog';
import Text from '../components/text';

export default function PageComponent() {
  const form = useForm();
  const file = form.watch('file');
  const fileSource = file?.[0] ? URL.createObjectURL(file[0]) : undefined;

  return (
    <div className="grid gap-7 p-6">
      <div className="flex gap-3">
        <Button>Button</Button>
        <Button variant="secondary">Button</Button>
        <Button disabled>Button</Button>
        <Button handling>Loading</Button>
        <Button icon={ChevronRightIcon}>Próxima Imagem</Button>
        <Button variant="ghost" size="sm">
          Button
        </Button>
        <Button variant="primary" size="sm">
          Button
        </Button>
      </div>

      <div className="flex gap-3">
        <ButtonIcon icon={ChevronLeftIcon} />
        <ButtonIcon icon={ChevronRightIcon} variant="secondary" />
      </div>

      <div className="flex gap-3">
        <Badge>Todos</Badge>
        <Badge>Natureza</Badge>
        <Badge>Viagem</Badge>
        <Badge loading>Viagem</Badge>
        <Badge loading>Viagem</Badge>
        <Badge loading>Viagem</Badge>
      </div>

      <div>
        <Alert>
          Tamanho máximo: 50MB
          <br />
          Você pode selecionar arquivos em PNG, JPG, JPEG ou WEBP
        </Alert>
      </div>

      <div>
        <Divider />
      </div>

      <div>
        <InputText icon={SearchIcon} placeholder="Pesquisar" />
      </div>

      <div>
        <InputCheckbox />
      </div>

      <div>
        <InputSingleFile
          form={form}
          {...form.register('file')}
          allowedExtensions={['png', 'jpg', 'jpeg', 'webp']}
          replaceBy={<ImagePreview src={fileSource} alt="Imagem do arquivo" />}
          maxFileSize={50}
        />
      </div>

      <div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Abrir Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>Adicionar Foto</DialogHeader>
            <DialogBody className="flex flex-col gap-8">
              <InputText icon={SearchIcon} placeholder="Adicione um título" />
              <div className="flex flex-col gap-5">
                <Alert>
                  Tamanho máximo: 50MB
                  <br />
                  Você pode selecionar arquivos em PNG, JPG, JPEG ou WEBP
                </Alert>
                <InputSingleFile
                  form={form}
                  {...form.register('file')}
                  allowedExtensions={['png', 'jpg', 'jpeg', 'webp']}
                  replaceBy={<ImagePreview src={fileSource} alt="Imagem do arquivo" />}
                  maxFileSize={50}
                />
                <Text variant="label-small">Selecionar albúm</Text>
                <div className="flex gap-3">
                  <Badge>Todos</Badge>
                  <Badge>Natureza</Badge>
                  <Badge>Viagem</Badge>
                </div>
              </div>
            </DialogBody>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancelar</Button>
              </DialogClose>
              <Button>Adicionar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
