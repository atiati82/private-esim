'use client';

import React from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui.shadcn/form/button';
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui.shadcn/form/form';
import { Input } from '@/components/ui.shadcn/form/input';
import { Textarea } from '@/components/ui.shadcn/form/textarea';
import * as styles from './get-in-touch.css';

interface ContactFormValues {
  name: string;
  company: string;
  email: string;
  subject: string;
}

export const ContactForm: React.FC = () => {
  const form = useForm<ContactFormValues>({
    defaultValues: {
      name: '',
      company: '',
      email: '',
      subject: '',
    },
  });

  const onSubmit = (values: ContactFormValues): void => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <FormItem>
        <FormLabel>Name</FormLabel>
        <FormControl>
          <Input placeholder="Full name" {...form.register('name')} />
        </FormControl>
        <FormMessage />
      </FormItem>

      <FormItem>
        <FormLabel>Company</FormLabel>
        <FormControl>
          <Input placeholder="Enter your company name" {...form.register('company')} />
        </FormControl>
        <FormMessage />
      </FormItem>

      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input placeholder="your@email.com" {...form.register('email')} />
        </FormControl>
        <FormMessage />
      </FormItem>

      <FormItem>
        <FormLabel>Subject</FormLabel>
        <FormControl>
          <Textarea
            size="small"
            placeholder="write us something"
            variant="secondary"
            {...form.register('subject')}
          />
        </FormControl>
        <FormMessage />
      </FormItem>

      <Button onClick={form.handleSubmit(onSubmit)} size="cta" className={styles.buttonContactUs}>
        Contact Us
      </Button>
    </Form>
  );
};
