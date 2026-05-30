'use client';

import React from 'react';
import styles from './DashboardHome.module.css';
import Topbar from '@/components/admin/common/Topbar';
import KPICard from '@/components/admin/common/KPICard';
import Card from '@/components/admin/common/Card';
import Pill from '@/components/admin/common/Pill';

export default function DashboardHome() {
  return (
    <div className={styles.main}>
      <Topbar crumbs="Master Admin / Dashboard" title="Good morning, Sagar 👋" />

      {/* Action Queue */}
      <Card className={styles.heroCard} glow>
        <div className={styles.between}>
          <div>
            <div className={styles.row}>
              <h3 className={styles.h3}>⚡ Action queue</h3>
              <Pill variant="purple">
                <span className={styles.dot}></span>9 pending
              </Pill>
            </div>
            <div className={styles.sub}>Things blocking users until you act · sorted by age</div>
          </div>
          <div className={styles.segmentControl}>
            <button className={styles.segOn}>All</button>
            <button>Mine</button>
            <button>Aged &gt;6h</button>
          </div>
        </div>

        <div className={styles.queueGrid}>
          <QueueCard urgent label="⏱ Urgent · 18h old" count="5" desc="withdrawals waiting · ₹12,000" />
          <QueueCard label="📇 KYC" count="3" desc="submissions to verify" />
          <QueueCard label="↓ Deposits" count="2" desc="stuck pending verification" />
          <QueueCard label="👤 Signups today" count="1" desc="new account · review" />
        </div>
      </Card>

      {/* KPI Strip */}
      <div className={styles.kpiGrid}>
        <KPICard variant="good" label="Total Deposits · 30d" value="₹1,04,491" delta="+18%" />
        <KPICard variant="bad" label="Total Withdrawals · 30d" value="₹74,200" delta="-4%" />
        <KPICard variant="featured" label="Net Revenue · 30d" value="₹46,291" delta="+22%" />
        <KPICard label="Community" value="142" delta="+12 new this week" />
      </div>

      {/* Charts Section */}
      <div className={styles.chartGrid}>
        <Card>
          <div className={styles.between}>
            <div>
              <h3 className={styles.h3}>Money pulse</h3>
              <div className={styles.sub}>Deposits vs withdrawals · last 30 days</div>
            </div>
            <div className={styles.segmentControl}>
              <button>7D</button>
              <button>14D</button>
              <button className={styles.segOn}>30D</button>
              <button>90D</button>
              <button>All</button>
            </div>
          </div>
          <div className={styles.chartContainer}>
            <svg className={styles.chart} viewBox="0 0 600 240" preserveAspectRatio="none">
              <defs>
                <linearGradient id="dep" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="#36d399" stopOpacity=".35" />
                  <stop offset="1" stopColor="#36d399" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="wd" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="#ff5577" stopOpacity=".25" />
                  <stop offset="1" stopColor="#ff5577" stopOpacity="0" />
                </linearGradient>
                <pattern id="grid" width="50" height="48" patternUnits="userSpaceOnUse">
                  <path d="M0,48 L600,48" stroke="#262a36" strokeWidth="1" />
                  <path d="M50,0 L50,240" stroke="#262a36" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="600" height="240" fill="url(#grid)" opacity=".5" />
              <path
                d="M0,200 C50,180 90,170 130,140 C170,110 210,130 250,100 C290,70 330,90 370,60 C410,35 450,55 490,32 C530,15 570,28 600,22 L600,240 L0,240 Z"
                fill="url(#dep)"
              />
              <path
                d="M0,200 C50,180 90,170 130,140 C170,110 210,130 250,100 C290,70 330,90 370,60 C410,35 450,55 490,32 C530,15 570,28 600,22"
                fill="none"
                stroke="#36d399"
                strokeWidth="2.5"
              />
              <path
                d="M0,210 C50,205 100,202 150,190 C200,178 250,182 300,168 C350,155 400,160 450,148 C500,138 550,142 600,132 L600,240 L0,240 Z"
                fill="url(#wd)"
              />
              <path
                d="M0,210 C50,205 100,202 150,190 C200,178 250,182 300,168 C350,155 400,160 450,148 C500,138 550,142 600,132"
                fill="none"
                stroke="#ff5577"
                strokeWidth="2"
                strokeDasharray="6 4"
              />
              <circle cx="490" cy="32" r="5" fill="#36d399" />
              <circle cx="490" cy="32" r="9" fill="#36d399" opacity=".25" />
            </svg>
          </div>
          <div className={styles.chartLegend}>
            <span>
              <span style={{ color: '#36d399' }}>●</span> Deposits
            </span>
            <span>
              <span style={{ color: '#ff5577' }}>●</span> Withdrawals
            </span>
          </div>
        </Card>

        <Card>
          <h3 className={styles.h3}>Today at a glance</h3>
          <div className={styles.sub}>Tue · May 6, 2026</div>
          <div className={styles.statsBlock}>
            <StatRow label="New signups" value="1" />
            <StatRow label="Deposits today" value="₹0" />
            <StatRow label="Withdrawals today" value="₹0" />
            <StatRow label="KYC submitted" value="0" />
            <StatRow label="Active right now" value="14" highlight />
            <StatRow label="Failed payments" value="0" />
          </div>
          <div className={styles.systemStatus}>
            <span className={styles.dot}></span>
            All systems normal
          </div>
        </Card>
      </div>

      {/* Community, Feed, Leaderboard */}
      <div className={styles.threeColGrid}>
        <Card>
          <h3 className={styles.h3}>Community</h3>
          <div className={styles.sub}>User breakdown</div>
          <div className={styles.donutContainer}>
            <DonutChart />
            <div className={styles.donutLegend}>
              <LegendItem color="#36d399" label="Active" value="128" />
              <LegendItem color="#f5a524" label="KYC pending" value="11" />
              <LegendItem color="#ff5577" label="Banned" value="3" />
              <LegendItem color="#8b7cff" label="Verified" value="88" />
            </div>
          </div>
        </Card>

        <Card>
          <div className={styles.between}>
            <div>
              <h3 className={styles.h3}>Live activity</h3>
              <div className={styles.sub}>Real-time events · auto-refresh</div>
            </div>
            <button className={styles.iconBtn}>⟲</button>
          </div>
          <div className={styles.feedContainer}>
            <FeedItem icon="+" variant="purple" user="Raj jaiswal" action="signed up" time="2m ago" tag="signup" />
            <FeedItem
              icon="▣"
              variant="warn"
              user="ADS15123"
              action="KYC submitted"
              time="12m ago"
              tag="kyc"
            />
            <FeedItem
              icon="↑"
              variant="bad"
              user="ADS15090"
              action="Withdrawal request ₹500"
              time="1h ago"
              tag="withdrawal"
            />
            <FeedItem
              icon="🔒"
              user="ADS15101"
              action="Login from new device"
              time="3h ago"
              tag="auth"
            />
            <FeedItem
              icon="↓"
              variant="good"
              user="ADS15090"
              action="Deposit ₹2,000 approved"
              time="4h ago"
              tag="deposit"
            />
          </div>
        </Card>

        <Card>
          <div className={styles.between}>
            <div>
              <h3 className={styles.h3}>Leaderboard</h3>
              <div className={styles.sub}>Public visibility status</div>
            </div>
            <Pill variant="warn">
              <span className={styles.dot}></span>draft
            </Pill>
          </div>
          <div className={styles.toggleList}>
            <ToggleItem label="Today" />
            <ToggleItem label="7 Days" />
            <ToggleItem label="30 Days" defaultOn />
            <ToggleItem label="All Time" />
          </div>
          <button className={styles.primaryBtn}>💾 Publish changes</button>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className={styles.twoColGrid}>
        <Card>
          <div className={styles.between}>
            <div>
              <h3 className={styles.h3}>Top earners</h3>
              <div className={styles.sub}>By total earnings · this month</div>
            </div>
            <div className={styles.segmentControl}>
              <button className={styles.segOn}>Month</button>
              <button>Week</button>
              <button>All</button>
            </div>
          </div>
          <div className={styles.earnersTable}>
            <EarnerRow
              initials="RJ"
              name="Raj jaiswal"
              id="ADS15123"
              amount="₹12,400"
              change="+18%"
            />
            <EarnerRow
              initials="PK"
              name="Priya K"
              id="ADS15098"
              amount="₹9,800"
              change="+12%"
              color="linear-gradient(135deg,#1f8a5b,#36d399)"
            />
            <EarnerRow
              initials="AM"
              name="Aman M"
              id="ADS15090"
              amount="₹7,200"
              change="-4%"
              isNegative
              color="linear-gradient(135deg,#d97706,#f5a524)"
            />
            <EarnerRow
              initials="SS"
              name="Suresh S"
              id="ADS15084"
              amount="₹5,100"
              change="+6%"
              color="linear-gradient(135deg,#c0392b,#ff5577)"
            />
          </div>
        </Card>

        <Card>
          <div className={styles.between}>
            <div>
              <h3 className={styles.h3}>Payment gateway split</h3>
              <div className={styles.sub}>Volume share · last 30 days</div>
            </div>
          </div>
          <div className={styles.gatewayContainer}>
            <GatewayDonut />
            <div className={styles.gatewayList}>
              <GatewayRow color="#8b7cff" label="Razorpay" amount="₹57,470" percent="55%" />
              <GatewayRow color="#36d399" label="SimplyPay" amount="₹26,123" percent="25%" />
              <GatewayRow color="#f5a524" label="WatchPay" amount="₹20,898" percent="20%" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

interface QueueCardProps {
  urgent?: boolean;
  label: string;
  count: string;
  desc: string;
}

function QueueCard({ urgent, label, count, desc }: QueueCardProps) {
  return (
    <div className={`${styles.qcard} ${urgent ? styles.urgent : ''}`}>
      <div className={styles.qlabel}>{label}</div>
      <div className={styles.qcount}>{count}</div>
      <div className={styles.qdesc}>{desc}</div>
      <button className={`${styles.btn} ${urgent ? styles.primary : ''}`}>
        {urgent ? 'Review now →' : 'Open →'}
      </button>
    </div>
  );
}

interface StatRowProps {
  label: string;
  value: string;
  highlight?: boolean;
}

function StatRow({ label, value, highlight }: StatRowProps) {
  return (
    <div className={styles.statRow}>
      <span>{label}</span>
      <b style={highlight ? { color: '#36d399' } : {}}>{value}</b>
    </div>
  );
}

function DonutChart() {
  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      <circle cx="70" cy="70" r="55" fill="none" stroke="#1d2130" strokeWidth="14" />
      <circle
        cx="70"
        cy="70"
        r="55"
        fill="none"
        stroke="#36d399"
        strokeWidth="14"
        strokeDasharray="240 350"
        strokeDashoffset="0"
        transform="rotate(-90 70 70)"
        strokeLinecap="round"
      />
      <circle
        cx="70"
        cy="70"
        r="55"
        fill="none"
        stroke="#f5a524"
        strokeWidth="14"
        strokeDasharray="35 350"
        strokeDashoffset="-242"
        transform="rotate(-90 70 70)"
        strokeLinecap="round"
      />
      <circle
        cx="70"
        cy="70"
        r="55"
        fill="none"
        stroke="#ff5577"
        strokeWidth="14"
        strokeDasharray="20 350"
        strokeDashoffset="-279"
        transform="rotate(-90 70 70)"
        strokeLinecap="round"
      />
      <text x="70" y="70" textAnchor="middle" dominantBaseline="central" fontSize="24" fontWeight="700" fill="#e8eaf2">
        142
      </text>
      <text
        x="70"
        y="88"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="10"
        fill="#8a91a6"
        letterSpacing="1.2px"
      >
        USERS
      </text>
    </svg>
  );
}

function GatewayDonut() {
  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      <circle cx="70" cy="70" r="55" fill="none" stroke="#1d2130" strokeWidth="14" />
      <circle
        cx="70"
        cy="70"
        r="55"
        fill="none"
        stroke="#8b7cff"
        strokeWidth="14"
        strokeDasharray="190 350"
        transform="rotate(-90 70 70)"
        strokeLinecap="round"
      />
      <circle
        cx="70"
        cy="70"
        r="55"
        fill="none"
        stroke="#36d399"
        strokeWidth="14"
        strokeDasharray="86 350"
        strokeDashoffset="-192"
        transform="rotate(-90 70 70)"
        strokeLinecap="round"
      />
      <circle
        cx="70"
        cy="70"
        r="55"
        fill="none"
        stroke="#f5a524"
        strokeWidth="14"
        strokeDasharray="69 350"
        strokeDashoffset="-280"
        transform="rotate(-90 70 70)"
        strokeLinecap="round"
      />
      <text x="70" y="60" textAnchor="middle" dominantBaseline="central" fontSize="18" fontWeight="700" fill="#e8eaf2">
        ₹1L
      </text>
      <text x="70" y="78" textAnchor="middle" dominantBaseline="central" fontSize="10" fill="#8a91a6" letterSpacing="1px">
        VOLUME
      </text>
    </svg>
  );
}

