'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';

import { useLoginMutation } from '@/data-store/auth-api';
import { navigateAction } from '@/data-store/router/router';
import { useAppDispatch } from '@/data-store/store-hooks';
import {
  getCatchError,
  getErrorFromReduxApiResponse,
  NormalisedError,
  ReduxApiResponse,
} from '@/lib/responses';
import { urlForAccount } from '@/lib/urls';
import { cn } from '@/lib/utils';
import { Link } from '@/navigation';

import { Button } from '@/components/ui.shadcn/form/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui.shadcn/form/form';
import { Input } from '@/components/ui.shadcn/form/input';
import { Separator } from '@/components/ui.shadcn/separator';
import { Headline } from '@/components/ui/Headline';
import { Textual } from '@/components/ui/textual';
import { fullWidth } from '@/styles/layout.css';
import { fontSemibold, links, prose, textAlignRight, textSm } from '@/styles/typography.css';

type FormData = {
  email: string;
  password: string;
};

export const LoginForm: React.FC = (formData: Partial<FormData> = {}) => {
  const dispatch = useAppDispatch();
  const [apiLogin, { isLoading }] = useLoginMutation();
  const [hadLoginErrors, setHadLoginErrors] = useState(false);

  const form = useForm<FormData>({
    defaultValues: { email: '', password: '', ...formData },
  });

  const clearFormErrors = (): void => form.clearErrors('root');
  const onFormError = ({ message }: NormalisedError): void => {
    setHadLoginErrors(true);
    form.setFocus('password');
    form.setError('root', { message });
  };
  useEffect(() => {
    const { unsubscribe } = form.watch(() => clearFormErrors());
    return () => unsubscribe();
  }, [form.watch]);

  const onSubmit = useCallback(
    async (data: FormData) => {
      let apiResponse: ReduxApiResponse | undefined = undefined;
      try {
        apiResponse = await apiLogin(data);
        const loginError = getErrorFromReduxApiResponse(apiResponse);
        if (loginError) {
          onFormError(loginError);
          // TODO: support redirects to after-login destinations
          // else if (redirect?.current) {
          //   router.push(redirect.current);
        } else {
          dispatch(navigateAction(urlForAccount()));
        }
      } catch (err) {
        onFormError(getCatchError(err));
      }
    },
    [apiLogin],
  );
  const onSubmitWithErrors = (errors: FieldErrors): void => {
    console.log('LOGIN FORM submit errors', errors);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onSubmitWithErrors)}>
        <Headline as="h2" like="h2-small" align="center">
          Log in to your Account
        </Headline>

        {hadLoginErrors && (
          <div className="min-h-5">
            <FormMessage />
          </div>
        )}

        <FormField
          control={form.control}
          name="email"
          rules={{ required: 'Please enter valid e-mail address' }}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="Your e-maill address"
                  autoComplete="username"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          rules={{ required: 'Please enter your password' }}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  placeholder="Your password"
                  autoComplete="current-password"
                />
              </FormControl>
              <FormMessage />
              <FormDescription className={cn(textAlignRight, textSm, fontSemibold, links)}>
                <Link href={urlForAccount('password-reset')}>Forgot password?</Link>
              </FormDescription>
            </FormItem>
          )}
        />

        <Button type="submit" isLoading={isLoading} disabled={isLoading} className={fullWidth}>
          {isLoading ? 'Logging In...' : 'Log In'}
        </Button>

        <Separator />

        <div className={prose}>
          <Textual variant="footer" align="center">
            Don't have an account?{' '}
            <Link href={urlForAccount('create')} className={fontSemibold}>
              Create an account
            </Link>
            .
          </Textual>
        </div>
      </form>
    </Form>
  );
};
