import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { StoreProvider } from '@/context/StoreContext';
import { CMSProvider } from '@/context/CMSContext';
import { AdminAuthProvider, AdminProtectedRoute } from '@/context/AdminAuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Public pages — loaded on demand per route
const Home        = lazy(() => import('@/pages/Home'));
const Gallery     = lazy(() => import('@/pages/Gallery'));
const ArtworkDetail = lazy(() => import('@/pages/ArtworkDetail'));
const Artists     = lazy(() => import('@/pages/Artists'));
const ArtistDetail = lazy(() => import('@/pages/ArtistDetail'));
const Exhibitions = lazy(() => import('@/pages/Exhibitions'));
const About       = lazy(() => import('@/pages/About'));
const Contact     = lazy(() => import('@/pages/Contact'));
const Terms       = lazy(() => import('@/pages/Terms'));
const Privacy     = lazy(() => import('@/pages/Privacy'));
import { SearchModal } from '@/components/SearchModal';
import { CartDrawer } from '@/components/CartDrawer';
import { WishlistDrawer } from '@/components/WishlistDrawer';

// Admin CMS pages — only downloaded when navigating to /nart-admin
const AdminLogin      = lazy(() => import('@/pages/admin/AdminLogin'));
const AdminLayout     = lazy(() => import('@/pages/admin/AdminLayout'));
const AdminDashboard  = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminArtworks   = lazy(() => import('@/pages/admin/AdminArtworks'));
const AdminArtists    = lazy(() => import('@/pages/admin/AdminArtists'));
const AdminExhibitions = lazy(() => import('@/pages/admin/AdminExhibitions'));
const AdminSettings   = lazy(() => import('@/pages/admin/AdminSettings'));

// Minimal loading fallback shown while a chunk is being fetched
function PageLoader() {
  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-gold-500/30 border-t-gold-400 animate-spin" />
    </div>
  );
}

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
            <Suspense fallback={<PageLoader />}>
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
                <Route path="/nart-admin/login" element={<AdminLogin />} />
                <Route
                  path="/nart-admin"
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
            </Suspense>
          </StoreProvider>
        </AdminAuthProvider>
      </CMSProvider>
    </BrowserRouter>
  );
}
