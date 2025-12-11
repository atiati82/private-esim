import { initDevPassword, initDevUser, initUsersToCreate } from '@/config';
import { getCliLogger } from '@/lib/logging';
import { UserDto } from '@/payload/app-types';
import { UsersCollectionId } from '@/payload/collections';
import { UserRole } from '@/payload/collections/users/roles';
import { appGetPayloadStandalone } from '@/payload/utils/get-payload-standalone';

export async function createInitialUsers(): Promise<void> {
  const payload = await appGetPayloadStandalone();
  const logger = getCliLogger();

  const existingUsers = await payload.find({ collection: UsersCollectionId, limit: 0 });
  if (existingUsers.totalDocs === 0) {
    const adminUser = await payload.create({
      collection: UsersCollectionId,
      data: {
        email: initDevUser,
        password: initDevPassword,
        roles: [UserRole.Admin],
        _verified: true,
      },
      disableVerificationEmail: true,
    });
    logger.info(`Done, admin user [${adminUser.id}] ${adminUser.email} created.`);

    logger.info(`Creating additional users:`);
    for (const userData of initUsersToCreate) {
      const newUser = await payload.create({
        collection: UsersCollectionId,
        data: userData as UserDto,
        disableVerificationEmail: true,
      });
      logger.info(`Additional user ${newUser.email} created (roles:${newUser.roles.join(',')}).`);
    }
  } else {
    logger.info(`INIT DB: ${existingUsers.totalDocs} user(s) already present in DB, skipping.`);
  }
}
