// Database Simulation
let users = JSON.parse(localStorage.getItem('envi_users')) || [
    { username: 'admin', pass: 'admin123', name: 'System Admin', role: 'admin', status: 'Approved' }
];
let records = JSON.parse(localStorage.getItem('scrap_db')) || [];
let currentUser = null;

// --- LOGIN LOGIC ---
function login() {
    const userIn = document.getElementById('login-user').value;
    const passIn = document.getElementById('login-pass').value;

    const foundUser = users.find(u => u.username === userIn && u.pass === passIn);

    if (foundUser) {
        if (foundUser.status === 'Disapproved') {
            alert("Your account is disabled. Please contact Admin.");
            return;
        }
        currentUser = foundUser;
        document.getElementById('login-section').classList.add('hidden');
        document.getElementById('logout-btn').classList.remove('hidden');
        
        if (foundUser.role === 'admin') {
            showPage('admin-dashboard');
        } else {
            showPage('user-add-scrap');
        }
        updateNav();
    } else {
        alert("Invalid Username or Password!");
    }
}

function logout() {
    currentUser = null;
    location.reload(); // Refresh para bumalik sa login
}

// --- ADMIN: USER MANAGEMENT ---
function addUser() {
    const name = document.getElementById('new-user').value;
    const user = document.getElementById('new-username').value;
    const role = document.getElementById('new-role').value;

    if(!name || !user) return alert("Fill all fields");

    const newUser = { username: user, pass: '1234', name: name, role: role, status: 'Approved' };
    users.push(newUser);
    localStorage.setItem('envi_users', JSON.stringify(users));
    renderUserList();
    alert("User added! Default password: 1234");
}

function renderUserList() {
    const list = document.getElementById('user-list-body');
    list.innerHTML = users.map((u, index) => `
        <tr>
            <td>${u.name}</td>
            <td>${u.role.toUpperCase()}</td>
            <td>
                <select onchange="toggleStatus(${index}, this.value)">
                    <option ${u.status === 'Approved' ? 'selected' : ''}>Approved</option>
                    <option ${u.status === 'Disapproved' ? 'selected' : ''}>Disapproved</option>
                </select>
            </td>
            <td><button class="btn-delete" onclick="deleteUser(${index})">Delete</button></td>
        </tr>
    `).join('');
}

function deleteUser(index) {
    if(confirm("Delete this user?")) {
        users.splice(index, 1);
        localStorage.setItem('envi_users', JSON.stringify(users));
        renderUserList();
    }
}

function toggleStatus(index, val) {
    users[index].status = val;
    localStorage.setItem('envi_users', JSON.stringify(users));
}

// --- NAVIGATION & PAGES ---
function showPage(pageId) {
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');
    
    if(pageId === 'admin-dashboard') renderChart();
    if(pageId === 'admin-users') renderUserList();
    if(pageId === 'user-view-scrap') renderUserRecords();
}

function updateNav() {
    const nav = document.getElementById('nav-links');
    if(currentUser.role === 'admin') {
        nav.innerHTML = `
            <button onclick="showPage('admin-dashboard')">Dashboard</button>
            <button onclick="showPage('admin-users')">User Management</button>`;
    } else {
        nav.innerHTML = `
            <button onclick="showPage('user-add-scrap')">Add Record</button>
            <button onclick="showPage('user-view-scrap')">View Records</button>`;
    }
}

// --- RECORDS LOGIC ---
document.getElementById('scrap-form').onsubmit = (e) => {
    e.preventDefault();
    const rec = {
        id: Date.now(),
        owner: currentUser.username,
        date: document.getElementById('date').value,
        personnel: document.getElementById('personnel').value,
        qty: document.getElementById('qty').value,
        type: document.getElementById('scrap-type').value
    };
    records.push(rec);
    localStorage.setItem('scrap_db', JSON.stringify(records));
    alert("Record Saved!");
    e.target.reset();
};

function renderUserRecords() {
    const list = document.getElementById('scrap-list');
    const myRecs = records.filter(r => r.owner === currentUser.username);
    list.innerHTML = myRecs.map(r => `
        <tr>
            <td>${r.date}</td><td>${r.personnel}</td><td>${r.type}</td><td>${r.qty}</td>
            <td><button class="btn-delete" onclick="deleteRecord(${r.id})">Delete</button></td>
        </tr>
    `).join('');
}

function deleteRecord(id) {
    records = records.filter(r => r.id !== id);
    localStorage.setItem('scrap_db', JSON.stringify(records));
    renderUserRecords();
}

// Chart Placeholder
function renderChart() {
    const ctx = document.getElementById('monthlyChart');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr'],
            datasets: [{ label: 'Scrap Waste', data: [10, 25, 13, 40], backgroundColor: '#00205B' }]
        }
    });
}
