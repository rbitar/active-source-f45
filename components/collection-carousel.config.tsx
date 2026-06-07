import type { ComponentConfig } from '@reacteditor/core';
import { GalleryHorizontal } from 'lucide-react';
import CollectionCarousel, {
  type CollectionCarouselProps,
} from '@/components/collection-carousel';

const productsCarouselEditor: ComponentConfig<CollectionCarouselProps> = {
  label: 'Products Carousel',
  icon: <GalleryHorizontal size={16} />,
  category: 'commerce',
  defaultProps: {
    collectionHandle: '',
    label: '',
    title: 'Featured Products',
    description: '',
    showViewAll: true,
    itemsPerPage: 20,
  },
  fields: {
    collectionHandle: { label: 'Collection', type: 'shopifyCollection' as any },
    label: { label: 'Label', type: 'text', contentEditable: true },
    title: { label: 'Title', type: 'text', contentEditable: true },
    description: { label: 'Description', type: 'textarea', contentEditable: true },
    showViewAll: {
      label: 'Show View All',
      type: 'radio',
      options: [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ],
    },
    itemsPerPage: {
      label: 'Items Per Page',
      type: 'number',
      min: 4,
      max: 50,
      step: 4,
    } as any,
  },
  render: (props) => <CollectionCarousel {...props} />,
};

export default productsCarouselEditor;
