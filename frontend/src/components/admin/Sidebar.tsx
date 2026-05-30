'use client';

import React from 'react';
import Image from 'next/image';
import styles from './Sidebar.module.css';

interface SidebarProps {
  activeKey: string;
}

export default function Sidebar({ activeKey }: SidebarProps) {
  const navItems = [
    { key: 'home', label: 'Home', icon: '⌂', section: 'Dashboard' },
    { key: 'users', label: 'All Users', icon: '◴', section: 'User Management' },
    { key: 'kyc', label: 'KYC Management', icon: '▣', section: 'User Management', badge: '3' },
    { key: 'leaderboard', label: 'Leaderboard', icon: '♕', section: 'User Management' },
    { key: 'deposits', label: 'Deposits', icon: '↓', section: 'Financials' },
    { key: 'withdrawals', label: 'Withdrawals', icon: '↑', section: 'Financials', badge: '5', badgeType: 'bad' },
    { key: 'transactions', label: 'Transactions', icon: '⇄', section: 'Financials' },
  ];

  const sections = ['Dashboard', 'User Management', 'Financials'];
  const itemsBySection = sections.reduce((acc, section) => {
    acc[section] = navItems.filter((item) => item.section === section);
    return acc;
  }, {} as Record<string, typeof navItems>);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoRow}>
        <Image
          src="/images/logo.png"
          alt="ADS Skill India"
          width={180}
          height={48}
          priority
          className={styles.logoImg}
        />
        <div className={styles.tag}>MASTER ADMIN</div>
      </div>

      {sections.map((section) => (
        <div key={section}>
          <div className={styles.navSection}>{section}</div>
          {itemsBySection[section].map((item) => (
            <div
              key={item.key}
              className={`${styles.navItem} ${activeKey === item.key ? styles.active : ''}`}
            >
              <span className={styles.icon}>{item.icon}</span>
              {item.label}
              {item.badge && (
                <span className={`${styles.badge} ${item.badgeType === 'bad' ? styles.badgeBad : ''}`}>
                  {item.badge}
                </span>
              )}
            </div>
          ))}
        </div>
      ))}

      <div className={styles.upgradeCard}>
        <h4>System healthy</h4>
        <p>All gateways online. Last sync 2m ago.</p>
      </div>
    </aside>
  );
}
