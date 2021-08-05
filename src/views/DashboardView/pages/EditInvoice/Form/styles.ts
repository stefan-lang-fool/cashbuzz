import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  root: {
    width: '100%',
    maxWidth: '900px',

    '& .MuiGrid-container:not(:last-of-type)': {
      marginBottom: '16px'
    },

    '& .MuiFormControl-root': {
      width: '100%',
      minWidth: '120px',

      '&.submit': {
        width: 'auto'
      }
    },

    '@media (max-width:600px)': {
      '& .invoice-form-row': {
        flexDirection: 'column',

        '& > *': {
          maxWidth: 'unset'
        }
      }
    }
  },

  buttonsSection: {
    marginTop: 36
  },

  submit: {
    minWidth: 150,
    marginLeft: 24
  },

  sectionTitle: {
    marginBottom: 16
  },

  sectionRemark: {
    margin: '0 0 32px'
  }
}), { name: 'add-new-invoice-form' });
