'use client';

import React from 'react';
import styles from './KPICard.module.css';

interface KPICardProps {
  variant?: 'good' | 'bad' | 'warn' | 'featured';
  label: string;
  value: string;
  delta: string;
  icon?: string;
}

export default function KPICard({ variant, label, value, delta, icon = '★' }: KPICardProps) {
  const classList = `${styles.kpi} ${variant ? styles[variant] : ''}`;
  const isDelta = delta.includes('+') ? 'up' : delta.includes('-') ? 'dn' : '';

  return (
    <div className={classList}>
      <div className={styles.label}>
        <span className={styles.ic}>{icon}</span>
        {label}
      </div>
      <div className={styles.value}>{value}</div>
      <div className={`${styles.delta} ${isDelta}`}>
        {isDelta === 'up' && '↑'}
        {isDelta === 'dn' && '↓'}
        {isDelta && <span className={styles.pct}>{delta}</span>}
        {!isDelta && delta}
      </div>
    </div>
  );
}
