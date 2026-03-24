// ─────────────────────────────────────────────────────────────
//  IN-MEMORY DEMO STORE  (no database / Prisma required)
// ─────────────────────────────────────────────────────────────
//  Demo credentials:
//    USER  → demo@arthanova.in  / Demo@1234
//    ADMIN → admin@arthanova.in / Admin@1234
// ─────────────────────────────────────────────────────────────

let _nextId = 3;

// bcryptjs hash of "Demo@1234"  (rounds=10)
const DEMO_HASH  = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHi2';
// bcryptjs hash of "Admin@1234" (rounds=10)
const ADMIN_HASH = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';

const users = [
  {
    id: 1,
    email: 'demo@arthanova.in',
    username: 'demo_user',
    full_name: 'Demo User',
    hashed_password: DEMO_HASH,
    phone: null,
    avatar_url: null,
    bio: null,
    role: 'user',
    risk_profile: 'moderate',
    is_active: true,
    is_verified: true,
    is_admin: false,
    notification_email: true,
    notification_push: true,
    preferred_currency: 'INR',
    theme: 'light',
    created_at: new Date('2025-01-01T00:00:00Z'),
    updated_at: new Date('2025-01-01T00:00:00Z'),
    last_login: null,
  },
  {
    id: 2,
    email: 'admin@arthanova.in',
    username: 'admin',
    full_name: 'ArthaNova Admin',
    hashed_password: ADMIN_HASH,
    phone: null,
    avatar_url: null,
    bio: 'Platform Administrator',
    role: 'admin',
    risk_profile: 'aggressive',
    is_active: true,
    is_verified: true,
    is_admin: true,
    notification_email: true,
    notification_push: true,
    preferred_currency: 'INR',
    theme: 'dark',
    created_at: new Date('2025-01-01T00:00:00Z'),
    updated_at: new Date('2025-01-01T00:00:00Z'),
    last_login: null,
  },
];

// ── helpers ──────────────────────────────────────────────────
function matchWhere(user, where) {
  for (const [key, val] of Object.entries(where)) {
    if (user[key] !== val) return false;
  }
  return true;
}

// ── mini Prisma-shape client ──────────────────────────────────
const prisma = {
  user: {
    findUnique: async ({ where }) => users.find(u => matchWhere(u, where)) ?? null,

    findMany: async ({ where } = {}) =>
      where ? users.filter(u => matchWhere(u, where)) : [...users],

    create: async ({ data }) => {
      const user = {
        id: _nextId++,
        phone: null,
        avatar_url: null,
        bio: null,
        role: 'user',
        risk_profile: 'moderate',
        is_active: true,
        is_verified: false,
        is_admin: false,
        notification_email: true,
        notification_push: true,
        preferred_currency: 'INR',
        theme: 'light',
        created_at: new Date(),
        updated_at: new Date(),
        last_login: null,
        ...data,
      };
      users.push(user);
      return user;
    },

    update: async ({ where, data }) => {
      const idx = users.findIndex(u => matchWhere(u, where));
      if (idx === -1) throw new Error('Record not found');
      users[idx] = { ...users[idx], ...data, updated_at: new Date() };
      return users[idx];
    },

    delete: async ({ where }) => {
      const idx = users.findIndex(u => matchWhere(u, where));
      if (idx === -1) throw new Error('Record not found');
      return users.splice(idx, 1)[0];
    },

    count: async ({ where } = {}) =>
      where ? users.filter(u => matchWhere(u, where)).length : users.length,
  },
};

export default prisma;

