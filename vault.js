let vaultDriveId = null;
let vaultSearch = '';

function vaultData(){
  state.mediaVault ||= {drives:[],entries:[]};
  state.mediaVault.drives ||= [];
  state.mediaVault.entries ||= [];
  return state.mediaVault;
}
function vaultDrive(id){return byId(vaultData().drives,id)}
function vaultEntries(id){return vaultData().entries.filter(e=>e.driveId===id)}
function vaultTypes(value=''){return String(value).split(',').map(x=>x.trim()).filter(Boolean)}
function vaultBackupLabel(status){return status==='none'?'Fără backup':status==='yes'?'Backup existent':'Backup necunoscut'}
function vaultBackupClass(status){return status==='none'?'warn':status==='yes'?'ok':''}
function normalizeVaultProjectName(name=''){
  let value=String(name).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\.(mp4|mov|mxf|prproj|drp)$/,'').trim();
  for(let i=0;i<3;i++)value=value.replace(/^(?:(?:19|20)\d{2}|\d+)[\s._-]+/,'');
  return value.replace(/[^a-z0-9]+/g,'');
}
function linkVaultProjects(){
  const groups=new Map();
  vaultData().entries.forEach(e=>{const key=normalizeVaultProjectName(e.name)||e.id;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(e)});
  groups.forEach(entries=>{const projectId=entries.find(e=>e.projectId)?.projectId||uid();entries.forEach(e=>e.projectId=projectId)});
}
function vaultProjectEntries(entry){
  if(!entry)return[];
  const key=normalizeVaultProjectName(entry.name);
  return vaultData().entries.filter(e=>(entry.projectId&&e.projectId===entry.projectId)||normalizeVaultProjectName(e.name)===key);
}
function vaultEffectiveBackup(entry){
  const locations=new Set(vaultProjectEntries(entry).map(e=>e.driveId));
  return locations.size>1?'yes':(entry.backupStatus||'unknown');
}
function uniqueVaultProjects(entries){
  const seen=new Set();return entries.filter(e=>{const key=e.projectId||normalizeVaultProjectName(e.name);if(seen.has(key))return false;seen.add(key);return true});
}

function renderVault(){
  linkVaultProjects();
  title.textContent='Media Vault';
  if(vaultDriveId && vaultDrive(vaultDriveId)) return renderVaultDrive(vaultDriveId);
  vaultDriveId=null;
  const data=vaultData(), q=vaultSearch.trim().toLocaleLowerCase('ro');
  const noBackup=uniqueVaultProjects(data.entries.filter(e=>vaultEffectiveBackup(e)==='none'));
  const results=q ? uniqueVaultProjects(data.entries.filter(e=>{
    const d=vaultDrive(e.driveId);
    return [e.name,e.client,e.date,e.types,e.size,e.path,e.notes,d?.name,d?.location].join(' ').toLocaleLowerCase('ro').includes(q);
  })) : [];
  view.innerHTML=`
    <div class="vault-toolbar"><input id="vaultSearchInput" type="search" value="${escapeHtml(vaultSearch)}" placeholder="Caută proiect, folder sau SSD…"><button class="primary tiny" onclick="openVaultDriveForm()">＋ SSD</button></div>
    ${q?`<div class="section-title"><h3>Rezultate</h3><span class="pill">${results.length}</span></div><div class="list">${results.map(vaultResultRow).join('')||empty('Nu am găsit nimic.')}</div>`:''}
    <div class="section-title"><h3>Fără backup</h3><span class="pill ${noBackup.length?'warn':'ok'}">${noBackup.length}</span></div>
    <div class="list">${noBackup.map(vaultResultRow).join('')||empty('Nu ai proiecte marcate fără backup.')}</div>
    <div class="section-title"><h3>SSD-uri / HDD-uri</h3><span class="pill">${data.drives.length}</span></div>
    <div class="grid">${data.drives.map(d=>{
      const entries=vaultEntries(d.id);
      return `<section class="card stack" onclick="vaultDriveId='${d.id}';renderVault()"><div class="vault-drive-head"><div><h2>${escapeHtml(d.name)}</h2><p class="muted">${escapeHtml(d.kind||'SSD')} · ${escapeHtml(d.capacity||'capacitate nespecificată')}</p></div><span class="pill ${d.status==='Problem'?'warn':''}">${escapeHtml(d.status||'Active')}</span></div><div class="vault-drive-meta"><span class="pill">${entries.length} ${entries.length===1?'element':'elemente'}</span>${d.freeSpace?`<span class="pill">${escapeHtml(d.freeSpace)} liber</span>`:''}${d.location?`<span class="pill">${escapeHtml(d.location)}</span>`:''}</div>${d.notes?`<p class="muted">${escapeHtml(d.notes)}</p>`:''}</section>`;
    }).join('')||empty('Adaugă primul SSD ca să începi catalogul.')}</div>`;
  document.getElementById('vaultSearchInput')?.addEventListener('input',e=>updateVaultSearch(e.target.value));
}

