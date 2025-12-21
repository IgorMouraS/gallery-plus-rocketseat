import { tv, type VariantProps } from 'tailwind-variants';
import Icon from './icon';
import Text, { textVariants } from './text';
import UploadIcon from '../assets/icons/upload-file.svg?react';
import FileIcon from '../assets/icons/image.svg?react';
import { useWatch, type FieldValues, type UseFormReturn } from 'react-hook-form';
import { useMemo } from 'react';

export const inputSingleFileVariants = tv({
  base: `
  flex  flex-col items-center justify-center
  w-full border border-solid border-border-primary
  group-hover:border-border-active
  rounded-lg transition
  `,
  variants: {
    size: {
      md: 'px-5 py-6',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const inputSingleFileIconVariants = tv({
  base: `
  fill-placeholder
  `,
  variants: {
    size: {
      md: 'h-8 w-8',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

interface InputSingleFileProps
  extends
    Omit<React.ComponentProps<'input'>, 'size' | 'form'>,
    VariantProps<typeof inputSingleFileIconVariants> {
  form: UseFormReturn<FieldValues>;
  allowedExtensions: string[];
  maxSize: number;
  error?: React.ReactNode;
  replaceBy?: React.ReactNode;
}

export default function InputSingleFile({
  size,
  error,
  form,
  allowedExtensions,
  maxSize,
  replaceBy,
  ...props
}: InputSingleFileProps) {
  const formValues = useWatch({ control: form.control });
  const name = props.name;
  const formFile = useMemo(() => formValues[name as keyof FieldValues]?.[0], [formValues, name]);
  const { extensionFile, sizeFile } = useMemo(() => {
    return {
      extensionFile: formFile?.name.split('.').pop() || '',
      sizeFile: formFile?.size || 0,
    };
  }, [formFile]);

  function isAllowedExtension(): boolean {
    return allowedExtensions.includes(extensionFile);
  }

  function isAllowedSize(): boolean {
    return sizeFile <= maxSize * 1024 * 1024;
  }

  function isAllowedFile(): boolean {
    if (!formFile) return false;
    return isAllowedExtension() && isAllowedSize();
  }

  return (
    <div>
      {!formFile || !isAllowedFile() ? (
        <>
          <div className={`w-full relative group cursor-pointer`}>
            <input
              type="file"
              className={`
        absolute top-0 right-0 cursor-pointer
        w-full h-full opacity-0
        `}
              {...props}
            />
            <div className={inputSingleFileVariants({ size })}>
              <Icon svg={UploadIcon} className={inputSingleFileIconVariants({ size })} />
              <Text variant="label-medium" className="text-placeholder text-center">
                Arraste o arquivo aqui
                <br />
                ou clique para selecionar
              </Text>
            </div>
          </div>
          <div className="flex flex-col gap-1 mt-1">
            {formFile && !isAllowedSize() && (
              <Text variant="label-small" className="text-accent-red">
                Arquivo muito grande
              </Text>
            )}
            {formFile && !isAllowedExtension() && (
              <Text variant="label-small" className="text-accent-red">
                Arquivo inválido
              </Text>
            )}
            {formFile && error && (
              <Text variant="label-small" className="text-accent-red">
                {error}
              </Text>
            )}
          </div>
        </>
      ) : (
        <>
          {replaceBy}
          <div
            className={`flex gap-3 items-center border border-solid border-border-primary rounded mt-5 p-3`}
          >
            <Icon svg={FileIcon} className="fill-white w-6 h-6" />
            <div className="flex flex-col">
              <div className="truncate max-w-80">
                <Text variant="label-medium" className="text-placeholder">
                  {formFile.name}
                </Text>
              </div>
              <div className="flex">
                <button
                  type="button"
                  className={textVariants({
                    variant: 'label-small',
                    className: 'text-accent-red cursor-pointer hover-underline',
                  })}
                  onClick={() => form.setValue(name as keyof FieldValues, undefined)}
                >
                  Remover
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
