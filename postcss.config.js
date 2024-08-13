import purgecss from '@fullhuman/postcss-purgecss'

export default {
  plugins: [
    purgecss({
      content: ['./**/*.vue', './index.html']
    })
  ]
}