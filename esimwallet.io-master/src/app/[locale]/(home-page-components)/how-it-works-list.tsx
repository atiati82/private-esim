import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Headline } from '@/components/ui/Headline';
import * as styles from './how-it-works-list.css';

interface HowItWorksListProps {
  items: {
    title: string;
    description: string;
    href: string;
    url: string;
  }[];
}

export const HowItWorksList: React.FC<HowItWorksListProps> = ({ items }) => {
  return (
    <div className={styles.howItWorksListWrapper}>
      {items.map((howitworks, index) => {
        return (
          <Link
            href={howitworks.href}
            key={howitworks.title}
            className={styles.howItWorksListContent}
          >
            <div className={styles.howItWorksListCardWrapper}>
              <Image
                alt={howitworks.title}
                src={howitworks.url}
                width={500}
                height={500}
                loading="lazy"
                className={
                  index !== 1
                    ? styles.howItWorksListCardImage
                    : styles.howItWorksListCardImageChoosePlan
                }
              />
            </div>
            <Headline as="h3">
              <span>Step {index + 1}:</span> {howitworks.title}
            </Headline>
            <p>{howitworks.description}</p>
          </Link>
        );
      })}
    </div>
  );
};
