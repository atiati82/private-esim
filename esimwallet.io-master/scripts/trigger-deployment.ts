import * as fs from 'fs';
import { execa } from 'execa';

import { getCliLogger, LoggerName } from '../src/lib/logging';

const allowedAuthorEmail = 'marcin@ryzycki.com';
const triggerFile = 'scripts/.trigger-deployment.txt';

const logger = getCliLogger(LoggerName.Scripts);

type CommitInfo = {
  shortHash: string;
  authorName: string;
  authorEmail: string;
  commitMessage: string;
};

/**
 * Make a commit as {@link allowedAuthorEmail}, which is a paid account on Vercel
 * so Vercel can pick it and do a new deployment
 */
async function commitDummyFile(commitInfo: CommitInfo): Promise<void> {
  // Write commit info to trigger file - just to have not empty git commit
  fs.writeFileSync(
    triggerFile,
    `${commitInfo.shortHash} ${commitInfo.commitMessage} - ${commitInfo.authorName}`,
  );

  try {
    await execa('git', ['add', triggerFile]);
    await execa('git', [
      '-c',
      `user.name="${commitInfo.authorName}*"`,
      '-c',
      `user.email=${allowedAuthorEmail}`,
      'commit',
      '-m',
      `deploy: ${commitInfo.commitMessage}`,
    ]);
  } catch (error) {
    logger.error('Failed to make dummy commit', error);
  }
}

async function getLastCommitInfo(): Promise<CommitInfo> {
  try {
    // Get the last commit details: commit hash, author name/email, and message
    const { stdout } = await execa('git', [
      'log',
      '-1',
      '--pretty=format:%H - %ad - %an - %ae - %s', // Format: commit hash, author name/email, commit message
    ]);
    const commitInfo = stdout.trim().split(' - ');
    return {
      shortHash: commitInfo[0].substring(0, 7),
      authorName: commitInfo[2],
      authorEmail: commitInfo[3],
      commitMessage: commitInfo[4],
    };
  } catch (error) {
    logger.error('Failed to get last commit info', error);
    throw error;
  }
}

(async () => {
  try {
    const lastCommitInfo = await getLastCommitInfo();

    if (lastCommitInfo.authorEmail !== allowedAuthorEmail) {
      logger.info(`Last commit not from valid Vercel user ${allowedAuthorEmail}.`);
      logger.info(`Triggering a dummy commit...\n`);
      const lastCommitInfo = await getLastCommitInfo();
      await commitDummyFile(lastCommitInfo); // Write the last commit info to the trigger file
      logger.info(`Dummy commit made as ${allowedAuthorEmail}.`);
      logger.info(`Now, push it to trigger Vercel deployment.`);
    } else {
      logger.info(`Last commit is from the valid Vercel user ${allowedAuthorEmail}.`);
      logger.info('All good. No need for any extra commit.');
    }
  } catch (error) {
    logger.error('Failed to check last commit or make dummy commit', error);
  }
})();
