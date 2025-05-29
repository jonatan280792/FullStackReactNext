import { useEffect, useState, useMemo } from 'react';
import {
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Container,
  CircularProgress,
  Box,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  clearTransactionState,
  createTransactionThunk,
  fetchProductsThunk,
} from '@/app/store/productsSlice';
import ScreenHeader from '@/app/common/screenHeader';
import ProductModal from '@/app/common/productPaymentModal';
import { showSuccessToast } from '@/app/utils/toastUtils';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '@/theme/ThemeContext';

const ProductsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [loadingTransaction, setLoadingTransaction] = useState(false);

  const { toggleTheme, isDark } = useThemeContext();

  const { list: productsList, loading, transactionSuccess } = useAppSelector(
    (state) => state.products
  );

  const memoizedProducts = useMemo(() => productsList, [productsList]);

  useEffect(() => {
    dispatch(fetchProductsThunk());
  }, [dispatch]);

  const handleLogout = () => {
    navigate('/', { replace: true });
    sessionStorage.clear();
  };

  useEffect(() => {
    if (transactionSuccess && selectedProduct) {
      showSuccessToast('¡Transacción realizada con éxito!');
      setSelectedProduct(null);
      setLoadingTransaction(false);
      dispatch(clearTransactionState());
    }
  }, [transactionSuccess, selectedProduct, dispatch]);

  const handlePay = (paymentData: any) => {
    if (!selectedProduct) return;

    const payload = {
      ...paymentData,
      product_id: selectedProduct.id,
      price: selectedProduct.price,
      name: selectedProduct.name,
      email: paymentData.customer_email,
    };

    setLoadingTransaction(true);  // Empieza a cargar

    dispatch(createTransactionThunk(payload));
  };

  return (
    <>
      <ScreenHeader
        onToggleTheme={toggleTheme}
        onLogout={handleLogout}
        isDarkTheme={isDark}
      />

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container justifyContent="space-between" alignItems="center" mb={3}>
          <Grid item>
            <Typography variant="h4" fontWeight={700}>
              Gestor de productos
            </Typography>
          </Grid>
        </Grid>

        {loading ? (
          <Typography variant="body1" mt={4}>
            Cargando productos...
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {memoizedProducts.map((product: any, idx: number) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Card elevation={4}>
                  <CardContent>
                    <Typography
                      variant="h6"
                      align="center"
                      fontWeight={600}
                      gutterBottom
                    >
                      {product.name}
                    </Typography>
                    <Grid
                      container
                      spacing={2}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Grid item>
                        <ShoppingCartIcon fontSize="large" />
                      </Grid>
                    </Grid>

                    <Typography variant="body2" align="center" mt={2}>
                      {product.description}
                    </Typography>
                    <Typography
                      variant="h6"
                      align="center"
                      fontWeight={700}
                      color="primary"
                      mt={2}
                    >
                      Total: ${parseFloat(product.price + product.priceIva).toLocaleString('es-CO')}
                    </Typography>


                    <Typography variant="body2" align="center" mt={2}>
                      Iva.
                      ${parseFloat(product.priceIva).toLocaleString('es-CO')}
                    </Typography>

                    <Typography variant="body2" align="center" mt={2}>
                      Valor sin iva:
                      ${parseFloat(product.price).toLocaleString('es-CO')}
                    </Typography>

                    <Grid container spacing={2} mt={2} justifyContent="center">
                      <Grid item xs={12}>
                        <Button
                          variant="contained"
                          color="success"
                          fullWidth
                          startIcon={<ShoppingCartIcon />}
                          onClick={() => setSelectedProduct(product)}
                        >
                          Comprar
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Spinner de carga mientras se hace la transacción */}
        {loadingTransaction && (
          <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '200px',
            position: 'fixed',  // Fijar en pantalla
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo oscuro
            zIndex: 9999,  // Asegurarse que esté encima
          }}
        >
            <CircularProgress />
          </Box>
        )}
      </Container>

      <ProductModal
        open={Boolean(selectedProduct)}
        productId={selectedProduct?.id}
        onClose={() => setSelectedProduct(null)}
        onPay={handlePay}
      />
    </>
  );
};

export default ProductsPage;
