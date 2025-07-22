import React from 'react';
import Box from '@mui/material/Box';

// project imports
import getColors, { type ColorName } from '@/utils/getColors';
import { useTheme, type Theme } from '@mui/material';

export interface DotProps {
  color?: ColorName; // <-- Chỉ nhận đúng các giá trị
  size?: number;
  variant?: 'filled' | 'outlined';
  sx?: object;
}

const Dot: React.FC<DotProps> = ({ color = 'primary', size = 8, variant = 'filled', sx }) => {
  const theme = useTheme<Theme>();
  const colors = getColors(theme, color);
  const { main } = colors;

  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        ...(variant === 'outlined'
          ? { border: `1px solid ${main}` }
          : { bgcolor: main }),
        ...sx
      }}
    />
  );
};

export default Dot;
