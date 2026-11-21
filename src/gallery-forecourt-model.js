import './gallery-forecourt-data.js';
export const GALLERY_FORECOURT=globalThis.window?.CITY_GALLERY_FORECOURT??globalThis.CITY_GALLERY_FORECOURT;
export const galleryForecourtHeight=(x,z)=>GALLERY_FORECOURT.heightAt(x,z);
