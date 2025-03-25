import DustMeasureCount from '../components/DustMeasureCount';
import DustExceedLoacation from '../components/DustExceedLoacation';
import DustExceedType from '../components/DustExceedType';
import LineChart from '../components/LineChart';
import PieChart from '../components/PieChart';
import TopLocation from '../components/TopLocation';

export default function OverviewPage() {

    return (
        <>
            <h1>Overview Page</h1>
            <div style={{ display: 'flex', gap: '1rem', padding: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', padding: '1rem' }}>
                        <DustMeasureCount />
                        <DustExceedLoacation />
                        <DustExceedType />
                    </div>
                    <LineChart />
                </div>
                <div style={{ display: 'flex', flexDirection:'column', gap: '2rem', padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'center'}}>
                        <PieChart />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <TopLocation />
                    </div>
                </div>
            </div>
        </>
    );
}
