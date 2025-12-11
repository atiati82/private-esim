/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    autoprefixer: {
      flexbox: false,
      overrideBrowserslist:
        // defaults is: last 2 versions, > 0.2%, not dead - which makes sense for prod
        process.env.NODE_ENV === 'development' ? ['last 1 version', '> 5%'] : ['defaults'],
    },
  },
};

export default config;
