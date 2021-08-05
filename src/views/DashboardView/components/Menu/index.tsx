/* eslint-disable max-len */
import {
  Divider,
  List,
  ListItem,
  useTheme
} from '@material-ui/core';
import classnames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useHistory } from 'react-router';

import MenuItem from './components/Item';
import { menuMap } from './menu';
import styles from './styles';
import { MenuLabelsType } from '@/types';
import { usePartnerId } from '@/utils/partnerId';
import { sendMenuEvent } from '@/utils/trackingEvents';

interface Props {
  onClick?: () => void;
}

const Menu = ({ onClick = (): void => {} }: Props): JSX.Element => {
  const { t } = useTranslation();
  const currentLocation = useLocation();
  const history = useHistory();
  const classes = styles();
  const theme = useTheme();
  const partnerId = usePartnerId();

  return (
    <List
      component="nav"
      disablePadding
    >
      {
        theme.custom.menu?.map((item) => menuMap[item])
          .filter((item) => item)
          .map((item, index) => (
            item.isSeparator
              ? <Divider key={ index } />
              : (
                <ListItem
                  key={ index }
                  button
                  className={ classnames({
                    active: `/${currentLocation.pathname.split('/')[1]}` === item.path,
                    [classes.listItem]: true
                  }) }
                  onClick={ async (): Promise<void> => {
                    await sendMenuEvent(partnerId, item.title as MenuLabelsType);

                    onClick();
                    if (`/${currentLocation.pathname.split('/')[1]}` === item.path) {
                      return;
                    }

                    if (item.action) {
                      item.action();
                    } else if (item.path) {
                      history.push(item.path);
                    }
                  } }
                >
                  <MenuItem
                    icon={ item.icon }
                    text={ t(`menu.${item.title}`) }
                  />
                </ListItem>
              )
          ))
      }
    </List>
  );
};

export default Menu;
