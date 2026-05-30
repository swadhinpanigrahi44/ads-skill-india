'use client';

import React from 'react';
import styles from './Pill.module.css';

interface PillProps {
  children: React.ReactNode;
  variant?: 'good' | 'bad' | 'warn' | 'purple';
}

export default function Pill({ children, variant }: PillProps) {
  const className = `${styles.pill} ${variant ? styles[variant] : ''}`;
  return <span className={className}>{children}</span>;
}
