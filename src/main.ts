
import 'style.css';

type EventItem = {
  id: number;
  name: string;
  date: string;
  time: string;
  location: string;
  guests: number;
  color: string;
};

let events: EventItem[] = [
  {
    id: 1,
    name: 'Birthday Celebration',
    date: '2026-11-14',
    time: '18:00',
    location: 'Community Center',
    guests: 24,
    color: 'purple'
  },
  {
    id: 2,
    name: 'Friendsgiving',
    date: '2026-11-21',
    time: '17:30',
    location: 'My House',
    guests: 12,
    color: 'orange'
  },
  {
    id: 3,
    name: 'Christmas Party',
    date: '2026-12-20',
    time: '19:00',
    location: 'Main Hall',
    guests: 45,
    color: 'green'
  }
];

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) throw new Error('App element not found');

let activePage = 'Dashboard';
let searchTerm = '';

const escapeHTML = (value: string) =>
  value.replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[char] || char);

const formatDate = (date: string) =>
  new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

const navigation = [
  { name: 'Dashboard', icon: '◫' },
  { name: 'My Events', icon: '▦' },
  { name: 'Calendar', icon: '▣' },
  { name: 'Guests', icon: '♧' },
  { name: 'Budget', icon: '◇' }
];

function renderEvents() {
  const filtered = events.filter(event =>
    `${event.name} ${event.location}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (!filtered.length) {
    return `<div class="empty-state">
      <div class="empty-icon">✦</div>
      <h3>No events found</h3>
      <p>Try another search or create a new event.</p>
    </div>`;
  }

  return filtered.map(event => `
    <article class="event-card">
      <div class="event-color ${event.color}"></div>
      <div class="event-info">
        <span class="event-date">${formatDate(event.date)}</span>
        <h3>${escapeHTML(event.name)}</h3>
        <p>⌖ ${escapeHTML(event.location)}</p>
      </div>
      <div class="event-details">
        <span>◷ ${escapeHTML(event.time)}</span>
        <span>♧ ${event.guests} guests</span>
      </div>
      <button class="more-button" data-delete="${event.id}" title="Delete event">⋯</button>
    </article>
  `).join('');
}

function renderPage() {
  if (activePage === 'Dashboard') {
    return `
      <section class="welcome">
        <div>
          <span class="eyebrow">YOUR EVENT SPACE</span>
          <h1>Good evening! <span>✦</span></h1>
          <p>Let's make something worth celebrating.</p>
        </div>
        <button class="primary-button" data-action="create">
          <span>＋</span> Create event
        </button>
      </section>

      <section class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon purple">▦</div>
          <span>Total events</span>
          <strong>${events.length}</strong>
          <small>Events you've created</small>
        </div>
        <div class="stat-card">
          <div class="stat-icon orange">◷</div>
          <span>Upcoming events</span>
          <strong>${events.filter(e => e.date >= new Date().toISOString().slice(0, 10)).length}</strong>
          <small>Ready to be celebrated</small>
        </div>
        <div class="stat-card">
          <div class="stat-icon green">♧</div>
          <span>Total guests</span>
          <strong>${events.reduce((sum, e) => sum + e.guests, 0)}</strong>
          <small>Across all your events</small>
        </div>
      </section>

      <section class="content-section">
        <div class="section-heading">
          <div>
            <h2>Upcoming events</h2>
            <p>Here's what's coming up.</p>
          </div>
          <button class="text-button" data-page="My Events">View all →</button>
        </div>
        <div class="event-list">${renderEvents()}</div>
      </section>

      <section class="bottom-banner">
        <div>
          <span class="eyebrow">MAKE IT MEMORABLE</span>
          <h2>Every great event starts with a plan.</h2>
          <p>Bring your next idea to life with Planify.</p>
        </div>
        <button class="banner-button" data-action="create">Plan an event →</button>
      </section>
    `;
  }

  if (activePage === 'My Events') {
    return `
      <section class="page-heading">
        <div><span class="eyebrow">YOUR COLLECTION</span><h1>My Events</h1><p>All your celebrations in one place.</p></div>
        <button class="primary-button" data-action="create">＋ Create event</button>
      </section>
      <div class="search-box">
        <span>⌕</span>
        <input id="event-search" placeholder="Search events..." value="${escapeHTML(searchTerm)}">
      </div>
      <div class="event-list">${renderEvents()}</div>
    `;
  }

  const descriptions: Record<string, string> = {
    Calendar: 'Your event calendar will live here.',
    Guests: 'Manage invitations and guest lists here.',
    Budget: 'Keep your event spending organized here.'
  };

  return `
    <section class="page-heading">
      <div><span class="eyebrow">PLANIFY</span><h1>${activePage}</h1><p>${descriptions[activePage] || ''}</p></div>
    </section>
    <div class="coming-soon">
      <div class="empty-icon">✦</div>
      <h2>${activePage} is coming soon</h2>
      <p>We're building this part of Planify next.</p>
      <button class="primary-button" data-page="Dashboard">Back to dashboard</button>
    </div>
  `;
}

function render() {
  app!.innerHTML = `
    <div class="app-layout">
      <aside class="sidebar">
        <div class="brand">
          <div class="brand-icon">P</div>
          <span>planify<span class="brand-dot">.</span></span>
        </div>

        <div class="workspace">
          <div class="workspace-avatar">P</div>
          <div><strong>Personal workspace</strong><small>Free plan</small></div>
          <span class="workspace-arrow">⌄</span>
        </div>

        <span class="nav-label">WORKSPACE</span>
        <nav class="navigation">
          ${navigation.map(item => `
            <button class="nav-item ${activePage === item.name ? 'active' : ''}"
              data-page="${item.name}">
              <span class="nav-icon">${item.icon}</span>
              ${item.name}
              ${item.name === 'My Events' ? `<span class="nav-count">${events.length}</span>` : ''}
            </button>
          `).join('')}
        </nav>

        <div class="sidebar-bottom">
          <div class="upgrade-card">
            <div class="upgrade-icon">✦</div>
            <strong>Make more memories</strong>
            <p>Your next great event is waiting.</p>
            <button data-action="create">Create an event →</button>
          </div>
          <div class="profile">
            <div class="profile-avatar">G</div>
            <div><strong>My Account</strong><small>Personal planner</small></div>
            <span>⋯</span>
          </div>
        </div>
      </aside>

      <main class="main-area">
        <header class="topbar">
          <div class="breadcrumb">Workspace <span>/</span> ${activePage}</div>
          <div class="topbar-right">
            <span class="today-label">${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
            <button class="notification-button" title="Notifications">♧</button>
          </div>
        </header>

        <div class="main-content">
          ${renderPage()}
        </div>
        <footer class="footer">Made for moments that matter. <span>✦</span> Planify</footer>
      </main>
    </div>

    <div id="modal-root"></div>
  `;

  attachListeners();
}

function openModal() {
  const root = document.querySelector<HTMLDivElement>('#modal-root');
  if (!root) return;

  root.innerHTML = `
    <div class="modal-overlay" data-close="true">
      <form class="event-modal" id="event-form">
        <div class="modal-heading">
          <div><span class="eyebrow">LET'S GET PLANNING</span><h2>Create an event</h2>
          <p>Start planning something special.</p></div>
          <button type="button" class="close-button" data-close="true">×</button>
        </div>

        <label>Event name<input name="name" placeholder="e.g. Birthday party" required maxlength="70"></label>
        <label>Location<input name="location" placeholder="Where is it happening?" required maxlength="100"></label>

        <div class="form-row">
          <label>Date<input name="date" type="date" min="${new Date().toISOString().slice(0, 10)}" required></label>
          <label>Time<input name="time" type="time" value="18:00" required></label>
        </div>

        <label>Expected guests<input name="guests" type="number" min="1" max="10000" value="10" required></label>

        <div class="modal-actions">
          <button type="button" class="secondary-button" data-close="true">Cancel</button>
          <button type="submit" class="primary-button">Create event →</button>
        </div>
      </form>
    </div>
  `;

  root.querySelector<HTMLFormElement>('#event-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const data = new FormData(form);

    const name = String(data.get('name') || '').trim();
    const location = String(data.get('location') || '').trim();
    const date = String(data.get('date') || '');
    const time = String(data.get('time') || '');
    const guests = Number(data.get('guests'));

    if (!name || !location || !date || !time || !Number.isInteger(guests) || guests < 1) return;

    events.push({
      id: Date.now(),
      name,
      location,
      date,
      time,
      guests,
      color: ['purple', 'orange', 'green'][events.length % 3]
    });

    activePage = 'My Events';
    searchTerm = '';
    render();
  });
}

function attachListeners() {
  app!.querySelectorAll<HTMLElement>('[data-action="create"]').forEach(button => {
    button.addEventListener('click', openModal);
  });

  app!.querySelectorAll<HTMLElement>('[data-page]').forEach(button => {
    button.addEventListener('click', () => {
      activePage = button.dataset.page || 'Dashboard';
      searchTerm = '';
      render();
    });
  });

  app!.querySelectorAll<HTMLElement>('[data-delete]').forEach(button => {
    button.addEventListener('click', () => {
      const id = Number(button.dataset.delete);
      if (confirm('Delete this event?')) {
        events = events.filter(event => event.id !== id);
        render();
      }
    });
  });

  app!.querySelector<HTMLInputElement>('#event-search')?.addEventListener('input', e => {
    const input = e.currentTarget as HTMLInputElement;
    searchTerm = input.value;
    const list = app!.querySelector('.event-list');
    if (list) list.innerHTML = renderEvents();
    attachDeleteListeners();
  });
}

function attachDeleteListeners() {
  app!.querySelectorAll<HTMLElement>('[data-delete]').forEach(button => {
    button.addEventListener('click', () => {
      const id = Number(button.dataset.delete);
      if (confirm('Delete this event?')) {
        events = events.filter(event => event.id !== id);
        render();
      }
    });
  });
}

document.addEventListener('click', e => {
  const target = e.target as HTMLElement;
  if (target.dataset.close === 'true') {
    document.querySelector('#modal-root')!.innerHTML = '';
  }
});

render();
