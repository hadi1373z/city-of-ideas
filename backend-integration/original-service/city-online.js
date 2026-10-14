// Copy to worker/city-online.js in the original House checkout.
import {createOnlineWorker} from './online.js';
import {withCityBridge} from './city-bridge-worker.js';
export default withCityBridge(createOnlineWorker());
