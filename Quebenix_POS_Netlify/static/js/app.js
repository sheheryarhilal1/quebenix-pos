
/* =====================================================
   QUEBENIX TECHNOLOGY - POS SYSTEM
   Standard | Golden | Premium Packages
===================================================== */

const $ = s => document.querySelector(s);

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
}[c]));

const money = n => `${db.settings.currency || 'PKR'} ${Number(n || 0).toLocaleString('en-PK', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
})}`;

const today = () => new Date().toISOString().slice(0, 10);

const uid = () => Date.now() + Math.floor(Math.random() * 999);

const defaultPackages = (price) => ({
    standard: { name: 'Standard', price: Number(price) },
    golden: { name: 'Golden', price: Number(price) * 2 },
    premium: { name: 'Premium', price: Number(price) * 4 }
});

/* =====================================================
   DEFAULT DATABASE
===================================================== */

const defaults = {

    users: [{
        id: 1,
        name: 'Quebenix Admin',
        email: 'admin@quebenix.com',
        password: 'Admin@123',
        role: 'Admin',
        active: 1
    }],

    clients: [],
    sales: [],
    projects: [],
    expenses: [],

    services: [
        {
            id: 1,
            name: 'Website Development',
            category: 'Web Development',
            description: 'Business websites, landing pages and eCommerce',
            price: 60000,
            active: 1,
            packages: {
                standard: { name: 'Standard', price: 60000 },
                golden: { name: 'Golden', price: 120000 },
                premium: { name: 'Premium', price: 250000 }
            }
        },
        {
            id: 2,
            name: 'Mobile App Development',
            category: 'Mobile Apps',
            description: 'Android and iOS application development',
            price: 250000,
            active: 1,
            packages: {
                standard: { name: 'Standard', price: 250000 },
                golden: { name: 'Golden', price: 500000 },
                premium: { name: 'Premium', price: 900000 }
            }
        },
        {
            id: 3,
            name: 'Power BI Dashboard',
            category: 'Data Analytics',
            description: 'Interactive BI dashboards and reporting',
            price: 35000,
            active: 1,
            packages: {
                standard: { name: 'Standard', price: 35000 },
                golden: { name: 'Golden', price: 75000 },
                premium: { name: 'Premium', price: 150000 }
            }
        },
        {
            id: 4,
            name: 'Data Analysis',
            category: 'Data Analytics',
            description: 'SQL, Python, Excel analysis and insights',
            price: 20000,
            active: 1,
            packages: {
                standard: { name: 'Standard', price: 20000 },
                golden: { name: 'Golden', price: 45000 },
                premium: { name: 'Premium', price: 90000 }
            }
        },
        {
            id: 5,
            name: 'QA Testing',
            category: 'Quality Assurance',
            description: 'Manual testing, automation, API and performance testing',
            price: 25000,
            active: 1,
            packages: {
                standard: { name: 'Standard', price: 25000 },
                golden: { name: 'Golden', price: 50000 },
                premium: { name: 'Premium', price: 100000 }
            }
        },
        {
            id: 6,
            name: 'SEO',
            category: 'SEO',
            description: 'Technical SEO, on-page optimization and content strategy',
            price: 35000,
            active: 1,
            packages: {
                standard: { name: 'Standard', price: 35000 },
                golden: { name: 'Golden', price: 65000 },
                premium: { name: 'Premium', price: 110000 }
            }
        },
        {
            id: 7,
            name: 'Digital Marketing',
            category: 'Digital Marketing',
            description: 'Social media, campaigns and performance marketing',
            price: 30000,
            active: 1,
            packages: {
                standard: { name: 'Standard' },
                golden: { name: 'Golden' },
                premium: { name: 'Premium' }
            }
        },
        {
            id: 8,
            name: 'Data Science',
            category: 'Data Science',
            description: 'Data modeling, predictive analytics and machine learning solutions',
            price: 75000,
            active: 1,
            packages: {
                standard: { name: 'Standard', },
                golden: { name: 'Golden',  },
                premium: { name: 'Premium' }
            }
        },
        {
            id: 9,
            name: 'UI/UX Design',
            category: 'Design',
            description: 'User research, wireframes and interface design',
            price: 30000,
            active: 1,
            packages: {
                standard: { name: 'Standard'},
                golden: { name: 'Golden' },
                premium: { name: 'Premium' }
            }
        }
    ],

    settings: {
        company_name: 'Quebenix Technology',
        email: 'quebenixtechnology4@gmail.com',
        phone: '+92 326 2434508',
        address: 'Karachi, Pakistan',
        currency: 'PKR',
        tax_rate: 0,
        logo_url: 'static/img/quebenix-logo.jpg'
    }
};

/* =====================================================
   DATABASE INITIALIZATION & MIGRATION
===================================================== */

let db;

try {
    db = JSON.parse(localStorage.getItem('quebenix_pos_db')) ||
        structuredClone(defaults);
} catch (e) {
    db = structuredClone(defaults);
}

db.users ||= [];
db.clients ||= [];
db.sales ||= [];
db.projects ||= [];
db.expenses ||= [];
db.services ||= [];
db.settings ||= structuredClone(defaults.settings);

db.services.forEach(s => {
    s.packages ||= defaultPackages(s.price);

    ['standard', 'golden', 'premium'].forEach(key => {
        if (!s.packages[key]) {
            s.packages[key] = {
                name: key.charAt(0).toUpperCase() + key.slice(1),
                price: Number(s.price || 0)
            };
        }
    });
});

function save() {
    localStorage.setItem('quebenix_pos_db', JSON.stringify(db));
}

save();

/* =====================================================
   GLOBAL STATE
===================================================== */

let user = null;
let page = 'dashboard';
let cart = [];
let currentInvoice = null;

const nav = [
    ['dashboard', '▦', 'Dashboard'],
    ['pos', '▣', 'POS Terminal', 'NEW'],
    ['sales', '↗', 'Sales & Invoices'],
    ['clients', '◎', 'Clients'],
    ['services', '◇', 'Service Catalog'],
    ['projects', '▤', 'Projects'],
    ['expenses', '↘', 'Expenses'],
    ['reports', '▥', 'Reports'],
    ['staff', '♙', 'Team & Staff'],
    ['settings', '⚙', 'Settings']
];

/* =====================================================
   SIDEBAR
===================================================== */

function openSidebar() {
    document.body.classList.add('nav-open');
    $('#mobileMenu')?.setAttribute('aria-expanded', 'true');
}

function closeSidebar() {
    document.body.classList.remove('nav-open');
    $('#mobileMenu')?.setAttribute('aria-expanded', 'false');
}

function toggleSidebar() {
    document.body.classList.contains('nav-open')
        ? closeSidebar()
        : openSidebar();
}

document.addEventListener('click', function(e) {

    const menuBtn = e.target.closest('#mobileMenu');
    const sidebar = $('.sidebar');

    if (menuBtn) {
        e.preventDefault();
        e.stopPropagation();
        toggleSidebar();
        return;
    }

    if (e.target.closest('.sidebar nav a')) {
        closeSidebar();
        return;
    }

    if (
        document.body.classList.contains('nav-open') &&
        sidebar &&
        !sidebar.contains(e.target)
    ) {
        closeSidebar();
    }
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeSidebar();
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 760) closeSidebar();
});

