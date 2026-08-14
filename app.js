const STORAGE_KEY = 'gear-check-v1';
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
const today = () => new Date().toISOString().slice(0,10);

const seedData = () => {
  const bags = [
    { id: uid(), name: 'Vevor Medium Case', type: 'VevorMediumStyled.png', notes: 'Case mediu principal' },
    { id: uid(), name: 'Small Audio Case', type: 'VevorSmallStyled.png', notes: 'Case compact pentru audio' },
    { id: uid(), name: 'Large Case — Activ', type: 'VevorLargeStyled.png', notes: 'Case mare folosit' },
    { id: uid(), name: 'Large Case — Gol', type: 'HardcaseLarge.png', notes: 'Case mare de rezervă, momentan gol' },
    { id: uid(), name: 'Rucsac cameră', type: 'backpack', notes: 'Setup rapid pentru cameră + lentile' },
    { id: uid(), name: 'Troller lumini', type: 'trolley', notes: 'Lumini, stative, alimentare' },
    { id: uid(), name: 'Geantă audio', type: 'audio', notes: 'Microfoane, lavaliere, cabluri audio' },
    { id: uid(), name: 'Pouch cabluri', type: 'pouch', notes: 'HDMI, USB-C, adaptoare, prelungitoare' },
    { id: uid(), name: 'Case dronă', type: 'case', notes: 'Dronă, baterii, telecomandă' },
    { id: uid(), name: 'Portbagaj', type: 'car', notes: 'Backup, stative mari, consumabile' }
  ];
  const bag = name => bags.find(b => b.name === name)?.id || '';
  const gear = [
    ['Sony FX3','Camera',1,'Rucsac cameră','available','Main camera, S-Log3'],
    ['Sony A7S III','Camera',1,'Rucsac cameră','available','B-cam / backup'],
    ['Sony 24-70mm GM II','Lens',1,'Rucsac cameră','available','Main versatile lens'],
    ['Laowa 10mm','Lens',1,'Rucsac cameră','available','Real estate / wide shots'],
    ['Sony Zeiss 50mm f/1.4','Lens',1,'Rucsac cameră','available','Portrait / detail'],
    ['Sigma 85mm Art','Lens',1,'Rucsac cameră','available','Portrait / cinematic details'],
    ['Atomos Ninja V','Monitor/Recorder',1,'Rucsac cameră','available','Monitor + recorder'],
    ['DJI Ronin RS3','Stabilizare',1,'Portbagaj','available','Gimbal'],
    ['SD Cards','Storage',6,'Rucsac cameră','available','Formatate înainte de shoot'],
    ['FX3 / NP-FZ100 baterii','Power',6,'Rucsac cameră','available','Încărcate full'],
    ['V-Mount SmallRig VB99 Pro','Power',1,'Rucsac cameră','available','Rig power'],
    ['PicoGear PicoMic 2 Pro','Audio',1,'Geantă audio','available','Wireless mic kit'],
    ['Shotgun mic','Audio',1,'Geantă audio','available','Backup audio'],
    ['SmallRig RC100B','Light',1,'Troller lumini','available','Key/accent light'],
    ['Nanlite Forza 300','Light',1,'Troller lumini','available','Big key light'],
    ['Godox BG02','Light',1,'Troller lumini','available','Tube / accent'],
    ['MixPad 150','Light',1,'Troller lumini','available','Soft light'],
    ['Light stands','Grip',3,'Troller lumini','available','Stative lumini'],
    ['Tripod video','Grip',1,'Portbagaj','available','Locked shots'],
    ['Smoke machine','FX',1,'Portbagaj','available','Atmosphere'],
    ['HDMI cables','Cables',3,'Pouch cabluri','available','Atomos/camera'],
    ['USB-C cables','Cables',4,'Pouch cabluri','available','Power/data'],
    ['Chargers','Power',4,'Pouch cabluri','available','Camera/light/audio chargers'],
    ['Gaffer tape','Consumables',1,'Portbagaj','available','Always useful']
  ].map(([name,category,quantity,bagName,status,notes]) => ({ id: uid(), name, category, quantity, bagId: bag(bagName), status, notes }));
  const g = name => gear.find(x => x.name === name)?.id;
  const templates = [
    { name: 'Real Estate', notes: 'Wide, clean, fast walkthrough', items: ['Sony FX3','Laowa 10mm','Sony 24-70mm GM II','DJI Ronin RS3','SD Cards','FX3 / NP-FZ100 baterii','HDMI cables','USB-C cables','Chargers'] },
    { name: 'Corporate', notes: 'Interview + b-roll', items: ['Sony FX3','Sony A7S III','Sony 24-70mm GM II','Sony Zeiss 50mm f/1.4','PicoGear PicoMic 2 Pro','Shotgun mic','SmallRig RC100B','Nanlite Forza 300','Light stands','Tripod video','SD Cards','FX3 / NP-FZ100 baterii','Chargers'] },
    { name: 'Restaurant', notes: 'Food, vibe, details', items: ['Sony FX3','Sony 24-70mm GM II','Sigma 85mm Art','DJI Ronin RS3','SmallRig RC100B','Godox BG02','SD Cards','FX3 / NP-FZ100 baterii','Gaffer tape'] },
    { name: 'Rapid Basket', notes: 'Match vertical highlights', items: ['Sony FX3','Sony 24-70mm GM II','Atomos Ninja V','V-Mount SmallRig VB99 Pro','SD Cards','FX3 / NP-FZ100 baterii','HDMI cables','USB-C cables','Chargers'] },
    { name: 'Product Video', notes: 'Controlled cinematic product shoot', items: ['Sony FX3','Sony 24-70mm GM II','Sony Zeiss 50mm f/1.4','Sigma 85mm Art','SmallRig RC100B','Nanlite Forza 300','Godox BG02','MixPad 150','Light stands','Tripod video','Smoke machine','Gaffer tape'] },
    { name: 'Wedding / Botez', notes: 'Long day, redundancy, audio', items: ['Sony FX3','Sony A7S III','Sony 24-70mm GM II','Sony Zeiss 50mm f/1.4','Sigma 85mm Art','DJI Ronin RS3','PicoGear PicoMic 2 Pro','Shotgun mic','SD Cards','FX3 / NP-FZ100 baterii','V-Mount SmallRig VB99 Pro','Chargers','Gaffer tape'] }
  ].map(t => ({ id: uid(), name: t.name, notes: t.notes, itemIds: t.items.map(g).filter(Boolean) }));
  return { bags, gear, templates, sessions: [], settings: { firstRun: false } };
};

