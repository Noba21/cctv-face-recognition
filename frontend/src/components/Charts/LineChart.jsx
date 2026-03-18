import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const LineChart = ({
  data,
  lines = [],
  xAxisDataKey = 'name',
  height = 300,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
  customTooltip,
  margin = { top: 20, right: 30, left: 20, bottom: 5 }
}) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-secondary-800 border border-secondary-700 rounded-lg p-3 shadow-xl">
          <p className="text-white font-medium mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-secondary-300">{entry.name}:</span>
              <span className="text-white font-medium">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data} margin={margin}>
        {showGrid && (
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#374151" 
            vertical={false}
          />
        )}
        
        <XAxis 
          dataKey={xAxisDataKey} 
          stroke="#9ca3af"
          tick={{ fill: '#9ca3af', fontSize: 12 }}
          tickLine={{ stroke: '#4b5563' }}
        />
        
        <YAxis 
          stroke="#9ca3af"
          tick={{ fill: '#9ca3af', fontSize: 12 }}
          tickLine={{ stroke: '#4b5563' }}
        />
        
        {showTooltip && (
          <Tooltip 
            content={customTooltip || CustomTooltip}
            cursor={{ stroke: '#4b5563', strokeWidth: 1 }}
          />
        )}
        
        {showLegend && (
          <Legend 
            wrapperStyle={{
              paddingTop: '20px',
              color: '#9ca3af'
            }}
          />
        )}
        
        {lines.map((line, index) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            name={line.name || line.dataKey}
            stroke={line.color || colors[index % colors.length]}
            strokeWidth={line.strokeWidth || 2}
            dot={line.dot !== false}
            activeDot={{ r: 8 }}
            animationDuration={1000}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;