/* =====================================================
   NAVIGATION
===================================================== */

function go(p) {
    closeSidebar();
    page = p;
    history.replaceState({}, '', `#${p}`);
    render();
}

/* =====================================================
   LOGIN
===================================================== */

function loginView() {

    return `<div class="login-body">

        <div class="login-art">

            <div class="login-brand">
                <img class="brand-mark-img login-full-logo"
                src="${esc(db.settings.logo_url || 'static/img/quebenix-logo.jpg')}">
            </div>

            <div class="art-copy">
                <span class="eyebrow">BUSINESS OPERATIONS, REIMAGINED</span>

                <h1>One workspace.<br>
                <span>Every business move.</span></h1>

                <p>Manage clients, services, projects and revenue with clarity and control.</p>

                <div class="art-orbit">Q</div>
            </div>

            <small class="login-foot">INNOVATE · DEVELOP · GROW</small>

        </div>

        <div class="login-panel">

            <form class="login-card" id="loginForm">

                <span class="eyebrow">WELCOME BACK</span>

                <h2>Sign in to your workspace</h2>

                <p>Enter your credentials to continue.</p>

                <div id="loginError"></div>

                <label>Email address</label>

                <input name="email" type="email"
                    placeholder="admin@quebenix.com" required>

                <label>Password</label>

                <input name="password" type="password"
                    placeholder="Enter your password" required>

                <button class="btn primary full">
                    Sign in <span>→</span>
                </button>

            </form>

        </div>

    </div>`;
}

/* =====================================================
   APPLICATION SHELL
===================================================== */

function shell(content, title) {

    return `<div class="app-shell">

        <aside class="sidebar">

            <a class="brand brand-full-logo" href="#dashboard">
                <img class="brand-mark-img brand-full-logo"
                    src="${esc(db.settings.logo_url || 'static/img/quebenix-logo.jpg')}"
                    alt="Quebenix Technology">
            </a>

            <div class="side-label">WORKSPACE</div>

            <nav>
                ${nav.slice(0, 8).map(n => `
                    <a href="#${n[0]}" class="${page === n[0] ? 'active' : ''}">
                        ${n[1]}
                        <span>${n[2]}</span>
                        ${n[3] ? `<em>${n[3]}</em>` : ''}
                    </a>
                `).join('')}
            </nav>

            <div class="side-label admin-label">ADMINISTRATION</div>

            <nav>
                ${user.role === 'Admin' ? nav.slice(8).map(n => `
                    <a href="#${n[0]}" class="${page === n[0] ? 'active' : ''}">
                        ${n[1]}
                        <span>${n[2]}</span>
                    </a>
                `).join('') : ''}
            </nav>

            <div class="sidebar-bottom">
                <div class="online-dot"></div>
                <span>Workspace online</span>
                <small>v1.0.0</small>
            </div>

        </aside>

        <main class="main">

            <header class="topbar">

                <button class="mobile-menu" id="mobileMenu"
                    type="button"
                    aria-label="Toggle navigation"
                    aria-expanded="false">☰</button>

                <div>
                    <span class="crumb">QUEBENIX /</span>
                    <b>${title}</b>
                </div>

                <div class="top-actions">

                    <span class="top-date">
                        ${new Date().toLocaleDateString('en', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        })}
                    </span>

                    <div class="user-chip">
                        <span class="avatar">${esc(user.name[0].toUpperCase())}</span>
                        <span>
                            <b>${esc(user.name)}</b>
                            <small>${esc(user.role)}</small>
                        </span>
                    </div>

                    <a class="logout" href="#logout" title="Logout">↪</a>

                </div>

            </header>

            <section class="content" id="content">
                ${content}
            </section>

            <footer>
                © 2026 Quebenix Technology
                <span>INNOVATE · DEVELOP · GROW</span>
            </footer>

        </main>

    </div>`;
}

/* =====================================================
   DASHBOARD
===================================================== */

function stat(label, value, sub, featured = false, icon = '↗') {

    return `<div class="stat-card ${featured ? 'featured' : ''}">
        <div class="stat-top">
            <span>${label}</span>
            <span class="stat-icon">${icon}</span>
        </div>
        <strong>${value}</strong>
        <small>${sub}</small>
        ${featured ? '<div class="sparkline">〰 〰 〰</div>' : ''}
    </div>`;
}

function tableEmpty(cols, msg) {
    return `<tr><td colspan="${cols}" class="empty">${msg}</td></tr>`;
}

function status(s) {
    return `<span class="status ${String(s).toLowerCase().replaceAll(' ', ' ')}">${esc(s)}</span>`;
}

function dashboard() {

    let revenue = db.sales
        .filter(s => s.status === 'Paid')
        .reduce((a, s) => a + Number(s.total || 0), 0);

    let active = db.projects
        .filter(p => !['Completed', 'Cancelled'].includes(p.status)).length;

    return `<div class="page-heading">

        <div>
            <span class="eyebrow">BUSINESS OVERVIEW</span>

            <h1>Good to see you, ${esc(user.name.split(' ')[0])}
                <span class="wave">✦</span>
            </h1>

            <p>Here's what's happening across your business today.</p>
        </div>

        <a class="btn primary" href="#pos">＋ New sale</a>

    </div>

    <div class="stats-grid">
        ${stat('Total revenue', money(revenue), 'Paid sales to date', true)}
        ${stat('Total sales', db.sales.length, 'All transactions', false, '▣')}
        ${stat('Active clients', db.clients.length, 'Client records', false, '◎')}
        ${stat('Active projects', active, 'In progress or planning', false, '▤')}
    </div>

    <div class="dashboard-grid">

        <div class="panel chart-panel">

            <div class="panel-head">
                <div>
                    <h3>Revenue overview</h3>
                    <p>Monthly sales performance</p>
                </div>

<span class="pill">Daily sales · Last 30 days</span>
            </div>

            <canvas id="revenueChart" height="115"></canvas>

        </div>

        <div class="panel quick-panel">

            <div class="panel-head">
                <div>
                    <h3>Quick actions</h3>
                    <p>Jump back into your workflow</p>
                </div>
            </div>

            <a class="quick-link" href="#pos">
                <span class="quick-icon">＋</span>
                <span><b>Create a sale</b><small>Start a new checkout</small></span>
                <i>→</i>
            </a>

            <a class="quick-link" href="#clients">
                <span class="quick-icon">◎</span>
                <span><b>Add a client</b><small>Grow your customer list</small></span>
                <i>→</i>
            </a>

            <a class="quick-link" href="#projects">
                <span class="quick-icon">▤</span>
                <span><b>Track a project</b><small>Manage delivery progress</small></span>
                <i>→</i>
            </a>

        </div>

    </div>

    <div class="panel table-panel">

        <div class="panel-head">
            <div>
                <h3>Recent transactions</h3>
                <p>Your latest sales activity</p>
            </div>

            <a class="text-link" href="#sales">View all →</a>
        </div>

        <div class="table-wrap">

            <table>
                <thead>
                    <tr>
                        <th>INVOICE</th>
                        <th>CLIENT</th>
                        <th>DATE</th>
                        <th>PAYMENT</th>
                        <th>STATUS</th>
                        <th class="right">TOTAL</th>
                    </tr>
                </thead>

                <tbody>
                    ${db.sales.slice().reverse().slice(0, 7).map(s => `
                        <tr>
                            <td><a class="invoice-link" href="#invoice-${s.id}">${esc(s.invoice_no)}</a></td>
<td>
    ${esc(s.client_name || s.customer_type_label || 'Customer')}
    <small class="customer-type">
        ${esc(s.customer_type || 'Walk-in')}
    </small>
</td>                            <td>${esc(s.created_at)}</td>
                            <td>${esc(s.payment_method)}</td>
                            <td>${status(s.status)}</td>
                            <td class="right money">${money(s.total)}</td>
                        </tr>
                    `).join('') || tableEmpty(6, 'No transactions yet.')}
                </tbody>

            </table>

        </div>

    </div>`;
}

