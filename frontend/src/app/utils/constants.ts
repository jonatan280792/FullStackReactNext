export const ServicesRoutes = {
  loginUser: {
    requiredAuth: false,
    url: `${import.meta.env.VITE_URL_REST}/users/login`,
  },
  getProducts: {
    requiredAuth: true,
    url: `${import.meta.env.VITE_URL_REST}/products`,
  },
  getProductById: {
    requiredAuth: true,
    url: `${import.meta.env.VITE_URL_REST}/products/:id`,
  },
  setTransactions: {
    requiredAuth: true,
    url: `${import.meta.env.VITE_URL_REST}/transactions`,
  }
};
