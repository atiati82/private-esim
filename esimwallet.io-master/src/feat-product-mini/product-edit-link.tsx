import React from 'react';
import { WandIcon } from 'lucide-react';

import { urlCmsForEsimProduct } from '@/lib/urls';
import { Link } from '@/navigation';

interface EsimProductEditLinkProps {
  className?: string;
  id: string;
}

export const ProductEditLink: React.FC<EsimProductEditLinkProps> = ({ className, id }) => {
  return (
    <Link
      href={urlCmsForEsimProduct(id)}
      target="_payloadEditProduct"
      className={className}
      title="Edit in CMS"
    >
      <WandIcon size={16} strokeWidth={1} />
    </Link>
  );
};
