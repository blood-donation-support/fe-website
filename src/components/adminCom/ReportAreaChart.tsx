import React from 'react';
import { useTheme } from '@mui/material/styles';
import { chartsGridClasses, LineChart } from '@mui/x-charts';

const data = [58, 115, 28, 83, 63, 75, 35];
const labels = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// ==============================|| REPORT AREA CHART ||============================== //

const ReportAreaChart: React.FC = () => {
  const theme = useTheme();
  const axisFontStyle = { fill: theme.palette.text.secondary };

  return (
    <LineChart
      hideLegend
      grid={{ horizontal: true }}
      xAxis={[
        {
          data: labels,
          scaleType: 'point',
          disableLine: true,
          disableTicks: true,
          tickLabelStyle: axisFontStyle
        }
      ]}
      yAxis={[{ position: 'none', tickMaxStep: 10 }]}
      series={[
        {
          data,
          showMark: false,
          id: 'ReportAreaChart',
          color: theme.palette.warning.main ?? '#ffa726',
          label: 'Series 1'
        }
      ]}
      height={340}
      margin={{ top: 30, bottom: 25, left: 20, right: 20 }}
      sx={{
        '& .MuiLineElement-root': { strokeWidth: 1 },
        [`& .${chartsGridClasses.line}`]: { strokeDasharray: '5 3' }
      }}
    />
  );
};

export default ReportAreaChart;
