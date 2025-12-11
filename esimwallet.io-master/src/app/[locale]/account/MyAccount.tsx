'use client';

import React from 'react';

import { useGetMeUser, useLogoutMutation } from '@/data-store/auth-api';
import { urlForAccount } from '@/lib/urls';
import { Link } from '@/navigation';

import { Button } from '@/components/ui.shadcn/form/button';
import { Loader } from '@/components/ui/loader';
import { Textual } from '@/components/ui/textual';
import { prose } from '@/styles/typography.css';

export const MyAccount: React.FC = () => {
  const { data, isLoading: userIsLoading } = useGetMeUser();
  const user = data?.user;
  const [apiLogout, { isLoading: logoutIsLoading }] = useLogoutMutation();

  const logout = (): void => {
    apiLogout();
  };

  return (
    <div className={prose}>
      {userIsLoading && <Loader variant="short" />}
      {user && (
        <>
          <Textual>
            <Button onClick={logout} isLoading={logoutIsLoading} size="sm" className="w-32">
              {logoutIsLoading ? 'Logging out' : 'Log Out'}
            </Button>
            {user.fullName} {user.email}
          </Textual>
        </>
      )}
      {!user && !userIsLoading && (
        <>
          <Textual>Not logged in.</Textual>
          <Textual>
            <Link href={urlForAccount('login')} className="font-bold">
              Login
            </Link>{' '}
            to your account.
            <br />
            Or{' '}
            <Link href={urlForAccount('create')} className="font-bold">
              create a new account
            </Link>
            .
          </Textual>
        </>
      )}
    </div>
  );
};
