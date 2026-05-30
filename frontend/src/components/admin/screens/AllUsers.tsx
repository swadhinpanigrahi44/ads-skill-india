'use client';

import React from 'react';
import Topbar from '@/components/admin/common/Topbar';
import Card from '@/components/admin/common/Card';
import styles from './Screen.module.css';

export default function AllUsers() {
  return (
    <div className={styles.screen}>
      <Topbar crumbs="User Management" title="All Users" />
      <Card>
        <h3>All Users Screen</h3>
        <p>User management features will be implemented here.</p>
      </Card>
    </div>
  );
}
