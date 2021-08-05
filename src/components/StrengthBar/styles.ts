import { makeStyles } from '@material-ui/core/styles';

export type barData = {
  color: string;
  message: string;
}

const styles = (data: Array<barData>): Record<string, string> => {
  const dataObject = data.reduce((previousValue, currentValue, index) => ({
    ...previousValue,
    [`&.index-${index}`]: {
      color: currentValue.color
    },
    [`&.index-${index} .bar.selected`]: {
      backgroundColor: currentValue.color
    }
  }), {});

  return makeStyles({
    root: {
      '& .message': {
        marginBottom: '8px',
        fontSize: '12px',
        textAlign: 'right'
      },

      ...dataObject,

      '&:not(.show-score)': {
        '& .message': {
          visibility: 'hidden'
        },

        '& .bar': {
          backgroundColor: '#DDD !important'
        }
      }
    },
    list: {
      display: 'grid',
      gridTemplateColumns: `repeat(${data.length}, 1fr)`,
      gridGap: '8px',
      position: 'relative',

      '& .bar': {
        backgroundColor: '#DDD',
        borderRadius: '8px',
        height: '4px'
      }
    }
  }, { name: 'strength-bar' })();
};

export default styles;
