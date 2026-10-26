const EVENTS = [
  {id:"codefest",title:"CodeFest: Build the Future",category:"Technology",date:"2026-11-08",time:"10:00 AM – 4:00 PM",location:"Innovation Lab · Block B",description:"Team up, solve real-world problems, and turn your boldest idea into a working prototype.",icon:"⌘",art:"art-tech",spots:42},
  {id:"afterglow",title:"Afterglow Cultural Night",category:"Culture",date:"2026-11-12",time:"5:30 PM – 9:00 PM",location:"Main Auditorium",description:"An evening of live music, dance, open-mic moments, and performances from across campus.",icon:"✦",art:"art-culture",spots:120},
  {id:"career-sprint",title:"Career Sprint: Meet the Pros",category:"Career",date:"2026-11-15",time:"11:00 AM – 2:00 PM",location:"Seminar Hall 2",description:"Get practical career advice, ask questions, and connect with alumni and industry mentors.",icon:"↗",art:"art-career",spots:35},
  {id:"sports-day",title:"Campus Sports Carnival",category:"Sports",date:"2026-11-19",time:"8:00 AM – 1:00 PM",location:"University Sports Ground",description:"Bring your team spirit for friendly tournaments, relay races, and a day of campus cheering.",icon:"◉",art:"art-sports",spots:80},
  {id:"mindful",title:"Mindful Mornings",category:"Wellness",date:"2026-11-22",time:"7:30 AM – 8:30 AM",location:"Garden Amphitheatre",description:"Reset with guided breathing, gentle movement, and a calm start alongside your campus community.",icon:"☼",art:"art-wellness",spots:24},
  {id:"design-jam",title:"Design Jam: Make It Matter",category:"Technology",date:"2026-11-27",time:"1:00 PM – 5:00 PM",location:"Design Studio · Block A",description:"Sketch, prototype, and pitch a digital experience that makes student life a little better.",icon:"✳",art:"art-music",spots:28},
  {id:"startup-summit",title:"Student Startup & Ideas Summit",category:"Business",date:"2026-12-03",time:"11:00 AM – 2:00 PM",location:"Innovation Centre",description:"Meet student founders, pitch an idea, and learn how a project can become a venture.",icon:"↗",art:"art-business",spots:40},
  {id:"photo-walk",title:"Campus Through Your Lens",category:"Creative",date:"2026-12-08",time:"7:30 AM – 10:00 AM",location:"Meet at Main Gate",description:"Explore campus light, architecture, and everyday moments on a guided photography walk.",icon:"◎",art:"art-creative",spots:32}
];

const STORAGE_KEY = "campusEventHubRegistrations";
const eventGrid = document.querySelector("#eventGrid");
const emptyState = document.querySelector("#emptyState");
const searchInput = document.querySelector("#eventSearch");
const categoryFilter = document.querySelector("#categoryFilter");
const categoryPills = document.querySelector("#categoryPills");
const registrationForm = document.querySelector("#registrationForm");
const registerDialog = document.querySelector("#registerDialog");
const toast = document.querySelector("#toast");
let activeCategory = "all";
let sortOrder = "soonest";
let toastTimer;