/* =====================================================
   CLIENTS
===================================================== */

function clients() {

    return `<div class="page-heading">
        <div>
            <span class="eyebrow">RELATIONSHIP MANAGEMENT</span>
            <h1>Clients</h1>
            <p>Keep every client relationship organized.</p>
        </div>
    </div>

    <div class="two-col">

        <form class="panel form-panel" id="clientForm">

            <h3>Add new client</h3>
            <p class="subtext">Create a customer profile.</p>

            <label>Client / contact name *</label>
            <input name="name" required placeholder="e.g. Alex Morgan">

            <label>Company</label>
            <input name="company" placeholder="Company name">

            <div class="form-row">
                <div>
                    <label>Email</label>
                    <input name="email" type="email">
                </div>
                <div>
                    <label>Phone</label>
                    <input name="phone">
                </div>
            </div>

            <label>Address</label>
            <input name="address">

            <label>Notes</label>
            <textarea name="notes" rows="3"></textarea>

            <button class="btn primary">Save client →</button>

        </form>

        <div class="panel table-panel">

            <div class="panel-head">
                <div>
                    <h3>Client directory</h3>
                    <p>${db.clients.length} client records</p>
                </div>

                <input class="search" placeholder="Search clients..."
                    oninput="filterRows(this,'client-table')">
            </div>

            <div class="table-wrap">
                <table id="client-table">

                    <thead>
                        <tr><th>CLIENT</th><th>COMPANY</th><th>CONTACT</th><th></th></tr>
                    </thead>

                    <tbody>
                        ${db.clients.slice().reverse().map(c => `
                            <tr>
                                <td><b>${esc(c.name)}</b><small class="cell-sub">${esc(c.created_at)}</small></td>
                                <td>${esc(c.company || '—')}</td>
                                <td>${esc(c.email || c.phone || '—')}</td>
                                <td><button class="icon-btn" onclick="deleteClient(${c.id})">×</button></td>
                            </tr>
                        `).join('') || tableEmpty(4, 'No clients added yet.')}
                    </tbody>

                </table>
            </div>

        </div>

    </div>`;
}

/* =====================================================
   SERVICES CATALOG
===================================================== */

function services() {

    return `<div class="page-heading">

        <div>
            <span class="eyebrow">WHAT YOU OFFER</span>
            <h1>Service catalog</h1>
            <p>Manage services and their Standard, Golden and Premium prices.</p>
        </div>

        <a class="btn primary" href="#pos">Open POS →</a>

    </div>

    <div class="two-col">

        <form class="panel form-panel" id="serviceForm">

            <h3>Add a service</h3>

            <label>Service name *</label>
            <input name="name" required placeholder="e.g. Custom CRM development">

            <label>Category *</label>
            <select name="category">
                ${['Web Development','Mobile Apps','Data Analytics','Quality Assurance','Marketing','Design','SEO','Data Science','Other'].map(x => `<option>${x}</option>`).join('')}
            </select>

            <label>Description</label>
            <textarea name="description" rows="2"></textarea>

            <h3>Package pricing</h3>

            <label>Standard price (${db.settings.currency}) *</label>
            <input name="standard" type="number" min="0" step=".01" required>

            <label>Golden price (${db.settings.currency}) *</label>
            <input name="golden" type="number" min="0" step=".01" required>

            <label>Premium price (${db.settings.currency}) *</label>
            <input name="premium" type="number" min="0" step=".01" required>

            <button class="btn primary">Add to catalog →</button>

        </form>

        <div class="panel table-panel">

            <div class="panel-head">
                <div>
                    <h3>Available services</h3>
                    <p>${db.services.filter(s => s.active).length} active services</p>
                </div>
            </div>

            <div class="table-wrap">

                <table>
                    <thead>
                        <tr>
                            <th>SERVICE</th>
                            <th>STANDARD</th>
                            <th>GOLDEN</th>
                            <th>PREMIUM</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        ${db.services.map(s => `
                            <tr>
                                <td>
                                    <b>${esc(s.name)}</b>
                                    <small class="cell-sub">${esc(s.category)}</small>
                                </td>

                                <td class="money">${money(s.packages.standard.price)}</td>
                                <td class="money">${money(s.packages.golden.price)}</td>
                                <td class="money">${money(s.packages.premium.price)}</td>

                                <td>
                                    ${s.active
                                        ? `<button class="icon-btn" onclick="archiveService(${s.id})">×</button>`
                                        : '<span class="muted">Archived</span>'}
                                </td>
                            </tr>
                        `).join('') || tableEmpty(5, 'No services in catalog.')}
                    </tbody>

                </table>

            </div>

        </div>

    </div>`;
}

/* =====================================================
   POS TERMINAL WITH PACKAGES
===================================================== */


/* =====================================================
   POS TERMINAL WITH PACKAGES
   Package dropdown: Names only
   Price: Displayed separately below
===================================================== */

