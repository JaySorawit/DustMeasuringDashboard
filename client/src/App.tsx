import SmartToyIcon from '@mui/icons-material/SmartToy';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import BarChartIcon from '@mui/icons-material/BarChart';
import DateRangeIcon from '@mui/icons-material/DateRange';
import TableViewIcon from '@mui/icons-material/TableView';
import { Outlet } from 'react-router-dom';
import { AppProvider } from '@toolpad/core/react-router-dom';

const BRANDING = {
  title: 'Dust Measurement System',
  logo: '',
};

export default function App() {
  return (
    <AppProvider
      navigation={[
        {
          segment: 'RobotCommandPage',
          title: 'Robot command',
          icon: <SmartToyIcon />,
        },
        {
          segment: '',
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
    >
      <Outlet />
    </AppProvider>
  );
}
