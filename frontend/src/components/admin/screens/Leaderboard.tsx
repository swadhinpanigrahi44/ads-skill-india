'use client';

import React from 'react';
import Topbar from '@/components/admin/common/Topbar';
import Card from '@/components/admin/common/Card';
import styles from './Screen.module.css';

export default function Leaderboard() {
  return (
    <div className={styles.screen}>
      <Topbar crumbs="User Management" title="Leaderboard Control" />
      <Card>
        <h3>Leaderboard Screen</h3>
        <p>Leaderboard management features will be implemented here.</p>
      </Card>
    </div>
  );
}
