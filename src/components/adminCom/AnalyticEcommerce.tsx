import React from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import MainCard from './MainCard';

// Icons
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const iconSX = { fontSize: '0.75rem', color: 'inherit', marginLeft: 0, marginRight: 0 };

interface AnalyticEcommerceProps {
  color?: string;
  title?: string;
  count?: string;
  percentage?: number;
  isLoss?: boolean;
  extra?: string;
}

const AnalyticEcommerce: React.FC<AnalyticEcommerceProps> = ({
  color = 'primary',
  title,
  count,
  percentage,
  isLoss,
  extra
}) => {
  return (
    <MainCard contentSX={{ p: 2.25 }}>
      <Stack sx={{ gap: 0.5 }}>
        <Typography variant="h6" color="text.secondary">
          {title}
        </Typography>
        {/* Dùng Box để thay thế Grid */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h4" color="inherit">
            {count}
          </Typography>
          {percentage !== undefined && (
            <Chip
              variant="filled"
              color={color as any}
              icon={isLoss ? <ArrowDownwardIcon sx={iconSX} /> : <ArrowUpwardIcon sx={iconSX} />}
              label={`${percentage}%`}
              sx={{ ml: 1.25, pl: 1 }}
              size="small"
            />
          )}
        </Box>
      </Stack>
      {/* <Box sx={{ pt: 2.25 }}>
        <Typography variant="caption" color="text.secondary">
          You made an extra{' '}
          <Typography variant="caption" sx={{ color: `${color || 'primary'}.main` }}>
            {extra}
          </Typography>{' '}
          this year
        </Typography>
      </Box> */}
    </MainCard>
  );
};

export default AnalyticEcommerce;
