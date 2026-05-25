# 🏗️ Arsitektur Project E-Office Frontend

## Arsitektur Keseluruhan

```
┌─────────────────────────────────────────────────┐
│           Browser / Client Layer                │
├─────────────────────────────────────────────────┤
│  App.jsx (Routing & Protected Routes)           │
├─────────────────────────────────────────────────┤
│  Pages Layer                                    │
│  ├─ Login.jsx                                   │
│  ├─ Dashboard.jsx                               │
│  ├─ SuratMasuk.jsx                              │
│  ├─ SuratKeluar.jsx                             │
│  ├─ TugasAkhir.jsx                              │
│  ├─ Persetujuan.jsx                             │
│  └─ ManajemenUser.jsx                           │
├─────────────────────────────────────────────────┤
│  Layouts Layer                                  │
│  └─ MainLayout.jsx (Sidebar + Navbar)           │
├─────────────────────────────────────────────────┤
│  Components Layer (Reusable)                    │
│  ├─ Sidebar.jsx                                 │
│  ├─ Navbar.jsx                                  │
│  ├─ Card.jsx                                    │
│  ├─ Button.jsx                                  │
│  └─ Table.jsx                                   │
├─────────────────────────────────────────────────┤
│  Services Layer (API Communication)             │
│  ├─ api.js (Axios Instance)                     │
│  ├─ authService                                 │
│  ├─ suratService                                │
│  ├─ tugasAkhirService                           │
│  └─ userService                                 │
├─────────────────────────────────────────────────┤
│  Utils Layer (Helper Functions)                 │
│  ├─ formatDate()                                │
│  ├─ isAuthenticated()                           │
│  ├─ hasRole()                                   │
│  └─ validateEmail()                             │
├─────────────────────────────────────────────────┤
│           API Backend (REST)                    │
│           http://localhost:5000/api             │
└─────────────────────────────────────────────────┘
```

---

## Layer Descriptions

### 1. **Pages Layer**
Halaman penuh yang represent setiap route di aplikasi. Setiap page:
- Menampilkan satu halaman utuh
- Menggunakan Layout sebagai wrapper
- Menggunakan Components untuk UI building blocks
- Menggunakan Services untuk API calls
- Menggunakan Utils untuk helper functions

### 2. **Layouts Layer**
Template/kerangka yang dipakai oleh multiple pages:
- **MainLayout**: Layout utama dengan Sidebar dan Navbar
- Menyediakan struktur UI konsisten di semua halaman

### 3. **Components Layer**
Komponen React kecil yang reusable:
- Tidak bergantung pada routing
- Menerima data via props
- Tidak melakukan API calls
- Dapat dipakai di berbagai pages

**Components yang tersedia:**
- `Sidebar` - Menu navigasi side
- `Navbar` - Top bar dengan user info
- `Card` - Card component untuk statistik
- `Button` - Button dengan berbagai variant
- `Table` - Data table dengan kolom dinamis

### 4. **Services Layer**
Tempat konfigurasi dan API calls:
- **api.js** - Axios instance dengan interceptor
- **authService** - Login, register, logout
- **suratService** - CRUD surat masuk/keluar
- **tugasAkhirService** - Manajemen tugas akhir
- **userService** - Manajemen user (admin)

### 5. **Utils Layer**
Fungsi bantuan yang reusable:
- `formatDate()` - Format tanggal ke Indonesia
- `isAuthenticated()` - Cek user sudah login
- `hasRole()` - Cek role user
- `validateEmail()` - Validasi format email
- `truncateText()` - Potong teks panjang
- `formatFileSize()` - Format ukuran file

---

## Data Flow

### 1. User Interaction
```
User Click Button 
    ↓
Component Event Handler 
    ↓
Call Service Function
```

### 2. API Call Flow
```
Service Function
    ↓
Axios Instance
    ↓
Add Auth Token (Interceptor)
    ↓
Send Request to Backend
    ↓
Return Response/Error
```

