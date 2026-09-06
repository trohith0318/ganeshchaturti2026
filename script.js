"use strict";

// Replace this with your deployed Google Apps Script Web App URL when needed.
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwnyuaqVt_ojcctZz1jUlC238bQ_oDLf346wutzliHPOcZ7EaEwMWF222gsfBD6qY7xXA/exec";

const events = [
  { title: "Ganesh Sthapana", date: "5 September 2026", time: "10:00 AM", location: "Main Auditorium", category: "pooja", icon: "🪔", description: "Join us for the ceremonial installation of Lord Ganesha." },
  { title: "Cultural Night", date: "6 September 2026", time: "6:00 PM", location: "Open Ground", category: "cultural", icon: "🎤", description: "An evening of music, dance and performances by our campus community." },
  { title: "Student Competitions", date: "7 September 2026", time: "2:00 PM", location: "Student Centre", category: "competitions", icon: "🏆", description: "Put your creativity to work in our festive student competitions." },
  { title: "Modak Making Workshop", date: "5 September 2026", time: "3:00 PM", location: "Cafeteria Courtyard", category: "activities", icon: "🍥", description: "Learn the art of making a traditional festive favourite together." },
  { title: "Community Pooja", date: "6 September 2026", time: "9:00 AM", location: "Main Auditorium", category: "pooja", icon: "🙏", description: "Begin the day with prayers, aarti and blessings for our campus." },
  { title: "Open Mic: Ekta", date: "7 September 2026", time: "5:30 PM", location: "Open Ground", category: "cultural", icon: "🎶", description: "Share a song, poem or story that celebrates togetherness." }
];

const updates = [
  { time: "2:30 PM", text: "Decoration work is currently underway." },
  { time: "1:15 PM", text: "Volunteers have gathered at the main auditorium." },
  { time: "11:00 AM", text: "Today's event schedule has been updated." }
];

const activityUpdates = [
  { time: "Today, 2:30 PM", text: "Decoration preparation is underway around the main auditorium." },
  { time: "Today, 1:15 PM", text: "The volunteer meeting has wrapped up and teams are in position." },
  { time: "Today, 11:00 AM", text: "Cultural practice begins on the open ground." },
  { time: "Yesterday, 4:45 PM", text: "Pooja preparation and materials sorting are complete." },
  { time: "Yesterday, 2:00 PM", text: "Competition registration has opened at the Student Centre." },
  { time: "Yesterday, 12:30 PM", text: "Food distribution volunteers completed their briefing." }
];

const categoryLabels = { pooja: "Pooja", cultural: "Cultural", competitions: "Competitions", activities: "Activities" };

function setupMobileNavigation() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });
}

function eventCard(event, full = false) {
  return `<article class="event-card ${full ? "event-card-full" : ""}">
    <div class="event-icon" aria-hidden="true">${event.icon}</div>
    <div><h3>${event.title}</h3>
      <div class="event-meta"><span>📅 ${event.date}</span><span>◷ ${event.time}</span><span>📍 ${event.location}</span></div>
      ${full ? `<p class="event-description">${event.description}</p>` : ""}
      <span class="category-tag">${categoryLabels[event.category]}</span>
    </div>
  </article>`;
}

function renderUpdates() {
  const target = document.querySelector("[data-updates]");
  if (!target) return;
  target.innerHTML = updates.map(update => `<article class="update-card"><span class="update-time">● ${update.time}</span><p>${update.text}</p></article>`).join("");
}

function renderPreviewEvents() {
  const target = document.querySelector("[data-preview-events]");
  if (!target) return;
  target.innerHTML = events.slice(0, 3).map(event => eventCard(event)).join("");
}

function renderEvents(filter = "all") {
  const target = document.querySelector("[data-events-list]");
  const empty = document.querySelector("[data-empty-events]");
  if (!target) return;
  const visibleEvents = filter === "all" ? events : events.filter(event => event.category === filter);
  target.innerHTML = visibleEvents.map(event => eventCard(event, true)).join("");
  if (empty) empty.hidden = visibleEvents.length > 0;
}

