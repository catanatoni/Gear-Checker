importScripts('https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js');
const CACHE = 'gear-check-v1-ios-badge-v15';
const ASSETS = ['./', './index.html', './styles.css', './app.js', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png', './icons/cases/VevorMediumStyled.png', './icons/cases/VevorMediumStyled-Balanced.png', './icons/cases/VevorSmallStyled.png', './icons/cases/VevorLargeStyled.png', './icons/cases/ManfrottoRollerStyled.png', './icons/cases/CameraShoulderBag.png', './icons/cases/HardcaseCompact.png', './icons/cases/HardcaseMedium.png', './icons/cases/HardcaseLarge.png', './icons/cases/HardcaseLong.png', './icons/cases/HardcaseLens.png', './icons/cases/HardcaseBattery.png', './icons/cases/CarCutoutOpaque.png', './icons/cases/CarTrunkCutoutOpaque.png'];
ASSETS.push('./business.js', './notifications.js', './antonio-backup-2026-08-13.json');
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  const fresh = event.request.mode === 'navigate' || /\.(?:js|css|html)$/.test(url.pathname);
  if (fresh) event.respondWith(fetch(event.request).then(response => {
    const copy=response.clone(); caches.open(CACHE).then(cache=>cache.put(event.request,copy)); return response;
  }).catch(()=>caches.match(event.request)));
  else event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});
self.addEventListener('push', event => {
  if (self.navigator && typeof self.navigator.setAppBadge === 'function') {
    event.waitUntil(self.navigator.setAppBadge(1));
  }
});
