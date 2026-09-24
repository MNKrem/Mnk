document.getElementById('yr').textContent = new Date().getFullYear();

let PROJECTS = [];

/* ---------------- service area map (Leaflet + OpenStreetMap) ---------------- */
const HQ = [41.7606, -88.3201]; // Aurora, IL
const towns = [
  { name: 'Naperville', pos: [41.7508, -88.1535], mi: '~9 mi' },
  { name: 'North Aurora', pos: [41.7803, -88.3454], mi: '~5 mi' },
  { name: 'Oswego', pos: [41.6828, -88.3487], mi: '~8 mi' },
  { name: 'Plainfield', pos: [41.6023, -88.2073], mi: '~13 mi' },
  { name: 'Bolingbrook', pos: [41.6986, -88.0687], mi: '~15 mi' }
];

const serviceMap = L.map('serviceMap', { scrollWheelZoom: false }).setView(HQ, 10);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(serviceMap);

// Reads the site's --accent color straight from style.css, so changing
// the accent color there also changes the map circle — no need to edit it twice.
const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#3c5943';

// ~15 mile service radius around HQ, in meters
L.circle(HQ, {
  radius: 15 * 1609.34,
  color: accentColor,
  weight: 1.5,
  dashArray: '6 5',
  fillColor: accentColor,
  fillOpacity: 0.06
}).addTo(serviceMap);

L.marker(HQ).addTo(serviceMap)
  .bindPopup('<b>MNK Remodeling</b><br>Aurora, IL — home base')
  .openPopup();

towns.forEach(t => {
  L.marker(t.pos).addTo(serviceMap)
    .bindPopup(`<b>${t.name}</b><br>${t.mi} from HQ`);
});

