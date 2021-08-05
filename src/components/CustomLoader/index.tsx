import CircularProgress from '@material-ui/core/CircularProgress';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

import defaultSettings from '@/resources/stylings';

let loadingIterator = 0;
let loaderColor = defaultSettings.colors.primary;

interface Props {
  content?: string;
  elementSelector?: string;
  loaderSize?: number;
}

export const loading = ({
  content,
  elementSelector = 'body',
  loaderSize = 40
}: Props = {}): number | null => {
  const element = document.querySelector(elementSelector);

  if (!element) {
    return null;
  }

  const loadingElement = document.createElement('div');
  loadingElement.className = 'custom-loader';
  loadingElement.setAttribute('data-id', loadingIterator.toString());

  element.appendChild(loadingElement);

  ReactDOM.render(
    <>
      <CircularProgress
        size={ loaderSize }
        style={ { color: loaderColor } }
      />
      { content && <div className="custom-loader-content">{ content }</div> }
    </>,
    loadingElement
  );

  // eslint-disable-next-line no-plusplus
  return loadingIterator++;
};

export const closeLoading = (id: number | null): void => {
  if (id === null) {
    return;
  }

  const element = document.querySelector(`.custom-loader[data-id="${id}"]`);

  if (element) {
    element.remove();
  }
};

export const CustomLoaderInit = ({ color }: { color: string }): JSX.Element => {
  useEffect(() => {
    loaderColor = color;
  }, [color]);
  return (<div />);
};
