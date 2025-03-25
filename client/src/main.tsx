import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Layout from './layouts/dashboard';
import OverviewPage from './pages/OverviewPage';
import AllPointPage from './pages/AllPointPage';
import ListViewPage from './pages/ListViewPage';
import MonthlyViewPage from './pages/MonthlyViewPage';
import RepeatPointPage from './pages/RepeatPointPage';
import NotFoundPage from './pages/NotFoundPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <Layout />,
        children: [
          {
            path: '',
            element: <OverviewPage />,
          },
          {
            path: 'AllPointPage',
            element: <AllPointPage />,
          },
          {
            path: 'MonthlyViewPage',
            element: <MonthlyViewPage />,
          },
          {
            path: 'RepeatPointPage',
            element: <RepeatPointPage />,
          },
          {
            path: 'ListViewPage',
            element: <ListViewPage />,
          },
          {
            path: '*',
            element: <NotFoundPage />
          }
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
