/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
module.exports = ctx => {
  const config = {
    map: ctx.options.map,
    plugins: [
      require('postcss-import')(),
      require('postcss-mixins')(),
      require('postcss-nested')(),
    ],
  };
  if (ctx.env === 'production') {
    // config.plugins.push(
    //   require('cssnano')({
    //     preset: [
    //       'default',
    //       {
    //         discardComments: { removeAll: true },
    //         minifyFontValues: { removeQuotes: false },
    //       },
    //     ],
    //   })
    // );
  }
  return config;
};
