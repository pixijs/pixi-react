const path = require('path')

// DOCZ
// prevent compiling pixi and src files during SSR

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === 'develop-html' || stage === 'build-html') {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /pixi\.js/,
            use: loaders.null(),
          },
          {
            test: path.resolve(__dirname, '../src'),
            use: loaders.null(),
          },
        ],
      },
    })
  }
}
