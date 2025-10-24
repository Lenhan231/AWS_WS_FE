'use client';

/**
 * MockAuthBanner Component
 * 
 * Displays a warning banner when mock authentication is active.
 * Only visible when NEXT_PUBLIC_USE_MOCK_AUTH=true
 */

export function MockAuthBanner() {
  const isMockMode = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true';

  if (!isMockMode) return null;

  return (
    <div className="bg-orange-500 text-white px-4 py-2 text-center text-sm font-medium shadow-lg z-50 relative">
      <div className="flex items-center justify-center gap-2">
        <span className="text-lg">⚠️</span>
        <span className="font-bold">DEVELOPMENT MODE:</span>
        <span>Mock Authentication Active</span>
        <span className="hidden sm:inline">
          | Test users: client@test.com, gym@test.com, trainer@test.com, admin@test.com (password: password123)
        </span>
      </div>
    </div>
  );
}
