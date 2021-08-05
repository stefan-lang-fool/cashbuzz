/* eslint-disable import/prefer-default-export */
import { differenceInCalendarDays } from 'date-fns';

import { FIN_API_STATUSES } from '@/constants/statuses';
import { Account } from '@/interfaces';

const ACCOUNT_RESYNC_WARNING_PERIOD = 7;

// TODO: THIS WAS SKIPPED FOR NOW
export const shouldResync = (account: Account): boolean => {
  const bankInterface = account.interfaces[0];

  if (!bankInterface) {
    return false;
  }

  // If bank account has incorrect status or too many days have passed since the last successful update
  if (
    !bankInterface.lastSuccessfulUpdate
    || bankInterface.status === FIN_API_STATUSES.downloadFailed
    || bankInterface.status === FIN_API_STATUSES.deprecated
    || differenceInCalendarDays(
      new Date(),
      new Date(bankInterface.lastSuccessfulUpdate)
    ) > ACCOUNT_RESYNC_WARNING_PERIOD
  ) {
    return true;
  }

  return false;
};