function updateVaultSearch(value){
  vaultSearch=value;
  renderVault();
  const input=document.getElementById('vaultSearchInput');
  if(input){input.focus();input.setSelectionRange(input.value.length,input.value.length)}
}

function vaultResultRow(e){
  const locations=vaultProjectEntries(e),drives=[...new Set(locations.map(x=>vaultDrive(x.driveId)?.name).filter(Boolean))],status=vaultEffectiveBackup(e);
  return `<div class="item vault-search-result" onclick="openVaultProjectInfo('${e.id}')"><div class="item-left"><div class="item-title">${escapeHtml(e.name)}</div><div class="item-sub">${escapeHtml(drives.join(' · ')||'Drive necunoscut')}${e.types?` · ${escapeHtml(e.types)}`:''}</div></div><span class="pill ${vaultBackupClass(status)}">${drives.length} ${drives.length===1?'locație':'locații'} · ${escapeHtml(vaultBackupLabel(status))}</span></div>`;
}

function renderVaultDrive(id){
  const d=vaultDrive(id); if(!d){vaultDriveId=null;return renderVault()}
  const entries=vaultEntries(id);
  title.textContent=d.name;
  view.innerHTML=`
    <button class="ghost tiny" onclick="vaultDriveId=null;renderVault()">‹ Toate SSD-urile</button>
    <section class="card stack" style="margin-top:10px"><div class="vault-drive-head"><div><h2>${escapeHtml(d.name)}</h2><p class="muted">${escapeHtml(d.kind||'SSD')} · ${escapeHtml(d.capacity||'fără capacitate')}</p></div><span class="pill ${d.status==='Problem'?'warn':''}">${escapeHtml(d.status||'Active')}</span></div><div class="vault-drive-meta">${d.freeSpace?`<span class="pill">${escapeHtml(d.freeSpace)} liber</span>`:''}${d.location?`<span class="pill">${escapeHtml(d.location)}</span>`:''}</div>${d.notes?`<p class="muted">${escapeHtml(d.notes)}</p>`:''}<div class="vault-actions"><button class="secondary" onclick="event.stopPropagation();openVaultDriveForm('${d.id}')">Editează SSD</button><button class="danger" onclick="event.stopPropagation();deleteVaultDrive('${d.id}')">Șterge SSD</button></div></section>
    <div class="section-title"><h3>Conținut</h3><button class="primary tiny" onclick="openVaultEntryForm('', '${d.id}')">＋ Conținut</button></div>
    <div class="list">${entries.map(e=>{const status=vaultEffectiveBackup(e),locations=new Set(vaultProjectEntries(e).map(x=>x.driveId)).size;return `<div class="item" onclick="openVaultProjectInfo('${e.id}')"><div class="item-left"><div class="item-title">${escapeHtml(e.name)}</div><div class="item-sub">${[e.client,e.date,e.size,e.path].filter(Boolean).map(escapeHtml).join(' · ')||'fără detalii'}</div><div class="vault-entry-types">${vaultTypes(e.types).map(t=>`<span class="pill">${escapeHtml(t)}</span>`).join('')}<span class="pill ${vaultBackupClass(status)}">${locations} ${locations===1?'locație':'locații'} · ${escapeHtml(vaultBackupLabel(status))}</span></div></div><button class="danger tiny" onclick="event.stopPropagation();deleteVaultEntry('${e.id}')">Șterge</button></div>`}).join('')||empty('SSD-ul este gol în catalog.')}</div>`;
}

