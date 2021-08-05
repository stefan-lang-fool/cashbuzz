import { List, Paper, Typography } from '@material-ui/core';
import { format, parse, isSameDay, isToday, isYesterday } from 'date-fns';
import React, { useMemo, useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './styles'
import RegiosItem from './components/Item';
import ListItem from './components/ListItem';
import { showNotification } from '@/components/Notification';
import APIService from '@/services/APIService';
import { getCurrentDateFormat } from '@/utils/format';
import { Organization, Transaction } from '@/interfaces';
import 'react-circular-progressbar/dist/styles.css';

const Regios = (): JSX.Element => {
  const classes = styles();
  const { t } = useTranslation();
  const [isStart, start] = useState(true);
  const [selectedRegion, selectRegion] = useState<string>('');
  const [regiosSummary, setRegiosSummary] = useState<any[]>([]);
  const [regios, setRegios] = useState<any[]>([]);

  const organizationsHelper = useRef<{ [key: string]: Organization }>({});
  const transactionsRef = useRef(regios);
  interface SingleTransaction {
    transaction: Transaction;
    organization?: string;
  }

  const grxx = ["grxf", "grxm", "grxh", "grxl", "grxo"]

  const getName = (item: string) => {
    switch (item) {
      case "grxf":
        return "Food";
      case "grxm":
        return "Mobility";
      case "grxh":
        return "Hobbies";
      case "grxl":
        return "Lifestyle";
      case "grxo":
        return "Other";
      default:
        return "";
    }
  }

  const initialize = async () => {
    try {
      const resultData: SingleTransaction[] = [];
      const { data } = await APIService.transaction.getAll(1, 100);
      const regiox = await APIService.regios.get();
      // console.log('data.transactions >>>>', data.transactions);
      
      const missingOrgs: string[] = Array.from(new Set(data.transactions.map((singleTransaction) => singleTransaction.org_id))).filter((id) => id && !organizationsHelper.current[id]) as string[];
      if (missingOrgs.length) {
        const { data: missingOrgsData } = await APIService.description.getOrganizations(missingOrgs);

        missingOrgsData.forEach((singleOrganization) => {
          organizationsHelper.current[singleOrganization.id] = singleOrganization;
        });
      }

      for (const transaction of data.transactions) {
        const tempOrganization = transaction.org_id ? organizationsHelper.current[transaction.org_id] : undefined;
        let organization = transaction.org_id ? organizationsHelper.current[transaction.org_id]?.name : undefined;

        if (tempOrganization?.generic && transaction.counterpartName) {
          organization = transaction.counterpartName;
        }

        resultData.push({
          organization,
          transaction
        });
      }

      transactionsRef.current = [...transactionsRef.current, ...resultData];
      setRegios(transactionsRef.current);

      let arr = new Array(grxx.length);
      grxx.forEach((grx, index) => {
        arr[index] = {};
        arr[index].percent = regiox.data[grx][0];
        arr[index].label = grx;
        arr[index].title = getName(grx);
        arr[index].amount = data.transactions.filter((trans: any) => trans.group_grxx === grx).reduce((val: number, item: any) => item.amount + val, 0);
      });

      setRegiosSummary(arr);
    } catch (err) {
      console.log(err.message);
      showNotification({ content: t('common.internal_error'), type: 'error' });
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  const currentDateFormat = useMemo(() => getCurrentDateFormat(), []);

  const groupedTransactions = useMemo(() => regios.reduce<any[]>((previous, current) => {
    const currentDate = parse(current.transaction.valueDate, 'yyyy-MM-dd', new Date());

    let el = previous.find((singleEl) => isSameDay(singleEl.date, currentDate));
    if (!el) {
      let label = '';
      if (isToday(currentDate)) {
        label = t('time.today');
      } else if (isYesterday(currentDate)) {
        label = t('time.yesterday');
      } else {
        label = format(currentDate, currentDateFormat);
      }
      el = {
        date: currentDate,
        label,
        transactions: []
      };
      previous.push(el);
    }

    el.transactions.push(current);

    return previous;
  }, []), [currentDateFormat, t, regios]);
  
  return (
    <div className={`${classes.root}`}>
      {isStart ?
        <>
          <Typography
            variant="h4"
          >
            { t(`regios.title`) }
          </Typography>
          <Typography
            className={classes.subtitle}
            variant="h6"
          >
            { t('regios.sub_title') }
          </Typography>
          <Paper className={classes.card}>
            <Typography
              variant="h6"
              className={classes.card_title}
            >
              { t('regios.card.title') }
            </Typography>
            <div
              className={classes.start}
              onClick={() => start(false)}
            >
              { t('regios.card.click_here') }
            </div>
          </Paper>
        </>
        :
        (selectedRegion === '' ?
          <>
            <Typography
              variant="h4"
            >
              { t('regios.regional_affinity') }
            </Typography>
            <Typography
              className={classes.subtitle}
              variant="h6"
            >
              { t('regios.expenses_last') }
            </Typography>
            <div>
              {regiosSummary.map((item, index) =>
                <RegiosItem
                  key={index}
                  onSelect={() => selectRegion(item.label)}
                  percent={item.percent}
                  title={item.title}
                  amount={item.amount}
                />
              )}
            </div>
          </>
          :
          <>
            <Typography
              variant="h4"
            >
              { getName(selectedRegion) }
            </Typography>
            <Typography
              className={classes.subtitle}
              variant="h6"
            >
              { t('regios.your_last_expenses') }
            </Typography>
            <div>
              {
                groupedTransactions.map((singleGroup) => (
                  <div
                    key={ singleGroup.date.getTime() }
                  >
                    <Typography className={ classes.transactionGroupTitle }>
                      { singleGroup.label }
                    </Typography>
                    <List className={ classes.transactionGroupList }>
                      { singleGroup.transactions.map((singleTransaction: any) => (
                        <ListItem
                          key={ singleTransaction.transaction.id }
                          organization={ singleTransaction.organization }
                          transaction={ singleTransaction.transaction }
                        />
                      )) }
                    </List>
                  </div>
                ))
              }
            </div>
          </>
        )
      }
    </div>
  );
}

export default Regios;
