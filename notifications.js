const ONESIGNAL_APP_ID = '235c0b1a-654b-4ba4-b23b-dca951f21105';
let oneSignalClient = null;

function pushDeviceId() {
  let id = localStorage.getItem('gear-check-push-device');
  if (!id) {
    id = `toni-${uid()}`;
    localStorage.setItem('gear-check-push-device', id);
  }
  return id;
}

function renderPushStatus(message, enabled = false, canEnable = true) {
  const card = document.getElementById('pushCard');
  if (!card) return;
  card.classList.toggle('ready', enabled);
  card.innerHTML = `<div><h3>Notificări pe iPhone</h3><p class="muted">${escapeHtml(message)}</p></div>${canEnable ? `<button class="${enabled ? 'primary' : 'secondary'}" onclick="enablePushNotifications()">${enabled ? 'Active ✓' : 'Activează'}</button>` : ''}`;
}

async function refreshPushStatus() {
  if (!oneSignalClient) return renderPushStatus('OneSignal se inițializează…');
  const permission = oneSignalClient.Notifications.permission;
  const optedIn = oneSignalClient.User.PushSubscription.optedIn;
  if (permission && optedIn) renderPushStatus('Push activ pe acest iPhone.', true);
  else if ('Notification' in window && Notification.permission === 'denied') renderPushStatus('Blocate în iOS. Activează-le din Settings → Notifications → Gear Check.', false, false);
  else renderPushStatus('Apasă Activează, apoi Allow.', false);
}

async function enablePushNotifications() {
  if (!oneSignalClient) return alert('OneSignal încă se încarcă. Încearcă din nou peste câteva secunde.');
  try {
    await oneSignalClient.Notifications.requestPermission();
    await oneSignalClient.User.PushSubscription.optIn();
    await refreshPushStatus();
  } catch (error) {
    alert('Notificările nu au putut fi activate. Deschide aplicația din iconița de pe Home Screen.');
  }
}

window.OneSignalDeferred = window.OneSignalDeferred || [];
window.OneSignalDeferred.push(async function (OneSignal) {
  await OneSignal.init({
    appId: ONESIGNAL_APP_ID,
    serviceWorkerPath: 'Gear-Checker/sw.js',
    serviceWorkerParam: { scope: '/Gear-Checker/' },
    notifyButton: { enable: false },
    allowLocalhostAsSecureOrigin: true
  });
  oneSignalClient = OneSignal;
  await OneSignal.login(pushDeviceId());
  OneSignal.Notifications.addEventListener('permissionChange', refreshPushStatus);
  OneSignal.User.PushSubscription.addEventListener('change', refreshPushStatus);
  refreshPushStatus();
});
