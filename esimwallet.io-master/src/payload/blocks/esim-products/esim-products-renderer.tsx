'use client';

import React from 'react';
import { SerializedBlockNode } from '@payloadcms/richtext-lexical';

import { useGetEsimProductByIdQuery } from '@/data-store/esim-products-api';
import { Destination } from '@/data/destination';
import { EsimProduct } from '@/data/esim-product';
import { Region } from '@/data/region';
import { EsimProductBlock } from '@/payload/app-types';
import * as styles from '@/payload/blocks/esim-products/esim-products-renderer.css';

import { Headline } from '@/components/ui/Headline';
import { Loader } from '@/components/ui/loader';
import { ProductMiniCard } from '@/feat-product-mini/product-mini-card';
import { grid123Cols } from '@/styles/layout.css';

type RenderItemProps = {
  product: EsimProduct;
  location: Destination | Region;
};

const EsimProductBlockRendererItem: React.FC<RenderItemProps> = ({ product, location }) => {
  const { isLoading, data, error: _error } = useGetEsimProductByIdQuery(product.id);

  if (isLoading) {
    return <Loader />;
  }

  return <ProductMiniCard key={data?.id} product={data!} location={location} />;
};

type BlockProps = {
  node: SerializedBlockNode;
};
export const EsimProductsBlockRenderer: React.FC<BlockProps> = (params) => {
  const { node } = params;

  return (
    <div className={styles.esimProductsBlockContainer}>
      <div className={styles.esimProductsBlockHeadContainer}>
        <Headline like="h2" className={styles.esimProductsBlockTitle}>
          {(node.fields as EsimProductBlock).title}
        </Headline>
        <Headline like="h3" className={styles.esimProductsBlockSubtitle}>
          {(node.fields as EsimProductBlock).subtitle}
        </Headline>
      </div>
      <div className={grid123Cols}>
        {node.fields.products?.map((item: EsimProduct) => (
          <EsimProductBlockRendererItem
            key={item.id}
            product={item}
            location={node.fields?.locations[0]}
          />
        ))}
      </div>
    </div>
  );
};
