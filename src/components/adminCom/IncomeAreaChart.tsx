import React, { useState } from 'react';
import { alpha, useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { LineChart } from '@mui/x-charts/LineChart';
import type { LineSeriesType } from '@mui/x-charts';

// const monthlyLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const monthlyLabels = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
const weeklyLabels = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
const yearlyLabels = ['2021', '2022', '2023', '2024', '2025', '2026', '2027'];

const monthlyData1 = [76, 85, 101, 98, 87, 105, 91, 114, 94, 86, 115, 35];
const weeklyData1 = [31, 40, 28, 51, 42, 109, 100];


const monthlyData2 = [110, 60, 150, 35, 60, 36, 26, 45, 65, 52, 53, 41];
const weeklyData2 = [11, 32, 45, 32, 34, 52, 41];

const yearlyData1 = [1000, 1200, 1500, 1700, 2000, 2200, 2500];
const yearlyData2 = [800, 900, 1000, 1100, 1200, 1300, 1400];
type SeriesLabel = 'Đã nhận từ người hiến' | 'Đã hiến';

type LegendItem = {
  label: SeriesLabel;
  color: string;
  visible: boolean;
};

type LegendProps = {
  items: LegendItem[];
  onToggle: (label: SeriesLabel) => void;
};

const Legend: React.FC<LegendProps> = ({ items, onToggle }) => (
  <Stack direction="row" sx={{ gap: 2, alignItems: 'center', justifyContent: 'center', mt: 2.5, mb: 1.5 }}>
    {items.map((item) => (
      <Stack
        key={item.label}
        direction="row"
        sx={{ gap: 1.25, alignItems: 'center', cursor: 'pointer' }}
        onClick={() => onToggle(item.label)}
      >
        <Box sx={{ width: 12, height: 12, bgcolor: item.visible ? item.color : 'grey.500', borderRadius: '50%' }} />
        <Typography variant="body2" color="text.primary">
          {item.label}
        </Typography>
      </Stack>
    ))}
  </Stack>
);

type IncomeAreaChartProps = {
  view: 'monthly' | 'weekly' | 'yearly';
};

const IncomeAreaChart: React.FC<IncomeAreaChartProps> = ({ view }) => {
  const theme = useTheme();

  const [visibility, setVisibility] = useState<Record<SeriesLabel, boolean>>({
    'Đã nhận từ người hiến': true,
    'Đã hiến': true
  });

  // const labels = view === 'monthly' ? monthlyLabels : weeklyLabels; 
  // const data1 = view === 'monthly' ? monthlyData1 : weeklyData1;
  // const data2 = view === 'monthly' ? monthlyData2 : weeklyData2;
  const labels = view === 'monthly' ? monthlyLabels : view === 'weekly' ? weeklyLabels : yearlyLabels;
  const data1 = view === 'monthly' ? monthlyData1 : view === 'weekly' ? weeklyData1 : yearlyData1;
  const data2 = view === 'monthly' ? monthlyData2 : view === 'weekly' ? weeklyData2 : yearlyData2;
  
  const line = theme.palette.divider;

  const toggleVisibility = (label: SeriesLabel) => {
    setVisibility((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  // Đảm bảo type: "line" là string literal
  const chartSeries: (LineSeriesType & { visible: boolean })[] = [
  {
    type: "line" as const,
    data: data1,
    label: 'Đã nhận từ người hiến', // <-- đây là SeriesLabel
    showMark: false,
    area: true,
    id: 'Germany',
    color: theme.palette.primary.light || '',
    visible: visibility['Đã nhận từ người hiến']
  },
  {
    type: "line" as const,
    data: data2,
    label: 'Đã hiến', // <-- đây là SeriesLabel
    showMark: false,
    area: true,
    id: 'UK',
    color: theme.palette.primary.dark || '',
    visible: visibility['Đã hiến']
  }
];


  const axisFontStyle = { fontSize: 10, fill: theme.palette.text.secondary };

  return (
    <>
      <LineChart
        hideLegend
        grid={{ horizontal: true }}
        xAxis={[{ scaleType: 'point', data: labels, disableLine: true, tickLabelStyle: axisFontStyle }]}
        yAxis={[{ disableLine: true, disableTicks: true, tickLabelStyle: axisFontStyle }]}
        height={450}
        margin={{ top: 40, bottom: -5, right: 20, left: 5 }}
        series={chartSeries.filter((s) => s.visible)}
        sx={{
          '& .MuiAreaElement-series-Germany': { fill: "url('#myGradient1')", strokeWidth: 2, opacity: 0.8 },
          '& .MuiAreaElement-series-UK': { fill: "url('#myGradient2')", strokeWidth: 2, opacity: 0.8 },
          '& .MuiChartsAxis-directionX .MuiChartsAxis-tick': { stroke: line }
        }}
      >
        <defs>
          <linearGradient id="myGradient1" gradientTransform="rotate(90)">
            <stop offset="10%" stopColor={alpha(theme.palette.primary.main, 0.4)} />
            <stop offset="90%" stopColor={alpha(theme.palette.background.default, 0.4)} />
          </linearGradient>
          <linearGradient id="myGradient2" gradientTransform="rotate(90)">
            <stop offset="10%" stopColor={alpha(theme.palette.primary.dark, 0.4)} />
            <stop offset="90%" stopColor={alpha(theme.palette.background.default, 0.4)} />
          </linearGradient>
        </defs>
      </LineChart>
      <Legend
        items={chartSeries.map(({ label, color, visible }) => ({
          label: label as SeriesLabel,
          color: color ?? '',    // CHỖ NÀY: đảm bảo luôn là string
          visible
        }))}
        onToggle={toggleVisibility}
      />

    </>
  );
};

export default IncomeAreaChart;