### 3. State Management
- Menggunakan React State (useState) untuk component state
- localStorage untuk token dan user data
- Dapat diupgrade ke Redux/Zustand jika perlu centralized state

---

## Routing Structure

```javascript
/                    → Redirect ke /dashboard
/login              → Login page (public)
/dashboard          → Main dashboard (protected)
/surat-masuk        → Incoming letters (protected)
/surat-keluar       → Outgoing letters (protected)
/tugas-akhir        → Final projects (protected)
/persetujuan        → Approvals (protected)
/users              → User management (protected, admin only)
/*                  → Not found page
```

---

## Protected Routes

Routes yang memerlukan authentication:
- Menggunakan `ProtectedRoute` component di App.jsx
- Jika user tidak login → redirect ke /login
- Token disimpan di localStorage
- Setiap API request otomatis include token di header

---

## Styling Approach

- **Tailwind CSS v4** - Utility-first CSS
- Custom classes di `index.css`
- Consistent color scheme:
  - Blue (Primary) - `#2563EB`
  - Green (Success) - `#16A34A`
  - Red (Danger) - `#DC2626`
  - Yellow (Warning) - `#CA8A04`

---

## Best Practices

### 1. Component Organization
```javascript
// ❌ Avoid
export default function MyComponent() {
  // 300 lines of code
}

// ✅ Good
function MyComponent() {
  // Split into smaller components
}
export default MyComponent;
```

### 2. Naming Convention
```javascript
// ❌ Avoid
const d = new Date();
const c = calculateTotal();

// ✅ Good
const todayDate = new Date();
const totalAmount = calculateTotal();
```

### 3. Service Usage
```javascript
// ❌ Avoid direct axios
const response = axios.get('/api/surat');

// ✅ Good - Use services
const response = await suratService.getMasuk();
```

### 4. Error Handling
```javascript
// ✅ Always handle errors
try {
  const data = await suratService.getMasuk();
} catch (error) {
  console.error('Error:', error.message);
  setError('Failed to load data');
}
```

---

## Performance Optimization

### Current Implementation:
- Lazy loading via React Router (built-in)
- Optimized re-renders with proper component structure
- Conditional rendering untuk data

### Future Improvements:
- React.memo untuk expensive components
- useMemo untuk complex calculations
- useCallback untuk optimized event handlers
- Code splitting untuk pages

---

## Security Considerations

1. **Authentication**
   - Token stored in localStorage
   - Included in every API request header

2. **Authorization**
   - Protected routes check authentication
   - Role-based access control via `hasRole()` utility

3. **Input Validation**
   - Email validation
   - Text truncation untuk security
   - Form validation di components

---

## Testing Strategy

### Unit Tests (untuk utils)
```javascript
test('formatDate formats correctly', () => {
  expect(formatDate('2024-03-20')).toBe('20 Maret 2024');
});
```

### Component Tests
```javascript
test('Button renders with correct text', () => {
  render(<Button>Click Me</Button>);
  expect(screen.getByText('Click Me')).toBeInTheDocument();
});
```

### Integration Tests
```javascript
test('Login flow works correctly', async () => {
  // Simulate login process
});
```

---

## Deployment Checklist

- [ ] Update API_BASE_URL di `.env.local`
- [ ] Run `npm run build`
- [ ] Test production build
- [ ] Remove console.logs
- [ ] Update meta tags di index.html
- [ ] Check bundle size
- [ ] Enable HTTPS
- [ ] Setup CI/CD pipeline

---

## Troubleshooting

### 1. Axios Interceptor Not Working
- Check token format di localStorage
- Verify API_BASE_URL di services/api.js

### 2. Protected Routes Redirecting
- Check localStorage untuk token
- Verify token format di utils

### 3. Component Not Re-rendering
- Check state updates di React DevTools
- Verify dependency array di useEffect

---

**Dokumentasi ini akan di-update seiring pengembangan project.**