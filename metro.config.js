const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname, {
  isCSSEnabled: true,
});

// Only add necessary customizations
config.transformer.unstable_allowRequireContext = true;
config.maxWorkers = 2;

module.exports = config;