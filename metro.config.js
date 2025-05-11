const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Configuração completa de polyfills
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  'http': require.resolve('stream-http'),
  'https': require.resolve('https-browserify'),
  'stream': require.resolve('stream-browserify'),
  'net': require.resolve('react-native-tcp'),
  'tls': require.resolve('react-native-tcp'),
  'crypto': require.resolve('react-native-crypto'),
  'ws': require.resolve('react-native-websocket'),
  'zlib': require.resolve('browserify-zlib'),
};

// Bloqueia explicitamente módulos problemáticos
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const blockedModules = ['http', 'https', 'net', 'tls', 'ws'];
  if (blockedModules.includes(moduleName)) {
    return {
      filePath: require.resolve('react-native-websocket'),
      type: 'sourceFile',
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;

/*const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Configuração para resolver o problema do 'ws'
const extraNodeModules = {
  ...config.resolver.extraNodeModules,
  'events': require.resolve('events/'),
  'stream': require.resolve('stream-browserify'),
  'ws': require.resolve('react-native-websocket'),
  'missing-asset-registry-path': path.resolve(__dirname, 'node_modules/expo-router/assets')
};

// Configuração completa
config.resolver = {
  ...config.resolver,
  assetExts: [
    ...config.resolver.assetExts.filter(ext => ext !== 'svg'),
    'png',
    'jpg',
    'jpeg',
    'gif'
  ],
  sourceExts: [
    ...config.resolver.sourceExts,
    'svg',
    'ts',
    'tsx',
    'jsx',
    'cjs'
  ],
  extraNodeModules,
  resolverMainFields: ['react-native', 'browser', 'main'],
};

config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
  minifierPath: 'metro-minify-terser',
};

module.exports = config;*/