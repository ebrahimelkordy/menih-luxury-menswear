import { AppProvider, useApp } from '@/context/AppContext';
import { useRouter } from '@/router';
import { Header, MobileMenu } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { SearchModal } from '@/components/SearchModal';
import { QuickAddModal } from '@/components/QuickAddModal';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { HomePage } from '@/pages/HomePage';
import { ShopPage } from '@/pages/ShopPage';
import { ProductPage } from '@/pages/ProductPage';
import { MixMatchPage } from '@/pages/MixMatchPage';
import { ContactPage } from '@/pages/ContactPage';
import { TrackOrderPage } from '@/pages/TrackOrderPage';
import { AdminPage } from '@/pages/AdminPage';

function AppContent() {
  const { route } = useRouter();

  if (route.name === 'admin') {
    return <AdminPage initialTab={route.tab} />;
  }

  let page;
  switch (route.name) {
    case 'home':
      page = <HomePage />;
      break;
    case 'shop':
      page = <ShopPage category={route.category} />;
      break;
    case 'product':
      page = <ProductPage handle={route.handle} />;
      break;
    case 'mix-match':
      page = <MixMatchPage />;
      break;
    case 'contact':
      page = <ContactPage />;
      break;
    case 'track':
      page = <TrackOrderPage />;
      break;
    default:
      page = <HomePage />;
      break;
  }

  return (
    <div className="min-h-screen bg-ivory flex flex-col relative">
      <Header />
      <MobileMenu />
      <main className="flex-1">{page}</main>
      <Footer />
      <CartDrawer />
      <SearchModal />
      <QuickAddModal />
      <FloatingWhatsApp />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
