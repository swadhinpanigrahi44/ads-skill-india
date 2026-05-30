'use client';

import React from 'react';
import Topbar from '@/components/admin/common/Topbar';
import Card from '@/components/admin/common/Card';
import styles from './Screen.module.css';

export default function KYCManagement() {
  return (
    <div className={styles.screen}>
      <Topbar crumbs="User Management" title="KYC Management" />
      <Card>
        <h3>KYC Management Screen</h3>
        <p>KYC verification and management features will be implemented here.</p>
      </Card>
    </div>
  );
}