/* ---------------- service data ---------------- */
const services = [
  {
    id:'bathroom', num:'01', title:'Bathroom Renovation', ph:'ph-1',
    blurb:'Full gut renovations, wet-area waterproofing, custom tile work, fixture installation, and glass enclosures.',
    icon:'<path d="M6 26h36v4a8 8 0 0 1-8 8H14a8 8 0 0 1-8-8v-4Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M10 26v-9a4 4 0 0 1 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="14" cy="9" r="2" stroke="currentColor" stroke-width="2"/>',
    body:[
      "A bathroom renovation touches almost every trade at once — plumbing, electrical, tile, and waterproofing all have to line up correctly before the pretty parts go in. We start with a full gut when the layout, subfloor, or plumbing lines need to move, and go lighter when the existing footprint already works.",
      "Waterproofing is the part that never shows up in a photo and is the difference between a bathroom that lasts fifteen years and one that fails behind the tile in three. We use membrane systems under every wet area, not just paint-on sealant, and we don't tile over a subfloor we haven't checked for rot or flex first.",
      "Typical scope includes: demo, rough plumbing and electrical relocation, waterproofing, custom tile (floor, shower walls, niches), vanity and countertop installation, glass shower enclosures, ventilation upgrades, and heated-floor rough-in on request. Most full bathroom renovations run 3–5 weeks depending on tile complexity and whether walls are moving.",
      "Powder rooms and guest baths are handled the same way at a smaller scale — usually 1–2 weeks, often without moving plumbing at all — for homeowners who want the finish quality without a full-gut budget."
    ],
    tags:['Waterproofing','Custom tile','Fixtures & glass','Permits','Heated floors (optional)']
  },
  {
    id:'kitchen', num:'02', title:'Kitchen Remodeling', ph:'ph-2',
    blurb:'Layout redesign, cabinetry, countertops, backsplashes, appliance integration, and lighting.',
    icon:'<path d="M10 14h28M14 14v22M34 14v22M14 22h20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="24" cy="10" r="2.4" fill="currentColor"/>',
    body:[
      "The kitchen is usually the most-used room in the house, which is exactly why layout decisions matter more here than anywhere else. We start by mapping how you actually cook and move through the space — the classic work-triangle between sink, stove, and fridge — before a single cabinet gets picked.",
      "Where it makes sense structurally, we remove load-bearing and non-load-bearing walls to open the kitchen to an adjacent room, coordinating the necessary beam or post work with a structural engineer when required by code.",
      "Scope typically covers: cabinetry (semi-custom or fully custom), countertops (quartz, granite, butcher block), tile or slab backsplash, under-cabinet and recessed lighting, appliance integration (including panel-ready fridges and hidden hoods), and plumbing/electrical relocation for islands or peninsulas.",
      "A full kitchen remodel generally runs 4–7 weeks. Cabinet refacing or a countertop-and-backsplash refresh without layout changes can be done in 1–2 weeks for homeowners not ready for a full rebuild."
    ],
    tags:['Cabinetry','Countertops','Lighting','Appliance integration','Wall removal']
  },
  {
    id:'basement', num:'03', title:'Basement Finishing', ph:'ph-3',
    blurb:'Insulation, framing, drywall, flooring, electrical, HVAC tie-ins, and custom millwork.',
    icon:'<rect x="8" y="18" width="32" height="20" rx="1" stroke="currentColor" stroke-width="2"/><path d="M8 18l16-10 16 10" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    body:[
      "An unfinished basement is one of the highest-return spaces in a house to build out, but only if moisture and egress are handled correctly from the start — that's where most basement projects go wrong.",
      "We assess the slab and walls for existing moisture issues before framing anything, install vapor barriers and insulation rated for below-grade use, and frame around existing mechanicals (sump pumps, ejector pits, main shutoffs) rather than boxing them in without access.",
      "A typical build includes: framing, insulation, drywall, egress window coordination where a bedroom is planned, electrical circuits and lighting, flooring (usually LVP or carpet tile for moisture tolerance), a full or half bathroom, and built-in storage or a wet bar on request.",
      "Most finished basements run 6–10 weeks depending on square footage and whether a bathroom is included. We pull the required permits and schedule inspections at each stage rather than treating it as unpermitted work — it matters for resale and for insurance."
    ],
    tags:['Insulation & framing','Electrical & HVAC','Egress & permits','Millwork']
  },
  {
    id:'carpentry', num:'04', title:'Custom Carpentry', ph:'ph-5',
    blurb:'Built-in shelving, wainscoting, crown molding, trim packages, window seats, and custom storage.',
    icon:'<path d="M8 40V16l16-10 16 10v24" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M16 40V24h16v16" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    body:[
      "Custom carpentry is usually what makes a remodeled room look finished rather than just renovated — trim, built-ins, and millwork that's sized and profiled to match the rest of the house instead of ordered off a shelf.",
      "We build and install floor-to-ceiling shelving, window seats with hidden storage, mudroom benches and lockers, wainscoting, coffered ceilings, and crown molding packages, matching existing profiles in older homes rather than defaulting to a generic modern trim.",
      "Every piece is built to the room's actual dimensions on-site or in our shop and finished (painted, stained, or clear-coated) to match existing woodwork — no pre-fab units caulked into an approximate gap.",
      "Smaller carpentry projects (a single built-in, a trim package for one room) typically run 3–7 days. Whole-house trim and multiple built-ins are scheduled alongside a larger remodel or as their own 2–3 week project."
    ],
    tags:['Built-ins','Trim & molding','Custom storage','Profile matching']
  },
  {
    id:'flooring', num:'05', title:'Flooring &amp; Tile', ph:'ph-4',
    blurb:'Hardwood, LVP, porcelain, ceramic, and natural stone. Proper subfloor prep, leveling, and precision installation.',
    icon:'<path d="M6 12h36v24H6z" stroke="currentColor" stroke-width="2"/><path d="M6 20h36M6 28h36M18 12v24M30 12v24" stroke="currentColor" stroke-width="1.4"/>',
    body:[
      "Most flooring failures trace back to what's underneath the material, not the material itself — an unlevel or moisture-compromised subfloor will eventually show through hardwood, LVP, or tile no matter how well it's installed. We assess and correct the subfloor before quoting the finish material.",
      "We install and repair hardwood (solid and engineered), luxury vinyl plank, porcelain and ceramic tile, and natural stone, including radiant-heat rough-in under tile where requested.",
      "Scope includes subfloor leveling and repair, moisture testing and vapor barriers where needed, transitions between rooms and flooring types, baseboard removal and reinstallation, and disposal of old flooring and adhesive.",
      "A single room typically runs 2–4 days once the subfloor is confirmed sound; whole-floor replacements or extensive subfloor repair extend to 1–2 weeks. We can usually match existing hardwood for partial repairs rather than requiring a full-room replacement."
    ],
    tags:['Hardwood & LVP','Tile & stone','Subfloor prep','Radiant heat (optional)']
  },
  {
    id:'whole-home', num:'06', title:'Whole-Home Remodeling', ph:'ph-4',
    blurb:'Multi-room coordination, structural modifications, open-concept conversions, and full interior updates.',
    icon:'<path d="M6 22 20 8l16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 20v18h20V20" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    body:[
      "A whole-home remodel is where having one crew across every room actually matters — trades that would normally be scheduled and managed separately (plumbing, electrical, flooring, cabinetry, trim) get sequenced by one project lead instead of getting lost between subcontractors.",
      "This is the right scope when several rooms are changing at once, when structural work in one area affects another (an opened-up kitchen changing sightlines into a living room, for example), or when a home needs a coordinated update rather than a series of disconnected projects done over several years.",
      "We handle the full sequence: structural modifications and permits, rough plumbing and electrical across all affected rooms, insulation and drywall, flooring transitions between spaces, cabinetry and built-ins, and a single finish pass (paint, trim, hardware) so the whole home reads as one project rather than several stitched together.",
      "Timelines vary widely by scope — a two-bathroom-plus-kitchen remodel typically runs 8–14 weeks. We provide a room-by-room schedule up front so you know which parts of the house are usable at each stage."
    ],
    tags:['Multi-room coordination','Structural work','Full interior updates','Single project lead']
  }
];

