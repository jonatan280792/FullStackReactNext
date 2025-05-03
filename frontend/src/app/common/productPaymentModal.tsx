import {
  Dialog, DialogTitle, DialogContent, Stepper, Step, StepLabel, Typography,
  Button, Grid, Box, TextField, DialogActions
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/app/store';
import { fetchProductByIdThunk } from '@/app/store/productsSlice';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  productId: string | null;
  onPay: (paymentData: any) => void;
}

const steps = ['Producto', 'Detalles de pago'];

const ProductModal = ({ open, onClose, productId, onPay }: ProductModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { list, loading } = useSelector((state: RootState) => state.products);

  const product = productId ? list.find((p) => p.id === productId) : null;

  const [activeStep, setActiveStep] = useState(0);
  const [paymentData, setPaymentData] = useState({
    customer_email: '',
    phone_number: '',
    reference: '',
  });

  useEffect(() => {
    if (productId && open) {
      dispatch(fetchProductByIdThunk(productId));
    }
  }, [dispatch, productId, open]);

  const handleClose = () => {
    setActiveStep(0);
    setPaymentData({
      customer_email: '', phone_number: '', reference: ''
    });
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      onPay(paymentData);
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Proceso de pago</DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}><StepLabel>{label}</StepLabel></Step>
          ))}
        </Stepper>

        <Box mt={3}>
          {activeStep === 0 && (
            loading ? (
              <Typography align="center">Cargando producto...</Typography>
            ) : product ? (
              <>
                <Grid item alignItems="center">
                  <ShoppingCartIcon fontSize="large" />
                </Grid>
                <Typography variant="h6" align="center" gutterBottom>
                  {product.name}
                </Typography>
                <Typography variant="body2" align="center">
                  {product.description}
                </Typography>
                <Typography
                  variant="h5"
                  align="center"
                  color="primary"
                  fontWeight={600}
                  mt={2}
                >
                  ${parseFloat(product.price).toLocaleString('es-CO')}
                </Typography>
              </>
            ) : (
              <Typography align="center">Producto no disponible</Typography>
            )
          )}

          {activeStep === 1 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Correo electrónico"
                  name="customer_email"
                  type="email"
                  fullWidth
                  required
                  value={paymentData.customer_email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Número de celular (Nequi)"
                  name="phone_number"
                  fullWidth
                  required
                  value={paymentData.phone_number}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Referencia de pago"
                  name="reference"
                  fullWidth
                  required
                  value={paymentData.reference}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose}>Cancelar</Button>
        {activeStep > 0 && <Button onClick={handleBack}>Atrás</Button>}
        <Button
          onClick={handleNext}
          variant="contained"
          color="primary"
          disabled={
            activeStep === 1 &&
            (!paymentData.customer_email || !paymentData.phone_number || !paymentData.reference)
          }
        >
          {activeStep === steps.length - 1 ? 'Pagar' : 'Siguiente'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductModal;