function pos() {

    let active = db.services.filter(s => s.active);

    return `<div class="page-heading">

        <div>
            <span class="eyebrow">CHECKOUT EXPERIENCE</span>
            <h1>POS terminal</h1>
            <p>Select a service, choose a package and generate an invoice.</p>
        </div>

        <span class="live-pill"><i></i> Ready to checkout</span>

    </div>

    <div class="pos-layout">

        <div class="panel catalog-panel">

            <div class="panel-head">
                <div>
                    <h3>Choose a service</h3>
                    <p>Select your preferred package</p>
                </div>

                <input class="search" placeholder="Search..."
                    oninput="filterCards(this)">
            </div>

            <div class="category-filter">

                ${[['all','All services'],['Web Development','Web'],['Data Analytics','Analytics'],['Mobile Apps','Mobile'],['Quality Assurance','QA']].map((x,i) => `
                    <button type="button"
                        class="filter-chip ${i === 0 ? 'active' : ''}"
                        onclick="filterCategory('${x[0]}',this)">
                        ${x[1]}
                    </button>
                `).join('')}

            </div>

            <div class="service-grid">

                ${active.map(s => {

                    const packages = s.packages || defaultPackages(s.price);

                    return `<div class="service-tile"
                        data-id="${s.id}"
                        data-name="${esc(s.name)}"
                        data-category="${esc(s.category)}">

                        <span class="service-symbol">
                            ${s.category.includes('Web') ? '⌘' :
                                s.category.includes('Mobile') ? '▣' :
                                s.category.includes('Data') ? '▥' :
                                s.category.includes('Quality') ? '✓' : '✦'}
                        </span>

                        <b>${esc(s.name)}</b>
                        <small>${esc(s.category)}</small>

                        <label>Select package</label>

                        <select class="package-select"
                            onchange="updateServicePrice(this)">

                            ${['standard','golden','premium'].map(key => `
                                <option value="${key}"
                                    data-price="${Number(packages[key]?.price ?? s.price)}">
                                    ${esc(packages[key]?.name || key)}
                                </option>
                            `).join('')}

                        </select>

                        <strong class="service-price">
                            ${money(packages.standard?.price ?? s.price)}
                        </strong>

                        <button type="button"
                            class="btn primary full add-service-btn"
                            onclick="addToCart(this)">
                            ＋ Add to order
                        </button>

                    </div>`;

                }).join('') || '<p class="empty">Add services to your catalog first.</p>'}

            </div>

        </div>

        <aside class="panel cart-panel">

            <div class="panel-head">
                <div>
                    <h3>Current order</h3>
                    <p><span id="cart-count">0</span> items in cart</p>
                </div>

                <button type="button" class="text-link"
                    onclick="clearCart()">Clear all</button>
            </div>

            <label>Client</label>

            <select id="customerType">
                <option value="walkin">Walk-in Customer</option>
                <option value="online">Online Customer</option>
                <option value="company">Company Customer</option>
                <option value="freelancer">Freelancer Customer</option>
            </select>

            <div id="cart-items" class="cart-items"></div>

            <div class="cart-math">

                <div><span>Subtotal</span><b id="subtotal">0</b></div>

                <div class="discount-row">
                    <label for="discount">Discount (${db.settings.currency})</label>
                    <input id="discount" type="number"
                        min="0" value="0" oninput="updateTotals()">
                </div>

                <div>
                    <span>Tax (${Number(db.settings.tax_rate) || 0}%)</span>
                    <b id="tax">0</b>
                </div>

                <div class="total-line">
                    <span>Total due</span>
                    <strong id="total">0</strong>
                </div>

            </div>

            <div class="checkout-fields">

                <label>Payment method</label>

                <select id="payment-method">
                    <option>Cash</option>
                    <option>Bank Transfer</option>
                    <option>Card</option>
                    <option>Online</option>
                </select>

                <label>Payment status</label>

                <select id="payment-status">
                    <option>Paid</option>
                    <option>Pending</option>
                </select>

                <label>Order notes</label>

                <input id="order-notes" placeholder="Optional notes">

            </div>

            <button class="btn primary full checkout-btn"
                onclick="checkout()">
                Complete sale →
            </button>

            <small class="secure-note">
                Invoice will be generated automatically.
            </small>

        </aside>

    </div>`;
}




/* =====================================================
   PACKAGE PRICE UPDATE
===================================================== */


/* =====================================================
   PACKAGE PRICE UPDATE
===================================================== */

function updateServicePrice(select) {

    const tile = select.closest('.service-tile');
    const option = select.selectedOptions[0];

    const price = Number(option.dataset.price || 0);

    // Update price separately below package dropdown
    tile.querySelector('.service-price').textContent = money(price);

}



/* =====================================================
   SALES
===================================================== */

function sales() {

    return `<div class="page-heading">

        <div>
            <span class="eyebrow">TRANSACTION HISTORY</span>
            <h1>Sales & invoices</h1>
            <p>Review payments and access customer invoices.</p>
        </div>

        <div class="heading-actions">
            <button class="btn secondary" onclick="exportCSV()">↓ Export CSV</button>
            <a class="btn primary" href="#pos">＋ New sale</a>
        </div>

    </div>

    <div class="panel table-panel">

        <div class="panel-head">
            <div>
                <h3>All transactions</h3>
                <p>${db.sales.length} recorded sales</p>
            </div>

            <input class="search" placeholder="Search..."
                oninput="filterRows(this,'sales-table')">
        </div>

        <div class="table-wrap">

            <table id="sales-table">

                <thead>
                    <tr>
                        <th>INVOICE</th>
                        <th>CLIENT</th>
                        <th>DATE</th>
                        <th>METHOD</th>
                        <th>STATUS</th>
                        <th class="right">TOTAL</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    ${db.sales.slice().reverse().map(s => `
                        <tr>
                            <td><a class="invoice-link" href="#invoice-${s.id}">${esc(s.invoice_no)}</a></td>
                            <td>${esc(s.client_name || s.customer_type_label || 'Customer')}</td>
                            <td>${esc(s.created_at)}</td>
                            <td>${esc(s.payment_method)}</td>
                            <td>${status(s.status)}</td>
                            <td class="right money">${money(s.total)}</td>
                            <td><a class="text-link" href="#invoice-${s.id}">View →</a></td>
                        </tr>
                    `).join('') || tableEmpty(7, 'No sales recorded yet.')}
                </tbody>

            </table>

        </div>

    </div>`;
}

/* =====================================================
   PROJECTS
===================================================== */

function projects() {

    return `<div class="page-heading">

        <div>
            <span class="eyebrow">DELIVERY PIPELINE</span>
            <h1>Projects</h1>
            <p>Track client work from kickoff to completion.</p>
        </div>

    </div>

    <div class="two-col">

        <form class="panel form-panel" id="projectForm">

            <h3>Create project</h3>

            <label>Project title *</label>
            <input name="title" required>

            <label>Client</label>
            <select name="client_id">
                <option value="">Select client</option>
                ${db.clients.map(c => `<option value="${c.id}">${esc(c.name)}</option>`).join('')}
            </select>

            <label>Service</label>
            <input name="service">

            <label>Status</label>
            <select name="status">
                ${['Planning','In Progress','On Hold','Completed','Cancelled'].map(s => `<option>${s}</option>`).join('')}
            </select>

            <div class="form-row">
                <div><label>Start date</label><input name="start_date" type="date"></div>
                <div><label>Due date</label><input name="due_date" type="date"></div>
            </div>

            <label>Budget (${db.settings.currency})</label>
            <input name="budget" type="number" min="0" value="0">

            <label>Notes</label>
            <textarea name="notes" rows="2"></textarea>

            <button class="btn primary">Create project →</button>

        </form>

        <div class="panel table-panel">

            <div class="panel-head">
                <div>
                    <h3>Project pipeline</h3>
                    <p>${db.projects.length} projects</p>
                </div>
            </div>

            <div class="project-list">

                ${db.projects.slice().reverse().map(p => `
                    <div class="project-row">

                        <div class="project-avatar">${esc(p.title[0].toUpperCase())}</div>

                        <div class="project-info">
                            <b>${esc(p.title)}</b>
                            <small>${esc(p.client_name || 'No client')} · ${esc(p.service || 'General')}</small>
                            <small>Due: ${esc(p.due_date || 'Not set')} · ${money(p.budget || 0)}</small>
                        </div>

                        <select class="status-select"
                            onchange="changeProjectStatus(${p.id},this.value)">
                            ${['Planning','In Progress','On Hold','Completed','Cancelled'].map(x => `<option ${p.status === x ? 'selected' : ''}>${x}</option>`).join('')}
                        </select>

                    </div>
                `).join('') || '<p class="empty">No projects yet.</p>'}

            </div>

        </div>

    </div>`;
}