/* ---------------- render: nav overlay ---------------- */
const navList = document.getElementById('navList');
let navHtml = services.map(s=>`
  <button class="nav-item" data-nav="/services/${s.id}">
    <svg class="ic" viewBox="0 0 48 48" fill="none">${s.icon}</svg>
    <div><h3>${s.title}</h3><p>${s.blurb}</p></div>
  </button>`).join('');
navHtml += `
  <button class="nav-item" data-nav="/#ai-design">
    <svg class="ic" viewBox="0 0 48 48" fill="none"><rect x="7" y="9" width="34" height="24" rx="2" stroke="currentColor" stroke-width="2"/><path d="M7 27l9-8 7 6 7-9 11 11" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="17" cy="17" r="2.5" stroke="currentColor" stroke-width="2"/></svg>
    <div><h3>AI Design Preview <span style="color:var(--accent);font-size:11px;">BETA</span></h3><p>Upload a photo and get three style concepts.</p></div>
  </button>
  <button class="nav-item" data-nav="/#testimonials">
    <svg class="ic" viewBox="0 0 48 48" fill="none"><path d="M8 10h32v20H20l-8 7V30H8z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
    <div><h3>Testimonials</h3><p>What homeowners say.</p></div>
  </button>
  <button class="nav-item" data-nav="/#coverage">
    <svg class="ic" viewBox="0 0 48 48" fill="none"><path d="M24 5c8 0 13 6.2 13 13.4C37 29 24 43 24 43S11 29 11 18.4C11 11.2 16 5 24 5Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="24" cy="18" r="4.5" stroke="currentColor" stroke-width="2"/></svg>
    <div><h3>Service Area</h3><p>Aurora, Naperville and the western suburbs.</p></div>
  </button>
  <a href="#/contact" class="btn btn-primary nav-cta" data-nav="/#contact">Get a Quote</a>`;
navList.innerHTML = navHtml;

/* ---------------- selected work ---------------- */
const work = [
  {svc:'bathroom', img:'bathroom-full-overhaul', ph:'ph-1', cat:'Bathroom', title:'Spa-Style Primary Bath', desc:'Full-height marble shower, freestanding tub, pebble tile floor.'},
  {svc:'bathroom', img:'bathroom-fresh-tub', ph:'ph-6', cat:'Bathroom', title:'Tub-and-Shower Refresh', desc:'New tub, large-format tile, updated vanity and lighting.'},
  {svc:'carpentry', img:'carpentry-built-ins', ph:'ph-5', cat:'Carpentry', title:'Floating Media Wall', desc:'Custom slatted accent wall with backlit console and shelving.'},
  {svc:'carpentry', img:'carpentry-stair-railing', ph:'ph-5', cat:'Carpentry', title:'Staircase & Railing Rebuild', desc:'New treads, risers, and matching handrail throughout.'},
  {svc:'flooring', img:'flooring-primary-bath', ph:'ph-4', cat:'Flooring', title:'Primary Bath Tile Floor', desc:'Large-format porcelain plank, precision-laid.'},
  {svc:'bathroom', img:'bathroom-powder-room', ph:'ph-6', cat:'Bathroom', title:'Double-Vanity Refresh', desc:'Bookmatched stone backsplash, brass fixtures and mirrors.'}
];
document.getElementById('workGrid').innerHTML = work.map(w=>`
  <a class="work-card" href="#/services/${w.svc}" data-nav="/services/${w.svc}">
    <div class="work-photo ${w.ph}"><img src="images/work/${w.img}.jpg" alt="${w.title}" onerror="this.remove()"></div>
    <div class="work-body">
      <span class="work-cat">${w.cat}</span>
      <h3>${w.title}</h3>
      <p>${w.desc}</p>
    </div>
  </a>`).join('');

