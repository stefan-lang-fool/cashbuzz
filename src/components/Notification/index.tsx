import Alert from '@material-ui/lab/Alert';
import React, { ReactNode } from 'react';
import { toast } from 'react-toastify';

type NotificationType = 'success' | 'error' | 'warning';

interface Props {
  content: string | ReactNode;
  duration?: number | false;
  onClick?: () => void;
  onClose?: () => void;
  type?: NotificationType;
  width?: number;
}

interface ToastContentFunctionParams {
  closeToast: () => void;
}

// eslint-disable-next-line import/prefer-default-export
export const showNotification = ({
  content,
  duration = 5000,
  onClick,
  onClose = (): void => {},
  type
}: Props): React.ReactText => toast(({ closeToast }: ToastContentFunctionParams) => (
  <div
    className="notification-message"
  >
    <Alert
      onClose={ (): void => {
        onClose();

        closeToast();
      } }
      severity={ type }
      variant="filled"
    >
      { content }
    </Alert>
  </div>
), {
  autoClose: duration,
  className: type && `${type}`,
  closeButton: false,
  closeOnClick: false,
  draggable: false,
  hideProgressBar: true,
  onClick,
  position: 'top-center'
});
