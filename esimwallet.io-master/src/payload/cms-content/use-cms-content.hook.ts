import { CmsContentService } from '@/payload/cms-content/cms-content.service';

/**
 * Get instance of {@link CmsContentService} to easily access CMS content
 * across various components in the app
 */
export function useCmsContent(): CmsContentService {
  return CmsContentService.getInstance();
}