/* ---------------- render: home services list ---------------- */
document.getElementById('svcGrid').innerHTML = services.map(s=>`
  <a class="svc-row" href="#/services/${s.id}" data-nav="/services/${s.id}">
    <span class="num">${s.num}</span>
    <div><h3>${s.title}</h3><p>${s.blurb}</p></div>
    <span class="go">View &amp; photos →</span>
  </a>`).join('');

document.getElementById('footServices').innerHTML = services.map(s=>`
  <li><button data-nav="/services/${s.id}">${s.title}</button></li>`).join('');

/* ---------------- render: individual service pages ---------------- */
const pagesRoot = document.getElementById('service-pages');
pagesRoot.innerHTML = services.map(s=>`
  <div class="page" id="page-services-${s.id}">
    <section style="padding-top:44px;">
      <div class="wrap">
        <a class="back-link" href="#/" data-nav="/">← All services</a>
        <div class="svc-hero">
          <div>
            <span class="tag">SERVICE ${s.num}</span>
            <h1>${s.title}</h1>
          </div>
        </div>
        <div class="photo-card ${s.ph}" style="aspect-ratio:16/6;margin-top:24px;"><img src="${firstProjectCover(s.id) || `images/services/${s.id}-hero.jpg`}" alt="${s.title}" onerror="this.remove()"></div>
        <div class="svc-body">${s.body.map(p=>`<p>${p}</p>`).join('')}</div>
        <div class="svc-tags">${s.tags.map(t=>`<span>${t}</span>`).join('')}</div>

        <div class="gallery-head"><h2>Our ${s.title.toLowerCase()} projects</h2></div>
        <div class="projects-grid" data-projects-for="${s.id}"></div>

        <div class="cta-band">
          <p>Ready to talk through your ${s.title.toLowerCase()} project?</p>
          <a href="#/contact" class="btn btn-primary" data-nav="/#contact">Get a Quote</a>
        </div>

        <div class="related">
          <span class="sec-label">OTHER SERVICES</span>
          <div class="related-list">
            ${services.filter(o=>o.id!==s.id).map(o=>`<a href="#/services/${o.id}" data-nav="/services/${o.id}">${o.title}</a>`).join('')}
          </div>
        </div>
      </div>
    </section>
  </div>`).join('');

/* ---------------- projects & lightbox gallery ---------------- */
function projectPhotos(p){
  return Array.from({length:p.count}, (_,i)=> `images/projects/${p.folder}/${i+1}.${p.ext}`);
}
function firstProjectCover(serviceId){
  const p = PROJECTS.find(p=>p.service===serviceId);
  return p ? projectPhotos(p)[0] : null;
}

function renderAllProjectGrids(){
  document.querySelectorAll('[data-projects-for]').forEach(container=>{
    const serviceId = container.getAttribute('data-projects-for');
    const list = PROJECTS.filter(p=>p.service===serviceId);
    if(list.length === 0){
      container.innerHTML = `<p class="no-projects">Photos of completed ${serviceId} projects are coming soon.</p>`;
      return;
    }
    container.innerHTML = list.map((p)=>{
      const photos = projectPhotos(p);
      const globalIndex = PROJECTS.indexOf(p);
      return `
        <button class="project-card" data-open-gallery="${globalIndex}">
          <div class="project-cover"><img src="${photos[0]}" alt="${p.title}" loading="lazy"></div>
          <div class="project-body">
            <h3>${p.title}</h3>
            ${p.location ? `<p class="project-loc">${p.location}</p>` : ''}
            <span class="project-count">${photos.length} photo${photos.length>1?'s':''} · View gallery</span>
          </div>
        </button>`;
    }).join('');
  });
}

fetch('projects.json')
  .then(r => r.json())
  .then(data => { PROJECTS = data; renderAllProjectGrids(); })
  .catch(() => {
    document.querySelectorAll('[data-projects-for]').forEach(c=>{
      c.innerHTML = `<p class="no-projects">Couldn't load projects right now.</p>`;
    });
  });

