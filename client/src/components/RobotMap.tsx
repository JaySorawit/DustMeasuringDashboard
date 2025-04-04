import { Card, Typography, LinearProgress, Box } from '@mui/material';
import Map from '/Map.png';

function RobotMap() {
  // Mock percentage for the progress bar
  const progress = 60; // Change this value as needed

  return (
    <Card sx={{ backgroundColor: '#f9f9f9', p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Robot Monitor
      </Typography>

      {/* Progress Bar */}
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Progress: {progress}%
        </Typography>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 15, // Thicker progress bar
            borderRadius: 5, // Rounded corners
          }}
        />
      </Box>

      {/* Map Image */}
      <Box sx={{ textAlign: 'center' }}>
        <img src={Map} alt="Robot Map" style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }} />
      </Box>
    </Card>
  );
}

export default RobotMap;
