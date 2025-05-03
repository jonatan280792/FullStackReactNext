export const ServicesRoutes = {
  loginMerchants: {
    requiredAuth: false,
    url: `${process.env.URL_WOMPI}/merchants/:secretKey`,
  },
  setTransactions: {
    requiredAuth: true,
    url: `${process.env.URL_WOMPI}/transactions`,
  }
};