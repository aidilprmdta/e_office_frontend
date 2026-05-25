# 📋 File Structure Reference

Dokumentasi lengkap struktur file dan folder project.

---

## Struktur Lengkap

```
e-office-frontend/
│
├── 📄 package.json                 # Dependencies dan scripts
├── 📄 package-lock.json            # Locked versions
├── 📄 vite.config.js               # Vite configuration
├── 📄 eslint.config.js             # ESLint configuration
├── 📄 index.html                   # HTML entry point
├── 📄 .env.example                 # Environment variables template
├── 📄 README.md                    # Project documentation
├── 📄 ARCHITECTURE.md              # Architecture documentation
│
├── 📁 public/                      # Static assets
│   └── (favicon, manifest, etc.)
│
└── 📁 src/                         # Main source code
    ├── 📄 main.jsx                 # React entry point
    ├── 📄 App.jsx                  # Main app component + routing
    ├── 📄 index.css                # Global styles
    ├── 📄 App.css                  # App-specific styles (optional)
    │
    ├── 📁 assets/                  # Media & static files
    │   ├── 📁 images/              # Gambar
    │   ├── 📁 logos/               # Logo kampus
    │   └── 📁 icons/               # Custom icons
    │
    ├── 📁 components/              # Reusable components
    │   ├── 📄 Sidebar.jsx          # Side navigation
    │   ├── 📄 Navbar.jsx           # Top navigation bar
    │   ├── 📄 Card.jsx             # Card component
    │   ├── 📄 Button.jsx           # Button component
    │   ├── 📄 Table.jsx            # Data table component
    │   └── 📄 index.js             # Export all components
    │
    ├── 📁 layouts/                 # Page layout templates
    │   ├── 📄 MainLayout.jsx       # Main layout (Sidebar + Navbar)
    │   └── 📄 index.js             # Export all layouts
    │
    ├── 📁 pages/                   # Page components (full pages)
    │   ├── 📄 Login.jsx            # Login page
    │   ├── 📄 Dashboard.jsx        # Main dashboard
    │   ├── 📄 SuratMasuk.jsx       # Incoming letters page
    │   ├── 📄 SuratKeluar.jsx      # Outgoing letters page
    │   ├── 📄 TugasAkhir.jsx       # Final projects page
    │   ├── 📄 Persetujuan.jsx      # Approvals page
    │   ├── 📄 ManajemenUser.jsx    # User management page
    │   ├── 📄 NotFound.jsx         # 404 page
    │   └── 📄 index.js             # Export all pages
    │
    ├── 📁 services/                # API services
    │   ├── 📄 api.js               # Axios configuration
    │   └── 📄 index.js             # All services (auth, surat, dll)
    │
    └── 📁 utils/                   # Utility functions
        └── 📄 index.js             # Helper functions
```

---

## File Descriptions

### Root Level

| File | Purpose |
|------|---------|
| `package.json` | Dependencies, scripts, project metadata |
| `vite.config.js` | Vite bundler configuration |
| `eslint.config.js` | Code quality rules |
| `index.html` | HTML template untuk React |
| `.env.example` | Environment variables template |
| `README.md` | Project overview dan setup |
| `ARCHITECTURE.md` | Architecture dan design patterns |

---

### src/assets/

Menyimpan file statis:
- Logo kampus
- Gambar ilustrasi
- Font custom
- SVG icons

```
assets/
├── images/
│   ├── logo.png
│   ├── login-bg.png
│   └── illustration.svg
└── icons/
    ├── document.svg
    └── letter.svg
```

---

### src/components/

**Reusable UI components** yang independen dan dapat digunakan di banyak halaman.

| Component | Purpose |
|-----------|---------|
| `Sidebar.jsx` | Navigation menu di sidebar |
| `Navbar.jsx` | Top bar dengan user info & notifications |
| `Card.jsx` | Card untuk menampilkan statistik |
| `Button.jsx` | Button dengan berbagai variant |
| `Table.jsx` | Data table dengan kolom dinamis |

**Karakteristik:**
- Tidak bergantung pada routing
- Tidak melakukan API calls langsung
- Menerima data via props
- Reusable di berbagai halaman

---

### src/layouts/

**Template layout** untuk struktur halaman.

| Layout | Purpose |
|--------|---------|
| `MainLayout.jsx` | Layout utama (Sidebar + Navbar + Content) |

