import React from 'react';
import { useTheme } from '@mui/material/styles';
import { BarChart } from '@mui/x-charts/BarChart';

// XLabels có thể là các ngày trong tuần
const xLabels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

interface WeeklyEventsChartProps {
  data?: number[]; // Định nghĩa prop 'data' là một mảng số
}

// ==============================|| WEEKLY EVENTS CHART ||============================== //

const WeeklyEventsChart: React.FC<WeeklyEventsChartProps> = (props) => {
  const theme = useTheme();
  const axisFontStyle = { fontSize: 10, fill: theme.palette.text.secondary };

  return (
    <BarChart
      hideLegend
      height={380}
      series={[{ data: props.data, label: 'Số lượng người' }]}
      xAxis={[
        {
          data: xLabels,
          scaleType: 'band',
          disableLine: true,
          disableTicks: true,
          tickLabelStyle: axisFontStyle,
        },
      ]}
      yAxis={[{ position: 'none' }]}
      slotProps={{ bar: { rx: 5, ry: 5 } }}
      axisHighlight={{ x: 'none' }}
      margin={{ left: 20, right: 20 }}
      colors={[theme.palette.info.light ?? '#90caf9']}
      sx={{ '& .MuiBarElement-root:hover': { opacity: 0.6 } }}
    />
  );
};

export default WeeklyEventsChart;
