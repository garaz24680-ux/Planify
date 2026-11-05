import './style.css';

type EventItem = {
  id: number;
  name: string;
  date: string;
  location: string;
  guests: number;
  budget: number;
  color: string;
};

const STORAGE_KEY = 'planify-events';

const starterEvents: EventItem[] = [
  {
    id: 1,
    name: 'Birthday Celebration',
    date: '2026-11-14',
    location: 'The Garden Room',
    guests: 35,
    budget: 850,
    color: 'purple'
  },
  {
    id: 2,
    name: 'Holiday Dinner',
    date: '2026-12-05',
    location: 'Family House',
    guests: 18,
    budget: 500,
    color: 'blue'
  },
  {
    id: 3,
    name: 'Graduation Party',
    date: '2027-01-22',
    location: 'Community Center',
    guests: 60,
    budget: 1200,
    color: 'pink'
  }
];

function loadEvents(): EventItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) as EventItem[] : starterEvents;
  } catch {
    return starterEvents;
  }
}

let events = loadEvents();
let currentPage = 'Dashboard';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('Could not find the #app element in index.html');
}

function saveEvents(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

function escapeHTML(value: string): string {
  const replacements: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };

  return value.replace(/[&<>"']/g, (char) => replacements[char] ?? char);
}

function formatDate(date: string): string {
  const [year, month, day] = date.split('-').map(Number);
  const parsed = new Date(year, month - 1, day);

  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function formatMoney(amount: number): string {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });
}

function renderEventCard(event: EventItem): string {
  return `
    <article class="event-card">
      <div class="event-card-top">
        <div class="event-icon ${event.color}">✦</div>
        <button class="icon-button delete-event" data-id="${event.id}" aria-label="Delete ${escapeHTML(event.name)}">···</button>
      </div>

      <div class="event-card-content">
        <p class="event-date">${formatDate(event.date)}</p>
        <h3>${escapeHTML(event.name)}</h3>
        <p class="event-location">⌖ ${escapeHTML(event.location)}</p>
      </div>

      <div class="event-card-bottom">
        <span>♧ ${event.guests} guests</span>
        <span>${formatMoney(event.budget)}</span>
      </div>
    </article>
  `;
}

function render(): void {
  const totalGuests = events.reduce((total, event) => total + event.guests, 0);
  const totalBudget = events.reduce((total, event) => total + event.budget, 0);

  const sortedEvents = [...events].sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  const upcomingEvents = sortedEvents.slice(0, 3);

  app.innerHTML = `
    <div class="app-layout">
      <aside class="sidebar">
        <a class="brand" href="#" aria-label="Planify home">
          <span class="brand-mark">P</span>
          <span>planify<span class="brand-dot">.</span></span>
        </a>

        <div class="sidebar-label">WORKSPACE</div>

        <nav class="navigation">
          <button class="nav-link ${currentPage === 'Dashboard' ? 'active' : ''}" data-page="Dashboard">
            <span>⌂</span> Dashboard
          </button>
          <button class="nav-link ${currentPage === 'My Events' ? 'active' : ''}" data-page="My Events">
            <span>▦</span> My Events
          </button>
          <button class="nav-link ${currentPage === 'Calendar' ? 'active' : ''}" data-page="Calendar">
            <span>▣</span> Calendar
          </button>
          <button class="nav-link ${currentPage === 'Guests' ? 'active' : ''}" data-page="Guests">
            <span>♧</span> Guests
          </button>
          <button class="nav-link ${currentPage === 'Budget' ? 'active' : ''}" data-page="Budget">
            <span>◈</span> Budget
          </button>
        </nav>

        <div class="sidebar-bottom">
          <div class="upgrade-card">
            <div class="upgrade-icon">✧</div>
            <strong>Make planning easier</strong>
            <p>Your next great event starts here.</p>
          </div>
          <div class="profile">
            <div class="avatar">Y</div>
            <div>
              <strong>My Workspace</strong>
              <span>Personal account</span>
            </div>
            <span class="profile-menu">···</span>
          </div>
        </div>
      </aside>

      <main class="main-content">
        <header class="topbar">
          <div class="breadcrumb">Workspace <span>/</span> ${currentPage}</div>
          <div class="topbar-right">
            <span class="today-label">${new Date().toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric'
            })}</span>
            <div class="top-avatar">Y</div>
          </div>
        </header>

        <div class="page-content">
          ${
            currentPage === 'Dashboard'
              ? renderDashboard(totalGuests, totalBudget, upcomingEvents)
              : renderOtherPage()
          }
        </div>
      </main>
    </div>

    <div id="modal-root"></div>
  `;

  attachListeners();
}

function renderDashboard(
  totalGuests: number,
  totalBudget: number,
  upcomingEvents: EventItem[]
): string {
  return `
    <section class="welcome-row">
      <div>
        <p class="eyebrow">YOUR EVENT SPACE</p>
        <h1>Let's make something <span>memorable.</span></h1>
        <p class="welcome-description">Everything you need to plan your next great event, all in one place.</p>
      </div>
      <button class="primary-button" id="new-event-button">
        <span>＋</span> Create event
      </button>
    </section>

    <section class="stats-grid">
      <article class="stat-card">
        <div class="stat-heading"><span>Total events</span><span class="stat-icon purple">✦</span></div>
        <strong>${events.length}</strong>
        <p>Events in your workspace</p>
      </article>

      <article class="stat-card">
        <div class="stat-heading"><span>Total guests</span><span class="stat-icon blue">♧</span></div>
        <strong>${totalGuests}</strong>
        <p>Across all your events</p>
      </article>

      <article class="stat-card">
        <div class="stat-heading"><span>Planned budget</span><span class="stat-icon pink">◈</span></div>
        <strong>${formatMoney(totalBudget)}</strong>
        <p>Combined event budgets</p>
      </article>
    </section>

    <section class="section-heading">
      <div>
        <p class="eyebrow">KEEP THINGS MOVING</p>
        <h2>Your upcoming events</h2>
      </div>
      <button class="text-button" data-page="My Events">View all <span>→</span></button>
    </section>

    <section class="events-grid">
      ${
        upcomingEvents.length
          ? upcomingEvents.map(renderEventCard).join('')
          : `<div class="empty-state">
              <div>✦</div>
              <h3>No events yet</h3>
              <p>Create your first event to get started.</p>
              <button class="primary-button" id="empty-create-button">Create an event</button>
            </div>`
      }
    </section>

    <section class="bottom-banner">
      <div class="banner-sparkle">✧</div>
      <div>
        <p class="eyebrow">A LITTLE INSPIRATION</p>
        <h2>Good times don't plan themselves.</h2>
        <p>Start with an idea. Plan the details. Make it unforgettable.</p>
      </div>
      <div class="banner-decoration">✳</div>
    </section>
  `;
}

function renderOtherPage(): string {
  if (currentPage === 'My Events') {
    return `
      <section class="welcome-row">
        <div>
          <p class="eyebrow">YOUR WORKSPACE</p>
          <h1>My <span>events.</span></h1>
          <p class="welcome-description">All your plans, organized in one place.</p>
        </div>
        <button class="primary-button" id="new-event-button">＋ Create event</button>
      </section>
      <section class="events-grid all-events">
        ${
          events.length
            ? [...events].sort((a, b) => a.date.localeCompare(b.date)).map(renderEventCard).join('')
            : `<div class="empty-state"><h3>No events yet</h3><p>Create your first event to get started.</p></div>`
        }
      </section>
    `;
  }

  const descriptions: Record<string, string> = {
    Calendar: 'See your events and important dates in one place.',
    Guests: 'Keep track of invitations and guest lists.',
    Budget: 'Plan your spending and keep your events on budget.'
  };

  return `
    <section class="welcome-row">
      <div>
        <p class="eyebrow">COMING UP</p>
        <h1>${currentPage} <span>overview.</span></h1>
        <p class="welcome-description">${descriptions[currentPage] ?? ''}</p>
      </div>
    </section>
    <div class="placeholder-panel">
      <div class="placeholder-icon">✧</div>
      <h2>${currentPage} is next on our list.</h2>
      <p>This section is ready for us to build. Your events are already saved in this browser.</p>
      <button class="secondary-button" data-page="Dashboard">Back to dashboard</button>
    </div>
  `;
}

function openModal(): void {
  const modalRoot = document.querySelector<HTMLDivElement>('#modal-root');
  if (!modalRoot) return;

  modalRoot.innerHTML = `
    <div class="modal-backdrop" id="modal-backdrop">
      <section class="modal">
        <div class="modal-heading">
          <div>
            <p class="eyebrow">LET'S GET PLANNING</p>
            <h2>Create an event</h2>
          </div>
          <button class="icon-button" id="close-modal" aria-label="Close">✕</button>
        </div>

        <form id="event-form">
          <label>
            Event name
            <input name="name" type="text" placeholder="e.g. Summer party" required maxlength="60" />
          </label>

          <label>
            Date
            <input name="date" type="date" required />
          </label>

          <label>
            Location
            <input name="location" type="text" placeholder="Where is it happening?" required maxlength="80" />
          </label>

          <div class="form-row">
            <label>
              Number of guests
              <input name="guests" type="number" min="1" value="20" required />
            </label>
            <label>
              Budget ($)
              <input name="budget" type="number" min="0" value="500" required />
            </label>
          </div>

          <button class="primary-button modal-submit" type="submit">Create event <span>→</span></button>
        </form>
      </section>
    </div>
  `;

  document.querySelector<HTMLButtonElement>('#close-modal')
    ?.addEventListener('click', closeModal);

  document.querySelector<HTMLDivElement>('#modal-backdrop')
    ?.addEventListener('click', (event) => {
      if (event.target === event.currentTarget) closeModal();
    });

  document.querySelector<HTMLFormElement>('#event-form')
    ?.addEventListener('submit', (event) => {
      event.preventDefault();

      const form = event.currentTarget as HTMLFormElement;
      const data = new FormData(form);

      const newEvent: EventItem = {
        id: Date.now(),
        name: String(data.get('name')).trim(),
        date: String(data.get('date')),
        location: String(data.get('location')).trim(),
        guests: Number(data.get('guests')),
        budget: Number(data.get('budget')),
        color: ['purple', 'blue', 'pink'][events.length % 3]
      };

      events.push(newEvent);
      saveEvents();
      closeModal();
      currentPage = 'My Events';
      render();
    });
}

function closeModal(): void {
  const modalRoot = document.querySelector<HTMLDivElement>('#modal-root');
  if (modalRoot) modalRoot.innerHTML = '';
}

function attachListeners(): void {
  document.querySelectorAll<HTMLButtonElement>('[data-page]')
    .forEach((button) => {
      button.addEventListener('click', () => {
        currentPage = button.dataset.page ?? 'Dashboard';
        render();
      });
    });

  document.querySelectorAll<HTMLButtonElement>('.delete-event')
    .forEach((button) => {
      button.addEventListener('click', () => {
        const id = Number(button.dataset.id);
        if (!window.confirm('Delete this event?')) return;

        events = events.filter((event) => event.id !== id);
        saveEvents();
        render();
      });
    });

  document.querySelectorAll<HTMLButtonElement>('#new-event-button, #empty-create-button')
    .forEach((button) => button.addEventListener('click', openModal));
}

render();