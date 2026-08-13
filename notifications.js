const ONESIGNAL_APP_ID = '235c0b1a-654b-4ba4-b23b-dca951f21105';
let oneSignalClient = null;

function pushStatusLabel() {
  if (!oneSignalClient) return localStorage.getItem('gear-check-push-enabled') === '1' ? 'Push activ' : 'Se verifică…';
  return oneSignalClient.Notifications.permission && oneSignalClient.User.PushSubscription.optedIn ? 'Push activ' : 'Push inactiv';
}

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
  const configured=Boolean(localStorage.getItem('gear-check-notify-worker'));
  card.innerHTML = `<div><h3>Notificări pe iPhone</h3><p class="muted">${escapeHtml(message)} ${configured?'Automatizare configurată.':'Automatizarea nu este configurată.'}</p></div><div class="stack">${canEnable ? `<button class="${enabled ? 'primary' : 'secondary'}" onclick="enablePushNotifications()">${enabled ? 'Active ✓' : 'Activează'}</button>` : ''}<button class="ghost tiny" onclick="configureNotificationService()">Configurează</button></div>`;
}

function configureNotificationService() {
  const current=localStorage.getItem('gear-check-notify-worker')||'';
  const url=prompt('URL-ul Cloudflare Worker pentru notificări:',current);
  if(!url)return;
  const token=prompt('Tokenul de programare ales în Cloudflare:');
  if(!token)return;
  localStorage.setItem('gear-check-notify-worker',url.replace(/\/$/,''));
  localStorage.setItem('gear-check-notify-token',token);
  alert('Automatizarea a fost configurată. Sesiunile noi vor programa notificările.');
  refreshPushStatus();
}

function localMoment(date,time,days=0){const d=new Date(`${date}T${time}:00`);d.setDate(d.getDate()+days);return d.toISOString()}
async function scheduleSessionNotifications(session){
  const url=localStorage.getItem('gear-check-notify-worker'),token=localStorage.getItem('gear-check-notify-token');
  if(!url||!token){session.notificationScheduleStatus='not_configured';save();return}
  const notifications=[{kind:'gear',sendAt:localMoment(session.date,session.reminderTime||'09:00',-1)}];
  if(session.clothesReminder){notifications.push({kind:'clothes_day_before',sendAt:localMoment(session.date,session.clothesPrepTime||'09:05',-1)},{kind:'clothes_morning',sendAt:localMoment(session.date,session.clothesMorningTime||'07:00',0)})}
  try{const response=await fetch(`${url}/schedule`,{method:'POST',headers:{'Content-Type':'application/json','X-Gear-Token':token},body:JSON.stringify({sessionId:session.id,name:session.name,date:session.date,shootType:session.shootType,notifications})});if(!response.ok)throw new Error('schedule');session.notificationScheduleStatus='programmed'}catch(e){session.notificationScheduleStatus='error'}save();if(currentSessionId===session.id)render()
}

async function refreshPushStatus() {
  if (!oneSignalClient) return renderPushStatus('OneSignal se inițializează…');
  const permission = oneSignalClient.Notifications.permission;
  const optedIn = oneSignalClient.User.PushSubscription.optedIn;
  if (permission && optedIn) { localStorage.setItem('gear-check-push-enabled', '1'); renderPushStatus('Push activ pe acest iPhone.', true); }
  else if ('Notification' in window && Notification.permission === 'denied') renderPushStatus('Blocate în iOS. Activează-le din Settings → Notifications → Gear Check.', false, false);
  else renderPushStatus('Apasă Activează, apoi Allow.', false);
}

async function enablePushNotifications() {
  if (!oneSignalClient) return alert('OneSignal încă se încarcă. Încearcă din nou peste câteva secunde.');
  try {
    await oneSignalClient.Notifications.requestPermission();
    await oneSignalClient.User.PushSubscription.optIn();
    localStorage.setItem('gear-check-push-enabled', '1');
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
