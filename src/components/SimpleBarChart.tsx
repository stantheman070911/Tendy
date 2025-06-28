import React from 'react';

interface ChartData {
  label: string;
  value: number;
}

interface SimpleBarChartProps {
  data: ChartData[];
  title: string;
  valuePrefix?: string;
  color?: string;
}

export const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ 
  data, 
  title, 
  valuePrefix = '$',
  color = '#2E4034' // evergreen
}) => {
  const maxValue = Math.max(...data.map(item => item.value), 0);

  return (
    <div className="chart-container">
      <h4 className="text-2xl font-lora text-evergreen text-center mb-lg">{title}</h4>
      <div className="chart-body">
        {data.map(item => (
          <div key={item.label} className="chart-bar-group">
            <div 
              className="chart-bar" 
              style={{ 
                height: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%`,
                backgroundColor: color
              }}
            >
              <span className="bar-label-top">
                {valuePrefix}{item.value.toLocaleString()}
              </span>
            </div>
            <span className="bar-label-bottom">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};