# Master Admin Dashboard

A comprehensive admin dashboard for ADS Skill India platform built with Next.js and React.

## 📂 File Structure

```
src/
├── app/(dashboard)/admin/
│   ├── page.tsx              # Main dashboard entry point
│   └── admin.module.css      # Dashboard layout styles
├── components/admin/
│   ├── Sidebar.tsx           # Navigation sidebar
│   ├── Sidebar.module.css
│   ├── common/               # Reusable components
│   │   ├── Topbar.tsx
│   │   ├── Topbar.module.css
│   │   ├── Card.tsx
│   │   ├── Card.module.css
│   │   ├── KPICard.tsx
│   │   ├── KPICard.module.css
│   │   ├── Pill.tsx
│   │   └── Pill.module.css
│   └── screens/              # Dashboard screens
│       ├── DashboardHome.tsx # Main dashboard with KPIs, charts, activity feed
│       ├── DashboardHome.module.css
│       ├── AllUsers.tsx      # User management (placeholder)
│       ├── KYCManagement.tsx # KYC verification (placeholder)
│       ├── Leaderboard.tsx   # Leaderboard control (placeholder)
│       ├── Deposits.tsx      # Deposit history (placeholder)
│       ├── Withdrawals.tsx   # Withdrawal management (placeholder)
│       ├── Transactions.tsx  # Transaction audit log (placeholder)
│       └── Screen.module.css # Shared screen styles
```

## 🎨 Design Features

- **Dark Mode Theme**: Professional dark interface with purple accent colors
- **Real-time KPI Cards**: Display key metrics with sparklines
- **Interactive Charts**: SVG-based charts for deposits vs withdrawals
- **Activity Feed**: Live activity updates with categorized events
- **Responsive Layout**: Sidebar navigation that adapts to screen size
- **Component Library**: Reusable UI components (Card, KPI, Pill, Topbar)

## 🔌 Key Components

### Page Layout (`page.tsx`)
- Screen switcher with top navigation bar
- Multi-screen support with client-side routing
- Logo integration with real `/images/logo.png`

### Common Components
- **Topbar**: Header with breadcrumbs, title, search, and user avatar
- **Card**: Content container with optional glow effect
- **KPICard**: Key performance indicator card with variants (good, bad, warn, featured)
- **Pill**: Inline badge component with color variants
- **Sidebar**: Navigation with sections, active states, and badge support

### Dashboard Screens

#### DashboardHome (Main Dashboard)
Features:
- Action queue hero card with pending items
- KPI strip showing deposits, withdrawals, net revenue, and community
- Money pulse chart (deposits vs withdrawals over time)
- Today at a glance statistics
- Community breakdown with donut chart
- Live activity feed with real-time events
- Leaderboard toggle controls
- Top earners list with gradient avatars
- Payment gateway volume breakdown

#### Other Screens (Placeholders)
- All Users, KYC Management, Leaderboard, Deposits, Withdrawals, Transactions
- Ready for detailed implementation

## 🎯 Design System

### Colors (CSS Variables)
```css
--bg: #08090c              /* Main background */
--surface: #12141b         /* Card background */
--accent: #8b7cff          /* Primary purple */
--good: #36d399            /* Success green */
--warn: #f5a524            /* Warning amber */
--bad: #ff5577             /* Error red */
--text: #e8eaf2            /* Primary text */
--muted: #8a91a6           /* Secondary text */
```

### Typography
- Font Family: Inter (via Google Fonts)
- Monospace: JetBrains Mono (for codes/IDs)

### Spacing & Sizing
- Border radius: 8-18px (cards)
- Padding: 14-18px (standard)
- Gap: 6-18px (flexible)

## 🚀 Usage

### Access the Dashboard
```
http://localhost:3000/admin
```

### Switching Screens
Click the tab buttons in the top navigation bar:
- Dashboard
- All Users
- KYC
- Leaderboard
- Deposits
- Withdrawals
- Transactions

### Navigation
Use the sidebar to jump between sections:
- Dashboard: Home
- User Management: All Users, KYC Management, Leaderboard
- Financials: Deposits, Withdrawals, Transactions

## 🔄 Component Reusability

The dashboard uses a modular component structure allowing easy:
- **Addition of new screens**: Create a new file in `screens/` folder
- **UI consistency**: Reuse common components (Card, KPI, Pill)
- **Style updates**: Modify shared CSS modules

## 📊 Data Integration

The current dashboard uses mock data for demonstration:
- KPI values, charts, and statistics are hardcoded
- Ready for API integration in each screen component

### Integration Points
1. Replace mock KPI values with API calls
2. Connect activity feed to real-time event streams
3. Populate user tables with actual database queries
4. Link transaction charts to financial data

## 🎯 Next Steps

1. **Implement Data Fetching**: Add API calls to fetch real data
2. **Complete Screen Details**: Build out each section (Users, KYC, etc.)
3. **Add Interactivity**: Implement filters, search, and actions
4. **Real-time Updates**: Connect to WebSockets for live data
5. **Error Handling**: Add loading states and error boundaries
6. **Testing**: Add unit and integration tests

## 📝 Notes

- All CSS uses CSS Modules for scoped styling
- Dark theme with high contrast for accessibility
- SVG charts are inline for performance
- Logo uses Next.js Image component for optimization
- Uses client-side state management (React useState)

## 🔐 Responsive Design

Mobile support is included:
- Sidebar hidden/collapsed on smaller screens
- Grid layouts adapt from 4/3/2 columns to single column
- Touch-friendly buttons and spacing

---

**Created with Next.js 14+ and React 18+**
