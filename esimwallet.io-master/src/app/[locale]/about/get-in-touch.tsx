import React from 'react';
import Image from 'next/image';

import { ContactForm } from '@/app/[locale]/about/form-contact';
import { Headline } from '@/components/ui/Headline';
import * as styles from './get-in-touch.css';

export const GetInTouch: React.FC = () => {
  return (
    <div className={styles.getInTouchContainer}>
      <Headline as="h1">Get in Touch</Headline>
      <p className={styles.getInTouchSubTitle}>We’d love to hear from you.</p>
      <div className={styles.formWrapper}>
        <div className={styles.formContent}>
          <ContactForm />
        </div>
        <div className={styles.formMessageImage}>
          <Image
            alt="message-form"
            src={'/images/message-form.png'}
            width={500}
            height={500}
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};
