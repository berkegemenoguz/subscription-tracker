const API_URL = '/api/subscriptions';

let subscriptions = [];
let editingId = null;

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('subscription-form').addEventListener('submit', handleFormSubmit);
  document.getElementById('cancel-btn').addEventListener('click', resetForm);
  loadSubscriptions();
});

async function loadSubscriptions() {
  try {
    const res = await fetch(API_URL);
    subscriptions = await res.json();
    renderTable();
    renderCalendar();
    await loadSummary();
  } catch (err) {
    console.error('Failed to load subscriptions:', err);
  }
}

async function loadSummary() {
  try {
    const res = await fetch(`${API_URL}/summary`);
    const data = await res.json();
    document.getElementById('monthly-total').textContent = `$${data.monthlyTotal.toFixed(2)}`;
    document.getElementById('yearly-total').textContent = `$${data.yearlyTotal.toFixed(2)}`;
    document.getElementById('estimated-monthly').textContent = `$${data.estimatedMonthly.toFixed(2)}`;
    document.getElementById('estimated-yearly').textContent = `$${data.estimatedYearly.toFixed(2)}`;
  } catch (err) {
    console.error('Failed to load summary:', err);
  }
}

function renderTable() {
  const tbody = document.getElementById('subscriptions-body');
  const table = document.getElementById('subscriptions-table');
  const emptyMsg = document.getElementById('empty-message');

  tbody.innerHTML = '';

  if (subscriptions.length === 0) {
    table.style.display = 'none';
    emptyMsg.style.display = 'block';
    return;
  }

  table.style.display = 'table';
  emptyMsg.style.display = 'none';

  for (const sub of subscriptions) {
    const tr = document.createElement('tr');

    const cycleText = sub.cycle === 'monthly' ? 'Monthly' : 'Yearly';
    const statusClass = sub.status === 'active' ? 'status-active' : 'status-cancelled';
    const statusText = sub.status === 'active' ? 'Active' : 'Cancelled';

    tr.innerHTML = `
      <td>${escapeHtml(sub.name)}</td>
      <td>$${parseFloat(sub.price).toFixed(2)}</td>
      <td>${cycleText}</td>
      <td>${sub.start_date ? sub.start_date.substring(0, 10) : ''}</td>
      <td><span class="${statusClass}">${statusText}</span></td>
      <td>
        <button class="action-btn edit-btn" data-id="${sub.id}">Edit</button>
        <button class="action-btn delete-btn" data-id="${sub.id}">Delete</button>
      </td>
    `;

    tr.querySelector('.edit-btn').addEventListener('click', () => handleEdit(sub.id));
    tr.querySelector('.delete-btn').addEventListener('click', () => handleDelete(sub.id));

    tbody.appendChild(tr);
  }
}

function renderCalendar() {
  const grid = document.getElementById('calendar-grid');
  grid.innerHTML = '';

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  for (let i = 0; i < 12; i++) {
    const month = (currentMonth + i) % 12;
    const year = currentYear + Math.floor((currentMonth + i) / 12);

    let monthTotal = 0;
    const monthSubs = [];

    for (const sub of subscriptions) {
      if (sub.status !== 'active') continue;

      const price = parseFloat(sub.price);

      if (sub.cycle === 'monthly') {
        monthTotal += price;
        monthSubs.push(sub);
      } else if (sub.cycle === 'yearly') {
        const startDate = new Date(sub.start_date);
        if (startDate.getMonth() === month) {
          monthTotal += price;
          monthSubs.push(sub);
        }
      }
    }

    const card = document.createElement('div');
    card.className = 'calendar-month';

    const subsListHtml = monthSubs
      .map(s => `<li>${escapeHtml(s.name)}: $${parseFloat(s.price).toFixed(2)}</li>`)
      .join('');

    card.innerHTML = `
      <h3>${monthNames[month]} ${year}</h3>
      <p class="month-total">$${monthTotal.toFixed(2)}</p>
      <ul>${subsListHtml}</ul>
    `;

    grid.appendChild(card);
  }
}

async function handleFormSubmit(e) {
  e.preventDefault();

  const formData = getFormData();
  const errors = validateForm(formData);

  if (errors.length > 0) {
    showFormErrors(errors);
    return;
  }

  clearFormErrors();

  try {
    let res;
    if (editingId) {
      res = await fetch(`${API_URL}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    } else {
      res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    }

    if (!res.ok) {
      const data = await res.json();
      if (data.errors) {
        showFormErrors(data.errors);
      } else if (data.error) {
        showFormErrors([data.error]);
      }
      return;
    }

    resetForm();
    await loadSubscriptions();
  } catch (err) {
    showFormErrors(['Could not connect to the server.']);
  }
}

function handleEdit(id) {
  const sub = subscriptions.find(s => s.id === id);
  if (!sub) return;

  editingId = id;

  document.getElementById('name').value = sub.name;
  document.getElementById('price').value = parseFloat(sub.price);
  document.getElementById('cycle').value = sub.cycle;
  document.getElementById('start_date').value = sub.start_date ? sub.start_date.substring(0, 10) : '';
  document.getElementById('status').value = sub.status;
  document.getElementById('notes').value = sub.notes || '';

  document.getElementById('form-title').textContent = 'Edit Subscription';
  document.getElementById('submit-btn').textContent = 'Update';
  document.getElementById('cancel-btn').style.display = 'inline-block';

  document.getElementById('form-section').scrollIntoView({ behavior: 'smooth' });
}

async function handleDelete(id) {
  if (!confirm('Are you sure you want to delete this subscription?')) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (res.ok) {
      await loadSubscriptions();
    }
  } catch (err) {
    console.error('Failed to delete:', err);
  }
}

function resetForm() {
  editingId = null;
  document.getElementById('subscription-form').reset();
  document.getElementById('form-title').textContent = 'Add New Subscription';
  document.getElementById('submit-btn').textContent = 'Add';
  document.getElementById('cancel-btn').style.display = 'none';
  clearFormErrors();
}

function getFormData() {
  return {
    name: document.getElementById('name').value.trim(),
    price: parseFloat(document.getElementById('price').value),
    cycle: document.getElementById('cycle').value,
    start_date: document.getElementById('start_date').value,
    status: document.getElementById('status').value,
    notes: document.getElementById('notes').value.trim() || null,
  };
}

function validateForm(data) {
  const errors = [];

  if (!data.name || data.name.length === 0) errors.push('Name is required.');
  if (data.name && data.name.length > 100) errors.push('Name must be 100 characters or fewer.');

  if (!data.price || isNaN(data.price) || data.price <= 0) errors.push('Price must be a positive number.');

  if (!['monthly', 'yearly'].includes(data.cycle)) errors.push('Cycle must be monthly or yearly.');

  if (!data.start_date) errors.push('Start date is required.');

  if (data.status && !['active', 'cancelled'].includes(data.status)) errors.push('Status must be active or cancelled.');

  return errors;
}

function showFormErrors(errors) {
  const el = document.getElementById('form-errors');
  el.innerHTML = `<ul>${errors.map(e => `<li>${escapeHtml(e)}</li>`).join('')}</ul>`;
}

function clearFormErrors() {
  document.getElementById('form-errors').innerHTML = '';
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
