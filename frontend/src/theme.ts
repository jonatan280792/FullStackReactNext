import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light', // Cambiar entre 'light' y 'dark' para alternar el tema
    primary: {
      main: '#6200ea',
    },
    secondary: {
      main: '#03dac5',
    },
  },
});

export default theme;
