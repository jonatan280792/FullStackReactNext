import { toast } from 'react-toastify';

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    position: 'top-right',
    autoClose: 5000,
    theme: 'colored',
  });
};

export const showErrorToast = (message: string) => {
  toast.error(message, {
    position: 'top-right', 
    autoClose: 5000,
    theme: 'colored',
  });
};
