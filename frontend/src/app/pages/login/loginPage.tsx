import React, { useEffect, useState, useCallback } from 'react';
import { Button, TextField, FormControl, InputLabel, OutlinedInput, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff, WbSunny, DarkMode } from '@mui/icons-material';
import { useThemeContext } from '@/theme/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { loginUserThunk } from '@/app/store/userSlice';
import { AppDispatch, RootState } from '@/app/store';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorLogin, setErrorLogin] = useState('');

  const { toggleTheme, isDark } = useThemeContext();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { isAuthenticated, errorMessage } = useSelector((state: RootState) => state.user);

  const handleLogin = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUserThunk(email, password));
  }, [email, password, dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/products');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (errorMessage) {
      setErrorLogin(errorMessage);
    }
  }, [errorMessage]);

  return (
    <section className="login">
      <div className="section-theme">
        <IconButton onClick={toggleTheme}>
          {isDark ? <WbSunny /> : <DarkMode />}
        </IconButton>
      </div>

      <div className="login-section">
        <div className="card-login">
          <div className="image-side">
            <img src="https://andres-dev.com/wp-content/uploads/2020/06/Wompi-1280x800.png" alt="server" />
          </div>
          <div className="form-side">
            <h1 className="title">Wompi! Inicia Sesión</h1>

            <div className="pt-4">
               <img src="/vite.svg" alt="programmer" style={{ width: '18%' }} />
             </div>

            <form onSubmit={handleLogin} className="form-login">
              <div className="user-field">
                <TextField
                  label="Correo Electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
              </div>

              <div className="user-field">
                <FormControl fullWidth variant="outlined" margin="normal" required>
                  <InputLabel htmlFor="password">Contraseña</InputLabel>
                  <OutlinedInput
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Contraseña"
                  />
                </FormControl>
              </div>

              {errorLogin && <div className="errorLogin">{errorLogin}</div>}

              <div className="form-submit">
                <Button variant="contained" type="submit" fullWidth>
                  Conectar
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
