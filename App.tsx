
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import PostAdPage from './pages/PostAdPage';
import RegisterPage from './pages/RegisterPage';
import PricingPage from './pages/PricingPage';
import ListingDetailPage from './pages/ListingDetailPage';
import AdminDashboard from './pages/AdminDashboard';
import { ListingCategory } from './types';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/jobs" element={<Layout><CategoryPage categoryType={ListingCategory.JOB} /></Layout>} />
        <Route path="/tenders" element={<Layout><CategoryPage categoryType={ListingCategory.TENDER} /></Layout>} />
        <Route path="/property" element={<Layout><CategoryPage categoryType={ListingCategory.PROPERTY} /></Layout>} />
        <Route path="/vehicles" element={<Layout><CategoryPage categoryType={ListingCategory.VEHICLE} /></Layout>} />
        <Route path="/listing/:id" element={<Layout><ListingDetailPage /></Layout>} />
        <Route path="/post" element={<Layout><PostAdPage /></Layout>} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<RegisterPage />} />
        <Route path="/pricing" element={<Layout><PricingPage /></Layout>} />
        
        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminDashboard />} />

        <Route path="*" element={
          <Layout>
            <div className="container mx-auto px-4 py-32 text-center">
              <h1 className="text-6xl font-black text-primary mb-4">404</h1>
              <p className="text-xl text-gray-500">Page not found</p>
            </div>
          </Layout>
        } />
      </Routes>
    </Router>
  );
};

export default App;
