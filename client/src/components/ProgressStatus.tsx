import { Card, CardContent, Typography, Box, Stack } from '@mui/material';
import ProgressCircle from './ProgressCircle';

function ProgressStatus() {
    return (
        <Card sx={{ backgroundColor: '#f9f9f9' }}>
            <CardContent>
                <Typography variant="h5" align="center" gutterBottom>
                    Progress Status
                </Typography>

                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={4}
                    justifyContent="center"
                    alignItems="center"
                    flexWrap="wrap"
                >
                    <Box textAlign="center">
                        <ProgressCircle percentage={50} size={100} color="#4A90E2" />
                        <Box mt={1}>
                            <Typography variant="subtitle2" color="textSecondary">
                                Overview
                            </Typography>
                        </Box>
                    </Box>

                    <Box textAlign="center">
                        <ProgressCircle percentage={75} size={100} color="#27AE60" />
                        <Box mt={1}>
                            <Typography variant="subtitle2" color="textSecondary">
                                Pass
                            </Typography>
                        </Box>
                    </Box>

                    <Box textAlign="center">
                        <ProgressCircle percentage={25} size={100} color="#E74C3C" />
                        <Box mt={1}>
                            <Typography variant="subtitle2" color="textSecondary">
                                Fail
                            </Typography>
                        </Box>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
}

export default ProgressStatus;
