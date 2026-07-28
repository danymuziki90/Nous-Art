import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { StoreProvider } from '@/context/StoreContext';
import { CMSProvider } from '@/context/CMSContext';
import { AdminAuthProvider, AdminProtectedRoute } from '@/context/AdminAuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SearchModal } from '@/components/SearchModal';
import { CartDrawer } from '@/components/CartDrawer';
import { WishlistDrawer } from '@/components/WishlistDrawer';

// Public pages — lazy loaded per route
const Home          = lazy(() => import('@/pages/Home'));
const Gallery       = lazy(() => import('@/pages/Gallery'));
const ArtworkDetail = lazy(() => import('@/pages/ArtworkDetail'));
const Artists       = lazy(() => import('@/pages/Artists'));
const ArtistDetail  = lazy(() => import('@/pages/ArtistDetail'));
const Exhibitions   = lazy(() => import('@/pages/Exhibitions'));
const About         = lazy(() => import('@/pages/About'));
const Contact       = lazy(() => import('@/pages/Contact'));
const Terms         = lazy(() => import('@/pages/Terms'));
const Privacy       = lazy(() => import('@/pages/Privacy'));

// Admin pages — all lazy to avoid chunk conflicts with manualChunks
const AdminLogin       = lazy(() => import('@/pages/admin/AdminLogin'));
const AdminLayout      = lazy(() => import('@/pages/admin/AdminLayout'));
const AdminDashboard   = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminArtworks    = lazy(() => import('@/pages/admin/AdminArtworks'));
const AdminArtists     = lazy(() => import('@/pages/admin/AdminArtists'));
const AdminExhibitions = lazy(() => import('@/pages/admin/AdminExhibitions'));
const AdminSettings    = lazy(() => import('@/pages/admin/AdminSettings'));

// Prefetch admin chunks silently after 2s on any public page
// so the back office loads instantly when the admin navigates there
function prefetchAdminChunks() {
  import('@/pages/admin/AdminLogin');
  import('@/pages/admin/AdminLayout');
  import('@/pages/admin/AdminDashboard');
  import('@/pages/admin/AdminArtworks');
  import('@/pages/admin/AdminArtists');
  import('@/pages/admin/AdminExhibitions');
  import('@/pages/admin/AdminSettings');
}

// Full-screen spinner (public pages)
function PageLoader() {
  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-gold-500/30 border-t-gold-400 animate-spin" />
    </div>
  );
}

// Inline spinner inside the admin sidebar layout
function AdminPageLoader() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="w-6 h-6 rounded-full border-2 border-gold-500/30 border-t-gold-400 animate-spin" />
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    if (!pathname.startsWith('/nart-admin')) {
      const timer = setTimeout(prefetchAdminChunks, 2000);
      return () => clearTimeout(timer);
    }
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

                {/* Admin CMS Routes */}
                <Route path="/nart-admin/login" element={<AdminLogin />} />
                <Route
                  path="/nart-admin"
                  element={
                    <AdminProtectedRoute>
                      <AdminLayout />
                    </AdminProtectedRoute>
                  }
                >
                  <Route index element={<Suspense fallback={<AdminPageLoader />}><AdminDashboard /></Suspense>} />
                  <Route path="artworks" element={<Suspense fallback={<AdminPageLoader />}><AdminArtworks /></Suspense>} />
                  <Route path="artists" element={<Suspense fallback={<AdminPageLoader />}><AdminArtists /></Suspense>} />
                  <Route path="exhibitions" element={<Suspense fallback={<AdminPageLoader />}><AdminExhibitions /></Suspense>} />
                  <Route path="settings" element={<Suspense fallback={<AdminPageLoader />}><AdminSettings /></Suspense>} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </StoreProvider>
        </AdminAuthProvider>
      </CMSProvider>
    </BrowserRouter>
  );
}
