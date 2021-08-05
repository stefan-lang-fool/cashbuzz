import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
  root: {
  },
  sectionTitle: {
    marginBottom: 32,
    wordBreak: 'break-word'
  },
  pickerSection: {
    marginBottom: 24,

    '& > *:not(:last-child)': {
      marginRight: 8
    }
  },
  chartsSection: {
    marginBottom: '40px',

    '&-single': {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',

      '& .chart-block': {
        marginTop: 'auto',

        '& .sunburst-chart': {
          alignSelf: 'center',
          margin: '0 auto',

          '&-info': {
            marginBottom: 36,
            minHeight: 100,

            '@media (max-width:1720px)': {
              marginBottom: 56
            },

            '@media (max-width:1340px)': {
              marginBottom: 76
            }
          },

          '@media (max-width:780px)': {
            '&-title': {
              textAlign: 'center',
              width: '100%',
              left: 0
            }
          }
        },

        '@media (max-width:1100px)': {
          flexDirection: 'column-reverse'
        }
      }
    },

    '@media (max-width:780px)': {
      flexDirection: 'column',

      '& > *': {
        maxWidth: 'unset'
      }
    }
  },

  chartSectionTitle: {
    marginBottom: 16,
    wordBreak: 'break-word'
  }
}, { name: 'affinities' });
