module.exports = function override(config, env) {
  // Ensure that the resolve object exists in the config
  config.resolve = config.resolve || {};

  // Set up the fallbacks for the required modules
  config.resolve.fallback = {
    ...(config.resolve.fallback || {}), // Spread the existing fallback configuration if it exists
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    http: require.resolve('stream-http'), // Existing fallback for http
    https: require.resolve('https-browserify'), // Add this line for https
    zlib: require.resolve('browserify-zlib'),   // Add this line for zlib
    url: require.resolve('url/'),              // Add this line for url
  };

  return config;
};
