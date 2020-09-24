export default {
  body: {
    margin: 0,
    padding: 0,
  },
  '.icon-link': {
    display: 'none',
  },
  '.with-overlay': {
    overflow: 'hidden',
  },
  'canvas, img, iframe': {
    maxWidth: '100%',
  },
  'p, ul, ol, table': {
    '@media (max-width: 600px)': {
      fontSize: '85% !important',
    },
  },
  pre: {
    '@media (max-width: 600px)': {
      fontSize: '75% !important',
    },
  },
}
