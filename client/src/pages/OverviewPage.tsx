import DustReport from "../components/DustReport";
import DustTrend from "../components/DustTrend";
import NotPassLocation from "../components/NotPassLocation";
import ProgressStatus from "../components/ProgressStatus";
import RobotLog from "../components/RobotLog";
import RobotMap from "../components/RobotMap";

export default function OverviewPage() {

    return (
        <>
            <div className="overview-container" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
                <div className="left-side">
                    <ProgressStatus />
                    <NotPassLocation />
                    <RobotLog />
                </div>
                <div className="center">
                    <DustTrend />
                    <DustReport />
                </div>
                <div className="right-side">
                    <RobotMap />
                </div>
            </div>
        </>
    );
}
