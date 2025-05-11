import { createClient } from '@supabase/supabase-js';
import { WebSocket } from 'react-native-websocket';

// Patch global para módulos necessários
if (typeof global.WebSocket === 'undefined') {
  global.WebSocket = WebSocket;
}

if (typeof global.net === 'undefined') {
  global.net = require('react-native-tcp');
}

const supabaseUrl = 'https://tawiuodyookyckzfbfdt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhd2l1b2R5b29reWNremZiZmR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NjY3ODYsImV4cCI6MjA2MDA0Mjc4Nn0.WF4pDuGX_ywwZXzQRm6PV1HsqhpO9UtgG2jcTgmN-eo';
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    websocketImplementation: WebSocket,
    heartbeatIntervalMs: 30000,
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});
/*import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tawiuodyookyckzfbfdt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhd2l1b2R5b29reWNremZiZmR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NjY3ODYsImV4cCI6MjA2MDA0Mjc4Nn0.WF4pDuGX_ywwZXzQRm6PV1HsqhpO9UtgG2jcTgmN-eo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Exporte como default também para compatibilidade
export default supabase;*/
