/**
 * Seed Mock Cognito from PostgreSQL Data
 * 
 * This script extracts users from PostgreSQL Flyway migrations
 * and seeds them into Mock Cognito for local development.
 * 
 * Based on:
 * - db/migration/V3__seed_minimal_data.sql
 * - db/seed/R__seed_mock_data.sql
 */

interface PostgresUser {
  id: number;
  cognitoSub: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: 'CLIENT_USER' | 'PT_USER' | 'GYM_STAFF' | 'ADMIN';
}

interface MockUser {
  id: string;
  email: string;
  password: string; // Base64 encoded
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: string;
  confirmed: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Users from V3__seed_minimal_data.sql
 */
const MINIMAL_SEED_USERS: PostgresUser[] = [
  {
    id: 1, // Will be assigned by PostgreSQL
    cognitoSub: 'seed-admin-sub',
    email: 'admin@easybody.com',
    firstName: 'System',
    lastName: 'Admin',
    phoneNumber: '+8488880001',
    role: 'ADMIN',
  },
  {
    id: 2,
    cognitoSub: 'seed-gymstaff-sub',
    email: 'owner@easybody.com',
    firstName: 'Linh',
    lastName: 'Tran',
    phoneNumber: '+8488880002',
    role: 'GYM_STAFF',
  },
  {
    id: 3,
    cognitoSub: 'seed-pt-sub',
    email: 'trainer@easybody.com',
    firstName: 'Minh',
    lastName: 'Nguyen',
    phoneNumber: '+8488880003',
    role: 'PT_USER',
  },
];

/**
 * Generate mock users from R__seed_mock_data.sql pattern
 * Creates 15 users of each type (GYM_STAFF, PT_USER, CLIENT_USER)
 */
function generateMockUsers(): PostgresUser[] {
  const users: PostgresUser[] = [];
  let idCounter = 4; // Start after minimal seed users

  for (let i = 1; i <= 15; i++) {
    // Gym Staff User
    users.push({
      id: idCounter++,
      cognitoSub: `mock-gymstaff-sub-${i}`,
      email: `mock.staff${i}@easybody.com`,
      firstName: `Staff${i}`,
      lastName: 'Nguyen',
      phoneNumber: `+8488811${String(2000 + i).padStart(4, '0')}`,
      role: 'GYM_STAFF',
    });

    // PT User
    users.push({
      id: idCounter++,
      cognitoSub: `mock-pt-sub-${i}`,
      email: `mock.pt${i}@easybody.com`,
      firstName: `Trainer${i}`,
      lastName: 'Pham',
      phoneNumber: `+8488822${String(3000 + i).padStart(4, '0')}`,
      role: 'PT_USER',
    });

    // Client User
    users.push({
      id: idCounter++,
      cognitoSub: `mock-client-sub-${i}`,
      email: `mock.client${i}@easybody.com`,
      firstName: `Client${i}`,
      lastName: 'Le',
      phoneNumber: `+8488833${String(4000 + i).padStart(4, '0')}`,
      role: 'CLIENT_USER',
    });
  }

  return users;
}

/**
 * Get all PostgreSQL users (minimal + mock)
 */
export function getAllPostgresUsers(): PostgresUser[] {
  return [...MINIMAL_SEED_USERS, ...generateMockUsers()];
}

/**
 * Convert PostgreSQL user to Mock Cognito format
 */
function convertToMockUser(pgUser: PostgresUser, password: string = 'password123'): MockUser {
  return {
    id: `mock-user-${pgUser.id}`,
    email: pgUser.email,
    password: btoa(password), // Base64 encode
    firstName: pgUser.firstName,
    lastName: pgUser.lastName,
    phoneNumber: pgUser.phoneNumber,
    role: pgUser.role,
    confirmed: true, // Auto-confirm for dev
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Seed all PostgreSQL users to Mock Cognito
 */
export function seedAllPostgresUsers(password: string = 'password123'): {
  added: number;
  total: number;
  users: MockUser[];
} {
  if (typeof window === 'undefined') {
    throw new Error('This function must be run in browser environment');
  }

  const postgresUsers = getAllPostgresUsers();
  const existingUsers: MockUser[] = JSON.parse(localStorage.getItem('mock_users') || '[]');
  
  // Convert all PostgreSQL users to Mock Cognito format
  const newMockUsers = postgresUsers.map(u => convertToMockUser(u, password));
  
  // Merge with existing users (avoid duplicates by email)
  const existingEmails = new Set(existingUsers.map(u => u.email.toLowerCase()));
  const usersToAdd = newMockUsers.filter(u => !existingEmails.has(u.email.toLowerCase()));
  
  const allUsers = [...existingUsers, ...usersToAdd];
  
  // Save to localStorage
  localStorage.setItem('mock_users', JSON.stringify(allUsers));
  
  console.log(`✅ Seeded ${usersToAdd.length} PostgreSQL users to Mock Cognito`);
  console.log(`📊 Total users: ${allUsers.length}`);
  console.log(`🔑 Default password: ${password}`);
  
  // Show summary by role
  const summary = allUsers.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  console.table(summary);
  
  return {
    added: usersToAdd.length,
    total: allUsers.length,
    users: usersToAdd,
  };
}

/**
 * Seed only minimal users (from V3__seed_minimal_data.sql)
 */
export function seedMinimalUsers(password: string = 'password123') {
  if (typeof window === 'undefined') {
    throw new Error('This function must be run in browser environment');
  }

  const existingUsers: MockUser[] = JSON.parse(localStorage.getItem('mock_users') || '[]');
  const newMockUsers = MINIMAL_SEED_USERS.map(u => convertToMockUser(u, password));
  
  const existingEmails = new Set(existingUsers.map(u => u.email.toLowerCase()));
  const usersToAdd = newMockUsers.filter(u => !existingEmails.has(u.email.toLowerCase()));
  
  const allUsers = [...existingUsers, ...usersToAdd];
  localStorage.setItem('mock_users', JSON.stringify(allUsers));
  
  console.log(`✅ Seeded ${usersToAdd.length} minimal users`);
  console.table(usersToAdd.map(u => ({
    Email: u.email,
    Password: password,
    Role: u.role,
  })));
  
  return {
    added: usersToAdd.length,
    total: allUsers.length,
    users: usersToAdd,
  };
}

/**
 * Get users by role
 */
export function getUsersByRole(role: 'CLIENT_USER' | 'PT_USER' | 'GYM_STAFF' | 'ADMIN'): PostgresUser[] {
  return getAllPostgresUsers().filter(u => u.role === role);
}

/**
 * List all PostgreSQL users (for reference)
 */
export function listPostgresUsers() {
  const users = getAllPostgresUsers();
  console.log(`📋 Total PostgreSQL users: ${users.length}`);
  console.table(users.map(u => ({
    ID: u.id,
    Email: u.email,
    Name: `${u.firstName} ${u.lastName}`,
    Role: u.role,
  })));
  return users;
}

// Export for browser console
if (typeof window !== 'undefined') {
  (window as any).seedAllPostgresUsers = seedAllPostgresUsers;
  (window as any).seedMinimalUsers = seedMinimalUsers;
  (window as any).listPostgresUsers = listPostgresUsers;
  (window as any).getUsersByRole = getUsersByRole;
}
