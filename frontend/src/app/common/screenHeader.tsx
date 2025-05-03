import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useAppSelector } from '@/app/store/hooks';

interface ScreenHeaderProps {
  onToggleTheme: () => void;
  onLogout: () => void;
  isDarkTheme: boolean;
}

const ScreenHeader = ({ onToggleTheme, onLogout, isDarkTheme }: ScreenHeaderProps) => {
  const userLogin = useAppSelector((state) => state.user.userData);

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Bienvenido: {userLogin?.name}
        </Typography>
        <IconButton color="inherit" onClick={onToggleTheme}>
          {isDarkTheme ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        <IconButton color="inherit" onClick={onLogout}>
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default ScreenHeader;
