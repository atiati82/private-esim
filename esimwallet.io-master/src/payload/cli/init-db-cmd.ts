import { getCliLogger } from '@/lib/logging';
import { createInitialUsers } from '@/payload/collections/users/init-db-users';
import { importBlogPosts } from '@/payload/import-blogpost/import-blog-posts';
import { importDestinationsOnInit } from '@/payload/import-destinations/import-destinations';

/**
 * `pnpm payload:init-db` script
 *
 * 1. Create initial db user(s)
 * 2. Import regions and destinations
 */
async function initDbCmd(): Promise<void> {
  const logger = getCliLogger();

  logger.info('INIT DB: creating initial users (if needed):');
  await createInitialUsers();

  logger.info(`INIT DB: importing regions and destinations:`);
  await importDestinationsOnInit(false);

  logger.info(`INIT DB: importing blog posts:`);
  await importBlogPosts(20);

  logger.info(`INIT DB: DONE.`);
  process.exit(0);
}

initDbCmd().catch((e) => {
  console.error(e);
  process.exit(1);
});