let galleryPhotos = [];
let galleryIndex = 0;
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCounter = document.getElementById('lightboxCounter');
const lightboxTitle = document.getElementById('lightboxTitle');

function openGallery(projectIdx, startAt){
  const p = PROJECTS[projectIdx];
  if(!p) return;
  galleryPhotos = projectPhotos(p);
  galleryIndex = startAt || 0;
  lightboxTitle.textContent = p.title;
  showGalleryPhoto();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeGallery(){
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}
function showGalleryPhoto(){
  lightboxImg.src = galleryPhotos[galleryIndex];
  lightboxCounter.textContent = `${galleryIndex+1} / ${galleryPhotos.length}`;
}
function nextGalleryPhoto(){ galleryIndex = (galleryIndex+1) % galleryPhotos.length; showGalleryPhoto(); }
function prevGalleryPhoto(){ galleryIndex = (galleryIndex-1+galleryPhotos.length) % galleryPhotos.length; showGalleryPhoto(); }

document.addEventListener('click', e=>{
  const openBtn = e.target.closest('[data-open-gallery]');
  if(openBtn){ openGallery(parseInt(openBtn.getAttribute('data-open-gallery'), 10), 0); return; }
  if(e.target.closest('[data-lightbox-close]')){ closeGallery(); return; }
  if(e.target.closest('[data-lightbox-next]')){ nextGalleryPhoto(); return; }
  if(e.target.closest('[data-lightbox-prev]')){ prevGalleryPhoto(); return; }
  if(e.target === lightbox){ closeGallery(); }
});
document.addEventListener('keydown', e=>{
  if(!lightbox.classList.contains('open')) return;
  if(e.key === 'Escape') closeGallery();
  if(e.key === 'ArrowRight') nextGalleryPhoto();
  if(e.key === 'ArrowLeft') prevGalleryPhoto();
});

/* swipe support for the lightbox on touch devices */
let touchStartX = null;
let touchStartY = null;
lightbox.addEventListener('touchstart', e=>{
  touchStartX = e.changedTouches[0].clientX;
  touchStartY = e.changedTouches[0].clientY;
}, {passive:true});
lightbox.addEventListener('touchend', e=>{
  if(touchStartX === null) return;
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  touchStartX = null;
  // ignore mostly-vertical swipes so scrolling isn't hijacked
  if(Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
  if(dx < 0) nextGalleryPhoto(); else prevGalleryPhoto();
}, {passive:true});

/* ---------------- router ---------------- */
const homePage = document.getElementById('page-home');
const allPages = ()=> [homePage, ...pagesRoot.querySelectorAll('.page')];

function route(){
  let hash = location.hash.replace(/^#/,'') || '/';
  const [pathPart, anchor] = hash.split('#');
  const path = pathPart || '/';
  const m = path.match(/^\/services\/([a-z-]+)$/);

  allPages().forEach(p=>p.classList.remove('active'));

  if(m && document.getElementById('page-services-'+m[1])){
    const svc = services.find(s=>s.id===m[1]);
    document.getElementById('page-services-'+m[1]).classList.add('active');
    document.title = svc ? `${svc.title} — MNK Remodeling` : 'MNK Remodeling';
    window.scrollTo(0,0);
  } else {
    homePage.classList.add('active');
    document.title = 'Home Remodeling & Bathroom Renovation | MNK Remodeling';
    if(anchor){
      requestAnimationFrame(()=>{
        const el = document.getElementById(anchor);
        if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
      });
    } else if(path === '/'){
      window.scrollTo(0,0);
    }
  }
  closeNav();
}

document.addEventListener('click', e=>{
  const el = e.target.closest('[data-nav]');
  if(!el) return;
  e.preventDefault();
  const target = el.getAttribute('data-nav');
  location.hash = '#' + target;
  if(location.hash === '#' + target){ route(); }
});
window.addEventListener('hashchange', route);

/* ---------------- hamburger ---------------- */
const burger = document.getElementById('burgerBtn');
const overlay = document.getElementById('navOverlay');
function closeNav(){overlay.classList.remove('open');burger.classList.remove('open');burger.setAttribute('aria-expanded','false');}
burger.addEventListener('click', ()=>{
  const open = overlay.classList.toggle('open');
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
});

/* ---------------- contact form: sends to /api/quote (Pages Function -> Telegram) ---------------- */
const quoteForm = document.getElementById('quoteForm');
const quoteSubmitBtn = quoteForm.querySelector('button[type="submit"]');
quoteForm.addEventListener('submit', async function(e){
  e.preventDefault();
  quoteSubmitBtn.disabled = true;
  const payload = {
    name: document.getElementById('qName').value,
    phone: document.getElementById('qPhone').value,
    service: document.getElementById('qService').value,
    message: document.getElementById('qMsg').value
  };
  try{
    const res = await fetch('/api/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if(!res.ok) throw new Error('Request failed (' + res.status + ')');
    document.getElementById('formOk').classList.add('show');
    this.reset();
  } catch(err){
    alert("Couldn't send your request — please call or email us directly. (" + err.message + ")");
  } finally {
    quoteSubmitBtn.disabled = false;
  }
});

/* ---------------- AI design preview: real generation via /api/ai-design (Pages Function) ---------------- */
const WORKER_URL = "/api/ai-design";

const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');
const beforeCanvas = document.getElementById('beforeCanvas');
const aiStatus = document.getElementById('aiStatus');
const generateBtn = document.getElementById('generateBtn');
const roomTypeSelect = document.getElementById('roomTypeSelect');
const variantSlots = [0,1,2].map(i => document.querySelector(`.variant-canvas-wrap[data-slot="${i}"]`));
const variantLabels = [0,1,2].map(i => document.querySelector(`.variant-label[data-label="${i}"]`));

const STYLE_DISPLAY_NAMES = {
  scandinavian_minimalist: 'Scandinavian Minimalist',
  modern_luxury: 'Modern Luxury',
  farmhouse_chic: 'Farmhouse Chic',
  coastal_beachy: 'Coastal Beachy',
  mid_century_modern: 'Mid-Century Modern',
  rustic_bohemian: 'Rustic Bohemian',
  industrial_modern: 'Industrial Modern',
  art_deco_glamour: 'Art Deco Glamour',
  mediterranean_villa: 'Mediterranean Villa',
  japanese_zen: 'Japanese Zen',
  victorian_elegant: 'Victorian Elegant',
  tropical_modern: 'Tropical Modern'
};

let uploadedDataUri = null;

dropZone.addEventListener('click', ()=> fileInput.click());
fileInput.addEventListener('change', e=>{
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = ()=>{
    uploadedDataUri = reader.result;
    const img = new Image();
    img.onload = ()=>{
      fitCanvas(beforeCanvas, img, beforeCanvas.parentElement.clientWidth || 400);
      beforeCanvas.getContext('2d').drawImage(img, 0, 0, beforeCanvas.width, beforeCanvas.height);
      dropZone.classList.add('has-img');
    };
    img.src = uploadedDataUri;
    generateBtn.disabled = false;
    resetVariants();
    aiStatus.textContent = '';
  };
  reader.readAsDataURL(file);
});

function fitCanvas(canvas, img, containerWidth){
  const ratio = img.height / img.width;
  canvas.width = containerWidth;
  canvas.height = Math.max(160, containerWidth*ratio);
}

function resetVariants(){
  variantSlots.forEach((slot, i) => {
    slot.innerHTML = `<span class="empty">Concept ${i+1}</span>`;
  });
  variantLabels.forEach(label => label.textContent = '—');
}

function setLoadingVariants(){
  variantSlots.forEach(slot => {
    slot.innerHTML = `<div class="spinner"></div>`;
  });
}

generateBtn.addEventListener('click', async ()=>{
  if(!uploadedDataUri) return;
  generateBtn.disabled = true;
  setLoadingVariants();
  aiStatus.textContent = 'Generating three real design concepts — this can take 20–60 seconds…';

  try{
    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: uploadedDataUri, roomType: roomTypeSelect.value })
    });
    const data = await res.json();
    if(!res.ok || data.error){
      throw new Error(data.error || `Request failed (${res.status})`);
    }
    data.variants.forEach((variant, i) => {
      const slot = variantSlots[i];
      if(!slot) return;
      const img = document.createElement('img');
      img.src = variant.url;
      img.alt = STYLE_DISPLAY_NAMES[variant.style] || variant.style;
      slot.innerHTML = '';
      slot.appendChild(img);
      variantLabels[i].textContent = STYLE_DISPLAY_NAMES[variant.style] || variant.style;
    });
    aiStatus.textContent = 'Three concepts ready.';
  } catch(err){
    aiStatus.textContent = `Couldn't generate concepts: ${err.message}`;
    resetVariants();
  } finally {
    generateBtn.disabled = false;
  }
});

/* run the initial route only after every listener above is wired up */
route();


