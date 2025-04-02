const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // [Web-only]: Enables CSS support in Metro.
  isCSSEnabled: true,
});

// Optimize caching
config.cacheStores = [];
config.resetCache = true;

// Optimize transformer
config.transformer = {
  ...config.transformer,
  minifierPath: undefined,
  minifierConfig: undefined,
  unstable_allowRequireContext: true,
  enableBabelRuntime: false,
};

// Reduce the number of workers to minimize memory usage
config.maxWorkers = 2;

module.exports = config;