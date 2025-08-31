import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { WS_CONFIG } from './config/ws.config';
declare global {
    interface Window {
        Pusher: typeof Pusher;
        Echo: Echo<any>;
    }
}

window.Pusher = Pusher;
window.Echo = new Echo({
    broadcaster: 'reverb',
    key: WS_CONFIG.PUSHER_KEY,
    wsHost: WS_CONFIG.WS_HOST ?? window.location.hostname,
    wsPort: parseInt(WS_CONFIG.WS_PORT ?? '80'),
    wssPort: parseInt(WS_CONFIG.WS_PORT ?? '443'),
    forceTLS: (WS_CONFIG.WS_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
});