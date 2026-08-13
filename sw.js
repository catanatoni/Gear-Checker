const CACHE = 'gear-check-v1-recovered-icons-2';
const ASSETS = ['./', './index.html', './styles.css', './app.js', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png', './icons/cases/VevorMediumStyled.png', './icons/cases/VevorSmallStyled.png', './icons/cases/VevorLargeStyled.png', './icons/cases/ManfrottoRollerStyled.png', './icons/cases/CameraShoulderBag.png', './icons/cases/HardcaseCompact.png', './icons/cases/HardcaseMedium.png', './icons/cases/HardcaseLarge.png', './icons/cases/HardcaseLong.png', './icons/cases/HardcaseLens.png', './icons/cases/HardcaseBattery.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});
