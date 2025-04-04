import { Card, Typography, Box, Stack } from '@mui/material';

function DustReport() {
  // Mock data for locations (20 items for demonstration)
  const locations = Array.from({ length: 20 }, (_, index) => ({
    location: `Location ${index + 1}`,
    dustValue: 100 + Math.floor(Math.random() * 50), // Random dust value
    status: index % 2 === 0 ? 'Pass' : 'Not pass', // Alternate between pass and not pass
  }));

  return (
    <Card sx={{ backgroundColor: '#f9f9f9', p: 3, mt: 2 }}>
      <Typography variant="h6" gutterBottom align="center">
        Dust Report
      </Typography>

      {/* Scrollable Container for Dust Report */}
      <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
        <Stack spacing={2}>
          {/* Show header once, aligned to the left */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="flex-start"
            alignItems="flex-start"
            sx={{ marginBottom: 2 }}
          >
            <Box sx={{ width: '30%' }}>
              <Typography variant="subtitle1" fontWeight="bold" textAlign="left">
                Location
              </Typography>
            </Box>

            <Box sx={{ width: '30%' }}>
              <Typography variant="subtitle1" fontWeight="bold" textAlign="left">
                Dust Value
              </Typography>
            </Box>

            <Box sx={{ width: '30%' }}>
              <Typography variant="subtitle1" fontWeight="bold" textAlign="left">
                Status
              </Typography>
            </Box>
          </Stack>

          {/* Data Rows */}
          {locations.map((item, index) => (
            <Stack
              key={index}
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="flex-start"
              alignItems="flex-start"
            >
              {/* Location */}
              <Box sx={{ width: '30%' }}>
                <Typography>{item.location}</Typography>
              </Box>

              {/* Dust Value */}
              <Box sx={{ width: '30%' }}>
                <Typography>{item.dustValue}</Typography>
              </Box>

              {/* Status */}
              <Box sx={{ width: '30%' }}>
                <Typography color={item.status === 'Not pass' ? 'error' : 'success'}>
                  {item.status}
                </Typography>
              </Box>
            </Stack>
          ))}
        </Stack>
      </Box>
    </Card>
  );
}

export default DustReport;
