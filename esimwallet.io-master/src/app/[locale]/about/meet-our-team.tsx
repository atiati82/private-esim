'use client';

import React, { useState } from 'react';
import Image from 'next/image';

import { dataOwner } from '@/app/[locale]/about/meet-our-team-data';
import { Headline } from '@/components/ui/Headline';
import * as styles from './meet-our-team.css';

type Member = {
  name: string;
  role: string;
  image: string;
  description: string;
};

type MeetOurTeamProps = {
  members: Member[];
};

export const MeetOurTeam: React.FC<MeetOurTeamProps> = ({ members }) => {
  const [selectedMember, setSelectedMember] = useState(dataOwner[0]);

  return (
    <div className={styles.meetOurTeamContainer}>
      <Headline as="h1">Meet Our Team</Headline>
      <p className={styles.meetOurTeamSubTitle}>
        The passionate individuals driving Private eSIM forward
      </p>
      <div className={styles.teamMemberList}>
        {members.map((member) => (
          <div
            key={member.name}
            className={`${styles.teamMemberWrap} ${member.name === selectedMember.name ? styles.selected : ''}`}
            onClick={() => setSelectedMember(member)}
          >
            <Image src={member.image} alt={member.name} width={415} height={504} loading="lazy" />
          </div>
        ))}
      </div>
      <div className={styles.teamMemberContent}>
        <div className={styles.teamMemberContentNameRole}>
          <p className={styles.teamMemberName}>{selectedMember.name}</p>
          <p className={styles.teamMemberRole}>{selectedMember.role}</p>
        </div>
        <p className={styles.teamMemberDescription}>{selectedMember.description}</p>
      </div>

      {/* mobile view */}
      <div className={styles.teamMember}>
        {dataOwner.map((member) => (
          <div key={member.name} className={styles.teamMemberWrapMobile}>
            <Image src={member.image} alt={member.name} width={300} height={400} loading="lazy" />
            <div className={styles.teamMemberContentMobile}>
              <p className={styles.teamMemberName}>{member.name}</p>
              <p className={styles.teamMemberRole}>{member.role}</p>
              <p className={styles.teamMemberDescription}>{member.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
