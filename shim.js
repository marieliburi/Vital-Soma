// Polyfills essenciais para React Native
import { Buffer } from 'buffer';
import process from 'process';
import net from 'react-native-tcp';
import { WebSocket } from 'react-native-websocket';

// Configurações globais
global.WebSocket = WebSocket;
global.net = net;
global.tls = net;
global.Buffer = Buffer;
global.process = process;

// Polyfill adicional para crypto se necessário
if (typeof global.crypto === 'undefined') {
  global.crypto = {
    getRandomValues: (array) => {
      const randomBytes = require('react-native-randombytes').randomBytes;
      const bytes = randomBytes(array.length);
      for (let i = 0; i < bytes.length; i++) {
        array[i] = bytes[i];
      }
      return array;
    }
  };
}