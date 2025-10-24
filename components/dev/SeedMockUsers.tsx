'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Database, Users, Trash2, List } from 'lucide-react';

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
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: string;
  confirmed: boolean;
  createdAt: string;
  updatedAt: string;
}

export function SeedMockUsers() {
  const [users, setUsers] = useState<MockUser[]>([]);
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  // Check if Mock Cognito mode is active
  const isMockMode = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true';

  if (!isMockMode) {
    return null; // Only show in Mock Cognito mode
  }

  const seedUsers = (postgresUsers: PostgresUser[], defaultPassword: string = 'password123') => {
    const existingUsers: MockUser[] = JSON.parse(localStorage.getItem('mock_users') || '[]');
    
    const newMockUsers: MockUser[] = postgresUsers.map(user => ({
      id: `mock-user-${user.id}`,
      email: user.email,
      password: btoa(defaultPassword),
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      role: user.role,
      confirmed: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    
    const existingEmails = new Set(existingUsers.map(u => u.email.toLowerCase()));
    const usersToAdd = newMockUsers.filter(u => !existingEmails.has(u.email.toLowerCase()));
    
    const allUsers = [...existingUsers, ...usersToAdd];
    localStorage.setItem('mock_users', JSON.stringify(allUsers));
    
    setMessage(`✅ Seeded ${usersToAdd.length} new users (Total: ${allUsers.length})`);
    setUsers(allUsers);
    
    return usersToAdd;
  };

  const handleSeedExample = () => {
    // Seed minimal users from V3__seed_minimal_data.sql
    const minimalUsers: PostgresUser[] = [
      {
        id: 1,
        email: 'admin@easybody.com',
        firstName: 'System',
        lastName: 'Admin',
        phoneNumber: '+8488880001',
        role: 'ADMIN',
      },
      {
        id: 2,
        email: 'owner@easybody.com',
        firstName: 'Linh',
        lastName: 'Tran',
        phoneNumber: '+8488880002',
        role: 'GYM_STAFF',
      },
      {
        id: 3,
        email: 'trainer@easybody.com',
        firstName: 'Minh',
        lastName: 'Nguyen',
        phoneNumber: '+8488880003',
        role: 'PT_USER',
      },
    ];
    
    seedUsers(minimalUsers);
  };

  const handleSeedAllPostgres = () => {
    // Generate all users from PostgreSQL (minimal + 45 mock users)
    const allUsers: PostgresUser[] = [];
    
    // Add minimal users
    allUsers.push(
      {
        id: 1,
        email: 'admin@easybody.com',
        firstName: 'System',
        lastName: 'Admin',
        phoneNumber: '+8488880001',
        role: 'ADMIN',
      },
      {
        id: 2,
        email: 'owner@easybody.com',
        firstName: 'Linh',
        lastName: 'Tran',
        phoneNumber: '+8488880002',
        role: 'GYM_STAFF',
      },
      {
        id: 3,
        email: 'trainer@easybody.com',
        firstName: 'Minh',
        lastName: 'Nguyen',
        phoneNumber: '+8488880003',
        role: 'PT_USER',
      }
    );
    
    // Add mock users (15 iterations × 3 roles = 45 users)
    let idCounter = 4;
    for (let i = 1; i <= 15; i++) {
      // Gym Staff
      allUsers.push({
        id: idCounter++,
        email: `mock.staff${i}@easybody.com`,
        firstName: `Staff${i}`,
        lastName: 'Nguyen',
        phoneNumber: `+8488811${String(2000 + i).padStart(4, '0')}`,
        role: 'GYM_STAFF',
      });
      
      // PT User
      allUsers.push({
        id: idCounter++,
        email: `mock.pt${i}@easybody.com`,
        firstName: `Trainer${i}`,
        lastName: 'Pham',
        phoneNumber: `+8488822${String(3000 + i).padStart(4, '0')}`,
        role: 'PT_USER',
      });
      
      // Client User
      allUsers.push({
        id: idCounter++,
        email: `mock.client${i}@easybody.com`,
        firstName: `Client${i}`,
        lastName: 'Le',
        phoneNumber: `+8488833${String(4000 + i).padStart(4, '0')}`,
        role: 'CLIENT_USER',
      });
    }
    
    seedUsers(allUsers);
  };

  const handleListUsers = () => {
    const allUsers: MockUser[] = JSON.parse(localStorage.getItem('mock_users') || '[]');
    setUsers(allUsers);
    setMessage(`📋 Found ${allUsers.length} users in Mock Cognito`);
  };

  const handleClearUsers = () => {
    if (confirm('Are you sure you want to clear all mock users?')) {
      localStorage.removeItem('mock_users');
      setUsers([]);
      setMessage('🗑️ Cleared all mock users');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg transition-all"
        title="Mock User Tools"
      >
        <Database className="w-6 h-6" />
      </button>

      {/* Panel */}
      {isVisible && (
        <div className="absolute bottom-16 right-0 w-96 bg-dark-800 border border-primary-600/30 rounded-xl shadow-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-primary-400" />
              Mock User Tools
            </h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Message */}
          {message && (
            <div className="mb-4 p-3 bg-primary-500/10 border border-primary-500/30 rounded-lg text-sm text-primary-300">
              {message}
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3 mb-4">
            <Button
              onClick={handleSeedExample}
              className="w-full btn-primary btn-sm"
            >
              <Database className="w-4 h-4 mr-2" />
              Seed Minimal Users (3)
            </Button>

            <Button
              onClick={handleSeedAllPostgres}
              className="w-full btn-primary btn-sm"
            >
              <Users className="w-4 h-4 mr-2" />
              Seed All PostgreSQL (48)
            </Button>

            <Button
              onClick={handleListUsers}
              variant="outline"
              className="w-full btn-outline btn-sm"
            >
              <List className="w-4 h-4 mr-2" />
              List All Users
            </Button>

            <Button
              onClick={handleClearUsers}
              variant="outline"
              className="w-full btn-outline btn-sm text-red-400 border-red-400/30 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Users
            </Button>
          </div>

          {/* User List */}
          {users.length > 0 && (
            <div className="max-h-64 overflow-y-auto">
              <div className="text-xs font-bold text-gray-400 mb-2 uppercase">
                Users ({users.length})
              </div>
              <div className="space-y-2">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="p-3 bg-dark-700/50 rounded-lg border border-gray-700/30"
                  >
                    <div className="text-sm font-medium text-white">{user.email}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {user.firstName} {user.lastName} • {user.role}
                    </div>
                    <div className="text-xs text-primary-400 mt-1">
                      Password: password123
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-4 pt-4 border-t border-gray-700/30">
            <div className="text-xs text-gray-400">
              <strong className="text-white">PostgreSQL Users:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>Minimal (3):</strong> admin, owner, trainer</li>
                <li><strong>All (48):</strong> + 15 gyms, 15 PTs, 15 clients</li>
                <li><strong>Password:</strong> <code className="text-primary-400">password123</code></li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
