import { MantineThemeOverride } from '@mantine/core';

export const theme: MantineThemeOverride = {
  colorScheme: 'dark',
  fontFamily: 'Inter',
  shadows: { sm: '0.0926vh 0.0926vh 0.2778vh rgba(0, 0, 0, 0.5)' },
  components: {
    Button: {
      styles: {
        root: {
          border: 'none',
        },
      },
    },
  },
};
