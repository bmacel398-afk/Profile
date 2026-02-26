// ══════════════════════════════════════════════════════
// PAGE NAVIGATION SYSTEM
// ══════════════════════════════════════════════════════
(function() {
    const pages   = document.querySelectorAll(".page");
    const navLinks = document.querySelectorAll("nav a[data-page]");
    const logo    = document.getElementById("logoHome");

    function showPage(pageId) {
        pages.forEach(p => {
            p.classList.remove("active", "entering");
            p.style.display = "none";
        });

        navLinks.forEach(l => l.classList.remove("nav-active"));

        const target = document.getElementById("page-" + pageId);
        if (target) {
            target.style.display = "block";
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    target.classList.add("active");
                });
            });
        }

        navLinks.forEach(l => {
            if (l.dataset.page === pageId) l.classList.add("nav-active");
        });

        window.scrollTo({ top: 0, behavior: "smooth" });
        sessionStorage.setItem("currentPage", pageId);
    }

    navLinks.forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            showPage(link.dataset.page);
        });
    });

    document.addEventListener("click", e => {
        const el = e.target.closest("[data-page]");
        if (el && !el.closest("nav")) {
            e.preventDefault();
            showPage(el.dataset.page);
        }
    });

    if (logo) {
        logo.addEventListener("click", () => showPage("home"));
    }

    document.querySelectorAll(".timeline-dot").forEach(dot => {
        dot.addEventListener("click", () => dot.classList.toggle("checked"));
    });

    const saved = sessionStorage.getItem("currentPage");
    if (saved) {
        showPage(saved);
    } else {
        const home = document.getElementById("page-home");
        if (home) {
            home.style.display = "block";
            home.classList.add("active");
        }
    }
})();


// ══════════════════════════════════════════════════════
// DARK MODE
// ══════════════════════════════════════════════════════
const toggleBtn = document.getElementById("themeToggle");

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
}

toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme",
        document.body.classList.contains("dark") ? "dark" : "light"
    );
});


// ══════════════════════════════════════════════════════
// TYPING EFFECT
// ══════════════════════════════════════════════════════
const roles = ["Computer Science", "CETA Department"];
let roleIndex = 0;
let charIndex = 0;
const typingElement = document.getElementById("typing");

function typeEffect() {
    if (charIndex < roles[roleIndex].length) {
        typingElement.textContent += roles[roleIndex].charAt(charIndex);
        charIndex++;
        setTimeout(typeEffect, 100);
    } else {
        setTimeout(eraseEffect, 1500);
    }
}

function eraseEffect() {
    if (charIndex > 0) {
        typingElement.textContent = roles[roleIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(eraseEffect, 50);
    } else {
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(typeEffect, 500);
    }
}

typeEffect();


// ══════════════════════════════════════════════════════
// LOADER
// ══════════════════════════════════════════════════════
window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    if (loader) {
        loader.style.opacity = "0";
        setTimeout(() => loader.style.display = "none", 500);
    }
});


// ══════════════════════════════════════════════════════
// CURSOR — Dot + Aura only
// ══════════════════════════════════════════════════════
(function() {
    const aura = document.querySelector(".cursor-aura");
    const dot  = document.querySelector(".cursor-dot");

    if (!dot) return;

    const mouse = { x: window.innerWidth / 2,  y: window.innerHeight / 2 };
    const auraP = { x: mouse.x, y: mouse.y };

    document.addEventListener("mousemove", e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        dot.style.left = e.clientX + "px";
        dot.style.top  = e.clientY + "px";
    });

    function tick() {
        auraP.x += (mouse.x - auraP.x) * 0.05;
        auraP.y += (mouse.y - auraP.y) * 0.05;
        if (aura) {
            aura.style.left = auraP.x + "px";
            aura.style.top  = auraP.y + "px";
        }
        requestAnimationFrame(tick);
    }
    tick();

    document.addEventListener("click", e => {
        const burst = document.createElement("div");
        burst.className = "cursor-burst";
        burst.style.left = e.clientX + "px";
        burst.style.top  = e.clientY + "px";
        document.body.appendChild(burst);
        setTimeout(() => burst.remove(), 650);
    });

    document.addEventListener("mouseleave", () => {
        [aura, dot].forEach(el => { if (el) el.style.opacity = "0"; });
    });
    document.addEventListener("mouseenter", () => {
        [aura, dot].forEach(el => { if (el) el.style.opacity = "1"; });
    });
})();


