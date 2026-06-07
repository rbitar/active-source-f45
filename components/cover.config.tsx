import type { ComponentConfig } from '@reacteditor/core';
import { Image as ImageIcon } from 'lucide-react';
import Cover from '@/components/cover';

export type CoverEditorProps = {
  imageUrl: string;
  label?: string;
  title: string;
  description: string;
  buttons?: Array<{
    label: string;
    href?: string;
    variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost';
  }>;
};

const coverEditor: ComponentConfig<CoverEditorProps> = {
  label: 'Cover',
  icon: <ImageIcon size={16} />,
  category: 'cover',
  defaultProps: {
    imageUrl: '',
    label: '',
    title: 'Headline goes here',
    description: 'Subheadline copy goes here.',
    buttons: [
      { label: 'Shop Now', href: '/', variant: 'outline' },
    ],
  },
  fields: {
    imageUrl: { label: 'Background Image', type: 'image' },
    label: { label: 'Label', type: 'text', contentEditable: true },
    title: { label: 'Title', type: 'text', contentEditable: true },
    description: { label: 'Description', type: 'textarea', contentEditable: true },
    buttons: {
      label: 'Buttons',
      type: 'array',
      defaultItemProps: { label: 'Button', href: '/', variant: 'outline' },
      getItemSummary: (it: any) => it?.label || 'Button',
      arrayFields: {
        label: { label: 'Label', type: 'text', contentEditable: true },
        href: { label: 'Link', type: 'text' },
        variant: {
          label: 'Variant',
          type: 'select',
          options: [
            { label: 'Default', value: 'default' },
            { label: 'Outline', value: 'outline' },
            { label: 'Secondary', value: 'secondary' },
            { label: 'Ghost', value: 'ghost' },
            { label: 'Destructive', value: 'destructive' },
          ],
        },
      },
    },
  },
  render: (props) => <Cover {...props} />,
};

export default coverEditor;
