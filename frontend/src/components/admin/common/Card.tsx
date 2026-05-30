'use client';

import React from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export default function Card({ children, className = '', glow = false }: CardProps) {
  const cardClass = `${styles.card} ${glow ? styles.glow : ''} ${className}`;
  return <div className={cardClass}>{children}</div>;
}
