import React from 'react';

export interface IconProps {
  className?: string;
}

export const DummyIcon: React.FC<IconProps> = () => {
  return <span className="dummy-icon">i</span>;
};
