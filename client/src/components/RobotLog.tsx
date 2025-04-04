import { Card, Typography, Box, Stack } from '@mui/material';

// 🧱 Reusable log entry
interface LogEntryProps {
  time: string;
  location: string;
  message: string;
}

function LogEntry({ time, location, message }: LogEntryProps) {
  return (
    <Box display="flex" gap={1} flexWrap="wrap">
      <Typography variant="body2" color="text.secondary">
        {time}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {location}
      </Typography>
      <Typography variant="body2">{message}</Typography>
    </Box>
  );
}

function RobotLog() {
    return (
      <Card sx={{ backgroundColor: '#f9f9f9', p: 3, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Robot Log
        </Typography>
  
        <Stack spacing={1}>
          <LogEntry time="[time]" location="[location]" message="Measuring Start..." />
          <LogEntry time="[time]" location="[location]" message="Measuring Finish..." />
          <LogEntry time="[time]" location="[location]" message="Result Pass" />
          <LogEntry time="[time]" location="[location2]" message="Going to [Next location]" />
          <LogEntry time="[time]" location="[location2]" message="Measuring Start..." />
          <LogEntry time="[time]" location="[location2]" message="Measuring Finish..." />
          <LogEntry time="[time]" location="[location2]" message="Not pass" />
          <LogEntry time="[time]" location="[location2]" message="Measuring Start..." />
        </Stack>
      </Card>
    );
  }

export default RobotLog;
