'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Sidebar from '@/components/admin/Sidebar';
import DashboardHome from '@/components/admin/screens/DashboardHome';
import AllUsers from '@/components/admin/screens/AllUsers';
import KYCManagement from '@/components/admin/screens/KYCManagement';
import Leaderboard from '@/components/admin/screens/Leaderboard';
import Deposits from '@/components/admin/screens/Deposits';
import Withdrawals from '@/components/admin/screens/Withdrawals';
import Transactions from '@/components/admin/screens/Transactions';
import styles from './admin.module.css';

type ScreenType = 'home' | 'users' | 'kyc' | 'leaderboard' | 'deposits' | 'withdrawals' | 'transactions';

export default function AdminDashboard() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');

  const screens: Record<ScreenType, React.ReactNode> = {
    home: <DashboardHome />,
    users: <AllUsers />,
    kyc: <KYCManagement />,
    leaderboard: <Leaderboard />,
    deposits: <Deposits />,
    withdrawals: <Withdrawals />,
    transactions: <Transactions />,
  };

  return (
    <div className={styles.container}>
      <ScreenBar currentScreen={currentScreen} onScreenChange={setCurrentScreen} />
      <div className={styles.mainContent}>
        <Sidebar activeKey={currentScreen} />
        {screens[currentScreen]}
      </div>
    </div>
  );
}

interface ScreenBarProps {
  currentScreen: ScreenType;
  onScreenChange: (screen: ScreenType) => void;
}

function ScreenBar({ currentScreen, onScreenChange }: ScreenBarProps) {
  const tabs: Array<{ id: ScreenType; label: string }> = [
    { id: 'home', label: 'Dashboard' },
    { id: 'users', label: 'All Users' },
    { id: 'kyc', label: 'KYC' },
    { id: 'leaderboard', label: 'Leaderboard' },
    { id: 'deposits', label: 'Deposits' },
    { id: 'withdrawals', label: 'Withdrawals' },
    { id: 'transactions', label: 'Transactions' },
  ];

  return (
    <div className={styles.screenBar}>
      <div className={styles.brand}>
        <Image
          src="/images/logo.png"
          alt="ADS Skill India"
          width={140}
          height={36}
          priority
          className={styles.logoImg}
        />
      </div>
      <div className={styles.tabsContainer}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.stab} ${currentScreen === tab.id ? styles.active : ''}`}
            onClick={() => onScreenChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