**Penggunaan:**
```javascript
<MainLayout>
  <DashboardContent />
</MainLayout>
```

---

### src/pages/

**Full page components** yang merepresentasikan setiap route.

| Page | Route | Purpose |
|------|-------|---------|
| `Login.jsx` | `/login` | Login page |
| `Dashboard.jsx` | `/dashboard` | Main dashboard |
| `SuratMasuk.jsx` | `/surat-masuk` | Incoming letters |
| `SuratKeluar.jsx` | `/surat-keluar` | Outgoing letters |
| `TugasAkhir.jsx` | `/tugas-akhir` | Final projects |
| `Persetujuan.jsx` | `/persetujuan` | Approvals |
| `ManajemenUser.jsx` | `/users` | User management |
| `NotFound.jsx` | `/*` | 404 error page |

**Karakteristik:**
- Satu page per file
- Menggunakan MainLayout sebagai wrapper
- Mengelola state halaman
- Melakukan API calls melalui services

---

### src/services/

**API communication layer** - tempat semua axios calls.

#### api.js
```javascript
// Axios instance dengan interceptor
- Base URL configuration
- Default headers
- Token injection
- Error handling
```

#### index.js
```javascript
authService = {
  login(),
  register(),
  getProfile(),
  logout()
}

suratService = {
  getMasuk(),
  getKeluar(),
  getSuratDetail(),
  createSurat(),
  updateSurat(),
  deleteSurat(),
  approveSurat(),
  rejectSurat()
}

tugasAkhirService = {
  getList(),
  getDetail(),
  create(),
  update(),
  delete(),
  submitProposal(),
  approveProposal()
}

userService = {
  getUsers(),
  getUserDetail(),
  createUser(),
  updateUser(),
  deleteUser(),
  changeRole()
}
```

---

### src/utils/

**Helper functions** yang reusable di berbagai file.

#### index.js
```javascript
formatDate()           // Format ke format Indonesia
formatDateTime()       // Format dengan waktu
isAuthenticated()      // Cek user sudah login
getUserRole()          // Get user role dari token
hasRole()              // Cek apakah user punya role tertentu
truncateText()         // Potong teks panjang
formatFileSize()       // Format ukuran file
validateEmail()        // Validasi email format
validateNomorSurat()   // Validasi nomor surat
```

---

## Import Examples

### Import Components
```javascript
// Option 1: Individual import
import Button from '../components/Button';

// Option 2: Dari index.js (lebih clean)
import { Button, Card, Table } from '../components';
```

### Import Pages
```javascript
import { Dashboard, Login, SuratMasuk } from '../pages';
```

### Import Services
```javascript
import { suratService, authService } from '../services';
```

### Import Utils
```javascript
import { formatDate, isAuthenticated } from '../utils';
```

---

## Naming Conventions

### Files
- **Components**: PascalCase (e.g., `Sidebar.jsx`)
- **Pages**: PascalCase (e.g., `Dashboard.jsx`)
- **Services/Utils**: camelCase (e.g., `suratService`)

### Functions
- **Component**: PascalCase (e.g., `export default function Dashboard()`)
- **Helper**: camelCase (e.g., `function formatDate()`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `const API_BASE_URL`)

### Variables
- **State**: camelCase (e.g., `const [letters, setLetters]`)
- **Props**: camelCase (e.g., `<Card title="..." />`)

---

## How Files Connect

```
User Visit /dashboard
    ↓
App.jsx routing matches /dashboard
    ↓
ProtectedRoute checks isAuthenticated() [from utils]
    ↓
Dashboard.jsx renders
    ↓
Dashboard wraps content with MainLayout
    ↓
MainLayout renders Sidebar, Navbar, content
    ↓
Sidebar uses components (Button, etc)
    ↓
Dashboard fetches data via suratService.getMasuk() [from services]
    ↓
Data displayed in Table component
    ↓
User can interact (filter, search, etc)
```

---

## Adding New Pages

1. Create file di `src/pages/YourPage.jsx`
2. Export di `src/pages/index.js`
3. Add route di `src/App.jsx`
4. Create components/services jika diperlukan

---

## Adding New Components

1. Create file di `src/components/YourComponent.jsx`
2. Export di `src/components/index.js`
3. Use di pages/layouts

---

**Refer ke ARCHITECTURE.md untuk penjelasan design patterns dan best practices.**