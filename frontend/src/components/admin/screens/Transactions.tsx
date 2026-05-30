'use client';

import React from 'react';
import Topbar from '@/components/admin/common/Topbar';
import Card from '@/components/admin/common/Card';
import styles from './Screen.module.css';

export default function Transactions() {
  return (
    <div className={styles.screen}>
      <Topbar crumbs="Financials" title="Transactions" />
      <Card>
        <h3>Transactions Screen</h3>
        <p>Transactions and audit log features will be implemented here.</p>
      </Card>
    </div>
  );
}
