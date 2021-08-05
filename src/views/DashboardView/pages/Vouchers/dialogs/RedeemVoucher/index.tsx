import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Typography
} from '@material-ui/core';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './styles';
import DialogTitle from '@/components/DialogTitle';
import { Voucher } from '@/interfaces';

type PartnerPolicyFormData = {
  privacyPolicyAcceptance: boolean;
};

interface Props {
  isOpened: boolean;
  onClose?: () => void | Promise<void>;
  onSubmit?: () => void | Promise<void>;
  voucher?: Voucher;
}

const RedeemVoucherDialog = ({
  isOpened,
  onClose = (): void => {},
  onSubmit = (): void => {},
  voucher
}: Props): JSX.Element => {
  const classes = styles();
  const { t } = useTranslation();

  const [voucherData, setVoucherData] = useState(voucher);

  const dialogContentRef = useRef<HTMLElement>();

  const copyVoucherCode = useCallback((): void => {
    if (!dialogContentRef.current || !voucherData?.code) {
      return;
    }

    const tempInput = document.createElement('input');
    tempInput.type = 'text';
    tempInput.value = voucherData.code;

    dialogContentRef.current.appendChild(tempInput);

    tempInput.select();
    tempInput.setSelectionRange(0, 99999);

    document.execCommand('copy');
    dialogContentRef.current.removeChild(tempInput);
  }, [voucherData]);

  const onDialogClose = useCallback(async (): Promise<void> => {
    await onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpened) {
      setVoucherData(voucher);
    }
  }, [isOpened, voucher]);

  return (
    <Dialog
      className={ classes.root }
      onClose={ onDialogClose }
      open={ isOpened }
      PaperProps={ {
        className: classes.paper
      } }
    >
      <DialogTitle
        onClose={ onDialogClose }
        title={ t('vouchers.redeem_voucher_dialog.title') }
      />
      <DialogContent
        ref={ dialogContentRef }
        dividers
      >
        <Grid
          alignItems="center"
          container
          direction="column"
        >
          <Grid
            item
          >
            <img
              alt="voucher-logo"
              src={ voucherData?.logoPath }
            />
          </Grid>
          <Grid
            item
          >
            <Typography
              align="center"
              style={ { fontWeight: 'bold', fontSize: '18px' } }
              variant="h6"
            >
              { voucherData?.voucherText }
            </Typography>
          </Grid>
          { voucherData?.code && (
            <div className="voucher-code-section">
              <Typography
                style={ { fontWeight: 'bold' } }
                variant="h4"
              >
                { t('vouchers.redeem_voucher_dialog.voucher_code') }
                :
              </Typography>
              <Typography variant="h5">
                { voucherData?.code }
              </Typography>
            </div>
          ) }
        </Grid>
      </DialogContent>
      <DialogActions className={ `${classes.actions} ${voucherData?.code ? 'with-code' : ''}` }>
        <Button
          onClick={ onDialogClose }
          size="large"
          variant="contained"
        >
          { t('common.cancel') }
        </Button>
        { voucherData?.code && (
          <Button
            onClick={ (): void => { copyVoucherCode(); } }
            size="large"
            variant="contained"
          >
            { t('vouchers.redeem_voucher_dialog.copy_code') }
          </Button>
        ) }
        <Button
          color="primary"
          onClick={ (): void => {
            if (voucherData?.code) {
              copyVoucherCode();
            }

            onSubmit();
          } }
          size="large"
          variant="contained"
        >
          { voucherData?.code ? t('vouchers.redeem_voucher_dialog.copy_and_redeem') : t('common.redeem') }
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RedeemVoucherDialog;
