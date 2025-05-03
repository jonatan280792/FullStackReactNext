import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { ReactNode, useEffect } from 'react';
import LoginPage from '@/app/pages/login/loginPage';
import ProductsPage from '@/app/pages/products/productsPage';
import { store } from '@/app/store';
import { Provider } from 'react-redux';
import '@/styles/pages/LoginPage.scss';
import '@/styles/pages/ProductsPage.scss';
import ProtectedRoute from '@/app/guards/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { checkUserData } from './app/store/userSlice';
import { useAppDispatch } from './app/store/hooks';

interface AppInitializerProps {
  children: ReactNode;
}

const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkUserData());
  }, [dispatch]);

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppInitializer>
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <ProductsPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
        <ToastContainer />
      </AppInitializer>
    </Provider>
  );
};


export default App;
