import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress } from '@mui/material';

interface DataTableProps {
    data: {
        measurement_date: string;
        measurement_time: string;
        location_id: string;
        dust_value: number;
        dust_type: string 
    }[];
    loading: boolean;
}

const DataTable: React.FC<DataTableProps> = ({ data, loading }) => {
    if (loading) {
        return <CircularProgress />;
    }

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Time</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Dust Value</TableCell>
                        <TableCell>Dust Type</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, index) => (
                        <TableRow key={index}>
                            <TableCell>{row.measurement_date}</TableCell>
                            <TableCell>{row.measurement_time}</TableCell>
                            <TableCell>{row.location_id}</TableCell>
                            <TableCell>{row.dust_value}</TableCell>
                            <TableCell>{row.dust_type}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default DataTable;
