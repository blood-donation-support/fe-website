

// Nếu dùng thêm custom palette, mở rộng type nếu cần

import type { PaletteColor, Theme } from "@mui/material";

export type ColorName = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';

export default function getColors(theme: Theme, color: ColorName = 'primary'): PaletteColor {
  switch (color) {
    case 'secondary':
      return theme.palette.secondary;
    case 'error':
      return theme.palette.error;
    case 'warning':
      return theme.palette.warning;
    case 'info':
      return theme.palette.info;
    case 'success':
      return theme.palette.success;
    default:
      return theme.palette.primary;
  }
}
