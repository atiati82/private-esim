import { UserDto } from '@/payload/app-types';
import { UserRole } from '@/payload/collections/users/roles';

export const mockUserDto: UserDto = {
  id: '66c7dbe36e71037a971d7fb8',
  roles: [UserRole.Customer],
  email: 'dev@private-esim.com',
  _verified: true,
  createdAt: '2024-10-10T00:00:00.000Z',
  updatedAt: '2024-12-12T00:00:00.000Z',
  fullName: 'Mock User',
  stripeCustomerId: 'cus_mock_stripe_customer_id',
  loginAttempts: 0,
};
