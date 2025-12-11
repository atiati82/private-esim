import { EsimProductsContent } from '@/payload/app-types';
import { esimProductsSeedContent } from '@/payload/collections/esim-products/esim-products-content.seed';

/**
 * CMS Content service, containing pieces of content from CMS
 * used in various components across the app.
 *
 * By default, it will use seed content from the code (so no matter if content is in the CMS
 * or not, we have it).
 * TODO: use client ContextProvider from outside to feed it with actual content from CMS.
 *  Be careful to not to use here any client-only OR server-only functionality (e.g. Payload)
 *  - code here needs to work both on client and server, w/o switching to CSR.
 */
export class CmsContentService {
  private static instance: CmsContentService | undefined;

  private productContent: EsimProductsContent;

  public static getInstance(): CmsContentService {
    if (!CmsContentService.instance) {
      CmsContentService.instance = new CmsContentService();
    }
    return CmsContentService.instance;
  }

  private constructor() {
    this.productContent = esimProductsSeedContent;
  }

  /**
   * Get CMS content related to {@link EsimProduct}.
   * It's used on product card and product listing.
   */
  public getProductsContent(): EsimProductsContent {
    return this.productContent;
  }

  public setProductsContent(_: EsimProductsContent): EsimProductsContent {
    // TODO: merge with "seed" content
    return this.productContent;
  }
}
