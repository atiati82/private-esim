import {
  AlignFeature,
  BlockquoteFeature,
  BlocksFeature,
  BoldFeature,
  ChecklistFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  IndentFeature,
  InlineCodeFeature,
  InlineToolbarFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  RelationshipFeature,
  StrikethroughFeature,
  SubscriptFeature,
  SuperscriptFeature,
  UnderlineFeature,
  UnorderedListFeature,
  UploadFeature,
} from '@payloadcms/richtext-lexical';
import { LexicalRichTextAdapterProvider } from 'node_modules/@payloadcms/richtext-lexical/dist/types';

import { EsimProductsBlock } from '@/payload/blocks/esim-products/esim-products-block';
import { BlogPostCollectionId } from '@/payload/collections';

export const lexicalEditorConfig = (): LexicalRichTextAdapterProvider => {
  return lexicalEditor({
    features: () => [
      UnderlineFeature(),
      BoldFeature(),
      ItalicFeature(),
      LinkFeature({
        enabledCollections: [BlogPostCollectionId],
        fields: ({ defaultFields }) => {
          const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
            if ('name' in field && field.name === 'url') {
              return false;
            }
            return true;
          });

          return [
            ...defaultFieldsWithoutUrl,
            {
              name: 'url',
              type: 'text',
              admin: {
                condition: ({ linkType }) => linkType !== 'internal',
              },
              label: ({ t }) => t('fields:enterURL'),
              required: true,
            },
          ];
        },
      }),
      AlignFeature(),
      BlockquoteFeature(),
      InlineCodeFeature(),
      StrikethroughFeature(),
      SubscriptFeature(),
      SuperscriptFeature(),
      HeadingFeature(),
      HorizontalRuleFeature(),
      IndentFeature(),
      ChecklistFeature(),
      OrderedListFeature(),
      UnorderedListFeature(),
      ParagraphFeature(),
      RelationshipFeature(),
      FixedToolbarFeature(),
      InlineToolbarFeature(),
      UploadFeature(),
      BlocksFeature({
        blocks: [EsimProductsBlock],
      }),
    ],
  });
};
