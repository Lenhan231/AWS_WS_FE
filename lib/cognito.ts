/**
 * Cognito Service Factory
 * 
 * This file acts as a factory that exports either MockCognitoService or RealCognitoService
 * based on the NEXT_PUBLIC_USE_MOCK_AUTH environment variable.
 * 
 * Usage:
 * - Set NEXT_PUBLIC_USE_MOCK_AUTH=true in .env.local to use mock authentication
 * - Set NEXT_PUBLIC_USE_MOCK_AUTH=false or omit it to use real AWS Cognito
 */

import { MockCognitoService } from './mockCognito';
import { RealCognitoService } from './realCognito';

// Check if mock mode is enabled
const USE_MOCK_AUTH = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true';

// Log warning if mock mode is active (client-side only)
if (USE_MOCK_AUTH && typeof window !== 'undefined') {
  console.warn(
    '%c⚠️ MOCK AUTHENTICATION ACTIVE',
    'background: #ff9800; color: white; font-size: 16px; font-weight: bold; padding: 8px 16px; border-radius: 4px;'
  );
  console.log(
    '%c🔧 This should only be used in development!',
    'color: #ff9800; font-size: 14px; font-weight: bold;'
  );
  console.log(
    '%cTo disable mock auth, remove or set NEXT_PUBLIC_USE_MOCK_AUTH=false in .env.local',
    'color: #666; font-size: 12px;'
  );
}

// Export the appropriate implementation
export const cognito = USE_MOCK_AUTH ? MockCognitoService : RealCognitoService;

// For backwards compatibility
export const CognitoService = cognito;