interface LegendItemProps {
  color: string;
  label: string;
  value: string;
}

function LegendItem({ color, label, value }: LegendItemProps) {
  return (
    <div className={styles.legendItem}>
      <span>
        <span style={{ color }}>●</span> {label}
      </span>
      <b>{value}</b>
    </div>
  );
}

interface FeedItemProps {
  icon: string;
  variant?: string;
  user: string;
  action: string;
  time: string;
  tag: string;
}

function FeedItem({ icon, variant, user, action, time, tag }: FeedItemProps) {
  return (
    <div className={styles.feedItem}>
      <div className={`${styles.feedIcon} ${variant ? styles[variant] : ''}`}>{icon}</div>
      <div className={styles.feedBody}>
        <div className={styles.ft}>
          <b>{user}</b> {action}
        </div>
        <div className={styles.fm}>{time} · {tag}</div>
      </div>
      <Pill variant={variant}>{tag}</Pill>
    </div>
  );
}

interface ToggleItemProps {
  label: string;
  defaultOn?: boolean;
}

function ToggleItem({ label, defaultOn }: ToggleItemProps) {
  const [on, setOn] = React.useState(defaultOn || false);
  return (
    <div className={styles.toggleRow}>
      <span>{label}</span>
      <button className={`${styles.toggle} ${on ? styles.toggleOn : ''}`} onClick={() => setOn(!on)} />
    </div>
  );
}

interface EarnerRowProps {
  initials: string;
  name: string;
  id: string;
  amount: string;
  change: string;
  isNegative?: boolean;
  color?: string;
}

function EarnerRow({ initials, name, id, amount, change, isNegative, color }: EarnerRowProps) {
  return (
    <div className={styles.earnerRow}>
      <div>
        <div className={styles.avatar} style={color ? { background: color } : {}}>
          {initials}
        </div>
        <div>
          <b>{name}</b>
          <div className={styles.id}>{id}</div>
        </div>
      </div>
      <div className={styles.earnerStats}>
        <b>{amount}</b>
        <div style={{ color: isNegative ? '#ff5577' : '#36d399' }}>{change}</div>
      </div>
    </div>
  );
}

interface GatewayRowProps {
  color: string;
  label: string;
  amount: string;
  percent: string;
}

function GatewayRow({ color, label, amount, percent }: GatewayRowProps) {
  return (
    <div className={styles.gatewayRow}>
      <span>
        <span style={{ color }}>●</span> {label}
      </span>
      <div>
        <b>{amount}</b>
        <div className={styles.percent}>{percent}</div>
      </div>
    </div>
  );
}
