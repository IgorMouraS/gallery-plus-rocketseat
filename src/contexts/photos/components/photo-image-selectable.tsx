import ImagePreview from '../../../components/image-preview';
import { tv } from 'tailwind-variants';
import { useState } from 'react';
import InputCheckbox from '../../../components/input-checkbox';

export const photoImageSelectableVariants = tv({
  base: 'cursor-pointer relative rounded-lg',
  variants: {
    selected: {
      true: 'outline-2 outline-accent-brand',
    },
  },
  defaultVariants: {
    selected: false,
  },
});

interface PhotoImageSelectableProps extends React.ComponentProps<typeof ImagePreview> {
  selected?: boolean;
  onSelectImage?: (selected: boolean) => void;
}

export default function PhotoImageSelectable({
  className,
  selected,
  onSelectImage,
  ...props
}: PhotoImageSelectableProps) {
  const [isSelected, setIsSelected] = useState(selected);

  function handleSelect() {
    const newValue = !isSelected;
    setIsSelected(newValue);
    onSelectImage?.(newValue);
  }

  return (
    <label className={photoImageSelectableVariants({ className, selected: isSelected })}>
      <InputCheckbox
        size="sm"
        defaultChecked={isSelected}
        onChange={handleSelect}
        className="absolute top-1 left-1"
      />
      <ImagePreview {...props} />
    </label>
  );
}
