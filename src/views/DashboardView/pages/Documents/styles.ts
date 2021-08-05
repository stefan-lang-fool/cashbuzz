import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
  root: {
    width: '100%'
  },

  section: {
    '&:not(:last-of-type)': {
      marginBottom: 32
    }
  },

  sectionTitle: {
    marginBottom: 32
  },

  sectionSubTitle: {
    marginBottom: 24
  },

  uploadDropZone: {
    minHeight: 'unset',
    outline: 'none',
    padding: 16,

    '& .MuiDropzoneArea-text': {
      margin: '0 0 24px'
    }
  },

  uploadPreviewList: {
    width: '100%',
    margin: 0
  },

  uploadPreviewListSingle: {
    padding: '8px 8px 8px 24px !important',
    position: 'relative',

    '&::before': {
      content: '"•"',
      display: 'block',
      position: 'absolute',
      left: 10,
      top: 10
    },

    '& .MuiDropzonePreviewList-image': {
      display: 'none'
    },

    '& .MuiTypography-body1': {
      textAlign: 'left'
    }
  },

  uploadButton: {
    marginTop: 16,
    minWidth: 150
  }
}, { name: 'documents' });
