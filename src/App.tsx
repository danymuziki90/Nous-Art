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

// Admin shell — imported eagerly so /nart-admin renders instantly (small footprint)
import AdminLogin  from '@/pages/admin/AdminLogin';
import AdminLayout from '@/pages/admin/AdminLayout';

// Admin inner pages — lazy loaded, prefetched on login page mount
const AdminDashboard   = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminArtworks    = lazy(() => import('@/pages/admin/AdminArtworks'));
const AdminArtists     = lazy(() => import('@/pages/admin/AdminArtists'));
const AdminExhibitions = lazy(() => import('@/pages/admin/AdminExhibitions'));
const AdminSettings    = lazy(() => import('@/pages/admin/AdminSettings'));

// Prefetch all admin chunks as soon as the user lands on the login page
// so they are already cached by the time login completes
function prefetchAdminChunks() {
  import('@/pages/admin/AdminDashboard');
  import('@/pages/admin/AdminArtworks');
  import('@/pages/admin/AdminArtists');
  import('@/pages/admin/AdminExhibitions');
  import('@/pages/admin/AdminSettings');
}

// Full-screen loader for public pages
function PageLoader() {
  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-gold-500/30 border-t-gold-400 animate-spin" />
    </div>
  );
}

// Lightweight inline loader for admin page transitions (inside the layout)
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
    // Start prefetching admin chunks as soon as user hits any /nart-admin route
    if (pathname.startsWith('/nart-admin')) {
      prefetchAdminChunks();
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

                {/* Admin CMS Back Office Routes — shell loads instantly */}
                <Route path="/nart-admin/login" element={<AdminLogin />} />
                <Route
                  path="/nart-admin"
                  element={
                    <AdminProtectedRoute>
                      <AdminLayout />
                    </AdminProtectedRoute>
                  }
                >
                  {/* Inner pages lazy-loaded inside the already-rendered layout */}
                  <Route index element={<Suspense fallback={<AdminPageLoader />}><AdminDashboard /></Suspense>} />
                  <Route path="artworks" element={<Suspense fallback={<AdminPageLoader />}><AdminArtworks /></Suspense>} />
                  <Route path="artists" element={<Suspense fallback={<AdminPageLoader />}><AdminArtists /></Suspense>} />
                  <Route path="exhibitions" element={<Suspense fallback={<AdminPageLoader />}><AdminExhibitions /></Suspense>} />
                  <Route path="settings" element={<Suspense fallback={<AdminPageLoader />}><AdminSettings /></Suspense>} />
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
