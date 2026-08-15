function seedMediaVaultV20(){
  state.mediaVault ||= {drives:[],entries:[]};
  state.mediaVault.drives ||= [];
  state.mediaVault.entries ||= [];
  state.settings ||= {};
  if(state.settings.mediaVaultSeedV20)return;
  const driveSpecs=[
    ['DISK 1','1 TB','342,34 GB'],['DISK 2','1 TB','118,03 GB'],['DISK 3','1 TB','163,26 GB'],['DISK 4','1 TB','389,52 GB'],['DISK 5','1 TB','235,31 GB'],
    ['T7 1','',''],['T7 2','2 TB','321,59 GB'],['SSD 2TB SMS','2 TB','954,14 GB'],['T9 2TB','2 TB','921,01 GB'],['T9 1TB','1 TB','658,76 GB']
  ];
  const driveIds={};
  driveSpecs.forEach(([name,capacity,freeSpace])=>{
    let d=state.mediaVault.drives.find(x=>x.name===name);
    if(!d){d={id:uid(),name,kind:'SSD',capacity,freeSpace,location:'',status:'Active',notes:'Importat din capturile din 14 august 2026'};state.mediaVault.drives.push(d)}
    else{if(!d.capacity)d.capacity=capacity;if(!d.freeSpace)d.freeSpace=freeSpace}
    driveIds[name]=d.id;
  });
  const rows=[];
  const add=(drive,names,types='Folder',backupStatus='unknown',notes='')=>names.forEach(name=>rows.push([drive,name,types,backupStatus,notes]));

  add('DISK 1',['!!! BOTEZ ADAM !!!','Claude','CLIPS','ECO ADAM','LOGO','Oana','Premiere Pro Installation Guide','SONY LUTS']);
  add('DISK 2',['Adobe Premiere Pro Audio Previews','1 BOTEZ 2025 - Geamana','2025 MEMENTO MED','CAPPADOCIA','Condor','LIVIA 7','NINA GAL','Prestige 2025','Roxana MakeUp','SONY','Thereau','Music']);
  add('DISK 3',['2025 Ioana Bogdan LESE','2026 reels','Ana Bogdan','CUNUNIE ADINA 18 august','DUMAN DECEBAL PREZENTARE','gata 2025 BOTEZ/NUNTA CERNICA','Prestige 2 2025']);
  add('DISK 4',['1 Pilot Garage','2 OPTIMA','Cinema Grade LUT Pack - LandonBTW','EssentialSFX - LandonBTW','Motion-Text-Pro V4','SFX','STUDIOFont - LandonBTW','2026 Goncearu','Clinica NOU OCTOMBRIE','Diana nitreanu Rosxtogol','Ines Stana','Ioana Bogdan LESE','Livia 9 ani 2025','Majorat Alexia Gheara','NUNTA 8 IUN - Vasi & Denisa - card fat only']);
  add('DISK 5',['2fast_op','2024 Recap Prestige','2025 BOTEZ 18 oct','Botez 1','BOTEZ BOBI','Clinica Ensar - rino + laser','ID-Brothers editing MK','Mi','Thereau']);
  add('DISK 5',['A A.mp4','Amalia + Antonio - Baby reveal.mp4','Amalia + Antonio - Casatorie civila.mp4'],'Personal','unknown','Clip personal Toni & Amalia');

  add('T7 1',['!!! BOTEZ ADAM !!!','8 INFINITE + LUXURY','2025 BOTEZ/NUNTA CERNICA','2025 SNOW','2026 CaseBineFacute','Bridal 2024','DUMAN - Herastrau Prezentare','DUMAN - Promovare','DUMAN - SONY','Ines Stana','LeGrand 8','LIVIA CRACIUN','Maroco 1','NUNTA DAVID DIANA','Prestige','Zi nastere FATA Ilona','Zi nastere TATAL Ilona']);
  add('T7 1',['Botez KAIL & MAIA - 26 mai 2024.mp4','CUNUNIE Adina & Dan - 18 August 2023.mp4','Cununie ANDREEA & CATALIN - 24 IUN.mp4','Cununie ANDREEA & CATALIN Highlights.mp4','MAJORAT Ioana Badea.mp4','NUNTA DENISA & VASI - film cinematic.mp4','NUNTA L&D - Highlights.mp4','NUNTA Lorena&Dan.mp4','NUNTA Tanea & Silviu.mp4','REEL_NUNTA VASI & DENISA.mp4','REEL.mp4'],'Export final');

  add('T7 2',['1 DUMAN DECEBAL PREZENTARE','2026 ELENA','2026 Goncearu','Ami alex','Bebe Pitesti 5 luni','BOTEZ ADAM - POZE','RTFKT','2fast_op','2025 BOTEZ 18 oct','2025 MEMENTO MED','2026','Bridal 2024','Bridal Florens BU','CUNUNIE ADINA 18 august','Georgiana','LAVALIERA','LIVIA CRACIUN','Livia Masa Craciun','Majorat IOANA','Maroc 2','munte Amalia','NUNTA L&D','NUNTA TANEA','Prestige 2025']);
  add('T7 2',['A A.mp4','Amalia + Antonio - Baby reveal.mp4','Amalia + Antonio - Casatorie civila.mp4'],'Personal','unknown','Clip personal Toni & Amalia');
  add('T7 2',['Botez Anastasia Maria & Bogdan - 17 mai 2025.mp4','Eveniment fam. Doloiu.mp4','Jaqueline 7.mp4','NUNTA D&D-1080.mp4','NUNTA D&D.mp4','REEL 1_DIANA & DAVID_1.mp4','REEL 1_DIANA & DAVID.mp4','Trailer D&D.mp4'],'Export final');

  add('SSD 2TB SMS',['1 PET TECH','2025 40s Diana','2025 ILONA SERBARE','2026 2 fast','Amro’s Instagram Captions','BOTEZ 2025 - Geamana','CLINICA - Ziua lui Ensar','CLINICA 3 IUL','CLINICA BAIAT','CUNUNIE 24 IUN - Andreea & Catalin','DUMAN TURKISH SWEETS','Interviu Dr Catana','Livia PetrecereLMA','Livia Workshop','Motion-Text-Pro V4','NOU DUMAN','NUNTA 8 IUN - Vasi & Denisa - card fat only','NUNTA L&D','PRESTIGE 2025 - Event 22 febr','PRESTIGE 2025 - SASS','zi noua Duman']);
  add('SSD 2TB SMS',['Botez 1 scurt','reel 1','reel 2'],'Export final');

  add('T9 2TB',['1 Bridal Reina','1 DIANA - REAL ESTATE','1 PET TECH','Bridal Florens','CaseBineFacute','Dorian SSAB','Georgiana','Imobiliare FLOREASCA','Timeshift Effect']);
  add('T9 2TB',['NUNTA DORIAN'],'RAW, Project','none','Filmarea originală nu are backup. Folderul apare ca DORIAN pe SSD.');

  add('T9 1TB',['2025 SNOW','2026','1 Pilot Garage','2 OPTIMA','Cinema Grade LUT Pack - LandonBTW','Motion-Text-Pro V4','SFX','STUDIOFont - LandonBTW','2026 Goncearu','Ami alex','Bebe Pitesti 5 luni','BOTEZ ADAM - POZE','DAVINCI Resolve Projects BACKUP','Livia 10 LeGrand','LIZ','RTFKT','The-Powergrade-Bundle-Dopamine-Frame']);

  rows.forEach(([drive,name,types,backupStatus,notes])=>{
    const driveId=driveIds[drive];
    if(!driveId||state.mediaVault.entries.some(e=>e.driveId===driveId&&e.name===name))return;
    state.mediaVault.entries.push({id:uid(),driveId,name,client:'',date:'',types,size:'',path:name,notes,backupStatus});
  });
  state.settings.mediaVaultSeedV20=true;
  save();
}
seedMediaVaultV20();

function migrateDisk1ClipsV22(){
  state.settings ||= {};
  if(state.settings.disk1ClipsV22)return;
  const drive=state.mediaVault?.drives?.find(d=>d.name==='DISK 1');
  if(drive){
    state.mediaVault.entries=state.mediaVault.entries.filter(e=>!(e.driveId===drive.id&&e.name==='CLIPS'));
    ['DUMAN','CRĂCIUN CU FAMILIA'].forEach(name=>{
      if(!state.mediaVault.entries.some(e=>e.driveId===drive.id&&e.name===name))state.mediaVault.entries.push({id:uid(),driveId:drive.id,name,client:'',date:'',types:'Folder',size:'',path:`CLIPS/${name}`,notes:'Importat din folderul CLIPS de pe DISK 1',backupStatus:'unknown'});
    });
  }
  state.settings.disk1ClipsV22=true;save();
}
migrateDisk1ClipsV22();
