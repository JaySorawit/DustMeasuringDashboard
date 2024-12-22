// index.tsx
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Layout from './layouts/dashboard';
import AllPointPage from './pages/AllPointPage';
import ListViewPage from './pages/ListViewPage';
import MonthlyViewPage from './pages/MonthlyViewPage';
import RepeatPointPage from './pages/RepeatPointPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // Root component with navigation
    children: [
      {
        path: '',
        element: <Layout />,
        children: [
          {
            path: 'AllPointPage', // Navigate to /AllPointPage
            element: <AllPointPage />,
          },
          {
            path: 'MonthlyViewPage', // Navigate to /MonthlyViewPage
            element: <MonthlyViewPage />,
          },
          {
            path: 'RepeatPointPage', // Navigate to /RepeatPointPage
            element: <RepeatPointPage />,
          },
          {
            path: 'ListViewPage', // Navigate to /ListViewPage
            element: <ListViewPage />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
