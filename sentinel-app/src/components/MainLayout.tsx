import { ReactNode } from 'react';
import TopAppBar from './TopAppBar';
import BottomNavBar from './BottomNavBar';
import Footer from './Footer';

interface MainLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

const MainLayout = ({ children, showFooter = true }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <TopAppBar />
      <main className="pt-20 pb-20">
        {children}
      </main>
      {showFooter && <Footer />}
      <BottomNavBar />
    </div>
  );
};

export default MainLayout;
