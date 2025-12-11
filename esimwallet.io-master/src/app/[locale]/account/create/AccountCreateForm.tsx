'use client';

import React, { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useReCaptcha } from 'next-recaptcha-v3';
import { joiResolver } from '@hookform/resolvers/joi';

import { AccountCreateFormData, useAccountRegisterMutation } from '@/data-store/auth-api';
import { emitFlashMessage, FlashMessage, MessageType } from '@/data-store/messages';
import { navigateAction } from '@/data-store/router/router';
import { useAppDispatch } from '@/data-store/store-hooks';
import { RecaptchaAction } from '@/lib/google/recaptcha-types';
import {
  getCatchError,
  getErrorFromReduxApiResponse,
  NormalisedError,
  ReduxApiResponse,
} from '@/lib/responses';
import { urlForAccount, UrlForPage, urlForPage } from '@/lib/urls';
import { cn } from '@/lib/utils';
import { Link } from '@/navigation';
import { accountCreateSchema } from '@/payload/collections/hooks/accountCreateSchema';

import { Button } from '@/components/ui.shadcn/form/button';
import { Checkbox } from '@/components/ui.shadcn/form/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui.shadcn/form/form';
import { formItemWithCheckbox } from '@/components/ui.shadcn/form/form.css';
import { Input } from '@/components/ui.shadcn/form/input';
import { Separator } from '@/components/ui.shadcn/separator';
import { Headline } from '@/components/ui/Headline';
import { Textual } from '@/components/ui/textual';
import { fullWidth } from '@/styles/layout.css';
import { fontSemibold, links, prose } from '@/styles/typography.css';

export const AccountCreateForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const [apiRegister, { isLoading }] = useAccountRegisterMutation();
  const { executeRecaptcha } = useReCaptcha();

  const form = useForm<AccountCreateFormData>({
    resolver: joiResolver(accountCreateSchema),
    resetOptions: { keepErrors: false },
    defaultValues: { email: '', password: '', passwordConfirm: '' },
  });

  const clearFormErrors = (): void => form.clearErrors();
  const onFormError = ({ message }: NormalisedError): void => {
    form.setError('root', { message });
  };
  useEffect(() => {
    const { unsubscribe } = form.watch(() => clearFormErrors());
    return () => unsubscribe();
  }, [form.watch]);

  const onSubmit = useCallback(
    async (data: AccountCreateFormData) => {
      let apiResponse: ReduxApiResponse | undefined = undefined;
      const { password, passwordConfirm, ...dataLog } = data;
      try {
        data.reCaptchaAction = RecaptchaAction.Signup;
        data.reCaptchaToken = await executeRecaptcha(data.reCaptchaAction);
        console.log('FORM SIGN UP', { formData: dataLog });
        apiResponse = await apiRegister(data);
        const loginError = getErrorFromReduxApiResponse(apiResponse);
        if (loginError) {
          onFormError(loginError);
        } else {
          dispatch(emitFlashMessage(prepareFlashMessage(data)));
          dispatch(navigateAction(urlForAccount('verify')));
        }
      } catch (err) {
        onFormError(getCatchError(err));
      }
    },
    [executeRecaptcha],
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Headline as="h2" like="h2-small" align="center">
          Create Private eSIM account
        </Headline>
        <FormMessage />

        <FormField
          control={form.control}
          name="email"
          rules={{ required: 'Please enter valid e-mail address' }}
          render={({ field }) => (
            <FormItem id="email">
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
          render={({ field }) => (
            <FormItem id="password">
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  placeholder="New password"
                  autoComplete="new-password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="passwordConfirm"
          render={({ field }) => (
            <FormItem id="passwordConfirm">
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="legalAgreement"
          render={({ field }) => (
            <FormItem id="legalAgreement" className={cn(formItemWithCheckbox, links)}>
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div>
                <FormLabel>
                  I agree to all{' '}
                  <Link href={urlForPage(UrlForPage.GeneralTermsAndConditions)}>
                    Terms and Conditions
                  </Link>
                  .
                  <br />I also agree to Private eSIM{' '}
                  <Link href={urlForPage(UrlForPage.PrivacyPolicy)}>Privacy Policy</Link>.
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" isLoading={isLoading} disabled={isLoading} className={fullWidth}>
          {isLoading ? 'Submitting...' : 'Create account'}
        </Button>

        <Separator />

        <div className={prose}>
          <Textual variant="footer" align="center">
            Already have an account?{' '}
            <Link href={urlForAccount('login')} className={fontSemibold}>
              Login here
            </Link>
            .
          </Textual>
        </div>
      </form>
    </Form>
  );
};

const prepareFlashMessage = (data: AccountCreateFormData): FlashMessage => {
  return {
    messageType: MessageType.Success,
    path: 'account.created',
    title: `Account Created Successfully`,
    message: (
      <>
        <Textual>Thank you for signing up!</Textual>
        <Textual>
          We've sent a verification link to your e-mail address <strong>{data.email}</strong>.
          Please check your inbox and click the link to verify your account. Only after verifying
          your email will you be able to log in and start using your account.
        </Textual>
        <Textual variant="footer">Private eSIM team</Textual>
      </>
    ),
  };
};
