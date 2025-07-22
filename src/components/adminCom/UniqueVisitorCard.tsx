import React, { useState } from 'react';

// material-ui
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import MainCard from './MainCard';
import IncomeAreaChart from './IncomeAreaChart';

const UniqueVisitorCard: React.FC = () => {
  const [view, setView] = useState<'monthly' | 'weekly' | 'yearly'>('monthly');

  return (
    <>
      {/* Thay Grid bằng Box flex */}
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h5">Thống kê</Typography>
        <Stack direction="row" sx={{ alignItems: 'center' }}>
          <Button
            size="small"
            onClick={() => setView('yearly')}
            color={view === 'yearly' ? 'primary' : 'secondary'}
            variant={view === 'yearly' ? 'outlined' : 'text'}
          >
            Năm
          </Button>
          <Button
            size="small"
            onClick={() => setView('monthly')}
            color={view === 'monthly' ? 'primary' : 'secondary'}
            variant={view === 'monthly' ? 'outlined' : 'text'}
          >
            Tháng
          </Button>
          <Button
            size="small"
            onClick={() => setView('weekly')}
            color={view === 'weekly' ? 'primary' : 'secondary'}
            variant={view === 'weekly' ? 'outlined' : 'text'}
          >
            Tuần
          </Button>
        </Stack>
      </Box>
      <MainCard content={false} sx={{ mt: 1.5 }}>
        <Box sx={{ pt: 1, pr: 2 }}>
          <IncomeAreaChart view={view} />
        </Box>
      </MainCard>
    </>
  );
};

export default UniqueVisitorCard;