/* =====================================================
   EXPENSES
===================================================== */

function expenses() {

    return `<div class="page-heading">
        <div>
            <span class="eyebrow">COST CONTROL</span>
            <h1>Expenses</h1>
            <p>Record operating costs and keep spending visible.</p>
        </div>
    </div>

    <div class="two-col">

        <form class="panel form-panel" id="expenseForm">

            <h3>Record expense</h3>

            <label>Expense title *</label>
            <input name="title" required>

            <label>Category</label>
            <select name="category">
                ${['Software & tools','Marketing','Payroll','Office','Travel','Other'].map(x => `<option>${x}</option>`).join('')}
            </select>

            <label>Amount (${db.settings.currency}) *</label>
            <input name="amount" type="number" min="0" step=".01" required>

            <label>Date *</label>
            <input name="expense_date" type="date" value="${today()}" required>

            <label>Notes</label>
            <textarea name="notes" rows="3"></textarea>

            <button class="btn primary">Save expense →</button>

        </form>

        <div class="panel table-panel">

            <div class="panel-head">
                <div>
                    <h3>Expense ledger</h3>
                    <p>${db.expenses.length} records</p>
                </div>
            </div>

            <div class="table-wrap">

                <table>
                    <thead>
                        <tr><th>EXPENSE</th><th>DATE</th><th class="right">AMOUNT</th></tr>
                    </thead>

                    <tbody>
                        ${db.expenses.slice().reverse().map(e => `
                            <tr>
                                <td><b>${esc(e.title)}</b><small class="cell-sub">${esc(e.category)}</small></td>
                                <td>${esc(e.expense_date)}</td>
                                <td class="right money">${money(e.amount)}</td>
                            </tr>
                        `).join('') || tableEmpty(3, 'No expenses recorded.')}
                    </tbody>

                </table>

            </div>

        </div>

    </div>`;
}

/* =====================================================
   REPORTS
===================================================== */

function reports() {

    let revenue = db.sales.reduce((a, s) => a + Number(s.total || 0), 0);

    let discount = db.sales.reduce((a, s) => a + Number(s.discount || 0), 0);

    let tax = db.sales.reduce((a, s) => a + Number(s.tax || 0), 0);

    let map = {};

    db.sales.forEach(s => s.items.forEach(i => {

        let key = `${i.name} (${i.packageName || 'Standard'})`;

        map[key] ??= { qty: 0, revenue: 0 };

        map[key].qty += Number(i.qty || 0);

        map[key].revenue += Number(i.line_total || 0);

    }));

    return `<div class="page-heading">

        <div>
            <span class="eyebrow">BUSINESS INTELLIGENCE</span>
            <h1>Reports & insights</h1>
            <p>A clear view of your sales performance and package mix.</p>
        </div>

        <button class="btn secondary" onclick="exportCSV()">↓ Export sales CSV</button>

    </div>

    <div class="stats-grid">
        ${stat('Total transactions', db.sales.length, 'Recorded sales')}
        ${stat('Gross revenue', money(revenue), 'All transaction statuses', true)}
        ${stat('Discounts', money(discount), 'Applied discounts')}
        ${stat('Tax collected', money(tax), 'Recorded tax amount')}
    </div>

    <div class="panel table-panel">

        <div class="panel-head">
            <div>
                <h3>Service & package performance</h3>
                <p>Revenue contribution by service and package</p>
            </div>
        </div>

        <div class="table-wrap">

            <table>
                <thead>
                    <tr>
                        <th>SERVICE & PACKAGE</th>
                        <th>QUANTITY SOLD</th>
                        <th class="right">REVENUE</th>
                    </tr>
                </thead>

                <tbody>
                    ${Object.entries(map).sort((a,b) => b[1].revenue - a[1].revenue).map(([name,v]) => `
                        <tr>
                            <td><b>${esc(name)}</b></td>
                            <td>${v.qty}</td>
                            <td class="right money">${money(v.revenue)}</td>
                        </tr>
                    `).join('') || tableEmpty(3, 'Sales data will appear here.')}
                </tbody>

            </table>

        </div>

    </div>`;
}

/* =====================================================
   STAFF
===================================================== */

