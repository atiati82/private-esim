'use client';

import * as React from 'react';
import { useRowLabel } from '@payloadcms/ui';
import type { ClientField } from 'payload';

import type { PopulatedOrderedPackageItem } from './populate-ordered-packages';

export const FieldOrderItemRowLabel: React.FC<{ field: ClientField }> = () => {
  const { data, rowNumber } = useRowLabel<PopulatedOrderedPackageItem>();

  let customLabel = `${String(rowNumber).padStart(2, '0')}. `;
  if (data.orderItem && data.product) {
    customLabel += `${data.productType} - ${data.productName} - ${data.orderItem} on ${data.createdAt?.substring(0, 10)}`;
  }
  return <div>{customLabel}</div>;
};
