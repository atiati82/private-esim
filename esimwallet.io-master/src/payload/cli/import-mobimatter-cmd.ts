import { importMobiMatter } from '@/esim-suppliers/mm/cli-import-mobimatter';

/**
 * `pnpm payload:import-mm` script
 *
 * 1. Import providers (if needed)
 * 2. Import/sync eSIM Products
 */
async function importMobiMatterCmd(): Promise<void> {
  const cleanImport = !!process.argv.find((param) => param.trim() === 'cleanImport=true');
  await importMobiMatter(cleanImport);
  process.exit(0);
}

importMobiMatterCmd().catch((e) => {
  console.error(e);
  process.exit(1);
});