function openVaultProjectInfo(id){
  const entry=byId(vaultData().entries,id);if(!entry)return;
  const locations=vaultProjectEntries(entry),status=vaultEffectiveBackup(entry);
  openModal(entry.name,`<div class="stack"><div class="row"><span class="pill ${vaultBackupClass(status)}">${escapeHtml(vaultBackupLabel(status))}</span><span class="pill">${locations.length} ${locations.length===1?'locație':'locații'}</span></div>${entry.notes?`<p class="muted">${escapeHtml(entry.notes)}</p>`:''}<div class="section-title"><h3>Unde îl găsești</h3></div><div class="list">${locations.map(location=>{const d=vaultDrive(location.driveId);return `<div class="item"><div class="item-left"><div class="item-title">${escapeHtml(d?.name||'Drive necunoscut')}</div><div class="item-sub">${[location.types,location.path,location.size].filter(Boolean).map(escapeHtml).join(' · ')}</div></div><button type="button" class="danger tiny" onclick="deleteVaultEntry('${location.id}',true)">Elimină</button></div>`}).join('')}</div><button type="button" class="primary" onclick="openVaultEntryForm('${entry.id}','${entry.driveId}')">Editează proiectul</button></div>`);
}

function openVaultDriveForm(id=''){
  const d=vaultDrive(id)||{name:'',kind:'SSD',capacity:'',freeSpace:'',location:'',status:'Active',notes:''};
  openModal(id?'Editează SSD':'Adaugă SSD',`<div class="form-grid"><label>Nume<input id="vdName" value="${escapeHtml(d.name)}" placeholder="Samsung T7 Shield #2"></label><label>Tip<select id="vdKind">${['SSD','HDD','NVMe','Card','Other'].map(x=>`<option ${x===d.kind?'selected':''}>${x}</option>`).join('')}</select></label><label>Capacitate<input id="vdCapacity" value="${escapeHtml(d.capacity)}" placeholder="2 TB"></label><label>Spațiu liber<input id="vdFree" value="${escapeHtml(d.freeSpace)}" placeholder="420 GB"></label><label>Locație fizică<input id="vdLocation" value="${escapeHtml(d.location)}" placeholder="Sertar studio"></label><label>Status<select id="vdStatus">${['Active','Archive','Full','Off-site','Problem','Retired'].map(x=>`<option ${x===d.status?'selected':''}>${x}</option>`).join('')}</select></label><label>Notițe<textarea id="vdNotes">${escapeHtml(d.notes)}</textarea></label><button type="button" class="primary" onclick="saveVaultDrive('${id}')">Salvează</button></div>`);
}
function saveVaultDrive(id=''){
  const payload={name:vdName.value.trim(),kind:vdKind.value,capacity:vdCapacity.value.trim(),freeSpace:vdFree.value.trim(),location:vdLocation.value.trim(),status:vdStatus.value,notes:vdNotes.value.trim()};
  if(!payload.name)return alert('Pune un nume pentru SSD.');
  if(id)Object.assign(vaultDrive(id),payload);else vaultData().drives.push({id:uid(),...payload});
  save();modal.close();renderVault();
}
function deleteVaultDrive(id){
  const d=vaultDrive(id);if(!d||!confirm(`Ștergi „${d.name}” și toate elementele lui din catalog? Fișierele reale nu sunt afectate.`))return;
  state.mediaVault.drives=state.mediaVault.drives.filter(x=>x.id!==id);state.mediaVault.entries=state.mediaVault.entries.filter(x=>x.driveId!==id);vaultDriveId=null;save();renderVault();
}

