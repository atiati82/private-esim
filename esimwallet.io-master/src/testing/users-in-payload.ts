import { UserDto } from '@/payload/app-types';
import { UsersCollectionId } from '@/payload/collections';
import { appGetPayloadStandalone } from '@/payload/utils/get-payload-standalone';

import { mockUserDto } from './users.mock';

const mockVerificationToken: string = 'MOCK_VERIFICATION_TOKEN_2e8e52e854cd69gt';
let mockUserCount: number = 0;

/**
 * Create a mock User in PayloadCMS
 */
export async function mockUserInPayload(userDto: Partial<UserDto>): Promise<UserDto> {
  mockUserCount++;
  const payload = await appGetPayloadStandalone();
  const data: UserDto = <UserDto>{
    ...mockUserDto,
    fullName: `Mock User ${mockUserCount}`,
    email: `mock.user.${mockUserCount}@private-esim.com`,
    password: 'some.password',
    ...userDto,
  };
  return payload.create({
    collection: UsersCollectionId,
    data,
    overrideAccess: true,
    showHiddenFields: true,
  });
}

/**
 * Create a User (an account) which needs to be verified via email link
 * @params userDto with `{ email, _verificationToken }` if you want to have specific values there
 */
export async function mockAccountToVerifyInPayload(userDto: Partial<UserDto>): Promise<UserDto> {
  return mockUserInPayload({
    _verified: false,
    _verificationToken: mockVerificationToken,
    ...userDto,
  });
}
