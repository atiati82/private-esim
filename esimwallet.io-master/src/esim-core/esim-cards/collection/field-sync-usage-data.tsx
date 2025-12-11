'use client';

import * as React from 'react';
import { useState } from 'react';
import { Button, fieldBaseClass, useField } from '@payloadcms/ui';
import { RefreshCcwIcon } from 'lucide-react';
import type { UIFieldClient } from 'payload';

import { cn } from '@/lib/utils';

export const FieldSyncUsageData: React.FC<{ field: UIFieldClient }> = ({ field }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { value } = useField({ path: 'id' });
  const { value: supplierOrderId } = useField({ path: 'fulfillment.supplierOrderId' });

  const syncForEsimCard = !field.name.includes('OrderItem') ? ((value as string) ?? false) : false;
  const syncForOrderItem = field.name.includes('OrderItem') ? ((value as string) ?? false) : false;

  console.log('FieldSyncUsageData', { syncForEsimCard, syncForOrderItem, supplierOrderId });

  const onClick = (): void => {
    setIsLoading(true);
    console.log('FieldSyncUsageData onClick', {
      syncForEsimCard,
      syncForOrderItem,
      supplierOrderId,
    });
  };

  if (!syncForEsimCard && !syncForOrderItem) {
    return null;
  }

  return (
    <div className={cn(fieldBaseClass)}>
      <div style={{ height: 64 }}>
        <Button
          type="button"
          size="large"
          buttonStyle="primary"
          icon={<RefreshCcwIcon />}
          iconPosition="left"
          onClick={onClick}
          disabled={isLoading || !supplierOrderId}
          tooltip="Update package usage data and eSIM card data."
        >
          {(isLoading && 'Syncing...') || 'Sync Usage Data'}
        </Button>
      </div>

      <div className="field-description">
        {!supplierOrderId && (
          <>
            <strong>NOTE:</strong>&nbsp;Cannot perform sync. Supplier Order ID is missing.
          </>
        )}
      </div>
    </div>
  );
};
