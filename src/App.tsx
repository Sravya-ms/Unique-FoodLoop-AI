/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AiAssistantDrawer } from './components/AiAssistantDrawer';

// Views
import { LandingPage } from './views/LandingPage';
import { HowItWorksView } from './views/HowItWorksView';
import { AuthLoginDonor } from './views/AuthLoginDonor';
import { AuthLoginConsumer } from './views/AuthLoginConsumer';
import { AuthLoginAdmin } from './views/AuthLoginAdmin';
import { AuthRegisterDonor } from './views/AuthRegisterDonor';
import { AuthRegisterConsumer } from './views/AuthRegisterConsumer';
import { VerificationPending } from './views/VerificationPending';
import { DonorDashboard } from './views/DonorDashboard';
import { ConsumerDashboard } from './views/ConsumerDashboard';
import { DonateFoodScreen } from './views/DonateFoodScreen';
import { DonationDetailsScreen } from './views/DonationDetailsScreen';
import { OrderTrackingScreen } from './views/OrderTrackingScreen';
import { ImpactDashboard } from './views/ImpactDashboard';
import { AdminDashboard } from './views/AdminDashboard';
import { HistoryView } from './views/HistoryView';
import { ProfileView } from './views/ProfileView';
import { NotificationsView } from './views/NotificationsView';

const MainContent: React.FC = () => {
  const { currentView } = useApp();
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage />;
      case 'how_it_works':
        return <HowItWorksView />;
      case 'login_donor':
        return <AuthLoginDonor />;
      case 'login_consumer':
        return <AuthLoginConsumer />;
      case 'login_admin':
        return <AuthLoginAdmin />;
      case 'register_donor':
        return <AuthRegisterDonor />;
      case 'register_consumer':
        return <AuthRegisterConsumer />;
      case 'verification_pending':
        return <VerificationPending />;
      case 'donor_dashboard':
        return <DonorDashboard />;
      case 'consumer_dashboard':
        return <ConsumerDashboard />;
      case 'donate_food':
        return <DonateFoodScreen />;
      case 'donation_details':
        return <DonationDetailsScreen />;
      case 'order_tracking':
        return <OrderTrackingScreen />;
      case 'impact':
        return <ImpactDashboard />;
      case 'admin_dashboard':
      case 'admin_verifications':
      case 'admin_all_donations':
      case 'admin_all_requests':
        return <AdminDashboard />;
      case 'history':
        return <HistoryView />;
      case 'profile':
        return <ProfileView />;
      case 'notifications':
        return <NotificationsView />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar onOpenAssistant={() => setIsAssistantOpen(true)} />
      <main className="flex-1">{renderView()}</main>
      <Footer />
      <AiAssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
