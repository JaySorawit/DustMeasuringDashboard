import { createTheme } from '@mui/material/styles';
import { AppProvider } from '@toolpad/core/react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import BarChartIcon from '@mui/icons-material/BarChart';
import DateRangeIcon from '@mui/icons-material/DateRange';
import TableViewIcon from '@mui/icons-material/TableView';
import { Outlet, useLocation } from 'react-router-dom';

const defaultTheme = createTheme({
  palette: {
    background: {
      default: '#fff',
    },
  },
});

const customTheme = createTheme({
  palette: {
    background: {
      default: '#EDEDF0',
    },
  },
});

const BRANDING = {
  title: 'Dust Measurement System',
  logo: '',
};

export default function App() {
  const location = useLocation();
  
  // Check if the current path is the Dust Quality Overview page
  const isOverviewPage = location.pathname === '/';

  const theme = isOverviewPage ? customTheme : defaultTheme;

  return (
    <AppProvider
      navigation={[
        {
          segment: '',
          title: 'Dust Quality Overview',
          icon: <DashboardIcon />,
        },
        {
          segment: 'AllPointPage',
          title: 'All Point (Daily report)',
          icon: <WarehouseIcon />,
        },
        {
          segment: 'MonthlyViewPage',
          title: 'Monthly report',
          icon: <DateRangeIcon />,
        },
        {
          segment: 'RepeatPointPage',
          title: 'Repeat point',
          icon: <BarChartIcon />,
        },
        {
          segment: 'ListViewPage',
          title: 'List view',
          icon: <TableViewIcon />,
        },
      ]}
      branding={BRANDING}
      theme={theme}
    >
      <Outlet />
    </AppProvider>
  );
}
