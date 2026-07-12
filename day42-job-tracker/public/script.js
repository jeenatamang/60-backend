const API = '/jobs';

let currentFilter = '';
let searchTimeout = null;

const toast = document.getElementById('toast');
const modalOverlay = document.getElementById('modal-overlay');
const modalContent = document.getElementById('modal-content');
const modalClose = document.getElementById('modal-close');

function showToast(message, isError = false) {
  toast.textContent = message;
  toast.className = 'toast show' + (isError ? ' error' : '');
  setTimeout(() => { toast.className = 'toast'; }, 2800);
}

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const view = btn.dataset.view;
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(`view-${view}`).classList.add('active');
    if (view === 'dashboard') loadDashboard();
    if (view === 'applications') loadJobs();
  });
});

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.status;

    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-view="applications"]').classList.add('active');
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('view-applications').classList.add('active');

    loadJobs();
  });
});

document.getElementById('search-input').addEventListener('input', (e) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => loadJobs(e.target.value), 300);
});

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

function openModal() { modalOverlay.classList.add('open'); }
function closeModal() { modalOverlay.classList.remove('open'); }

function statusBadge(status) {
  return `<span class="status-badge status-${status}">${status}</span>`;
}

function priorityBadge(priority) {
  return `<span class="priority-badge priority-${priority}">${priority}</span>`;
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

async function loadDashboard() {
  try {
    const [statsRes, jobsRes] = await Promise.all([
      fetch(`${API}/stats`),
      fetch(`${API}?sort=oldest`)
    ]);
    const statsJson = await statsRes.json();
    const jobsJson = await jobsRes.json();

    renderStats(statsJson.data);
    renderRecent(jobsJson.data.slice(0, 5));
  } catch (err) {
    showToast('Failed to load dashboard', true);
  }
}

function renderStats(data) {
  if (!data) return;
  const { overview, byStatus } = data;

  const statusMap = {};
  if (byStatus) byStatus.forEach(s => { statusMap[s._id] = s.count; });

  document.getElementById('stats-grid').innerHTML = `
    <div class="stat-card">
      <div class="stat-num">${overview?.totalApplications || 0}</div>
      <div class="stat-label">Total</div>
    </div>
    <div class="stat-card">
      <div class="stat-num" style="color: var(--applied)">${statusMap['applied'] || 0}</div>
      <div class="stat-label">Applied</div>
    </div>
    <div class="stat-card">
      <div class="stat-num" style="color: var(--interview)">${statusMap['interview'] || 0}</div>
      <div class="stat-label">Interviews</div>
    </div>
    <div class="stat-card">
      <div class="stat-num" style="color: var(--offer)">${overview?.offers || 0}</div>
      <div class="stat-label">Offers</div>
    </div>
    <div class="stat-card">
      <div class="stat-num" style="color: var(--rejected)">${overview?.rejections || 0}</div>
      <div class="stat-label">Rejected</div>
    </div>
    <div class="stat-card">
      <div class="stat-num" style="color: var(--accent)">${overview?.activeApplications || 0}</div>
      <div class="stat-label">Active</div>
    </div>
  `;
}

function renderRecent(jobs) {
  const el = document.getElementById('recent-list');
  if (!jobs || jobs.length === 0) {
    el.innerHTML = `<div class="empty">No applications yet. Add your first one!</div>`;
    return;
  }
  el.innerHTML = jobs.map(job => jobCardHTML(job)).join('');
  el.querySelectorAll('.job-card').forEach(card => {
    card.addEventListener('click', () => openJobDetail(card.dataset.id));
  });
}

async function loadJobs(search = '') {
  try {
    let url = API;
    const params = new URLSearchParams();
    if (currentFilter) params.set('status', currentFilter);
    if (search) params.set('search', search);
    if (params.toString()) url += `?${params.toString()}`;

    const res = await fetch(url);
    const json = await res.json();
    renderJobs(json.data);
  } catch (err) {
    showToast('Failed to load applications', true);
  }
}

function jobCardHTML(job) {
  return `
    <div class="job-card" data-id="${job._id}">
      <div class="job-card-left">
        <div class="job-company">${escapeHtml(job.company)}</div>
        <div class="job-role">${escapeHtml(job.role)}</div>
        <div class="job-meta">
          ${statusBadge(job.status)}
          ${priorityBadge(job.priority)}
          <span class="job-type-tag">${job.jobType}</span>
          <span class="job-days">${job.daysSinceApplied}d ago</span>
        </div>
      </div>
    </div>
  `;
}

function renderJobs(jobs) {
  const el = document.getElementById('jobs-list');
  if (!jobs || jobs.length === 0) {
    el.innerHTML = `<div class="empty">No applications found.</div>`;
    return;
  }
  el.innerHTML = jobs.map(job => jobCardHTML(job)).join('');
  el.querySelectorAll('.job-card').forEach(card => {
    card.addEventListener('click', () => openJobDetail(card.dataset.id));
  });
}

async function openJobDetail(id) {
  try {
    const res = await fetch(`${API}/${id}`);
    const json = await res.json();
    const job = json.data;

    modalContent.innerHTML = `
      <div class="modal-company">${escapeHtml(job.company)}</div>
      <div class="modal-role">${escapeHtml(job.role)}</div>
      <div class="job-meta" style="margin-bottom: 4px">
        ${statusBadge(job.status)}
        ${priorityBadge(job.priority)}
        <span class="job-type-tag">${job.jobType}</span>
      </div>

      <div class="modal-section">
        <div class="modal-section-title">Details</div>
        <div class="modal-row">
          <span class="modal-row-label">Location</span>
          <span>${escapeHtml(job.location) || '—'}</span>
        </div>
        <div class="modal-row">
          <span class="modal-row-label">Salary</span>
          <span>${job.salaryRange || '—'}</span>
        </div>
        <div class="modal-row">
          <span class="modal-row-label">Applied</span>
          <span>${formatDate(job.appliedAt)} (${job.daysSinceApplied} days ago)</span>
        </div>
        <div class="modal-row">
          <span class="modal-row-label">Interview date</span>
          <span>${formatDate(job.interviewDate)}</span>
        </div>
        ${job.jobUrl ? `
        <div class="modal-row">
          <span class="modal-row-label">Job URL</span>
          <a href="${escapeHtml(job.jobUrl)}" target="_blank" style="color: var(--accent); font-size: 13px">View listing</a>
        </div>` : ''}
      </div>

      <div class="modal-section">
        <div class="modal-section-title">Update Status</div>
        <select class="status-select-modal" id="modal-status-select">
          <option value="applied" ${job.status === 'applied' ? 'selected' : ''}>Applied</option>
          <option value="screening" ${job.status === 'screening' ? 'selected' : ''}>Screening</option>
          <option value="interview" ${job.status === 'interview' ? 'selected' : ''}>Interview</option>
          <option value="offer" ${job.status === 'offer' ? 'selected' : ''}>Offer</option>
          <option value="rejected" ${job.status === 'rejected' ? 'selected' : ''}>Rejected</option>
          <option value="withdrawn" ${job.status === 'withdrawn' ? 'selected' : ''}>Withdrawn</option>
        </select>
      </div>

      <div class="modal-section">
        <div class="modal-section-title">Notes</div>
        <div class="note-input-wrap">
          <textarea id="modal-note" rows="3" placeholder="Add interview notes, follow-ups...">${escapeHtml(job.notes || '')}</textarea>
        </div>
      </div>

      <div class="modal-actions">
        <button class="btn-primary" id="modal-save">Save changes</button>
        <button class="btn-danger" id="modal-delete">Delete</button>
      </div>
    `;

    document.getElementById('modal-save').addEventListener('click', async () => {
      const newStatus = document.getElementById('modal-status-select').value;
      const note = document.getElementById('modal-note').value;

      try {
        if (newStatus !== job.status) {
          await fetch(`${API}/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
          });
        }

        if (note !== (job.notes || '')) {
          await fetch(`${API}/${id}/note`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ note })
          });
        }

        showToast('Changes saved');
        closeModal();
        loadJobs(document.getElementById('search-input').value);
        loadDashboard();
      } catch (err) {
        showToast('Failed to save changes', true);
      }
    });

    document.getElementById('modal-delete').addEventListener('click', async () => {
      if (!confirm(`Delete application for ${job.role} at ${job.company}?`)) return;
      try {
        await fetch(`${API}/${id}`, { method: 'DELETE' });
        showToast('Application deleted');
        closeModal();
        loadJobs(document.getElementById('search-input').value);
        loadDashboard();
      } catch (err) {
        showToast('Failed to delete', true);
      }
    });

    openModal();
  } catch (err) {
    showToast('Failed to load job details', true);
  }
}

document.getElementById('submit-job').addEventListener('click', async () => {
  const company = document.getElementById('f-company').value.trim();
  const role = document.getElementById('f-role').value.trim();

  if (!company || !role) {
    showToast('Company and role are required', true);
    return;
  }

  const body = {
    company,
    role,
    location: document.getElementById('f-location').value.trim() || 'Remote',
    jobType: document.getElementById('f-jobType').value,
    priority: document.getElementById('f-priority').value,
    jobUrl: document.getElementById('f-jobUrl').value.trim(),
    notes: document.getElementById('f-notes').value.trim(),
    salary: {
      min: parseInt(document.getElementById('f-salaryMin').value) || null,
      max: parseInt(document.getElementById('f-salaryMax').value) || null,
      currency: 'USD'
    }
  };

  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);

    ['f-company', 'f-role', 'f-location', 'f-jobUrl', 'f-notes', 'f-salaryMin', 'f-salaryMax'].forEach(id => {
      document.getElementById(id).value = '';
    });

    showToast(`Added ${company} — ${role}`);

    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-view="applications"]').classList.add('active');
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('view-applications').classList.add('active');
    loadJobs();
  } catch (err) {
    showToast(err.message || 'Failed to add application', true);
  }
});

loadDashboard();
