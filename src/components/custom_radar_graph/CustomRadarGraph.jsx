import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

const CustomRadarGraph = ({
  data,
  angleAxisKey = 'category',
  dataKeys = [], // e.g., ['Active', 'Closed', 'Settled']
  colors = {},
  outerRadius = '80%',
}) => {
  if (!data || data.length === 0) return <p>No data available</p>;

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart cx="50%" cy="50%" outerRadius={outerRadius} data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey={angleAxisKey} />
        <PolarRadiusAxis />
        {dataKeys.map((key, index) => (
          <Radar
            key={key}
            name={key}
            dataKey={key}
            stroke={colors[key] || '#9698f6'}
            fill={colors[key] || '#9698f6'}
            fillOpacity={0.6}
          />
        ))}
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default CustomRadarGraph;
