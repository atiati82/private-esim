import React, { Fragment, JSX } from 'react';
import type { SerializedListNode } from '@lexical/list';
import type { SerializedHeadingNode } from '@lexical/rich-text';
import { SerializedBlockNode, SerializedListItemNode } from '@payloadcms/richtext-lexical';
import type { SerializedElementNode, SerializedTextNode } from 'lexical';

import { cn } from '@/lib/utils';
import { Link } from '@/navigation';
import { EsimProductsBlockRenderer } from '@/payload/blocks/esim-products/esim-products-renderer';

import { Headline } from '@/components/ui/Headline';
import { prose } from '@/styles/typography.css';
import {
  IS_BOLD,
  IS_CODE,
  IS_ITALIC,
  IS_STRIKETHROUGH,
  IS_SUBSCRIPT,
  IS_SUPERSCRIPT,
  IS_UNDERLINE,
} from './rich-text-node-format';

type RichTextProps = {
  className?: string;
  content: {
    root: {
      type: string;
      children: {
        type: string;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  };
  enableProse?: boolean;
};
interface SerializeLexicalProps {
  nodes: {
    type: string;
    version: number;
    [k: string]: unknown;
  }[];
}

export function serializeLexical({ nodes }: SerializeLexicalProps): JSX.Element {
  return (
    <Fragment>
      {nodes?.map((_node, index) => {
        if (_node.type === 'text') {
          const node = _node as SerializedTextNode;
          let text = <Fragment key={index}>{node.text}</Fragment>;
          if (node.format & IS_BOLD) {
            text = <strong key={index}>{text}</strong>;
          }
          if (node.format & IS_ITALIC) {
            text = <em key={index}>{text}</em>;
          }
          if (node.format & IS_STRIKETHROUGH) {
            text = (
              <span key={index} style={{ textDecoration: 'line-through' }}>
                {text}
              </span>
            );
          }
          if (node.format & IS_UNDERLINE) {
            text = (
              <span key={index} style={{ textDecoration: 'underline' }}>
                {text}
              </span>
            );
          }
          if (node.format & IS_CODE) {
            text = <code key={index}>{node.text}</code>;
          }
          if (node.format & IS_SUBSCRIPT) {
            text = <sub key={index}>{text}</sub>;
          }
          if (node.format & IS_SUPERSCRIPT) {
            text = <sup key={index}>{text}</sup>;
          }

          return text;
        }
        if (_node.type === 'block') {
          const node = _node as SerializedBlockNode;
          if (node.fields.blockType === 'esim-products') {
            return <EsimProductsBlockRenderer node={node} key={index} />;
          }
          return;
        }

        if (_node === null) {
          return null;
        }

        const serializedChildrenFn = (node: SerializedElementNode): JSX.Element | null => {
          if (!node.children) {
            return null;
          } else {
            return serializeLexical({ nodes: node.children });
          }
        };

        const serializedChildren = 'children' in _node ? serializedChildrenFn(_node as SerializedElementNode) : '';

        switch (_node.type) {
          case 'linebreak': {
            return <br key={index} />;
          }
          case 'paragraph': {
            return (
              <p key={index} style={{ textAlign: _node.format as React.CSSProperties['textAlign'] }}>
                {serializedChildren}
              </p>
            );
          }
          case 'heading': {
            const node = _node as SerializedHeadingNode;
            return (
              <Headline
                key={index}
                as={node.tag}
                style={{ textAlign: node.format as React.CSSProperties['textAlign'] }}
              >
                {serializedChildren}
              </Headline>
            );
          }
          case 'list': {
            const node = _node as SerializedListNode;
            const ListComponent = node.tag ?? 'ul';
            return (
              <ListComponent key={index} style={{ textAlign: node.format as React.CSSProperties['textAlign'] }}>
                {serializedChildren}
              </ListComponent>
            );
          }
          case 'listitem': {
            const node = _node as SerializedListItemNode;
            return (
              <li key={index} value={node.value} style={{ textAlign: node.format as React.CSSProperties['textAlign'] }}>
                {serializedChildren}
              </li>
            );
          }
          case 'quote': {
            return (
              <blockquote
                key={index}
                style={{
                  textAlign: _node.format as React.CSSProperties['textAlign'],
                }}
              >
                {serializedChildren}
              </blockquote>
            );
          }
          case 'code': {
            return (
              <pre key={index} style={{ textAlign: _node.format as React.CSSProperties['textAlign'] }}>
                <code>{serializedChildren}</code>
              </pre>
            );
          }
          case 'link': {
            const { url } = _node.fields as { url: string };
            return (
              <Link key={index} href={url} target="_blank" rel="noreferrer">
                {serializedChildren}
              </Link>
            );
          }
          default:
            return (
              <p key={index} style={{ textAlign: _node.format as React.CSSProperties['textAlign'] }}>
                {serializedChildren}
              </p>
            );
        }
      })}
    </Fragment>
  );
}

export const RichText: React.FC<RichTextProps> = ({ className, content, enableProse = true }) => {
  if (!content || !content.root) {
    return null;
  }

  return (
    <div
      className={cn(
        {
          [prose]: enableProse,
        },
        className,
      )}
    >
      {content && serializeLexical({ nodes: content?.root?.children })}
    </div>
  );
};
