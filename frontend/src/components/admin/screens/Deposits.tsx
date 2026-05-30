'use client';

import React from 'react';
import Topbar from '@/components/admin/common/Topbar';
import Card from '@/components/admin/common/Card';
import styles from './Screen.module.css';

export default function Deposits() {
  return (
    <div className={styles.screen}>
      <Topbar crumbs="Financials" title="Deposits History" />
      <Card>
        <h3>Deposits Screen</h3>
        <p>Deposits management features will be implemented here.</p>
      </Card>
    </div>
  );
}
