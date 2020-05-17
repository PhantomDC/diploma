import { useState } from 'react';

export const useDialog = () => {

  const [dialog, setDialog] = useState('');
  const [isError, setIsError] = useState(false);

  const show = (message, error = false) => {
    setDialog(message);
    setIsError(error);
  }

  const clear = () => {
    setDialog('');
    setIsError(false);
  }

  return { show, clear, dialog, isError }
}