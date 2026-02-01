let currentUser = null;
let records = JSON.parse(localStorage.getItem('scrap_db')) || [];

function login() {
    const role = document.getElementById('role').value;
    currentUser = role;
    document.getElementById('login-section').classList.add('hidden');
    showPage(role === 'admin' ? 'admin-dashboard' : 'user-add-scrap');
    updateNav();
}

function showPage(pageId) {
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');
    if(pageId === 'admin-dashboard') renderChart();
    if(pageId === 'user-view-scrap') renderUserRecords();
}

// Logic para sa Form Reset at Submission
document.getElementById('scrap-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const newRecord = {
        id: Date.now(),
        user: currentUser,
        date: document.getElementById('date').value,
        personnel: document.getElementById('personnel').value,
        qty: parseInt(document.getElementById('qty').value),
        type: document.getElementById('scrap-type').value
    };
    records.push(newRecord);
    localStorage.setItem('scrap_db', JSON.stringify(records));
    alert("Record Added!");
    e.target.reset(); // Auto reset
});

function renderUserRecords() {
    const list = document.getElementById('scrap-list');
    list.innerHTML = records.filter(r => r.user === currentUser).map(r => `
        <tr>
            <td>${r.date}</td>
            <td>${r.personnel}</td>
            <td>${r.type}</td>
            <td>${r.qty}</td>
            <td><button onclick="deleteRecord(${r.id})">Delete</button></td>
        </tr>
    `).join('');
}

function deleteRecord(id) {
    records = records.filter(r => r.id !== id);
    localStorage.setItem('scrap_db', JSON.stringify(records));
    renderUserRecords();
}

// Chart Logic para sa Admin
function renderChart() {
    const ctx = document.getElementById('monthlyChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Garbage', 'Carton', 'Waste Pallet', 'Pallet'],
            datasets: [{
                label: 'Scrap Volume',
                data: [12, 19, 3, 5], // Sample Data - Pwedeng i-link sa records array
                backgroundColor: '#2e7d32'
            }]
        }
    });
}

function updateNav() {
    const nav = document.getElementById('nav-links');
    if(currentUser === 'admin') {
        nav.innerHTML = `<button onclick="showPage('admin-dashboard')">Dashboard</button>
                         <button onclick="showPage('admin-users')">Add User</button>`;
    } else {
        nav.innerHTML = `<button onclick="showPage('user-add-scrap')">Add Scrap</button>
                         <button onclick="showPage('user-view-scrap')">View/Edit</button>`;
    }
}
