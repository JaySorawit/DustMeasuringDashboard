import { Card, CardContent, Typography } from '@mui/material'

function TopLocation() {
    return (
        <div>
            <Card variant="outlined" style={{ width: '400px', height: '300px' }}>
            <CardContent style={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6">Top 3 Areas with the Worst Air Quality </Typography>
                <Typography variant="caption"> (location with the highest exceedances in past 7 days) </Typography>
            </CardContent>
            <CardContent style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 1rem' }}>
                <Typography variant="body1">1. Room 1, clean zone, location 002 </Typography>
                <Typography variant="h6">10</Typography>
            </CardContent>
            <CardContent style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 1rem' }}>
                <Typography variant="body1">2. Room 2, clean booth, location 001 </Typography>
                <Typography variant="h6">6</Typography>
            </CardContent>
            <CardContent style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 1rem' }}>
                <Typography variant="body1">3. Room 1, clean zone, location 004 </Typography>
                <Typography variant="h6">5</Typography>
            </CardContent>
            </Card>
        </div>
    )
}

export default TopLocation