const hadStoredStateAtBoot = Boolean(localStorage.getItem(STORAGE_KEY));
let state = load();
migrateState();
let activeTab = 'dashboard';
let currentSessionId = null;

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || seedData(); }
  catch { return seedData(); }
}
function migrateState() {
  state.bags ||= []; state.gear ||= []; state.templates ||= []; state.sessions ||= []; state.settings ||= {};
  state.mediaVault ||= { drives: [], entries: [] };
  state.mediaVault.drives ||= [];
  state.mediaVault.entries ||= [];
  state.mediaVault.entries.forEach(entry => entry.backupStatus ||= 'unknown');
  if (typeof seedMediaVaultV20 === 'function') seedMediaVaultV20();
  if (!state.settings.finalCaseIconsAdded) {
    const wanted=[['Vevor Medium Case','VevorMediumStyled.png','Case mediu principal'],['Small Audio Case','VevorSmallStyled.png','Case compact pentru audio'],['Large Case — Activ','VevorLargeStyled.png','Case mare folosit'],['Large Case — Gol','HardcaseLarge.png','Case mare de rezervă, momentan gol']];
    for(const [name,type,notes] of wanted) if(!state.bags.some(b=>b.name===name)) state.bags.push({id:uid(),name,type,notes});
    state.settings.finalCaseIconsAdded=true; save();
  }
  if (!state.settings.antonioInventoryV3) {
    const specs=[
      ['Vevor Medium Case','VevorMediumStyled-Balanced.png','Rig principal, camere, obiective și power'],
      ['Vevor Large Case','VevorLargeStyled.png','Gimbal, lumini și efecte'],
      ['Small Audio Case','VevorSmallStyled.png','Recorder, microfoane și consumabile audio'],
      ['Mașină','Car-transparent.png','Transport gear'],['Portbagaj','CarTrunk-transparent.png','Echipament transportat separat']
    ];
    const oldBags=state.bags||[], bags=specs.map(([name,type,notes])=>{const old=oldBags.find(b=>b.name===name);return{id:old?.id||uid(),name,type,notes}});
    const bid=name=>bags.find(b=>b.name===name).id;
    const rows=[
      ['Sony FX3','Camera',1,'Vevor Medium Case',0],['Sony A7S III','Camera',1,'Vevor Medium Case',0],
      ['Laowa 10mm','Obiective',1,'Vevor Medium Case',0],['Sony Zeiss 50mm f/1.4','Obiective',1,'Vevor Medium Case',0],['Sigma 85mm Art','Obiective',1,'Vevor Medium Case',0],['Sony 24-70mm GM II','Obiective',1,'Vevor Medium Case',0],['Tamron 35-150mm','Obiective',1,'Vevor Medium Case',0],
      ['SmallRig VB99 Pro V-Mount','Power',2,'Vevor Medium Case',1],['Sony NP-FZ100 batteries','Power',6,'Vevor Medium Case',1],['Sony battery chargers','Power',2,'Vevor Medium Case',0],['Nitecore power bank','Power',1,'Vevor Medium Case',1],['Nitecore blower','Accesorii',1,'Vevor Medium Case',1],['Cabluri rig / cameră','Cabluri',1,'Vevor Medium Case',0],
      ['SmallRig articulating arm','Rig',1,'Vevor Medium Case',0],['SmallRig top handle','Rig',1,'Vevor Medium Case',0],['SmallRig side handles','Rig',2,'Vevor Medium Case',0],['DJI RS4 Pro','Gimbal',1,'Vevor Medium Case',1],['Atomos Ninja V','Monitor',1,'Vevor Medium Case',0],['NP-F batteries','Power',2,'Vevor Medium Case',1],
      ['DJI RS3','Gimbal',1,'Vevor Large Case',1],['SmallRig rechargeable flashlight + spotlight attachment','Light',1,'Vevor Large Case',1],['Ulanzi smoke machine','FX',1,'Vevor Large Case',1],['Tamron 17-28mm','Obiective',1,'Vevor Large Case',0],['SmallRig RC 60B lights','Light',2,'Vevor Large Case',1],['SmallRig RC 60B light attachments','Light modifiers',1,'Vevor Large Case',0],
      ['Zoom H5 recorder','Audio',1,'Small Audio Case',0],['Audio-Technica microphone','Audio',1,'Small Audio Case',0],['Zoom H2 lavalier','Audio',1,'Small Audio Case',0],['PicoGear PicoMic 2','Audio',1,'Small Audio Case',1],['AA batteries','Baterii',1,'Small Audio Case',0],['AAA batteries','Baterii',1,'Small Audio Case',0],['Audio cables','Cabluri',1,'Small Audio Case',0],
      ['Nanlite PavoTube 15X','Light',2,'Portbagaj',1],['Yongnuo IV lamps','Light',2,'Portbagaj',0],['MixPad 150','Light',1,'Portbagaj',0],['Nanlite Forza 300','Light',1,'Portbagaj',0]
    ];
    const oldGear=state.gear||[]; state.bags=bags; state.gear=rows.map(([name,category,quantity,bag,charge])=>{const old=oldGear.find(g=>g.name===name);return{id:old?.id||uid(),name,category,quantity,bagId:bid(bag),status:old?.status||'available',notes:old?.notes||'',needsCharge:!!charge,charged:old?.charged||false}});
    const ids=names=>state.gear.filter(g=>names.some(n=>g.name.includes(n))).map(g=>g.id), core=['Sony FX3','24-70mm','NP-FZ100','Cabluri rig'];
    state.templates=[
      {id:uid(),name:'Real Estate',notes:'Wide, gimbal, setup rapid',itemIds:ids([...core,'Laowa 10mm','DJI RS4 Pro','Tamron 17-28mm'])},
      {id:uid(),name:'Corporate',notes:'Interviu + b-roll + audio',itemIds:ids([...core,'Sony A7S III','50mm','Zoom H5','Audio-Technica','PicoGear','RC 60B'])},
      {id:uid(),name:'Restaurant',notes:'Food, vibe și detalii',itemIds:ids([...core,'Sigma 85mm','DJI RS4 Pro','RC 60B','smoke machine'])},
      {id:uid(),name:'Rapid Basket',notes:'Setup mobil pentru highlights',itemIds:ids([...core,'Tamron 35-150mm','Atomos Ninja V','NP-F batteries','VB99'])},
      {id:uid(),name:'Product Video',notes:'Lumini și control cinematic',itemIds:ids([...core,'50mm','Sigma 85mm','RC 60B','PavoTube','MixPad','Forza','smoke machine'])},
      {id:uid(),name:'Wedding / Botez',notes:'Redundanță, audio și power',itemIds:ids([...core,'Sony A7S III','Tamron 35-150mm','DJI RS4 Pro','PicoGear','Zoom H5','VB99','power bank'])},
      {id:uid(),name:'Tot gear-ul',notes:'Inventarul complet actualizat',itemIds:state.gear.map(g=>g.id)}
    ];
    state.settings.antonioInventoryV3=true; save();
  }
  if (!state.settings.antonioChargingV4) {
    const rename={'External battery / power bank':'Nitecore power bank'};
    state.gear.forEach(g=>{if(rename[g.name])g.name=rename[g.name];if(['Zoom H5 recorder','Zoom H2 lavalier'].includes(g.name)){g.needsCharge=false;g.charged=false}});
    state.bags.forEach(b=>{if(b.name==='Mașină')b.type='Car-transparent.png';if(b.name==='Portbagaj')b.type='CarTrunk-transparent.png'});
    state.settings.antonioChargingV4=true;save();
  }
  if (!state.settings.caseBasedTemplatesV5) {
    const caseNames=['Vevor Medium Case','Vevor Large Case','Small Audio Case'];
    state.templates.forEach(t=>{
      t.bagIds=caseNames.map(n=>state.bags.find(b=>b.name===n)).filter(b=>b&&state.gear.filter(g=>g.bagId===b.id).every(g=>t.itemIds.includes(g.id))).map(b=>b.id);
      t.extraItemIds=t.itemIds.filter(id=>!t.bagIds.includes(byId(state.gear,id)?.bagId));
    });
    state.settings.caseBasedTemplatesV5=true;save();
  }
  if(!state.settings.opaqueCarCutoutsV7){state.bags.forEach(b=>{if(b.name==='Mașină')b.type='CarCutoutOpaque.png';if(b.name==='Portbagaj')b.type='CarTrunkCutoutOpaque.png'});state.settings.opaqueCarCutoutsV7=true;save()}
  if(!state.settings.sessionPrepV8){const medium=state.bags.find(b=>b.name==='Vevor Medium Case');if(medium&&!state.gear.some(g=>/memory cards|sd cards/i.test(g.name)))state.gear.push({id:uid(),name:'SD memory cards',category:'Storage',quantity:6,bagId:medium.id,status:'available',notes:'Verifică backupul și formatează înainte de filmare',needsCharge:false,charged:false});state.settings.sessionPrepV8=true;save()}
}
function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function byId(arr, id) { return arr.find(x => x.id === id); }
function bagName(id) { return byId(state.bags, id)?.name || 'Fără bagaj'; }
function templateItemIds(t){return[...new Set([...(t.bagIds||[]).flatMap(bid=>state.gear.filter(g=>g.bagId===bid).map(g=>g.id)),...(t.extraItemIds||t.itemIds||[])])].filter(id=>byId(state.gear,id))}
function escapeHtml(str='') { return String(str).replace(/[&<>'"]/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[s])); }
const BAG_ICONS = ['VevorMediumStyled.png','VevorMediumStyled-Balanced.png','VevorMediumStyled-TOOFlatter.png','VevorSmallStyled.png','VevorLargeStyled.png','ManfrottoRollerStyled.png','CameraShoulderBag.png','HardcaseCompact.png','HardcaseMedium.png','HardcaseLarge.png','HardcaseLong.png','HardcaseLens.png','HardcaseBattery.png','CarCutoutOpaque.png','CarTrunkCutoutOpaque.png'];
const bagIcon = type => BAG_ICONS.includes(type) ? `icons/cases/${type}` : ({backpack:'icons/cases/CameraShoulderBag.png',trolley:'icons/cases/ManfrottoRollerStyled.png',audio:'icons/cases/VevorSmallStyled.png',pouch:'icons/cases/HardcaseCompact.png',case:'icons/cases/HardcaseMedium.png',car:'icons/cases/HardcaseLong.png'}[type] || 'icons/cases/HardcaseMedium.png');

const view = document.getElementById('view');
const title = document.getElementById('screenTitle');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const importFile = document.getElementById('importFile');

document.querySelectorAll('.tab').forEach(btn => btn.addEventListener('click', () => {
  activeTab = btn.dataset.tab;
  currentSessionId = null;
  render();
}));
document.body.appendChild(document.querySelector('.tabbar'));
document.getElementById('quickAddBtn').addEventListener('click', () => {
  if (activeTab === 'bags') openBagForm();
  else if (activeTab === 'templates') openTemplateForm();
  else if (activeTab === 'sessions') openNewSession();
  else if (activeTab === 'business') openBusinessProjectForm();
  else if (activeTab === 'vault') openVaultDriveForm();
  else openGearForm();
});
document.getElementById('closeModalBtn').addEventListener('click', () => modal.close());

function render() {
  document.querySelectorAll('.tab').forEach(b => b.classList.toggle('active', b.dataset.tab === activeTab));
  const map = { dashboard: renderDashboard, inventory: renderInventory, bags: renderBags, templates: renderTemplates, sessions: renderSessions, business: renderBusiness, vault: renderVault };
  map[activeTab]();
}

function renderDashboard() {
  title.textContent = 'Gear Check';
  const total = state.gear.length;
  const bags = state.bags.length;
  const templates = state.templates.length;
  const open = state.sessions.filter(s => !s.completed).length;
  const charging=state.gear.filter(g=>g.needsCharge);
  view.innerHTML = `
    <section class="hero stack">
      <h2>Nu mai pleci fără cabluri, baterii sau carduri.</h2>
      <p class="muted">Inventory + bagaje + checklist-uri pentru filmări. Totul local pe iPhone.</p>
      <button class="primary" onclick="openNewSession()">＋ New Shoot Checklist</button>
    </section>
    <div class="grid two" style="margin-top:14px">
      <div class="card kpi"><span class="muted">Gear items</span><strong>${total}</strong></div>
      <div class="card kpi"><span class="muted">Bagaje</span><strong>${bags}</strong></div>
      <div class="card kpi"><span class="muted">Template-uri</span><strong>${templates}</strong></div>
      <div class="card kpi"><span class="muted">Sesiuni active</span><strong>${open}</strong></div>
    </div>
    <div id="pushCard" class="card flat push-card" style="margin-top:14px"><div><h3>Notificări pe iPhone</h3><p class="muted">Se verifică statusul OneSignal…</p></div><button class="secondary" onclick="enablePushNotifications()">Activează</button></div>
    <div class="section-title"><h3>De încărcat</h3><span class="pill ${charging.every(g=>g.charged)?'ok':'warn'}">${charging.filter(g=>g.charged).length}/${charging.length}</span></div>
    <div class="list">${charging.map(gearItemRow).join('')||empty('Nu ai echipamente de încărcat.')}</div>
    <div class="section-title"><h3>Acțiuni rapide</h3></div>
    <div class="grid">
      <button class="secondary" onclick="openGearForm()">Adaugă echipament</button>
      <button class="secondary" onclick="openBagForm()">Adaugă bagaj/case</button>
      <button class="secondary" onclick="openTemplateForm()">Creează template</button>
      <button class="secondary vault-home-button" onclick="activeTab='vault';render()"><span class="vault-home-icon">▰</span><span><b>Media Vault · SSD</b><small>Vezi rapid ce proiecte sunt pe fiecare drive</small></span></button>
      <div class="footer-actions">
        <button class="ghost" onclick="exportBackup()">Export backup</button>
        <button class="ghost" onclick="importFile.click()">Import backup</button>
        <button class="ghost" onclick="restoreAntonioBackup()">Restaurează presetul Toni</button>
      </div>
    </div>
    <div class="section-title"><h3>Ultimele sesiuni</h3><button class="ghost tiny" onclick="activeTab='sessions';render()">Vezi toate</button></div>
    ${sessionList(state.sessions.slice(-3).reverse())}
  `;
}

function renderInventory(filter='') {
  title.textContent = 'Inventory';
  const items = state.gear.filter(item => [item.name,item.category,item.notes,bagName(item.bagId)].join(' ').toLowerCase().includes(filter.toLowerCase()));
  const categories = [...new Set(state.gear.map(i => i.category))].sort();
  view.innerHTML = `
    <input class="search" placeholder="Caută gear, categorie, bagaj..." value="${escapeHtml(filter)}" oninput="renderInventory(this.value)" />
    <div class="row"><span class="pill">${items.length} iteme</span><button class="primary tiny" onclick="openGearForm()">＋ Gear</button></div>
    <div class="section-title"><h3>Pe categorii</h3></div>
    <div class="stack">${categories.map(cat => {
      const catItems = items.filter(i => i.category === cat);
      if (!catItems.length) return '';
      return `<div class="card flat"><div class="row"><h3>${escapeHtml(cat)}</h3><span class="pill">${catItems.length}</span></div><div class="list">${catItems.map(gearItemRow).join('')}</div></div>`;
    }).join('') || empty('Nu ai încă echipament în inventory.')}</div>
  `;
}

function gearItemRow(item) {
  const statusClass = item.status === 'available' ? 'ok' : item.status === 'missing' ? 'warn' : '';
  return `<div class="item">
    <div class="item-left" onclick="openGearForm('${item.id}')">
      <div class="item-title">${escapeHtml(item.name)} ${item.quantity > 1 ? `×${item.quantity}` : ''}</div>
      <div class="item-sub">${escapeHtml(bagName(item.bagId))} · ${escapeHtml(item.notes || 'fără notițe')}</div>
    </div>
    ${item.needsCharge?`<button class="charge-toggle ${item.charged?'done':''}" onclick="event.stopPropagation();toggleCharged('${item.id}')">${item.charged?'⚡ Încărcat':'○ De încărcat'}</button>`:`<span class="pill ${statusClass}">${escapeHtml(item.status)}</span>`}
  </div>`;
}
function toggleCharged(id){const item=byId(state.gear,id);item.charged=!item.charged;save();render()}

function renderBags() {
  title.textContent = 'Bagaje';
  view.innerHTML = `
    <div class="row"><span class="pill">${state.bags.length} bagaje</span><button class="primary tiny" onclick="openBagForm()">＋ Bagaj</button></div>
    <div class="grid" style="margin-top:12px">${state.bags.map(b => {
      const count = state.gear.filter(g => g.bagId === b.id).length;
      return `<div class="card stack bag-card"><img class="bag-visual" src="${bagIcon(b.type)}" alt="" />
        <div class="row bag-heading"><div><h2>${escapeHtml(b.name)}</h2><p class="muted">${escapeHtml(b.notes || b.type || '')}</p></div><span class="pill accent item-count">${count}<small>${count===1?'item':'iteme'}</small></span></div>
        <div class="list">${state.gear.filter(g => g.bagId === b.id).map(g => `<div class="item"><div class="item-left"><div class="item-title">${escapeHtml(g.name)}</div><div class="item-sub">${escapeHtml(g.category)}</div></div><button class="unbag" onclick="removeFromBag('${g.id}')">Scoate</button></div>`).join('') || '<p class="empty">Gol momentan.</p>'}</div>
        <div class="footer-actions"><button class="ghost" onclick="openBagForm('${b.id}')">Editează</button><button class="danger" onclick="deleteBag('${b.id}')">Șterge</button></div>
      </div>`;
    }).join('') || empty('Nu ai bagaje definite.')}</div>`;
}
function removeFromBag(id){const g=byId(state.gear,id);if(g&&confirm(`Scoți „${g.name}” din ${bagName(g.bagId)}? Echipamentul va rămâne în Gear, fără bagaj.`)){g.bagId='';save();render()}}

function renderTemplates() {
  title.textContent = 'Templates';
  view.innerHTML = `
    <div class="row"><span class="pill">${state.templates.length} template-uri</span><button class="primary tiny" onclick="openTemplateForm()">＋ Template</button></div>
    <div class="grid" style="margin-top:12px">${state.templates.map(t => {
      const resolved=templateItemIds(t),chargeCount=resolved.filter(id=>byId(state.gear,id)?.needsCharge).length;
      return `<div class="card stack">
        <div class="row"><div><h2>${escapeHtml(t.name)}</h2><p class="muted">${escapeHtml(t.notes || '')}</p></div><span class="pill accent">${resolved.length} iteme</span></div><p class="charge-note">⚡ ${chargeCount} de verificat la încărcare</p>
        <button class="primary" onclick="createSession('${t.id}')">Pornește checklist</button>
        <div class="footer-actions"><button class="ghost" onclick="openTemplateForm('${t.id}')">Editează</button><button class="danger" onclick="deleteTemplate('${t.id}')">Șterge</button></div>
      </div>`;
    }).join('') || empty('Nu ai template-uri.')}</div>`;
}

function renderSessions() {
  title.textContent = 'Sesiuni';
  if (currentSessionId) return renderSessionDetail(currentSessionId);
  view.innerHTML = `
    <button class="primary" onclick="openNewSession()">＋ New Shoot Checklist</button>
    <div class="section-title"><h3>Active</h3></div>
    ${sessionList(state.sessions.filter(s => !s.completed).reverse())}
    <div class="section-title"><h3>Finalizate</h3></div>
    ${sessionList(state.sessions.filter(s => s.completed).reverse())}
  `;
}

function sessionList(sessions) {
  if (!sessions.length) return empty('Nicio sesiune aici momentan.');
  return `<div class="list">${sessions.map(s => {
    const pack = progress(s.packItems);
    const ret = progress(s.returnItems);
    return `<div class="item" onclick="currentSessionId='${s.id}';activeTab='sessions';render()">
      <div class="item-left"><div class="item-title">${escapeHtml(s.name)}</div><div class="item-sub">${escapeHtml(s.date)} · Packed ${pack}% · Return ${ret}%</div></div>
      <span class="pill ${s.completed ? 'ok' : ''}">${s.completed ? 'done' : 'active'}</span>
    </div>`;
  }).join('')}</div>`;
}

function renderSessionDetail(id) {
  const s = byId(state.sessions, id);
  if (!s) { currentSessionId = null; return renderSessions(); }
  normalizeSessionCases(s);
  title.textContent = s.name;
  const packPct = progress(s.packItems), returnPct = progress(s.returnItems);
  const mode = s.mode || 'pack';
  s.chargeItems ||= s.packItems.filter(ci=>byId(state.gear,ci.gearId)?.needsCharge).map(ci=>({id:uid(),gearId:ci.gearId,checked:false}));
  const items = mode === 'charge' ? s.chargeItems : mode === 'pack' ? s.packItems : s.returnItems;
  const missing = items.filter(i => !i.checked);
  view.innerHTML = `
    <button class="ghost tiny" onclick="currentSessionId=null;renderSessions()">‹ Înapoi</button>
    <section class="card stack" style="margin-top:10px">
      <div class="row"><div><h2>${escapeHtml(s.name)}</h2><p class="muted">${escapeHtml(s.date)} · ${mode === 'charge'?'Baterii și carduri':mode === 'pack' ? 'Checklist plecare la filmare' : 'Checklist plecare acasă'}</p></div><span class="pill accent">${progress(items)}%</span></div>
      <div class="progress"><div style="width:${progress(items)}%"></div></div>
      <div class="mode-tabs"><button class="${mode==='charge'?'primary':'secondary'}" onclick="setSessionMode('${s.id}','charge')">Pregătire</button><button class="${mode==='pack'?'primary':'secondary'}" onclick="setSessionMode('${s.id}','pack')">Spre filmare</button><button class="${mode==='return'?'primary':'secondary'}" onclick="setSessionMode('${s.id}','return')">Plecare acasă</button></div>
    </section>
    <div class="card flat stack" style="margin-top:12px"><div class="row"><b>Plan notificări</b><span class="pill ${s.notificationScheduleStatus==='programmed'?'ok':''}">${s.notificationScheduleStatus==='programmed'?'Programate ✓':(typeof pushStatusLabel==='function'?pushStatusLabel():'Se verifică…')}</span></div><p class="muted">${escapeHtml(s.reminderDate||'Cu o zi înainte')} la ${escapeHtml(s.reminderTime||'09:00')}: baterii și carduri.</p>${s.clothesReminder?`<p class="muted">Haine: cu o zi înainte la ${escapeHtml(s.clothesPrepTime||'09:05')} și în ziua evenimentului la ${escapeHtml(s.clothesMorningTime||'07:00')}.</p>`:''}${s.notificationScheduleStatus==='error'?'<p class="charge-note">Programarea a eșuat. Verifică serviciul de notificări.</p>':''}${s.notificationScheduleStatus!=='programmed'?`<button class="secondary tiny" onclick="scheduleSessionNotifications(byId(state.sessions,'${s.id}'))">Programează notificările</button>`:''}</div>
    ${missing.length ? `<div class="section-title"><h3>Lipsesc / nebifate</h3><span class="pill warn">${missing.length}</span></div><div class="list">${missing.map(i => checklistRow(s.id, i, mode, true)).join('')}</div>` : `<div class="card flat" style="margin-top:14px"><p class="empty">Totul bifat. Frumos.</p></div>`}
    <div class="section-title"><h3>Toate itemele</h3></div>
    <div class="list">${items.map(i => checklistRow(s.id, i, mode)).join('')}</div>
    <div class="footer-actions"><button class="ghost" onclick="toggleAll('${s.id}','${mode}',true)">Bifează tot</button><button class="ghost" onclick="toggleAll('${s.id}','${mode}',false)">Reset</button></div>
    <div class="footer-actions"><button class="secondary" type="button" id="finalizeSessionBtn">Marchează finalizat</button><button class="danger" type="button" onclick="deleteSession('${s.id}')">Șterge sesiunea</button></div>
  `;
  document.getElementById('finalizeSessionBtn')?.addEventListener('click', () => completeSession(s.id));
}

function checklistRow(sessionId, ci, mode, compact=false) {
  if(ci.bagId){const bag=byId(state.bags,ci.bagId);if(!bag)return'';const count=state.gear.filter(g=>g.bagId===bag.id).length;return `<div class="item session-case-row" onclick="toggleChecklist('${sessionId}','${ci.id}','${mode}')"><div class="io-switch ${ci.checked?'checked':''}"><span>${ci.checked?'I':'O'}</span></div><img src="${bagIcon(bag.type)}" alt=""/><div class="item-left"><div class="item-title">${escapeHtml(bag.name)}</div><div class="item-sub">Cutie completă · ${count} iteme în interior</div></div></div>`}
  const item = byId(state.gear, ci.gearId);
  if (!item) return '';
  return `<div class="item" onclick="toggleChecklist('${sessionId}','${ci.id}','${mode}')">
    <div class="io-switch ${ci.checked ? 'checked' : ''}"><span>${ci.checked ? 'I' : 'O'}</span></div>
    <div class="item-left"><div class="item-title">${escapeHtml(item.name)} ${item.quantity > 1 ? `×${item.quantity}` : ''}</div><div class="item-sub">${escapeHtml(item.category)} · ${escapeHtml(bagName(item.bagId))}${compact ? '' : ` · ${escapeHtml(item.notes || '')}`}</div></div>
  </div>`;
}

function progress(items) {
  if (!items || !items.length) return 0;
  return Math.round(items.filter(i => i.checked).length / items.length * 100);
}
function packingItemsForTemplate(t){
  const bags=(t?.bagIds||[]).map(bagId=>({id:uid(),bagId,checked:false}));
  const extras=(t?.extraItemIds||t?.itemIds||[]).filter(gearId=>byId(state.gear,gearId)&&!bags.some(x=>byId(state.gear,gearId)?.bagId===x.bagId)).map(gearId=>({id:uid(),gearId,checked:false}));
  return [...bags,...extras];
}
function normalizeSessionCases(s){
  const t=byId(state.templates,s.templateId);if(!t||(s.packItems||[]).some(i=>i.bagId)||!(t.bagIds||[]).length)return;
  const packChecked=new Map((s.packItems||[]).map(i=>[i.gearId,i.checked])),returnChecked=new Map((s.returnItems||[]).map(i=>[i.gearId,i.checked]));
  s.packItems=packingItemsForTemplate(t).map(i=>({...i,checked:i.bagId?state.gear.filter(g=>g.bagId===i.bagId).every(g=>packChecked.get(g.id)):Boolean(packChecked.get(i.gearId))}));
  s.returnItems=packingItemsForTemplate(t).map(i=>({...i,checked:i.bagId?state.gear.filter(g=>g.bagId===i.bagId).every(g=>returnChecked.get(g.id)):Boolean(returnChecked.get(i.gearId))}));save()
}
function empty(text) { return `<div class="card flat"><p class="empty">${escapeHtml(text)}</p></div>`; }

function openModal(name, html) {
  modalTitle.textContent = name;
  modalBody.innerHTML = html;
  modal.showModal();
}

function openGearForm(id='') {
  const item = byId(state.gear, id) || { name:'', category:'', quantity:1, bagId:'', status:'available', notes:'' };
  const categories=[...new Set(state.gear.map(g=>g.category).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'ro'));
  const knownCategory=categories.includes(item.category);
  openModal(id ? 'Editează gear' : 'Adaugă gear', `
    <div class="form-grid">
      <label>Nume<input id="fName" value="${escapeHtml(item.name)}" placeholder="Sony FX3" /></label>
      <label>Categorie<select id="fCategory" onchange="toggleNewCategory()"><option value="">Alege categoria…</option>${categories.map(c=>`<option value="${escapeHtml(c)}" ${c===item.category?'selected':''}>${escapeHtml(c)}</option>`).join('')}<option value="__new__" ${item.category&&!knownCategory?'selected':''}>＋ Categorie nouă</option></select></label>
      <label id="newCategoryLabel" class="${item.category&&!knownCategory?'':'hidden'}">Numele categoriei noi<input id="fNewCategory" value="${item.category&&!knownCategory?escapeHtml(item.category):''}" placeholder="Ex: Light Modifier" /></label>
      <label>Cantitate<input id="fQty" type="number" min="1" value="${item.quantity || 1}" /></label>
      <label>Bagaj<select id="fBag"><option value="" ${!item.bagId?'selected':''}>Fără bagaj · echipament separat</option>${state.bags.map(b => `<option value="${b.id}" ${b.id===item.bagId?'selected':''}>${escapeHtml(b.name)}</option>`).join('')}</select></label>
      <label>Status<select id="fStatus">${['available','missing','service','borrowed'].map(s => `<option ${s===item.status?'selected':''}>${s}</option>`).join('')}</select></label>
      <label class="charge-check"><input id="fNeedsCharge" type="checkbox" ${item.needsCharge?'checked':''}/> Trebuie încărcat</label>
      <label>Notițe<textarea id="fNotes">${escapeHtml(item.notes || '')}</textarea></label>
      <button class="primary" type="button" onclick="saveGear('${id}')">Salvează</button>
      ${id ? `<button class="danger" type="button" onclick="deleteGear('${id}')">Șterge</button>` : ''}
    </div>`);
}
function toggleNewCategory(){newCategoryLabel.classList.toggle('hidden',fCategory.value!=='__new__');if(fCategory.value==='__new__')fNewCategory.focus()}
function saveGear(id='') {
  const category=fCategory.value==='__new__'?fNewCategory.value.trim():fCategory.value;
  const payload = { name: fName.value.trim(), category: category || 'Altele', quantity: Math.max(1, Number(fQty.value||1)), bagId: fBag.value, status: fStatus.value, notes: fNotes.value.trim(), needsCharge:fNeedsCharge.checked };
  if (!payload.name) return alert('Pune un nume.');
  if (id) Object.assign(byId(state.gear, id), payload); else state.gear.push({ id: uid(), ...payload });
  save(); modal.close(); render();
}
function deleteGear(id) {
  if (!confirm('Ștergi echipamentul?')) return;
  state.gear = state.gear.filter(g => g.id !== id);
  state.templates.forEach(t => t.itemIds = t.itemIds.filter(x => x !== id));
  save(); modal.close(); render();
}

function openBagForm(id='') {
  const bag = byId(state.bags, id) || { name:'', type:'case', notes:'' };
  openModal(id ? 'Editează bagaj' : 'Adaugă bagaj', `
    <div class="form-grid">
      <label>Nume<input id="bName" value="${escapeHtml(bag.name)}" placeholder="Rucsac cameră" /></label>
      <label>Iconiță<select id="bType">${BAG_ICONS.map(icon => `<option value="${icon}" ${bag.type===icon?'selected':''}>${icon.replace('.png','')}</option>`).join('')}</select></label>
      <label>Notițe<textarea id="bNotes">${escapeHtml(bag.notes || '')}</textarea></label>
      ${id?`<div><p class="muted" style="font-weight:800;margin-bottom:8px">Conținut</p><div class="list">${state.gear.filter(g=>g.bagId===id).map(g=>`<div class="item"><span>${escapeHtml(g.name)}</span><button type="button" class="unbag" onclick="removeFromBagModal('${g.id}','${id}')">Scoate</button></div>`).join('')||'<p class="empty">Gol momentan.</p>'}</div></div>`:''}
      <button class="primary" type="button" onclick="saveBag('${id}')">Salvează</button>
    </div>`);
}
function removeFromBagModal(gearId,bagId){const g=byId(state.gear,gearId);if(g){g.bagId='';save();openBagForm(bagId)}}
function saveBag(id='') {
  const payload = { name: bName.value.trim(), type: bType.value.trim(), notes: bNotes.value.trim() };
  if (!payload.name) return alert('Pune un nume.');
  if (id) Object.assign(byId(state.bags, id), payload); else state.bags.push({ id: uid(), ...payload });
  save(); modal.close(); render();
}
function deleteBag(id) {
  if (!confirm('Ștergi bagajul? Itemele rămân fără bagaj.')) return;
  state.bags = state.bags.filter(b => b.id !== id);
  state.gear.forEach(g => { if (g.bagId === id) g.bagId = ''; });
  save(); render();
}

function openTemplateForm(id='') {
  const t = byId(state.templates, id) || { name:'', notes:'', itemIds:[],bagIds:[],extraItemIds:[] };
  const caseNames=['Vevor Medium Case','Vevor Large Case','Small Audio Case'],caseBags=state.bags.filter(b=>caseNames.includes(b.name));
  const loose=state.gear.filter(g=>!caseBags.some(b=>b.id===g.bagId));
  const production=loose.filter(g=>/light|stativ|stand|nanlite|yongnuo|forza|mixpad|gvm/i.test(`${g.category} ${g.name}`)),otherLoose=loose.filter(g=>!production.includes(g));
  const insideCases=caseBags.flatMap(b=>state.gear.filter(g=>g.bagId===b.id).map(g=>({...g,caseName:b.name})));
  const choices=items=>items.map(g => `<label class="item template-choice"><input type="checkbox" class="tGear" value="${g.id}" ${(t.extraItemIds||[]).includes(g.id)?'checked':''}/><span><b>${escapeHtml(g.name)} ${g.quantity>1?`×${g.quantity}`:''}</b><br><small class="muted">${escapeHtml(g.category)} · ${escapeHtml(bagName(g.bagId))}</small></span></label>`).join('');
  openModal(id ? 'Editează template' : 'Adaugă template', `
    <div class="form-grid">
      <label>Nume<input id="tName" value="${escapeHtml(t.name)}" placeholder="Real Estate" /></label>
      <label>Notițe<textarea id="tNotes">${escapeHtml(t.notes || '')}</textarea></label>
      <div><p class="muted template-label">Case-uri complete</p><p class="template-help">Bifezi case-ul o singură dată. Template-ul va lua automat tot conținutul lui actual.</p><div class="list">${caseBags.map(b=>`<label class="item template-choice"><input type="checkbox" class="tBag" value="${b.id}" ${(t.bagIds||[]).includes(b.id)?'checked':''}/><img src="${bagIcon(b.type)}"/><span><b>${escapeHtml(b.name)}</b><br><small class="muted">${state.gear.filter(g=>g.bagId===b.id).length} iteme · case complet</small></span></label>`).join('')}</div></div>
      <div><div class="template-section-head"><p class="muted template-label">Lumini și stative</p><button type="button" class="ghost tiny" onclick="toggleTemplateGroup('production')">Selectează toate</button></div><p class="template-help">Le alegi individual, indiferent dacă sunt în Mașină, Portbagaj sau fără bagaj.</p><div class="list template-scroll" data-template-group="production">${choices(production)||'<p class="empty">Nu există lumini sau stative.</p>'}</div></div>
      <details class="template-details"><summary>Ia doar anumite obiecte dintr-un case</summary><p class="template-help">Folosește asta când nu iei case-ul complet. Dacă bifezi și case-ul complet, obiectele duplicate apar o singură dată.</p><div class="list template-scroll">${insideCases.map(g=>`<label class="item template-choice"><input type="checkbox" class="tGear" value="${g.id}" ${(t.extraItemIds||[]).includes(g.id)?'checked':''}/><span><b>${escapeHtml(g.name)} ${g.quantity>1?`×${g.quantity}`:''}</b><br><small class="muted">${escapeHtml(g.caseName)} · ${escapeHtml(g.category)}</small></span></label>`).join('')}</div></details>
      <div><p class="muted template-label">Alte echipamente separate</p><div class="list template-scroll" data-template-group="other">${choices(otherLoose)||'<p class="empty">Nu există alte echipamente separate.</p>'}</div></div>
      <button class="primary" type="button" onclick="saveTemplate('${id}')">Salvează</button>
    </div>`);
}
function toggleTemplateGroup(group){const boxes=[...document.querySelectorAll(`[data-template-group="${group}"] input[type="checkbox"]`)],check=!boxes.every(b=>b.checked);boxes.forEach(b=>b.checked=check)}
function saveTemplate(id='') {
  const name=document.getElementById('tName').value.trim(),notes=document.getElementById('tNotes').value.trim();
  const bagIds=[...document.querySelectorAll('.tBag:checked')].map(x=>x.value),extraItemIds=[...new Set([...document.querySelectorAll('.tGear:checked')].map(x=>x.value))];
  const itemIds=[...new Set([...bagIds.flatMap(bid=>state.gear.filter(g=>g.bagId===bid).map(g=>g.id)),...extraItemIds])];
  const payload = { name,notes,bagIds,extraItemIds,itemIds };
  if (!payload.name) return alert('Pune un nume.');
  if (id) Object.assign(byId(state.templates, id), payload); else state.templates.push({ id: uid(), ...payload });
  save(); modal.close(); render();
}
function deleteTemplate(id) {
  if (!confirm('Ștergi template-ul?')) return;
  state.templates = state.templates.filter(t => t.id !== id);
  save(); render();
}

function openNewSession() {
  openModal('New Shoot Checklist', `
    <div class="form-grid">
      <label>Nume sesiune<input id="sName" value="Filmare ${today()}" /></label>
      <label>Data<input id="sDate" type="date" value="${today()}" /></label>
      <label>Tip filmare<select id="sShootType"><option>Filmări generale</option><option>Corporate</option><option>Sport</option><option>Product</option><option>Event</option><option>Wedding / Botez</option></select></label>
      <label>Notificare baterii + carduri, cu o zi înainte la<input id="sReminderTime" type="time" value="09:00" /></label>
      <div id="clothesHint" class="card flat"><p class="muted">Pentru Event și Wedding se adaugă automat notificările separate pentru haine: 09:05 cu o zi înainte și 07:00 în ziua evenimentului.</p></div>
      <p class="muted" style="font-weight:800">Alege template</p>
      <div class="list">${state.templates.map(t => {const ids=templateItemIds(t);return `<button type="button" class="secondary template-pick" onclick="createSession('${t.id}', document.getElementById('sName').value, document.getElementById('sDate').value,document.getElementById('sShootType').value,document.getElementById('sReminderTime').value)"><b>${escapeHtml(t.name)}</b><br><small class="muted">${ids.length} iteme · ⚡ ${ids.filter(id=>byId(state.gear,id)?.needsCharge).length} de încărcat · ${escapeHtml(t.notes || '')}</small></button>`}).join('')}</div>
    </div>`);
}
function createSession(templateId, name='', date='',shootType='Filmări generale',reminderTime='09:00') {
  const t = byId(state.templates, templateId);
  if (!t) return;
  const resolved=templateItemIds(t),makeItems = () => packingItemsForTemplate(t);
  const chargeItems=resolved.filter(id=>{const g=byId(state.gear,id);return g?.needsCharge||/memory cards|sd cards/i.test(g?.name||'')}).map(gearId=>({id:uid(),gearId,checked:false}));
  const clothesReminder=/event|wedding|botez/i.test(shootType);
  const session = { id: uid(), name: name?.trim() || t.name + ' · ' + today(), templateId, date: date || today(),shootType,reminderTime,reminderDate:'Cu o zi înainte',clothesReminder,clothesPrepTime:'09:05',clothesMorningTime:'07:00', mode: chargeItems.length?'charge':'pack', chargeItems, packItems: makeItems(), returnItems: makeItems(), completed: false };
  state.sessions.push(session);
  save(); modal.close(); activeTab = 'sessions'; currentSessionId = session.id; render();
  if(typeof scheduleSessionNotifications==='function') scheduleSessionNotifications(session);
}
function setSessionMode(id, mode) { byId(state.sessions, id).mode = mode; save(); render(); }
function toggleChecklist(sessionId, itemId, mode) {
  const s = byId(state.sessions, sessionId); const arr = mode === 'charge' ? s.chargeItems : mode === 'return' ? s.returnItems : s.packItems; const item = arr.find(i => i.id === itemId);
  item.checked = !item.checked; save(); render();
}
function toggleAll(sessionId, mode, checked) {
  const s = byId(state.sessions, sessionId); const arr = mode === 'charge' ? s.chargeItems : mode === 'return' ? s.returnItems : s.packItems;
  arr.forEach(i => i.checked = checked); save(); render();
}
function completeSession(id) {
  const session = byId(state.sessions, id);
  if (!session) return alert('Sesiunea nu a fost găsită.');
  session.completed = true;
  session.completedAt = new Date().toISOString();
  currentSessionId = null;
  activeTab = 'sessions';
  save();
  render();
}
function deleteSession(id) { if(confirm('Ștergi sesiunea?')) { state.sessions = state.sessions.filter(s => s.id !== id); currentSessionId = null; save(); render(); } }

function exportBackup() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `gear-check-backup-${today()}.json`; a.click();
  URL.revokeObjectURL(url);
}
importFile.addEventListener('change', async e => {
  const file = e.target.files[0]; if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    if (!data.gear || !data.bags || !data.templates) throw new Error('Format invalid');
    if (confirm('Importul va înlocui datele actuale. Continui?')) { state = data; migrateState(); save(); render(); }
  } catch (err) { alert('Backup invalid sau corupt.'); }
  importFile.value = '';
});

async function loadAntonioBackup() {
  const response = await fetch('./antonio-backup-2026-08-13.json', { cache: 'no-store' });
  if (!response.ok) throw new Error('Preset indisponibil');
  const data = await response.json();
  if (!data.gear || !data.bags || !data.templates) throw new Error('Preset invalid');
  return data;
}
async function restoreAntonioBackup() {
  if (!confirm('Restaurezi inventarul Toni din 13 august? Datele locale actuale vor fi înlocuite.')) return;
  try {
    state = await loadAntonioBackup();
    migrateState(); save(); render();
    alert('Presetul Toni a fost restaurat: inventarul complet, 6 bagaje și 7 template-uri.');
  } catch (err) { alert('Presetul Toni nu a putut fi încărcat.'); }
}

if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' }).then(reg=>reg.update()).catch(()=>{});
async function boot() {
  render();
  if (!hadStoredStateAtBoot) {
    try { state = await loadAntonioBackup(); migrateState(); save(); render(); }
    catch (err) { /* seedul intern rămâne fallback dacă fișierul nu este disponibil */ }
  }
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
else queueMicrotask(boot);
