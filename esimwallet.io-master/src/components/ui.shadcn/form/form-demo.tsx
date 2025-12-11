'use client';

import React, { useCallback, useState } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';

import { UrlForPage, urlForPage } from '@/lib/urls';
import { Link } from '@/navigation';
import { emailFieldSchema, tcsFieldSchema } from '@/payload/collections/hooks/accountCreateSchema';

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
import { Textarea } from '@/components/ui.shadcn/form/textarea';
import { Separator } from '@/components/ui.shadcn/separator';
import { Headline } from '@/components/ui/Headline';
import { Textual } from '@/components/ui/textual';
import { spaceBetween } from '@/styles/layout.css';

export type FormData = {
  email: string;
  password: string;
  phone: string;
  tcs: boolean;
  subject: string;
};
const defaultValues: FormData = { email: '', password: '' } as FormData;

export const formSchema = Joi.object<FormData>({
  email: emailFieldSchema,
  password: Joi.any(),
  tcs: tcsFieldSchema,
  subject: Joi.any(),
});

export const FormDemo: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<FormData>({
    resolver: joiResolver(formSchema),
    resetOptions: { keepErrors: false },
    defaultValues,
  });

  const onSubmit = useCallback((data: FormData) => {
    console.log('FORM VALID', { data });
    setIsLoading(!isLoading);
  }, []);
  const onSubmitError = (errors: FieldErrors): void => {
    console.log('FORM ERRORS', { errors });
    setIsLoading(!isLoading);
    const errorKeys = Object.keys(errors);
    const message =
      `Something went wrong. There is/are ${errorKeys.length} error(s) ` +
      `in the form. The following fields are erroneous: ${errorKeys.join(', ')}. Keep trying.`;
    form.setError('root', { message });
  };
  const onReset = (): void => {
    form.clearErrors();
    setIsLoading(!isLoading);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onSubmitError)} onReset={() => onReset()}>
        <Headline as="h2" like="h2-small" align="center">
          Welcome To The Form
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
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  placeholder="Your Password"
                  autoComplete="current-password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem id="subject">
              <FormControl>
                <Textarea
                  {...field}
                  size="small"
                  placeholder="write us something"
                  variant="secondary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tcs"
          render={({ field }) => (
            <FormItem className={formItemWithCheckbox}>
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
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <div className={spaceBetween.x.base}>
          <Button type="reset" variant="secondary">
            Reset
          </Button>
          <Button disabled={true} variant="outline">
            Disabled
          </Button>
          <Button type="submit" isLoading={isLoading} disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit'}
          </Button>
        </div>

        <Separator />
        <Textual variant="footer" align="center">
          Form footer text. Pretty cool, huh?
        </Textual>
      </form>
    </Form>
  );
};
