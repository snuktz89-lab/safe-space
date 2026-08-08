import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.jsx';
import AdminPage from './AdminPage.jsx';
import './index.css';

const rootElement = document.getElementById('root');

const useAdminPage =
  window.location.hash === '#admin';

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    {useAdminPage ? <AdminPage /> : <App />}
  </React.StrictMode>
);