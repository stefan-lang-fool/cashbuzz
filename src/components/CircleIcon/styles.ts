import { makeStyles } from '@material-ui/core/styles';

interface Props {
  color: string;
  height: number;
  width: number;
}

export default makeStyles({
  root: {
    width: '100%',
    border: '1px solid',
    borderRadius: '50%',
    borderColor: (props: Props): string => props.color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,

    '& svg': {
      height: (props: Props): number => props.height,
      width: (props: Props): number => props.width
    }
  }
}, { name: 'circle-icon' });
