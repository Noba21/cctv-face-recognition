import React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const PieChart = ({
  data,
  dataKey = 'value',
  nameKey = 'name',
  height = 300,
  innerRadius = 60,
  outerRadius = 80,
  showLegend = true,
  showTooltip = true,
  colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'],
  customTooltip,
  label
}) => {
  const RADIAN = Math.PI / 180;
  
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
    name
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-secondary-800 border border-secondary-700 rounded-lg p-3 shadow-xl">
          <p className="text-white font-medium">{data[nameKey]}</p>
          <p className="text-primary-400 mt-1">
            Value: <span className="text-white font-medium">{data[dataKey]}</span>
          </p>
          {data.percentage && (
            <p className="text-secondary-400 text-sm">
              {((data[dataKey] / data.total) * 100).toFixed(1)}% of total
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Calculate total for percentage
  const total = data.reduce((sum, item) => sum + (item[dataKey] || 0), 0);
  const dataWithPercentage = data.map(item => ({
    ...item,
    total,
    percentage: ((item[dataKey] || 0) / total) * 100
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Pie
          data={dataWithPercentage}
          dataKey={dataKey}
          nameKey={nameKey}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          labelLine={false}
          label={label ? renderCustomizedLabel : false}
          animationDuration={1000}
        >
          {dataWithPercentage.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={colors[index % colors.length]}
              stroke="#1f2937"
              strokeWidth={2}
            />
          ))}
        </Pie>
        
        {showTooltip && (
          <Tooltip 
            content={customTooltip || CustomTooltip}
          />
        )}
        
        {showLegend && (
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            wrapperStyle={{
              paddingLeft: '20px',
              color: '#9ca3af'
            }}
            formatter={(value, entry, index) => (
              <span style={{ color: '#9ca3af' }}>{value}</span>
            )}
          />
        )}
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

export default PieChart;