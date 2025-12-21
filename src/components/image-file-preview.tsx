import { tv, type VariantProps } from 'tailwind-variants';

export const imageFilePreviewVariants = tv({
  base: `
  rounded-lg overflow-hidden
  `,
});

export const imageFilePreviewImageVariants = tv({
  base: `
  w-full h-full object-cover
  `,
});

interface ImageFilePreviewProps
  extends VariantProps<typeof imageFilePreviewVariants>, React.ComponentProps<'img'> {
  imageClassName?: string;
}

export default function ImageFilePreview({
  imageClassName,
  className,
  ...props
}: ImageFilePreviewProps) {
  return (
    <div className={imageFilePreviewVariants({ className })}>
      <img className={imageFilePreviewImageVariants({ className: imageClassName })} {...props} />
    </div>
  );
}
