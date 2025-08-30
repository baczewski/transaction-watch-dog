import { JsonRpcProvider, WebSocketProvider } from 'ethers';
import config from './config.js';

export function createBlockchainProviders() {
    const INFURA_PROJECT_ID = config.get('infuraProjectId');
    
    if (!INFURA_PROJECT_ID) {
        throw new Error('INFURA_PROJECT_ID environment variable is required');
    }

    const httpProvider = new JsonRpcProvider(
        `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`
    );

    const wsProvider = new WebSocketProvider(
        `wss://mainnet.infura.io/ws/v3/${INFURA_PROJECT_ID}`
    );

    return { httpProvider, wsProvider };
}