function getRegistrations() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}
function saveRegistrations(registrations) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));
}
function getEvent(id) {
  return EVENTS.find(event => event.id === id);
}
function parseDate(dateString) {
  // Parse YYYY-MM-DD as a local date to avoid timezone shifting the displayed day.
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}
function dateParts(dateString) {
  const date = parseDate(dateString);
  return {
    day: date.toLocaleDateString("en-IN", {day:"2-digit"}),
    month: date.toLocaleDateString("en-IN", {month:"short"}).toUpperCase(),
    full: date.toLocaleDateString("en-IN", {day:"numeric", month:"short", year:"numeric"})
  };
}
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  })[char]);
}
function renderEvents() {
  const query = searchInput.value.trim().toLowerCase();
  const registrations = getRegistrations();
  let filtered = EVENTS.filter(event => {
    const matchesCategory = activeCategory === "all" || event.category === activeCategory;
    const haystack = `${event.title} ${event.category} ${event.description} ${event.location}`.toLowerCase();
    return matchesCategory && haystack.includes(query);
  });
  filtered.sort((a, b) => sortOrder === "latest" ? parseDate(b.date) - parseDate(a.date) : parseDate(a.date) - parseDate(b.date));
  eventGrid.innerHTML = filtered.map(event => {
    const date = dateParts(event.date);
    return `
      <article class="event-card">
        <div class="event-art ${event.art}">
          <div class="date-badge"><strong>${date.day}</strong><span>${date.month}</span></div>
          <span class="art-symbol" aria-hidden="true">${event.icon}</span>
        </div>
        <div class="event-card-body">
          <div class="event-meta"><span class="event-category">${escapeHTML(event.category)}</span><span class="event-time">${escapeHTML(event.time)}</span></div>
          <h3>${escapeHTML(event.title)}</h3>
          <p class="event-description">${escapeHTML(event.description)}</p>
          <div class="event-location"><span>⌖</span>${escapeHTML(event.location)}</div>
          <div class="event-card-footer">
            <span class="spots-left"><strong>${event.spots}</strong> spots available</span>
            <div class="event-actions"><button class="details-button" data-details="${event.id}" type="button">Details</button><button class="register-button" data-register="${event.id}" type="button">Register ↗</button></div>
          </div>
        </div>
      </article>`;
  }).join("");
  emptyState.classList.toggle("hidden", filtered.length > 0);
  eventGrid.classList.toggle("hidden", filtered.length === 0);
  document.querySelector("#eventStat").textContent = String(EVENTS.length).padStart(2, "0");
  document.querySelectorAll(".filter-pill").forEach(button => {
    button.classList.toggle("active", button.dataset.category === activeCategory);
    const count = button.querySelector("span");
    if (count) count.textContent = String(EVENTS.length);
  });
}
function renderRegistrations() {
  const registrations = getRegistrations();
  document.querySelector("#navCount").textContent = registrations.length;
  document.querySelector("#registrationTotal").textContent = `${registrations.length} registration${registrations.length === 1 ? "" : "s"}`;
  document.querySelector("#registrationsEmpty").classList.toggle("hidden", registrations.length > 0);
  const list = document.querySelector("#registrationsList");
  list.innerHTML = registrations.map(registration => {
    const event = getEvent(registration.eventId);
    if (!event) return "";
    const date = dateParts(event.date);
    return `<article class="registration-row">
      <div class="registration-date"><strong>${date.day}</strong><span>${date.month}</span></div>
      <div class="registration-info"><h3>${escapeHTML(event.title)}</h3><p>${date.full} · ${escapeHTML(event.time)} · ${escapeHTML(event.location)}</p><p>Registered as ${escapeHTML(registration.studentName)}</p></div>
      <span class="registration-confirmed">✓ Confirmed</span>
      <button class="cancel-registration" data-cancel="${escapeHTML(registration.registrationId || registration.eventId)}" aria-label="Cancel registration for ${escapeHTML(event.title)}" title="Cancel registration">×</button>
    </article>`;
  }).join("");
  renderEvents();
}
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}
function openEventDetails(eventId) {
  const event = getEvent(eventId);
  if (!event) return;
  const date = dateParts(event.date);
  document.querySelector("#detailsDialogContent").innerHTML = `
    <div class="dialog-header"><div><div class="eyebrow section-eyebrow">${escapeHTML(event.category.toUpperCase())} EVENT</div><h2 id="detailsDialogTitle">${escapeHTML(event.title)}</h2></div><button class="dialog-close" id="closeDetailsDialog" type="button" aria-label="Close event details">×</button></div>
    <div class="dialog-event-name">${date.full} · ${escapeHTML(event.time)}</div>
    <p class="details-description">${escapeHTML(event.description)}</p>
    <div class="details-fact"><strong>Venue</strong><span>${escapeHTML(event.location)}</span></div>
    <div class="details-fact"><strong>Registration spots</strong><span>${event.spots} sample spots available</span></div>
    <p class="form-note">Sample event information for this frontend prototype.</p>
    <button class="button button-primary form-submit" type="button" data-register="${event.id}">Register for this event ↗</button>`;
  const dialog = document.querySelector("#detailsDialog");
  dialog.showModal();
  document.querySelector("#closeDetailsDialog").addEventListener("click", () => dialog.close());
}

