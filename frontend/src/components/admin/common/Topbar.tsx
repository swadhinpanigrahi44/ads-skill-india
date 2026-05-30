'use client';

import React from 'react';
import styles from './Topbar.module.css';

interface TopbarProps {
  crumbs: string;
  title: string;
}

export default function Topbar({ crumbs, title }: TopbarProps) {
  return (
    <div className={styles.topbar}>
      <div>
        <div className={styles.crumbs}>{crumbs}</div>
        <h1 className={styles.h1}>{title}</h1>
      </div>
      <div className={styles.spacer}></div>
      <div className={styles.topPill}>⌕ Search anything</div>
      <div className={styles.topPill}>🔔</div>
      <div className={styles.avatarChip}>
        <div className={styles.avatar}>SG</div>
        <div>
          <div className={styles.name}>Sagar</div>
        </div>
        <span className={styles.tag}>PRO</span>
      </div>
    </div>
  );
}
