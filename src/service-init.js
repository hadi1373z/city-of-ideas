import {createHouseServiceBridge} from './service/city-house-service.mjs';
window.CITY_HOUSE_SERVICE=createHouseServiceBridge({lang:window.CITY_I18N?.lang||'en',onStatus:status=>{window.dispatchEvent(new CustomEvent('city-house-service-status',{detail:status}));}});
addEventListener('city-language',event=>window.CITY_HOUSE_SERVICE.setLanguage(event.detail.lang));
addEventListener('pagehide',()=>window.CITY_HOUSE_SERVICE.destroy());
