// ProgressCircle.tsx
import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface ProgressCircleProps {
  percentage: number;
  size?: number;
  color?: string;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({
  percentage,
  size = 100,
  color = '#00aaff',
}) => {
  return (
    <div style={{ width: size, height: size }}>
      <CircularProgressbar
        value={percentage}
        text={`${percentage}%`}
        styles={buildStyles({
          textColor: color,
          pathColor: color,
        })}
        backgroundPadding={6}
      />
    </div>
  );
};

export default ProgressCircle;
