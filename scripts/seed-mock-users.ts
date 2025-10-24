/**
 * Seed Mock Cognito Users Script
 * 
 * This script seeds Mock Cognito with users from your PostgreSQL database.
 * Run this in browser console after starting the app.
 * 
 * Usage:
 * 1. Open browser console
 * 2. Copy and paste this script
 * 3. Call: seedMockUsers(usersFromPostgres)
 */

interface PostgresUser {
  id: number;
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
 * Seed Mock Cognito with users from PostgreSQL
 * @param postgresUsers - Array of users from PostgreSQL
 * @param defaultPassword - Default password for all users (default: 'password123')
 */
function seedMockUsers(postgresUsers: PostgresUser[], defaultPassword: string = 'password123') {
  // Get existing mock users
  const existingUsers: MockUser[] = JSON.parse(localStorage.getItem('mock_users') || '[]');
  
  // Convert PostgreSQL users to Mock Cognito format
  const newMockUsers: MockUser[] = postgresUsers.map(user => ({
    id: `mock-user-${user.id}`,
    email: user.email,
    password: btoa(defaultPassword), // Base64 encode password
    firstName: user.firstName,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber,
    role: user.role,
    confirmed: true, // Auto-confirm for dev
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
  
  // Merge with existing users (avoid duplicates by email)
  const existingEmails = new Set(existingUsers.map(u => u.email.toLowerCase()));
  const usersToAdd = newMockUsers.filter(u => !existingEmails.has(u.email.toLowerCase()));
  
  const allUsers = [...existingUsers, ...usersToAdd];
  
  // Save to localStorage
  localStorage.setItem('mock_users', JSON.stringify(allUsers));
  
  console.log(`✅ Seeded ${usersToAdd.length} new users to Mock Cognito`);
  console.log(`📊 Total users: ${allUsers.length}`);
  console.table(usersToAdd.map(u => ({
    Email: u.email,
    Password: defaultPassword,
    Role: u.role,
  })));
  
  return {
    added: usersToAdd.length,
    total: allUsers.length,
    users: usersToAdd,
  };
}

/**
 * Example usage with sample PostgreSQL users
 */
function seedExampleUsers() {
  const exampleUsers: PostgresUser[] = [
    {
      id: 1,
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '+1234567890',
      role: 'CLIENT_USER',
    },
    {
      id: 2,
      email: 'jane.trainer@example.com',
      firstName: 'Jane',
      lastName: 'Trainer',
      phoneNumber: '+1234567891',
      role: 'PT_USER',
    },
    {
      id: 3,
      email: 'gym.owner@example.com',
      firstName: 'Gym',
      lastName: 'Owner',
      phoneNumber: '+1234567892',
      role: 'GYM_STAFF',
    },
  ];
  
  return seedMockUsers(exampleUsers);
}

/**
 * Clear all mock users (use with caution!)
 */
function clearMockUsers() {
  localStorage.removeItem('mock_users');
  console.log('🗑️ Cleared all mock users');
}

/**
 * List all mock users
 */
function listMockUsers() {
  const users: MockUser[] = JSON.parse(localStorage.getItem('mock_users') || '[]');
  console.table(users.map(u => ({
    Email: u.email,
    Password: 'password123', // Default password
    Role: u.role,
    Confirmed: u.confirmed,
  })));
  return users;
}

// Export functions for use in browser console
if (typeof window !== 'undefined') {
  (window as any).seedMockUsers = seedMockUsers;
  (window as any).seedExampleUsers = seedExampleUsers;
  (window as any).clearMockUsers = clearMockUsers;
  (window as any).listMockUsers = listMockUsers;
}

export { seedMockUsers, seedExampleUsers, clearMockUsers, listMockUsers };