function staff() {

    return `<div class="page-heading">
        <div>
            <span class="eyebrow">PEOPLE & PERMISSIONS</span>
            <h1>Team & staff</h1>
            <p>Create staff logins and manage workspace access.</p>
        </div>
    </div>

    <div class="two-col">

        <form class="panel form-panel" id="staffForm">

            <h3>Add team member</h3>

            <label>Full name *</label>
            <input name="name" required>

            <label>Email *</label>
            <input name="email" type="email" required>

            <label>Temporary password *</label>
            <input name="password" type="password" minlength="8" required>

            <label>Role</label>
            <select name="role">
                <option>Staff</option>
                <option>Manager</option>
            </select>

            <button class="btn primary">Create account →</button>

        </form>

        <div class="panel table-panel">

            <div class="panel-head">
                <div>
                    <h3>Workspace users</h3>
                    <p>${db.users.length} accounts</p>
                </div>
            </div>

            <div class="table-wrap">

                <table>
                    <thead>
                        <tr><th>MEMBER</th><th>ROLE</th><th>STATUS</th></tr>
                    </thead>

                    <tbody>
                        ${db.users.map(u => `
                            <tr>
                                <td><b>${esc(u.name)}</b><small class="cell-sub">${esc(u.email)}</small></td>
                                <td>${esc(u.role)}</td>
                                <td>
                                    ${u.role === 'Admin'
                                        ? '<span class="status paid">Admin</span>'
                                        : `<button class="status ${u.active ? 'paid' : 'pending'}" onclick="toggleStaff(${u.id})">${u.active ? 'Active' : 'Disabled'}</button>`}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>

                </table>

            </div>

        </div>

    </div>`;
}

/* =====================================================
   SETTINGS
===================================================== */

function settings() {

    let s = db.settings;

    return `<div class="page-heading">

        <div>
            <span class="eyebrow">WORKSPACE CONFIGURATION</span>
            <h1>Company settings</h1>
            <p>Customize business details shown on invoices.</p>
        </div>

    </div>

    <form class="panel form-panel settings-form" id="settingsForm">

        <h3>Business identity</h3>

        <div class="form-row">
            <div>
                <label>Company name</label>
                <input name="company_name" value="${esc(s.company_name)}">
            </div>

            <div>
                <label>Business email</label>
                <input name="email" type="email" value="${esc(s.email)}">
            </div>
        </div>

        <div class="form-row">

            <div>
                <label>Phone</label>
                <input name="phone" value="${esc(s.phone)}">
            </div>

            <div>
                <label>Currency code</label>
                <select name="currency">
                    ${['PKR','USD','GBP','AED','EUR'].map(c => `<option ${s.currency === c ? 'selected' : ''}>${c}</option>`).join('')}
                </select>
            </div>

        </div>

        <label>Business address</label>
        <textarea name="address" rows="2">${esc(s.address)}</textarea>

        <div class="form-row">

            <div>
                <label>Tax rate (%)</label>
                <input name="tax_rate" type="number"
                    min="0" max="100" step=".01" value="${s.tax_rate}">
            </div>

            <div>
                <label>Logo URL</label>
                <input name="logo_url" value="${esc(s.logo_url || '')}">
            </div>

        </div>

        <button class="btn primary">Save settings →</button>

    </form>`;
}

/* =====================================================
   INVOICE
===================================================== */

function invoice(id) {

    let s = db.sales.find(x => x.id === id);

    if (!s) {
        go('sales');
        return '';
    }

    currentInvoice = s;

    let c = db.clients.find(x => String(x.id) === String(s.client_id)) || {};
    const billedToName = s.client_name || c.name || s.customer_type_label || 'Customer';
    const billedToCompany = s.client_company || c.company || '';
    const billedToEmail = s.client_email || c.email || '';
    const billedToPhone = s.client_phone || c.phone || '';
    const billedToAddress = s.client_address || c.address || '';
    const customerTypeLabel = s.customer_type_label || ({
        walkin: 'Walk-in Customer',
        company: 'Company Customer',
        freelancer: 'Freelancer Customer',
        online: 'Online Customer'
    }[s.customer_type] || '');

    return `<div class="page-heading no-print">

        <div>
            <span class="eyebrow">PAYMENT DOCUMENT</span>
            <h1>Invoice</h1>
            <p>Review or print this transaction.</p>
        </div>

        <div class="heading-actions">
            <a class="btn secondary" href="#sales">← Back to sales</a>
            <button class="btn primary" onclick="window.print()">Print / Save PDF ↗</button>
        </div>

    </div>

    <div class="invoice-sheet">

        <div class="invoice-head">

            <div class="brand">
                <img class="invoice-full-logo"
                    src="${esc(db.settings.logo_url || 'static/img/quebenix-logo.jpg')}">
            </div>

            <div class="invoice-title">
                <span>INVOICE</span>
                <h2>${esc(s.invoice_no)}</h2>
                <small>${esc(s.created_at)}</small>
            </div>

        </div>

        <div class="invoice-parties">

            <div>
                <small>BILLED TO</small>
                <h3>${esc(billedToName)}</h3>
                ${customerTypeLabel ? `<span class="customer-type">${esc(customerTypeLabel)}</span>` : ''}
                <p>${esc(billedToCompany)}<br>
                ${esc(billedToEmail)}<br>
                ${esc(billedToPhone)}<br>
                ${esc(billedToAddress)}</p>
            </div>

            <div>
                <small>FROM</small>
                <h3>${esc(db.settings.company_name)}</h3>
                <p>${esc(db.settings.email)}<br>
                ${esc(db.settings.phone)}<br>
                ${esc(db.settings.address)}</p>
            </div>

        </div>

        <table>

            <thead>
                <tr>
                    <th>DESCRIPTION</th>
                    <th>PACKAGE</th>
                    <th>QTY</th>
                    <th>UNIT PRICE</th>
                    <th class="right">AMOUNT</th>
                </tr>
            </thead>

            <tbody>
                ${s.items.map(i => `
                    <tr>
                        <td><b>${esc(i.name)}</b></td>
                        <td><span class="pill">${esc(i.packageName || 'Standard')}</span></td>
                        <td>${i.qty}</td>
                        <td>${money(i.price)}</td>
                        <td class="right">${money(i.line_total)}</td>
                    </tr>
                `).join('')}
            </tbody>

        </table>

        <div class="invoice-bottom">

            <div>
                ${status(s.status)}
                <p class="muted">Payment method: ${esc(s.payment_method)}</p>
                ${s.notes ? `<p class="muted">Note: ${esc(s.notes)}</p>` : ''}
            </div>

            <div class="invoice-totals">

                <div><span>Subtotal</span><b>${money(s.subtotal)}</b></div>
                <div><span>Discount</span><b>− ${money(s.discount)}</b></div>
                <div><span>Tax</span><b>${money(s.tax)}</b></div>

                <div class="grand">
                    <span>Total</span>
                    <strong>${money(s.total)}</strong>
                </div>

            </div>

        </div>

        <div class="invoice-thanks">
            Thank you for choosing Quebenix Technology.
            <small>INNOVATE · DEVELOP · GROW</small>
        </div>

    </div>`;
}

/* =====================================================
   RENDER
===================================================== */

function render() {

    closeSidebar();

    if (!user) {

        $('#app').innerHTML = loginView();

        $('#loginForm').addEventListener('submit', e => {

            e.preventDefault();

            let f = new FormData(e.target);

            let u = db.users.find(x =>
                x.email.toLowerCase() === String(f.get('email')).toLowerCase() &&
                x.password === f.get('password') &&
                x.active
            );

            if (!u) {
                $('#loginError').innerHTML =
                    '<div class="flash error">Invalid email or password.</div>';
                return;
            }

            user = u;
            go('dashboard');

        });

        return;
    }

    if (location.hash === '#logout') {

        user = null;
        cart = [];

        history.replaceState({}, '', '#');

        render();
        return;
    }

    if (location.hash.startsWith('#invoice-')) {

        page = 'invoice';

        let id = Number(location.hash.split('-')[1]);

        $('#app').innerHTML = shell(invoice(id), 'Invoice detail');

        return;
    }

    let map = {

        dashboard: ['Overview', dashboard],
        clients: ['Clients', clients],
        services: ['Service catalog', services],
        pos: ['POS terminal', pos],
        sales: ['Sales & invoices', sales],
        projects: ['Projects', projects],
        expenses: ['Expenses', expenses],
        reports: ['Reports & insights', reports],
        staff: ['Team & staff', staff],
        settings: ['Company settings', settings]

    };

    if (!map[page]) page = 'dashboard';

    if (['staff','settings'].includes(page) && user.role !== 'Admin') {
        page = 'dashboard';
    }

    $('#app').innerHTML = shell(map[page][1](), map[page][0]);

    wireForms();

    if (page === 'pos') renderCart();

    if (page === 'dashboard') drawRevenue();
}

/* =====================================================
   FORM HANDLERS
===================================================== */

function wireForms() {

    const data = id => Object.fromEntries(new FormData($(id)).entries());

    $('#clientForm')?.addEventListener('submit', e => {

        e.preventDefault();

        let d = data('#clientForm');

        db.clients.push({
            id: uid(),
            ...d,
            created_at: new Date().toLocaleString()
        });

        save();
        render();

    });

    /* ADD SERVICE WITH 3 PACKAGES */

    $('#serviceForm')?.addEventListener('submit', e => {

        e.preventDefault();

        let d = data('#serviceForm');

        let standard = Number(d.standard);
        let golden = Number(d.golden);
        let premium = Number(d.premium);

        if ([standard, golden, premium].some(x => !Number.isFinite(x) || x < 0)) {
            alert('Please enter valid package prices.');
            return;
        }

        db.services.push({

            id: uid(),

            name: d.name,
            category: d.category,
            description: d.description,

            price: standard,

            active: 1,

            packages: {

                standard: {
                    name: 'Standard',
                    price: standard
                },

                golden: {
                    name: 'Golden',
                    price: golden
                },

                premium: {
                    name: 'Premium',
                    price: premium
                }

            }

        });

        save();
        render();

    });

    $('#projectForm')?.addEventListener('submit', e => {

        e.preventDefault();

        let d = data('#projectForm');

        let c = db.clients.find(x => String(x.id) === d.client_id);

        db.projects.push({
            id: uid(),
            ...d,
            budget: Number(d.budget || 0),
            client_name: c?.name || ''
        });

        save();
        render();

    });

    $('#expenseForm')?.addEventListener('submit', e => {

        e.preventDefault();

        let d = data('#expenseForm');

        db.expenses.push({
            id: uid(),
            ...d,
            amount: Number(d.amount)
        });

        save();
        render();

    });

    $('#staffForm')?.addEventListener('submit', e => {

        e.preventDefault();

        let d = data('#staffForm');

        if (db.users.some(x =>
            x.email.toLowerCase() === d.email.toLowerCase()
        )) {
            alert('Email already exists');
            return;
        }

        db.users.push({
            id: uid(),
            ...d,
            active: 1
        });

        save();
        render();

    });

    $('#settingsForm')?.addEventListener('submit', e => {

        e.preventDefault();

        let d = data('#settingsForm');

        d.tax_rate = Number(d.tax_rate || 0);

        db.settings = d;

        save();

        alert('Settings saved successfully.');

        render();

    });

}

/* =====================================================
   FILTERS
===================================================== */

function filterRows(input, id) {

    let q = input.value.toLowerCase();

    document.querySelectorAll('#' + id + ' tbody tr').forEach(r => {

        r.style.display =
            r.innerText.toLowerCase().includes(q) ? '' : 'none';

    });

}

function filterCards(input) {

    let q = input.value.toLowerCase();

    document.querySelectorAll('.service-tile').forEach(c => {

        c.style.display =
            c.innerText.toLowerCase().includes(q) ? '' : 'none';

    });

}

function filterCategory(cat, btn) {

    document.querySelectorAll('.filter-chip').forEach(x => {
        x.classList.remove('active');
    });

    btn.classList.add('active');

    document.querySelectorAll('.service-tile').forEach(c => {

        c.style.display =
            cat === 'all' || c.dataset.category === cat ? '' : 'none';

    });

}

/* =====================================================
   CART
===================================================== */

function addToCart(btn) {

    const tile = btn.closest('.service-tile');

    const select = tile.querySelector('.package-select');

    const option = select.selectedOptions[0];

    const id = Number(tile.dataset.id);

    const packageType = select.value;

    const service = db.services.find(s => s.id === id);

    if (!service || !service.active) {
        alert('This service is no longer available.');
        return;
    }

    const price = Number(option.dataset.price);

    if (!Number.isFinite(price) || price < 0) {
        alert('Invalid package price.');
        return;
    }

    let item = cart.find(x =>
        x.id === id && x.packageType === packageType
    );

    if (item) {

        item.qty++;

    } else {

        cart.push({

            id,

            name: service.name,

            packageType,

            packageName: service.packages[packageType].name,

            price,

            qty: 1

        });

    }

    renderCart();

}

function changeQty(id, d, packageType) {

    let item = cart.find(x =>
        x.id === id && x.packageType === packageType
    );

    if (!item) return;

    item.qty += d;

    if (item.qty < 1) {

        cart = cart.filter(x =>
            !(x.id === id && x.packageType === packageType)
        );

    }

    renderCart();

}

function removeItem(id, packageType) {

    cart = cart.filter(x =>
        !(x.id === id && x.packageType === packageType)
    );

    renderCart();

}

function clearCart() {

    if (!cart.length) return;

    if (!confirm('Clear the entire order?')) return;

    cart = [];

    renderCart();

}

/* =====================================================
   CART DISPLAY
===================================================== */

function renderCart() {

    let box = $('#cart-items');

    if (!box) return;

    $('#cart-count').textContent =
        cart.reduce((a, x) => a + x.qty, 0);

    box.innerHTML = cart.length

        ? cart.map(x => `

            <div class="cart-item">

                <div class="cart-item-main">

                    <b>${esc(x.name)}</b>

                    <small>${esc(x.packageName)} Package</small>

                    <small>${money(x.price)} each</small>

                </div>

                <div class="qty-control">

                    <button type="button"
                        onclick="changeQty(${x.id},-1,'${x.packageType}')">−</button>

                    <b>${x.qty}</b>

                    <button type="button"
                        onclick="changeQty(${x.id},1,'${x.packageType}')">＋</button>

                </div>

                <strong>${money(x.price * x.qty)}</strong>

                <button type="button" class="remove-item"
                    onclick="removeItem(${x.id},'${x.packageType}')">×</button>

            </div>

        `).join('')

        : `<div class="cart-empty">
            <span>＋</span>
            <b>Your order is empty</b>
            <small>Select a service to get started</small>
        </div>`;

    updateTotals();

}

/* =====================================================
   TOTALS
===================================================== */

function updateTotals() {

    let sub = cart.reduce(
        (a, x) => a + x.price * x.qty, 0
    );

    let discount = Math.min(
        sub,
        Math.max(0, Number($('#discount')?.value || 0))
    );

    let tax = (sub - discount) *
        Number(db.settings.tax_rate || 0) / 100;

    let total = sub - discount + tax;

    let set = (id, n) => {

        if ($(id)) {
            $(id).textContent = money(n);
        }

    };

    set('#subtotal', sub);
    set('#tax', tax);
    set('#total', total);

}

/* =====================================================
   CHECKOUT
===================================================== */

function checkout() {

    if (!cart.length) {

        alert('Please add at least one service.');

        return;

    }

    if (!confirm('Complete this sale and generate invoice?')) return;

    let subtotal = cart.reduce(
        (a, x) => a + x.price * x.qty, 0
    );

    let discount = Math.min(
        subtotal,
        Math.max(0, Number($('#discount')?.value || 0))
    );

    let tax = (subtotal - discount) *
        Number(db.settings.tax_rate || 0) / 100;

    const customerType = $('#customerType')?.value || 'walkin';
    const customerTypeLabels = {
        walkin: 'Walk-in Customer',
        company: 'Company Customer',
        freelancer: 'Freelancer Customer',
        online: 'Online Customer'
    };

    const clientId = Number($('#cart-client')?.value) || null;
    const c = db.clients.find(x => String(x.id) === String(clientId));
    const clientName = c?.name || customerTypeLabels[customerType] || 'Customer';

    let sale = {

        id: uid(),

        invoice_no: 'QBX-' +
            new Date().toISOString().slice(2, 10).replaceAll('-', '') +
            '-' +
            Math.random().toString(16).slice(2, 8).toUpperCase(),

        client_id: clientId,
        client_name: clientName,
        customer_type: customerType,
        customer_type_label: customerTypeLabels[customerType] || 'Customer',
        client_company: c?.company || '',
        client_email: c?.email || '',
        client_phone: c?.phone || '',
        client_address: c?.address || '',

        subtotal,

        discount,

        tax,

        total: subtotal - discount + tax,

        payment_method: $('#payment-method').value,

        status: $('#payment-status').value,

        notes: $('#order-notes').value,

        created_at: new Date().toLocaleString(),

        items: cart.map(x => ({
            ...x,
            line_total: x.price * x.qty
        }))

    };

    db.sales.push(sale);

    save();

    cart = [];

    location.hash = '#invoice-' + sale.id;

    render();

}

/* =====================================================
   RECORD MANAGEMENT
===================================================== */

function deleteClient(id) {

    if (!confirm('Delete this client?')) return;

    db.clients = db.clients.filter(x => x.id !== id);

    save();
    render();

}

function archiveService(id) {

    if (!confirm('Archive this service?')) return;

    let s = db.services.find(x => x.id === id);

    if (s) s.active = 0;

    save();
    render();

}

function changeProjectStatus(id, v) {

    let p = db.projects.find(x => x.id === id);

    if (p) p.status = v;

    save();
    render();

}

function toggleStaff(id) {

    let u = db.users.find(x => x.id === id);

    if (u && u.role !== 'Admin') {
        u.active = u.active ? 0 : 1;
    }

    save();
    render();

}

/* =====================================================
   CSV EXPORT WITH PACKAGE DETAILS
===================================================== */

function exportCSV() {

    let rows = [

        [
            'Invoice',
            'Date',
            'Client',
            'Service',
            'Package',
            'Quantity',
            'Unit Price',
            'Line Total',
            'Subtotal',
            'Discount',
            'Tax',
            'Total',
            'Payment',
            'Status'
        ],

        ...db.sales.slice().reverse().flatMap(s =>

            s.items.map(i => [

                s.invoice_no,
                s.created_at,
                s.client_name,
                i.name,
                i.packageName || 'Standard',
                i.qty,
                i.price,
                i.line_total,
                s.subtotal,
                s.discount,
                s.tax,
                s.total,
                s.payment_method,
                s.status

            ])

        )

    ];

    let csv = rows.map(r =>

        r.map(v =>
            '"' + String(v ?? '').replaceAll('"', '""') + '"'
        ).join(',')

    ).join('\r\n');

    let blob = new Blob(
        ['\uFEFF' + csv],
        { type: 'text/csv;charset=utf-8;' }
    );

    let url = URL.createObjectURL(blob);

    let a = document.createElement('a');

    a.href = url;

    a.download = 'quebenix-sales.csv';

    a.click();

    setTimeout(() => URL.revokeObjectURL(url), 1000);

}

/* =====================================================
   REVENUE CHART
===================================================== */

/* =====================================================
   DAILY REVENUE LINE CHART
===================================================== */

function drawRevenue() {

    const el = $('#revenueChart');

    if (!el || !window.Chart) return;

    // Last 30 days
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailyRevenue = {};

    // Create all 30 dates with zero revenue
    for (let i = 29; i >= 0; i--) {

        const date = new Date(today);
        date.setDate(today.getDate() - i);

        const key =
            date.getFullYear() + '-' +
            String(date.getMonth() + 1).padStart(2, '0') + '-' +
            String(date.getDate()).padStart(2, '0');

        dailyRevenue[key] = 0;
    }

    // Add each sale to its actual date
    db.sales.forEach(s => {

        if (!s.created_at) return;

        const saleDate = new Date(s.created_at);

        if (Number.isNaN(saleDate.getTime())) return;

        saleDate.setHours(0, 0, 0, 0);

        const key =
            saleDate.getFullYear() + '-' +
            String(saleDate.getMonth() + 1).padStart(2, '0') + '-' +
            String(saleDate.getDate()).padStart(2, '0');

        // Include only dates within the displayed 30-day period
        if (Object.prototype.hasOwnProperty.call(dailyRevenue, key)) {

            dailyRevenue[key] += Number(s.total || 0);

        }

    });

    // Prepare chart labels and values
    const dates = Object.keys(dailyRevenue);

    const labels = dates.map(key => {

        const [year, month, day] = key.split('-');

        return `${day}/${month}`;

    });

    const values = dates.map(key => dailyRevenue[key]);

    // Remove previous chart before drawing again
    if (el._chart) {
        el._chart.destroy();
    }

    el._chart = new Chart(el, {

        type: 'line',

        data: {

            labels: labels,

            datasets: [{

                label: 'Daily Sales',

                data: values,

                borderColor: '#079cff',

                backgroundColor: 'rgba(7,156,255,0.12)',

                fill: true,

                tension: 0.35,

                borderWidth: 3,

                pointRadius: 4,

                pointHoverRadius: 7,

                pointBackgroundColor: '#20c7ff',

                pointBorderColor: '#ffffff',

                pointBorderWidth: 2

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: true,

            interaction: {

                intersect: false,

                mode: 'index'

            },

            plugins: {

                legend: {
                    display: false
                },

                tooltip: {

                    callbacks: {

                        label: function(context) {

                            return 'Sales: ' + money(context.parsed.y);

                        }

                    }

                }

            },

            scales: {

                x: {

                    grid: {
                        display: false
                    },

                    ticks: {
                        color: '#8293a7',
                        maxTicksLimit: 10
                    }

                },

                y: {

                    beginAtZero: true,

                    grid: {
                        color: 'rgba(120,150,180,.12)'
                    },

                    ticks: {

                        color: '#8293a7',

                        callback: function(value) {

                            if (value >= 1000000) {
                                return 'PKR ' + (value / 1000000).toFixed(1) + 'M';
                            }

                            if (value >= 1000) {
                                return 'PKR ' + (value / 1000).toFixed(0) + 'K';
                            }

                            return 'PKR ' + value;

                        }

                    }

                }

            }

        }

    });

}
/* =====================================================
   HASH NAVIGATION
===================================================== */

window.addEventListener('hashchange', () => {

    closeSidebar();

    if (location.hash === '#logout') {

        user = null;
        cart = [];

        render();

        return;

    }

    if (location.hash.startsWith('#invoice-')) {

        render();

        return;

    }

    let p = location.hash.slice(1);

    page = p || 'dashboard';

    render();

});

/* =====================================================
   INITIALIZATION
===================================================== */

if (location.hash.startsWith('#invoice-')) {

    page = 'sales';

} else {

    page = location.hash.slice(1) || 'dashboard';

}

render();
