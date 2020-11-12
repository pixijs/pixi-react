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
  code: {
    background: 'rgba(255,255,255,.08)',
    color: 'rgba(255,255,255,0.8)',
    mixBlendMode: 'difference',
    padding: '.2em .4em',
    fontSize: '85%',
    borderRadius: 6,
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
