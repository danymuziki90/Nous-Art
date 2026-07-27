import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { StoreProvider } from '@/context/StoreContext';
import { CMSProvider } from '@/context/CMSContext';
import { AdminAuthProvider, AdminProtectedRoute } from '@/context/AdminAuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import Gallery from '@/pages/Gallery';
import ArtworkDetail from '@/pages/ArtworkDetail';
import Artists from '@/pages/Artists';
import ArtistDetail from '@/pages/ArtistDetail';
import Exhibitions from '@/pages/Exhibitions';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import { SearchModal } from '@/components/SearchModal';
import { CartDrawer } from '@/components/CartDrawer';
import { WishlistDrawer } from '@/components/WishlistDrawer';

// Admin CMS Pages
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminLayout from '@/pages/admin/AdminLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminArtworks from '@/pages/admin/AdminArtworks';
import AdminArtists from '@/pages/admin/AdminArtists';
import AdminExhibitions from '@/pages/admin/AdminExhibitions';
import AdminSettings from '@/pages/admin/AdminSettings';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CMSProvider>
        <AdminAuthProvider>
          <StoreProvider>
            <ScrollToTop />
            <SearchModal />
            <CartDrawer />
            <WishlistDrawer />
            <Routes>
              {/* Public Website Routes */}
              <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
              <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />
              <Route path="/artwork/:id" element={<PublicLayout><ArtworkDetail /></PublicLayout>} />
              <Route path="/artists" element={<PublicLayout><Artists /></PublicLayout>} />
              <Route path="/artist/:id" element={<PublicLayout><ArtistDetail /></PublicLayout>} />
              <Route path="/exhibitions" element={<PublicLayout><Exhibitions /></PublicLayout>} />
              <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
              <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
              <Route path="/terms" element={<PublicLayout><Terms /></PublicLayout>} />
              <Route path="/privacy" element={<PublicLayout><Privacy /></PublicLayout>} />

              {/* Admin CMS Back Office Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <AdminProtectedRoute>
                    <AdminLayout />
                  </AdminProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="artworks" element={<AdminArtworks />} />
                <Route path="artists" element={<AdminArtists />} />
                <Route path="exhibitions" element={<AdminExhibitions />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </StoreProvider>
        </AdminAuthProvider>
      </CMSProvider>
    </BrowserRouter>
  );
}