// ══════════════════════════════════════════════════════
// IMAGE LIGHTBOX MODAL
// ══════════════════════════════════════════════════════
const modal    = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImg");
const closeBtn = document.querySelector(".close");

if (closeBtn) closeBtn.onclick = () => modal.style.display = "none";
if (modal)    modal.onclick    = e => { if (e.target === modal) modal.style.display = "none"; };


// ══════════════════════════════════════════════════════
// PROFILE PHOTO — Upload / Delete / Persist
// ══════════════════════════════════════════════════════
(function() {
    const uploadInput    = document.getElementById("uploadProfile");
    const profilePreview = document.getElementById("profilePreview");
    const deleteBtn      = document.getElementById("deleteProfile");

    if (!uploadInput || !profilePreview || !deleteBtn) return;

    const saved = localStorage.getItem("profileImage");
    if (saved) profilePreview.src = saved;

    uploadInput.addEventListener("change", function() {
        const file = this.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = e => {
            profilePreview.src = e.target.result;
            localStorage.setItem("profileImage", e.target.result);
        };
        reader.readAsDataURL(file);
    });

    deleteBtn.addEventListener("click", () => {
        profilePreview.src = "graduation.jpg";
        localStorage.removeItem("profileImage");
    });
})();


// ══════════════════════════════════════════════════════
// INDEXEDDB HELPER
// ══════════════════════════════════════════════════════
function openDB(dbName, storeName) {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(dbName, 1);
        req.onupgradeneeded = e => {
            e.target.result.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
        };
        req.onsuccess = e => resolve(e.target.result);
        req.onerror   = e => reject(e.target.error);
    });
}

function dbGetAll(db, storeName) {
    return new Promise((resolve, reject) => {
        const tx  = db.transaction(storeName, "readonly");
        const req = tx.objectStore(storeName).getAll();
        req.onsuccess = e => resolve(e.target.result);
        req.onerror   = e => reject(e.target.error);
    });
}

function dbAdd(db, storeName, record) {
    return new Promise((resolve, reject) => {
        const tx  = db.transaction(storeName, "readwrite");
        const req = tx.objectStore(storeName).add(record);
        req.onsuccess = e => resolve(e.target.result);
        req.onerror   = e => reject(e.target.error);
    });
}

function dbDelete(db, storeName, id) {
    return new Promise((resolve, reject) => {
        const tx  = db.transaction(storeName, "readwrite");
        const req = tx.objectStore(storeName).delete(id);
        req.onsuccess = () => resolve();
        req.onerror   = e => reject(e.target.error);
    });
}


// ══════════════════════════════════════════════════════
// PROJECT IMAGE UPLOADS (AI SaaS / Workout / Cert) — with IndexedDB persistence
// ══════════════════════════════════════════════════════
async function setupImageUpload(inputId, containerId) {
    const input     = document.getElementById(inputId);
    const container = document.getElementById(containerId);
    if (!input || !container) return;

    const dbName    = "projectImages_" + containerId;
    const storeName = "images";
    const db        = await openDB(dbName, storeName);

    // Load persisted images
    const saved = await dbGetAll(db, storeName);
    saved.forEach(record => {
        addImageToContainer(container, record.dataUrl, db, storeName, record.id);
    });

    input.addEventListener("change", async function() {
        const file = this.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async e => {
            const dataUrl = e.target.result;
            const id = await dbAdd(db, storeName, { dataUrl });
            addImageToContainer(container, dataUrl, db, storeName, id);
        };
        reader.readAsDataURL(file);
        this.value = "";
    });
}