function openRegistration(eventId) {
  const event = getEvent(eventId);
  if (!event) return;
  document.querySelector("#registrationEventId").value = eventId;
  document.querySelector("#dialogEventName").textContent = `${event.title} · ${dateParts(event.date).full}`;
  document.querySelector("#formError").textContent = "";
  registrationForm.reset();
  document.querySelector("#registrationEventId").value = eventId;
  document.querySelector("#consent").checked = false;
  registerDialog.showModal();
}
categoryPills.addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  categoryFilter.value = activeCategory;
  renderEvents();
});
categoryFilter.addEventListener("change", () => {
  activeCategory = categoryFilter.value;
  renderEvents();
});
searchInput.addEventListener("input", renderEvents);
const sortFilter = document.querySelector("#sortFilter");
if (sortFilter) sortFilter.addEventListener("change", () => { sortOrder = sortFilter.value; renderEvents(); });
document.querySelector("#clearFilters").addEventListener("click", () => {
  searchInput.value = "";
  activeCategory = "all";
  categoryFilter.value = "all";
  sortOrder = "soonest";
  if (sortFilter) sortFilter.value = "soonest";
  renderEvents();
});
eventGrid.addEventListener("click", event => {
  const detailsButton = event.target.closest("[data-details]");
  const registerButton = event.target.closest("[data-register]");
  if (detailsButton) openEventDetails(detailsButton.dataset.details);
  if (registerButton) openRegistration(registerButton.dataset.register);
});
document.querySelector("#detailsDialog").addEventListener("click", event => {
  if (event.target === event.currentTarget) event.currentTarget.close();
});
document.querySelector("#detailsDialog").addEventListener("click", event => {
  const button = event.target.closest("[data-register]");
  if (button) { document.querySelector("#detailsDialog").close(); openRegistration(button.dataset.register); }
});
document.querySelector("#closeDialog").addEventListener("click", () => registerDialog.close());
registerDialog.addEventListener("click", event => {
  if (event.target === registerDialog) registerDialog.close();
});
registrationForm.addEventListener("submit", event => {
  event.preventDefault();
  const formError = document.querySelector("#formError");
  formError.textContent = "";
  if (!registrationForm.reportValidity()) return;
  const formData = new FormData(registrationForm);
  const eventId = String(formData.get("eventId"));
  const registrations = getRegistrations();
  const normalizedEmail = String(formData.get("studentEmail")).trim().toLowerCase();
  const normalizedId = String(formData.get("studentId")).trim().toLowerCase();
  if (registrations.some(item => item.eventId === eventId && (String(item.studentEmail || "").trim().toLowerCase() === normalizedEmail || String(item.studentId || "").trim().toLowerCase() === normalizedId))) {
    formError.textContent = "This email or student ID is already registered for this event.";
    return;
  }
  const registration = {
    registrationId: `CEH-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    eventId,
    studentName: String(formData.get("studentName")).trim(),
    studentEmail: normalizedEmail,
    studentId: String(formData.get("studentId")).trim(),
    department: String(formData.get("department")),
    registeredAt: new Date().toISOString()
  };
  if (registration.studentName.length < 2 || !registration.studentEmail.includes("@") || registration.studentId.length < 3) {
    formError.textContent = "Please check your details and try again.";
    return;
  }
  try {
    saveRegistrations([...registrations, registration]);
  } catch {
    formError.textContent = "This browser couldn't save your registration. Check your storage settings and try again.";
    return;
  }
  registerDialog.close();
  registrationForm.reset();
  renderRegistrations();
  showToast(`You're registered for ${getEvent(eventId).title}!`);
  document.querySelector("#my-registrations").scrollIntoView({behavior:"smooth", block:"start"});
});
document.querySelector("#registrationsList").addEventListener("click", event => {
  const button = event.target.closest("[data-cancel]");
  if (!button) return;
  const current = getRegistrations();
  const target = current.find(item => (item.registrationId || item.eventId) === button.dataset.cancel);
  if (!target) return;
  const eventInfo = getEvent(target.eventId);
  if (!window.confirm(`Cancel your registration for "${eventInfo ? eventInfo.title : "this event"}"?`)) return;
  const remaining = current.filter(item => (item.registrationId || item.eventId) !== button.dataset.cancel);
  try { saveRegistrations(remaining); } catch { showToast("Could not update browser storage. Please try again."); return; }
  renderRegistrations();
  showToast(`Registration cancelled${eventInfo ? ` for ${eventInfo.title}` : ""}.`);
});
const menuToggle = document.querySelector("#menuToggle");
const navLinks = document.querySelector("#navLinks");
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
navLinks.addEventListener("click", event => {
  if (event.target.closest("a")) {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

renderRegistrations();
