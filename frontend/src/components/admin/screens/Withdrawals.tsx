'use client';

import React from 'react';
import Topbar from '@/components/admin/common/Topbar';
import Card from '@/components/admin/common/Card';
import styles from './Screen.module.css';

export default function Withdrawals() {
  return (
    <div className={styles.screen}>
      <Topbar crumbs="Financials" title="Withdrawals" />
      <Card>
        <h3>Withdrawals Screen</h3>
        <p>Withdrawals management features will be implemented here.</p>
      </Card>
    </div>
  );
}
