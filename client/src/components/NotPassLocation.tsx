import { Card, Typography, Box, Stack } from '@mui/material';

function NotPassLocation() {
  return (
    <Card sx={{ backgroundColor: '#f9f9f9', p: 3, mt: 2 }}>
      <Typography variant="h6" gutterBottom align="center">
        Not Pass Location
      </Typography>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        justifyContent="center"
        alignItems="center"
        mt={3}
      >
        <Box textAlign="center">
          <Typography variant="subtitle1" fontWeight="bold">
            Location
          </Typography>
          <Typography>location1</Typography>
        </Box>

        <Box textAlign="center">
          <Typography variant="subtitle1" fontWeight="bold">
            Dust Value (um03)
          </Typography>
          <Typography>101</Typography>
        </Box>

        <Box textAlign="center">
          <Typography variant="subtitle1" fontWeight="bold">
            Status
          </Typography>
          <Typography color="error">Not pass</Typography>
        </Box>
      </Stack>
    </Card>
  );
}

export default NotPassLocation;
