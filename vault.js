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

function renderVault(){
  title.textContent='Media Vault';
  if(vaultDriveId && vaultDrive(vaultDriveId)) return renderVaultDrive(vaultDriveId);
  vaultDriveId=null;
  const data=vaultData(), q=vaultSearch.trim().toLocaleLowerCase('ro');
  const noBackup=data.entries.filter(e=>e.backupStatus==='none');
  const results=q ? data.entries.filter(e=>{
    const d=vaultDrive(e.driveId);
    return [e.name,e.client,e.date,e.types,e.size,e.path,e.notes,d?.name,d?.location].join(' ').toLocaleLowerCase('ro').includes(q);
  }) : [];
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
  const d=vaultDrive(e.driveId);
  return `<div class="item vault-search-result" onclick="vaultDriveId='${e.driveId}';renderVault()"><div class="item-left"><div class="item-title">${escapeHtml(e.name)}</div><div class="item-sub">${escapeHtml(d?.name||'Drive necunoscut')}${e.types?` · ${escapeHtml(e.types)}`:''}${e.path?` · ${escapeHtml(e.path)}`:''}</div></div><span class="pill ${vaultBackupClass(e.backupStatus)}">${escapeHtml(vaultBackupLabel(e.backupStatus))}</span></div>`;
}

function renderVaultDrive(id){
  const d=vaultDrive(id); if(!d){vaultDriveId=null;return renderVault()}
  const entries=vaultEntries(id);
  title.textContent=d.name;
  view.innerHTML=`
    <button class="ghost tiny" onclick="vaultDriveId=null;renderVault()">‹ Toate SSD-urile</button>
    <section class="card stack" style="margin-top:10px"><div class="vault-drive-head"><div><h2>${escapeHtml(d.name)}</h2><p class="muted">${escapeHtml(d.kind||'SSD')} · ${escapeHtml(d.capacity||'fără capacitate')}</p></div><span class="pill ${d.status==='Problem'?'warn':''}">${escapeHtml(d.status||'Active')}</span></div><div class="vault-drive-meta">${d.freeSpace?`<span class="pill">${escapeHtml(d.freeSpace)} liber</span>`:''}${d.location?`<span class="pill">${escapeHtml(d.location)}</span>`:''}</div>${d.notes?`<p class="muted">${escapeHtml(d.notes)}</p>`:''}<div class="vault-actions"><button class="secondary" onclick="event.stopPropagation();openVaultDriveForm('${d.id}')">Editează SSD</button><button class="danger" onclick="event.stopPropagation();deleteVaultDrive('${d.id}')">Șterge SSD</button></div></section>
    <div class="section-title"><h3>Conținut</h3><button class="primary tiny" onclick="openVaultEntryForm('', '${d.id}')">＋ Conținut</button></div>
    <div class="list">${entries.map(e=>`<div class="item"><div class="item-left" onclick="openVaultEntryForm('${e.id}','${d.id}')"><div class="item-title">${escapeHtml(e.name)}</div><div class="item-sub">${[e.client,e.date,e.size,e.path].filter(Boolean).map(escapeHtml).join(' · ')||'fără detalii'}</div><div class="vault-entry-types">${vaultTypes(e.types).map(t=>`<span class="pill">${escapeHtml(t)}</span>`).join('')}<span class="pill ${vaultBackupClass(e.backupStatus)}">${escapeHtml(vaultBackupLabel(e.backupStatus))}</span></div></div><button class="danger tiny" onclick="deleteVaultEntry('${e.id}')">Șterge</button></div>`).join('')||empty('SSD-ul este gol în catalog.')}</div>`;
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
  openModal(id?'Editează conținut':'Adaugă conținut',`<div class="form-grid"><label>Nume proiect / folder<input id="veName" value="${escapeHtml(e.name)}" placeholder="Enforce Commercial"></label><label>SSD<select id="veDrive">${vaultData().drives.map(d=>`<option value="${d.id}" ${d.id===(e.driveId||driveId)?'selected':''}>${escapeHtml(d.name)}</option>`).join('')}</select></label><label>Client — opțional<input id="veClient" value="${escapeHtml(e.client)}"></label><label>Data — opțional<input id="veDate" type="date" value="${escapeHtml(e.date)}"></label><label>Conținut<input id="veTypes" value="${escapeHtml(e.types)}" placeholder="RAW, Project, Export"></label><label>Backup<select id="veBackup"><option value="unknown" ${!e.backupStatus||e.backupStatus==='unknown'?'selected':''}>Necunoscut</option><option value="yes" ${e.backupStatus==='yes'?'selected':''}>Da · există backup</option><option value="none" ${e.backupStatus==='none'?'selected':''}>Nu · fără backup</option></select></label><label>Spațiu aproximativ<input id="veSize" value="${escapeHtml(e.size)}" placeholder="286 GB"></label><label>Folder / cale<input id="vePath" value="${escapeHtml(e.path)}" placeholder="/2026/ENFORCE/RAW"></label><label>Notițe<textarea id="veNotes">${escapeHtml(e.notes)}</textarea></label><button type="button" class="primary" onclick="saveVaultEntry('${id}')">Salvează</button></div>`);
}
function saveVaultEntry(id=''){
  const payload={driveId:veDrive.value,name:veName.value.trim(),client:veClient.value.trim(),date:veDate.value,types:veTypes.value.trim(),backupStatus:veBackup.value,size:veSize.value.trim(),path:vePath.value.trim(),notes:veNotes.value.trim()};
  if(!payload.name)return alert('Pune numele proiectului sau folderului.');
  if(id)Object.assign(byId(vaultData().entries,id),payload);else vaultData().entries.push({id:uid(),...payload});
  vaultDriveId=payload.driveId;save();modal.close();renderVault();
}
function deleteVaultEntry(id){
  const e=byId(vaultData().entries,id);if(!e||!confirm(`Ștergi „${e.name}” din catalog? Fișierele reale nu sunt afectate.`))return;
  state.mediaVault.entries=state.mediaVault.entries.filter(x=>x.id!==id);save();renderVault();
}