function addImageToContainer(container, src, db, storeName, id) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("image-wrapper");

    const img = document.createElement("img");
    img.src = src;
    img.addEventListener("click", () => {
        if (modal && modalImg) { modalImg.src = src; modal.style.display = "block"; }
    });

    const delBtn = document.createElement("button");
    delBtn.textContent = "✕";
    delBtn.classList.add("delete-btn");
    delBtn.title = "Remove photo";
    delBtn.onclick = async () => {
        await dbDelete(db, storeName, id);
        wrapper.remove();
    };

    wrapper.appendChild(img);
    wrapper.appendChild(delBtn);
    container.appendChild(wrapper);
}

setupImageUpload("uploadSaas",    "saasImages");
setupImageUpload("uploadWorkout", "workoutImages");
setupImageUpload("uploadCert",    "certImages");


// ══════════════════════════════════════════════════════
// CREATE NEW PROJECT MODAL
// ══════════════════════════════════════════════════════

// Inject modal HTML into the page
(function injectProjectModal() {
    const overlay = document.createElement("div");
    overlay.id = "newProjectModal";
    overlay.style.cssText = `
        display:none; position:fixed; inset:0; z-index:9995;
        background:rgba(0,0,0,0.82); backdrop-filter:blur(10px);
        align-items:center; justify-content:center;
    `;
    overlay.innerHTML = `
        <div id="newProjectBox" style="
            background:var(--charcoal);
            border:1px solid var(--glass-border);
            border-top: 2px solid var(--gold);
            padding:40px 36px;
            width:480px; max-width:92vw;
            border-radius:12px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.6);
            position:relative;
            animation: zoomIn 0.3s ease;
        ">
            <button id="closeProjectModal" style="
                position:absolute; top:14px; right:18px;
                background:none; border:none;
                color:var(--text-dim); font-size:22px; cursor:pointer;
                transition:color 0.2s;
            " title="Close">&times;</button>

            <h3 style="
                font-family:var(--font-display);
                font-size:26px; color:var(--gold);
                margin-bottom:6px; letter-spacing:0.5px;
            ">New Project</h3>
            <p style="
                font-size:11px; letter-spacing:2px; text-transform:uppercase;
                color:var(--text-dim); margin-bottom:28px;
            ">Fill in your project details</p>

            <label style="display:block; font-size:11px; letter-spacing:2px; text-transform:uppercase; color:var(--text-muted); margin-bottom:8px;">Project Name *</label>
            <input id="newProjectName" type="text" placeholder="e.g. My Awesome App" style="
                width:100%; padding:11px 14px;
                background:var(--ink); border:1px solid var(--glass-border);
                color:var(--text-primary); font-family:var(--font-body);
                font-size:14px; border-radius:6px; outline:none;
                transition:border-color 0.3s; margin-bottom:18px;
            ">

            <label style="display:block; font-size:11px; letter-spacing:2px; text-transform:uppercase; color:var(--text-muted); margin-bottom:8px;">Description</label>
            <textarea id="newProjectDesc" rows="3" placeholder="Brief description of what this project does..." style="
                width:100%; padding:11px 14px;
                background:var(--ink); border:1px solid var(--glass-border);
                color:var(--text-primary); font-family:var(--font-body);
                font-size:14px; border-radius:6px; outline:none; resize:vertical;
                transition:border-color 0.3s; margin-bottom:18px;
            "></textarea>

            <label style="display:block; font-size:11px; letter-spacing:2px; text-transform:uppercase; color:var(--text-muted); margin-bottom:8px;">Tech Stack (optional)</label>
            <input id="newProjectStack" type="text" placeholder="e.g. React, Node.js, Python" style="
                width:100%; padding:11px 14px;
                background:var(--ink); border:1px solid var(--glass-border);
                color:var(--text-primary); font-family:var(--font-body);
                font-size:14px; border-radius:6px; outline:none;
                transition:border-color 0.3s; margin-bottom:28px;
            ">

            <div style="display:flex; gap:12px; justify-content:flex-end;">
                <button id="cancelProjectModal" style="
                    padding:10px 22px; background:transparent;
                    border:1px solid var(--glass-border); color:var(--text-muted);
                    font-family:var(--font-body); font-size:11px; letter-spacing:2px;
                    text-transform:uppercase; border-radius:4px; cursor:pointer;
                    transition:all 0.3s;
                ">Cancel</button>
                <button id="confirmProjectModal" style="
                    padding:10px 26px; background:var(--gold);
                    border:1px solid var(--gold); color:var(--obsidian);
                    font-family:var(--font-body); font-size:11px; letter-spacing:2px;
                    font-weight:600; text-transform:uppercase; border-radius:4px;
                    cursor:pointer; transition:all 0.3s;
                ">Create Project</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    // Focus style on inputs
    overlay.querySelectorAll("input, textarea").forEach(el => {
        el.addEventListener("focus",  () => el.style.borderColor = "var(--gold)");
        el.addEventListener("blur",   () => el.style.borderColor = "var(--glass-border)");
    });
    overlay.querySelector("#closeProjectModal").addEventListener("mouseenter",  e => e.target.style.color = "var(--gold)");
    overlay.querySelector("#closeProjectModal").addEventListener("mouseleave",  e => e.target.style.color = "var(--text-dim)");
    overlay.querySelector("#cancelProjectModal").addEventListener("mouseenter", e => { e.target.style.borderColor="var(--gold)"; e.target.style.color="var(--gold)"; });
    overlay.querySelector("#cancelProjectModal").addEventListener("mouseleave", e => { e.target.style.borderColor="var(--glass-border)"; e.target.style.color="var(--text-muted)"; });
    overlay.querySelector("#confirmProjectModal").addEventListener("mouseenter",e => { e.target.style.background="var(--gold-light)"; });
    overlay.querySelector("#confirmProjectModal").addEventListener("mouseleave",e => { e.target.style.background="var(--gold)"; });
})();

function openProjectModal() {
    const overlay = document.getElementById("newProjectModal");
    overlay.style.display = "flex";
    document.getElementById("newProjectName").value  = "";
    document.getElementById("newProjectDesc").value  = "";
    document.getElementById("newProjectStack").value = "";
    setTimeout(() => document.getElementById("newProjectName").focus(), 50);
}

function closeProjectModal() {
    document.getElementById("newProjectModal").style.display = "none";
}

document.getElementById("closeProjectModal").addEventListener("click", closeProjectModal);
document.getElementById("cancelProjectModal").addEventListener("click", closeProjectModal);
document.getElementById("newProjectModal").addEventListener("click", e => {
    if (e.target.id === "newProjectModal") closeProjectModal();
});

document.getElementById("newProjectName").addEventListener("keydown", e => {
    if (e.key === "Enter") document.getElementById("confirmProjectModal").click();
});

document.getElementById("confirmProjectModal").addEventListener("click", () => {
    const name  = document.getElementById("newProjectName").value.trim();
    const desc  = document.getElementById("newProjectDesc").value.trim();
    const stack = document.getElementById("newProjectStack").value.trim();
    if (!name) {
        document.getElementById("newProjectName").style.borderColor = "#e05555";
        document.getElementById("newProjectName").focus();
        return;
    }
    closeProjectModal();
    createProject(name, desc, stack);
});


// ══════════════════════════════════════════════════════
// DYNAMIC CS PROJECT SYSTEM — with persistence
// ══════════════════════════════════════════════════════

const addProjectBtn   = document.getElementById("addProjectBtn");
const dynamicProjects = document.getElementById("dynamicProjects");

addProjectBtn.addEventListener("click", openProjectModal);

// Load saved projects from localStorage on page load
(async function loadSavedProjects() {
    const savedProjects = JSON.parse(localStorage.getItem("dynamicProjects") || "[]");
    for (const proj of savedProjects) {
        await createProject(proj.name, proj.desc, proj.stack, proj.id, false);
    }
})();

function saveProjectsState() {
    const blocks = dynamicProjects.querySelectorAll(".project-block-dynamic");
    const state = Array.from(blocks).map(b => ({
        id:    b.dataset.projectId,
        name:  b.dataset.projectName,
        desc:  b.dataset.projectDesc,
        stack: b.dataset.projectStack,
    }));
    localStorage.setItem("dynamicProjects", JSON.stringify(state));
}

async function createProject(name, desc, stack, projectId, saveState = true) {
    const id = projectId || ("proj_" + Date.now());

    const projectBlock = document.createElement("div");
    projectBlock.classList.add("project-block-dynamic");
    projectBlock.dataset.projectId   = id;
    projectBlock.dataset.projectName = name;
    projectBlock.dataset.projectDesc = desc  || "";
    projectBlock.dataset.projectStack= stack || "";

    // Build stack tags HTML
    const stackTags = stack
        ? stack.split(",").map(s => s.trim()).filter(Boolean)
              .map(t => `<span class="proj-tag">${t}</span>`).join("")
        : "";

    projectBlock.innerHTML = `
        <div class="project-header">
            <div>
                <h3>${name}</h3>
                ${desc  ? `<p class="proj-desc">${desc}</p>` : ""}
                ${stackTags ? `<div class="proj-tags">${stackTags}</div>` : ""}
            </div>
            <button class="delete-project-btn" title="Delete project">
                <i class="fas fa-trash-alt"></i> Delete
            </button>
        </div>
        <label class="upload-btn" style="margin-bottom:12px; display:inline-flex; align-items:center; gap:6px;">
            <i class="fas fa-plus"></i> Add Image
            <input type="file" accept="image/*" multiple hidden>
        </label>
        <div class="project-images"></div>
    `;

    const uploadInput      = projectBlock.querySelector("input[type='file']");
    const imageContainer   = projectBlock.querySelector(".project-images");
    const deleteProjectBtn = projectBlock.querySelector(".delete-project-btn");

    // Set up IndexedDB for this project's images
    const dbName    = "dynamicProject_" + id;
    const storeName = "images";
    const db        = await openDB(dbName, storeName);

    // Load persisted images for this project
    const savedImgs = await dbGetAll(db, storeName);
    savedImgs.forEach(record => {
        addDynamicImage(imageContainer, record.dataUrl, db, storeName, record.id);
    });

    uploadInput.addEventListener("change", async function() {
        const files = Array.from(this.files);
        for (const file of files) {
            await new Promise(resolve => {
                const reader = new FileReader();
                reader.onload = async e => {
                    const dataUrl = e.target.result;
                    const imgId = await dbAdd(db, storeName, { dataUrl });
                    addDynamicImage(imageContainer, dataUrl, db, storeName, imgId);
                    resolve();
                };
                reader.readAsDataURL(file);
            });
        }
        this.value = "";
    });

    deleteProjectBtn.addEventListener("click", async () => {
        if (confirm(`Delete project "${name}"?`)) {
            // Clear all images from IndexedDB for this project
            const allImgs = await dbGetAll(db, storeName);
            for (const img of allImgs) await dbDelete(db, storeName, img.id);
            projectBlock.remove();
            saveProjectsState();
        }
    });

    dynamicProjects.appendChild(projectBlock);

    if (saveState) saveProjectsState();
}

function addDynamicImage(container, src, db, storeName, id) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("image-wrapper-dynamic");

    const img = document.createElement("img");
    img.src = src;
    img.addEventListener("click", () => {
        if (modal && modalImg) { modalImg.src = src; modal.style.display = "block"; }
    });

    const delBtn = document.createElement("button");
    delBtn.innerHTML = "✕";
    delBtn.classList.add("delete-image-btn");
    delBtn.title = "Remove photo";
    delBtn.onclick = async e => {
        e.stopPropagation();
        await dbDelete(db, storeName, id);
        wrapper.remove();
    };

    wrapper.appendChild(img);
    wrapper.appendChild(delBtn);
    container.appendChild(wrapper);
}


// ══════════════════════════════════════════════════════
// CS GALLERY — Persistent Photos & Videos (IndexedDB)
// ══════════════════════════════════════════════════════
(async function() {
    const uploadImg  = document.getElementById("galleryUploadImg");
    const uploadVid  = document.getElementById("galleryUploadVid");
    const track      = document.getElementById("galleryTrack");
    const grid       = document.getElementById("galleryGrid");
    const slider     = document.getElementById("gallerySlider");
    const emptyState = document.getElementById("galleryEmpty");
    const countLabel = document.getElementById("galleryCount");
    const indicator  = document.getElementById("galleryIndicator");
    const leftBtn    = document.getElementById("galleryLeft");
    const rightBtn   = document.getElementById("galleryRight");

    if (!track) return;

    const DB_NAME    = "csGallery";
    const STORE_NAME = "media";

    // Open DB
    const db = await openDB(DB_NAME, STORE_NAME);

    let items      = [];   // { id, url, type, name }
    let slideIndex = 0;
    let autoTimer  = null;

    // ── Load persisted media ───────────────────────────
    const saved = await dbGetAll(db, STORE_NAME);
    saved.forEach(record => {
        // Convert stored base64 back to blob URL for efficiency
        const blob = base64ToBlob(record.dataUrl, record.mime);
        const url  = URL.createObjectURL(blob);
        items.push({ id: record.id, url, type: record.type, name: record.name });
    });
    render();

    // ── Helper: base64 → Blob ──────────────────────────
    function base64ToBlob(dataUrl, mime) {
        const byteString = atob(dataUrl.split(",")[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
        return new Blob([ab], { type: mime });
    }

    // ── Render everything ──────────────────────────────
    function render() {
        track.innerHTML     = "";
        grid.innerHTML      = "";
        indicator.innerHTML = "";

        const hasItems = items.length > 0;

        slider.style.display     = hasItems ? "block" : "none";
        grid.style.display       = hasItems ? "grid"  : "none";
        emptyState.style.display = hasItems ? "none"  : "flex";

        const imgCount = items.filter(x => x.type === "image").length;
        const vidCount = items.filter(x => x.type === "video").length;
        countLabel.textContent = items.length + (items.length === 1 ? " item" : " items")
            + " — " + imgCount + " 📷 " + vidCount + " 🎬";

        if (slideIndex >= items.length) slideIndex = Math.max(0, items.length - 1);

        items.forEach((item, i) => {

            // ── Slide ──────────────────────────────────
            let slideEl;
            if (item.type === "video") {
                slideEl = document.createElement("video");
                slideEl.src      = item.url;
                slideEl.controls = true;
                slideEl.preload  = "metadata";
            } else {
                slideEl = document.createElement("img");
                slideEl.src = item.url;
                slideEl.alt = item.name;
                slideEl.addEventListener("click", () => openLightbox(item.url));
            }
            track.appendChild(slideEl);

            // ── Indicator dot ──────────────────────────
            const dot = document.createElement("span");
            if (item.type === "video") dot.classList.add("dot-video");
            if (i === slideIndex) dot.classList.add("active");
            dot.title = item.name;
            dot.addEventListener("click", () => { slideIndex = i; updateSlide(); });
            indicator.appendChild(dot);

            // ── Thumbnail ──────────────────────────────
            const thumb = document.createElement("div");
            thumb.className = "gallery-thumb";
            thumb.title = item.name;

            if (item.type === "video") {
                const vt = document.createElement("video");
                vt.src     = item.url;
                vt.preload = "metadata";
                vt.muted   = true;
                thumb.appendChild(vt);

                const badge = document.createElement("div");
                badge.className = "video-badge";
                badge.innerHTML = '<i class="fas fa-play"></i>';
                thumb.appendChild(badge);
            } else {
                const ti = document.createElement("img");
                ti.src     = item.url;
                ti.alt     = item.name;
                ti.loading = "lazy";
                thumb.appendChild(ti);
            }

            // number badge
            const numBadge = document.createElement("div");
            numBadge.className   = "thumb-num";
            numBadge.textContent = (i + 1) + " / " + items.length;
            thumb.appendChild(numBadge);

            // delete button
            const delBtn = document.createElement("button");
            delBtn.className = "thumb-delete";
            delBtn.innerHTML = "✕";
            delBtn.title     = "Remove";
            delBtn.addEventListener("click", async e => {
                e.stopPropagation();
                await dbDelete(db, STORE_NAME, item.id);
                URL.revokeObjectURL(item.url);
                items.splice(i, 1);
                if (slideIndex >= items.length) slideIndex = Math.max(0, items.length - 1);
                render();
            });
            thumb.appendChild(delBtn);

            thumb.addEventListener("click", e => {
                if (e.target.closest(".thumb-delete")) return;
                slideIndex = i;
                updateSlide();
                slider.scrollIntoView({ behavior: "smooth", block: "center" });
            });

            grid.appendChild(thumb);
        });

        updateSlide();
        startAutoSlide();
    }

    // ── Slide position ─────────────────────────────────
    function updateSlide() {
        track.style.transform = `translateX(${-slideIndex * 100}%)`;
        indicator.querySelectorAll("span").forEach((d, i) =>
            d.classList.toggle("active", i === slideIndex)
        );
    }

    // ── Auto-slide ─────────────────────────────────────
    function startAutoSlide() {
        if (autoTimer) clearInterval(autoTimer);
        autoTimer = setInterval(() => {
            if (items.length > 1 && items[slideIndex]?.type !== "video") {
                slideIndex = (slideIndex + 1) % items.length;
                updateSlide();
            }
        }, 5000);
    }

    // ── Lightbox ───────────────────────────────────────
    function openLightbox(url) {
        const m  = document.getElementById("imageModal");
        const mi = document.getElementById("modalImg");
        if (m && mi) { mi.src = url; m.style.display = "block"; }
    }

    // ── Arrows ─────────────────────────────────────────
    leftBtn.addEventListener("click", () => {
        if (!items.length) return;
        slideIndex = (slideIndex - 1 + items.length) % items.length;
        updateSlide();
    });
    rightBtn.addEventListener("click", () => {
        if (!items.length) return;
        slideIndex = (slideIndex + 1) % items.length;
        updateSlide();
    });

    // ── Touch swipe ────────────────────────────────────
    let swipeX = 0;
    track.addEventListener("touchstart", e => { swipeX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener("touchend",   e => {
        const diff = e.changedTouches[0].clientX - swipeX;
        if      (diff >  50) { slideIndex = (slideIndex - 1 + items.length) % items.length; updateSlide(); }
        else if (diff < -50) { slideIndex = (slideIndex + 1) % items.length;                updateSlide(); }
    });

    // ── Mouse drag ─────────────────────────────────────
    let dragX = 0, dragging = false;
    track.addEventListener("mousedown", e => {
        if (e.target.tagName !== "VIDEO") { dragging = true; dragX = e.pageX; }
    });
    document.addEventListener("mouseup", e => {
        if (!dragging) return;
        dragging = false;
        const diff = e.pageX - dragX;
        if (Math.abs(diff) < 5) return;
        slideIndex = diff > 0
            ? (slideIndex - 1 + items.length) % items.length
            : (slideIndex + 1) % items.length;
        updateSlide();
    });

    // ── Keyboard ───────────────────────────────────────
    document.addEventListener("keydown", e => {
        const gp = document.getElementById("page-gallery");
        if (!gp || !gp.classList.contains("active")) return;
        if      (e.key === "ArrowLeft")  { slideIndex = (slideIndex - 1 + items.length) % items.length; updateSlide(); }
        else if (e.key === "ArrowRight") { slideIndex = (slideIndex + 1) % items.length;                updateSlide(); }
    });

    // ── Add files ──────────────────────────────────────
    async function addFiles(files, type) {
        for (const file of Array.from(files)) {
            const dataUrl = await readFileAsDataURL(file);
            const id = await dbAdd(db, STORE_NAME, { dataUrl, type, name: file.name, mime: file.type });
            const blob = base64ToBlob(dataUrl, file.type);
            const url  = URL.createObjectURL(blob);
            items.push({ id, url, type, name: file.name });
        }
        slideIndex = items.length - 1;
        render();
    }

    function readFileAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload  = e => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    if (uploadImg) {
        uploadImg.addEventListener("change", function() {
            if (this.files.length) addFiles(this.files, "image");
            this.value = "";
        });
    }
    if (uploadVid) {
        uploadVid.addEventListener("change", function() {
            if (this.files.length) addFiles(this.files, "video");
            this.value = "";
        });
    }

    // ── Drag & drop ────────────────────────────────────
    const gallerySection = document.querySelector("#page-gallery .page-section");
    if (gallerySection) {
        gallerySection.addEventListener("dragover",  e => { e.preventDefault(); gallerySection.classList.add("drag-over"); });
        gallerySection.addEventListener("dragleave", ()  => gallerySection.classList.remove("drag-over"));
        gallerySection.addEventListener("drop",      e  => {
            e.preventDefault();
            gallerySection.classList.remove("drag-over");
            const dropped = Array.from(e.dataTransfer.files);
            const imgs = dropped.filter(f => f.type.startsWith("image/"));
            const vids = dropped.filter(f => f.type.startsWith("video/"));
            if (imgs.length) addFiles(imgs, "image");
            if (vids.length) addFiles(vids, "video");
        });
    }

})();


// ══════════════════════════════════════════════════════
// AI CHAT — Powered by Anthropic API
// ══════════════════════════════════════════════════════
(function() {
    const chatBtn      = document.querySelector(".chat-button");
    const chatBox      = document.querySelector(".chat-box");
    const chatInput    = document.getElementById("chatInput");
    const chatMessages = document.querySelector(".chat-messages");
    const chatClose    = document.getElementById("chatCloseBtn");
    const chatSend     = document.getElementById("chatSendBtn");

    const SYSTEM_PROMPT = `You are a friendly AI assistant embedded in Macel Ray Bendanillo's personal portfolio website. 
Macel Ray is a Computer Science student in the CETA Department (2026), passionate about web development, AI, and building modern applications.
Answer questions about Macel Ray's portfolio, skills (HTML, CSS, JavaScript, Python, AI/ML), projects (AI SaaS Platform, Workout AI Tracker, Certification System), and experience (Frontend Developer, Backend Developer, Web Developer Intern).
Keep replies concise, warm, and helpful. If asked something unrelated to the portfolio, you may still help briefly.`;

    let conversationHistory = [];

    function openChat()  { chatBox.style.display = "flex"; }
    function closeChat() { chatBox.style.display = "none"; }

    if (chatBtn)   chatBtn.addEventListener("click",  () => chatBox.style.display === "flex" ? closeChat() : openChat());
    if (chatClose) chatClose.addEventListener("click", closeChat);

    function appendBubble(text, type) {
        const div = document.createElement("div");
        div.className   = "msg-bubble " + type;
        div.textContent = text;
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return div;
    }

    async function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        appendBubble(text, "user");
        chatInput.value    = "";
        chatInput.disabled = true;
        if (chatSend) chatSend.disabled = true;

        conversationHistory.push({ role: "user", content: text });

        const thinkingEl = appendBubble("Thinking...", "ai thinking");

        try {
            const response = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "claude-sonnet-4-20250514",
                    max_tokens: 1000,
                    system: SYSTEM_PROMPT,
                    messages: conversationHistory
                })
            });

            const data  = await response.json();
            const reply = data.content?.[0]?.text ?? "Sorry, I couldn't get a response right now.";

            thinkingEl.textContent = reply;
            thinkingEl.classList.remove("thinking");
            conversationHistory.push({ role: "assistant", content: reply });

        } catch (err) {
            thinkingEl.textContent = "⚠ Connection error. Please try again.";
            thinkingEl.classList.remove("thinking");
        }

        chatInput.disabled = false;
        if (chatSend) chatSend.disabled = false;
        chatInput.focus();
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    if (chatInput) chatInput.addEventListener("keypress", e => { if (e.key === "Enter") sendMessage(); });
    if (chatSend)  chatSend.addEventListener("click", sendMessage);
})();