function openVaultEntryForm(id='',driveId=vaultDriveId){
  const e=byId(vaultData().entries,id)||{driveId,name:'',client:'',date:'',types:'RAW',size:'',path:'',notes:'',backupStatus:'unknown'};
  const currentLocations=id?vaultProjectEntries(e):[],selectedDrives=new Set(currentLocations.length?currentLocations.map(x=>x.driveId):[e.driveId||driveId]);
  openModal(id?'Editează proiect':'Adaugă proiect',`<div class="form-grid"><label>Nume proiect / folder<input id="veName" value="${escapeHtml(e.name)}" placeholder="Enforce Commercial"></label><div><p class="muted vault-form-label">Pe ce SSD-uri se află?</p><div class="list vault-drive-picker">${vaultData().drives.map(d=>`<label class="item template-choice"><input type="checkbox" class="veDriveChoice" value="${d.id}" ${selectedDrives.has(d.id)?'checked':''}><span><b>${escapeHtml(d.name)}</b><br><small class="muted">${escapeHtml(d.capacity||d.kind||'SSD')}</small></span></label>`).join('')}</div></div><label>Client — opțional<input id="veClient" value="${escapeHtml(e.client)}"></label><label>Data — opțional<input id="veDate" type="date" value="${escapeHtml(e.date)}"></label><label>Conținut<input id="veTypes" value="${escapeHtml(e.types)}" placeholder="RAW, Project, Export"></label><label>Backup manual<select id="veBackup"><option value="unknown" ${!e.backupStatus||e.backupStatus==='unknown'?'selected':''}>Necunoscut</option><option value="yes" ${e.backupStatus==='yes'?'selected':''}>Da · există și alt backup</option><option value="none" ${e.backupStatus==='none'?'selected':''}>Nu · fără backup</option></select></label><p class="muted">Dacă alegi minimum două SSD-uri, aplicația marchează automat proiectul cu backup existent.</p><label>Spațiu aproximativ<input id="veSize" value="${escapeHtml(e.size)}" placeholder="286 GB"></label><label>Folder / cale<input id="vePath" value="${escapeHtml(e.path)}" placeholder="/2026/ENFORCE/RAW"></label><label>Notițe<textarea id="veNotes">${escapeHtml(e.notes)}</textarea></label><button type="button" class="primary" onclick="saveVaultEntry('${id}')">Salvează</button></div>`);
}
function saveVaultEntry(id=''){
  const selected=[...document.querySelectorAll('.veDriveChoice:checked')].map(x=>x.value);
  const payload={name:veName.value.trim(),client:veClient.value.trim(),date:veDate.value,types:veTypes.value.trim(),backupStatus:veBackup.value,size:veSize.value.trim(),path:vePath.value.trim(),notes:veNotes.value.trim()};
  if(!payload.name)return alert('Pune numele proiectului sau folderului.');
  if(!selected.length)return alert('Alege cel puțin un SSD.');
  const source=id?byId(vaultData().entries,id):null,existing=source?vaultProjectEntries(source):[],projectId=source?.projectId||uid();
  const removed=existing.filter(e=>!selected.includes(e.driveId));
  if(removed.length&&!confirm(`Elimini proiectul de pe ${removed.map(e=>vaultDrive(e.driveId)?.name).filter(Boolean).join(', ')}? Fișierele reale nu sunt afectate.`))return;
  if(removed.length)state.mediaVault.entries=state.mediaVault.entries.filter(e=>!removed.includes(e));
  selected.forEach(driveId=>{const location=existing.find(e=>e.driveId===driveId);if(location)Object.assign(location,payload,{projectId});else vaultData().entries.push({id:uid(),driveId,projectId,...payload})});
  vaultDriveId=selected.includes(vaultDriveId)?vaultDriveId:selected[0];save();modal.close();renderVault();
}
function deleteVaultEntry(id,fromModal=false){
  const e=byId(vaultData().entries,id);if(!e||!confirm(`Ștergi „${e.name}” din catalog? Fișierele reale nu sunt afectate.`))return;
  state.mediaVault.entries=state.mediaVault.entries.filter(x=>x.id!==id);save();if(fromModal)modal.close();renderVault();
}