function setupEventFilters() {
  const buttons = document.querySelectorAll("[data-filter]");
  if (!buttons.length) return;
  renderEvents();
  buttons.forEach(button => button.addEventListener("click", () => {
    buttons.forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    renderEvents(button.dataset.filter);
  }));
}

function renderActivityUpdates() {
  const target = document.querySelector("[data-activity-timeline]");
  if (!target) return;
  target.innerHTML = activityUpdates.map(item => `<article class="timeline-item"><time>${item.time}</time><p>${item.text}</p></article>`).join("");
}

function setupDonationForm() {
  const form = document.querySelector("#donation-form");
  if (!form) return;
  const amount = document.querySelector("#amount");
  const modal = document.querySelector("#success-modal");
  const errors = { name: "Please enter your name.", category: "Please select your category.", contact: "Please enter a valid 10-digit contact number.", amount: "Please enter a valid donation amount.", utr: "Please enter your UTR / transaction ID.", paymentDate: "Please select the payment date." };

  document.querySelectorAll("[data-amount]").forEach(button => button.addEventListener("click", () => {
    amount.value = button.dataset.amount;
    amount.dispatchEvent(new Event("input", { bubbles: true }));
  }));

  function setError(field, message) {
    const wrapper = field.closest(".field");
    const error = document.querySelector(`[data-error-for="${field.name}"]`);
    wrapper.classList.toggle("invalid", Boolean(message));
    if (error) error.textContent = message || "";
  }

  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = "";
  }

  form.addEventListener("submit", async event => {
    event.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    let valid = true;
    ["name", "category", "contact", "amount", "utr", "paymentDate"].forEach(key => {
      const field = form.elements[key];
      const value = String(data[key] || "").trim();
      const invalid = !value || (key === "amount" && Number(data[key]) <= 0) || (key === "contact" && !/^\d{10}$/.test(value));
      setError(field, invalid ? errors[key] : "");
      if (invalid) valid = false;
    });
    if (!valid) return;

    const payload = {
      fullName: data.name.trim(),
      studentFaculty: data.category,
      donationCollection: data.amount,
      utrId: data.utr.trim(),
      paymentDate: data.paymentDate,
      note: data.note.trim()
    };
    const submitButton = form.querySelector(".submit-button");
    submitButton.disabled = true;
    submitButton.innerHTML = "Submitting <span>...</span>";
    try {
      if (!GOOGLE_SCRIPT_URL) throw new Error("Google Apps Script URL is not configured.");
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(payload)
      });
      document.querySelector("[data-receipt-name]").textContent = payload.fullName;
      document.querySelector("[data-receipt-amount]").textContent = `₹${Number(payload.donationCollection).toLocaleString("en-IN")}`;
      document.querySelector("[data-receipt-utr]").textContent = payload.utrId;
      modal.hidden = false;
      document.body.style.overflow = "hidden";
      form.reset();
    } catch (error) {
      setError(form.elements.utr, "We could not submit right now. Please try again.");
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = "Submit donation details <span>→</span>";
    }
  });

  modal?.querySelector(".modal-close")?.addEventListener("click", closeModal);
  modal?.querySelector(".modal-done")?.addEventListener("click", closeModal);
  modal?.addEventListener("click", event => { if (event.target === modal) closeModal(); });
  document.addEventListener("keydown", event => { if (event.key === "Escape" && modal && !modal.hidden) closeModal(); });
}

function setCurrentYear() {
  document.querySelectorAll("[data-current-year]").forEach(element => { element.textContent = new Date().getFullYear(); });
}

document.addEventListener("DOMContentLoaded", () => {
  setupMobileNavigation();
  renderUpdates();
  renderPreviewEvents();
  setupEventFilters();
  renderActivityUpdates();
  setupDonationForm();
  setCurrentYear();
});
