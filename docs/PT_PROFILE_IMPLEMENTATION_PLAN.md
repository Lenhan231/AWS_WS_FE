# PT Profile Implementation Plan

## Current Status

✅ **PT Profile page exists** at `app/dashboard/pt/profile/page.tsx`
✅ **UI is complete** with beautiful design
❌ **Using mock data** - needs real API integration

## What Needs to Be Done

### 1. API Integration

#### Add PT Profile Endpoints to API Client

```typescript
// lib/api.ts
export const api = {
  // ... existing endpoints
  
  ptUsers: {
    // Get current PT user profile
    getMyProfile: async (): Promise<ApiResponse<PersonalTrainer>> => {
      return handleRequest(() => client.get('/pt-users/me'));
    },
    
    // Update PT profile
    updateProfile: async (data: Partial<PersonalTrainer>): Promise<ApiResponse<PersonalTrainer>> => {
      return handleRequest(() => client.put('/pt-users/me', data));
    },
    
    // Upload profile image
    uploadProfileImage: async (file: File): Promise<ApiResponse<{ url: string }>> => {
      const formData = new FormData();
      formData.append('file', file);
      return handleRequest(() => client.post('/pt-users/me/profile-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }));
    },
  },
};
```

### 2. Update PT Profile Page

#### Fetch Real Data

```typescript
'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { PersonalTrainer } from '@/types';

export default function PTProfilePage() {
  const [profile, setProfile] = useState<PersonalTrainer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const response = await api.ptUsers.getMyProfile();
      if (response.success && response.data) {
        setProfile(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    
    setIsSaving(true);
    try {
      const response = await api.ptUsers.updateProfile(profile);
      if (response.success) {
        setIsEditing(false);
        // Show success toast
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      // Show error toast
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const response = await api.ptUsers.uploadProfileImage(file);
      if (response.success && response.data) {
        setProfile({ ...profile!, profileImageUrl: response.data.url });
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!profile) {
    return <ErrorMessage />;
  }

  // ... rest of component
}
```

### 3. Add Specializations Management

```typescript
const [newSpecialization, setNewSpecialization] = useState('');

const handleAddSpecialization = () => {
  if (newSpecialization.trim()) {
    const specs = profile.specializations?.split(',') || [];
    specs.push(newSpecialization.trim());
    setProfile({ ...profile, specializations: specs.join(',') });
    setNewSpecialization('');
  }
};

const handleRemoveSpecialization = (index: number) => {
  const specs = profile.specializations?.split(',') || [];
  specs.splice(index, 1);
  setProfile({ ...profile, specializations: specs.join(',') });
};
```

### 4. Add Certifications Management

```typescript
const [newCertification, setNewCertification] = useState('');

const handleAddCertification = () => {
  if (newCertification.trim()) {
    const certs = profile.certifications?.split(',') || [];
    certs.push(newCertification.trim());
    setProfile({ ...profile, certifications: certs.join(',') });
    setNewCertification('');
  }
};

const handleRemoveCertification = (index: number) => {
  const certs = profile.certifications?.split(',') || [];
  certs.splice(index, 1);
  setProfile({ ...profile, certifications: certs.join(',') });
};
```

### 5. Add Image Upload Component

```typescript
const ImageUpload = ({ onUpload }: { onUpload: (file: File) => void }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <div className="text-center">
          <Camera className="w-12 h-12 text-white mx-auto mb-2" />
          <p className="text-white font-bold">Change Photo</p>
        </div>
      </button>
    </>
  );
};
```

### 6. Add Loading States

```typescript
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
  </div>
);

const ErrorMessage = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <p className="text-red-500 text-xl font-bold mb-4">Failed to load profile</p>
      <Button onClick={() => window.location.reload()}>Retry</Button>
    </div>
  </div>
);
```

### 7. Add Toast Notifications

```typescript
import { toast } from 'react-hot-toast';

const handleSave = async () => {
  // ... save logic
  
  if (response.success) {
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  } else {
    toast.error('Failed to update profile');
  }
};
```

## Backend Requirements

### PT Users Endpoints Needed

```
GET    /api/v1/pt-users/me              - Get current PT user profile
PUT    /api/v1/pt-users/me              - Update PT profile
POST   /api/v1/pt-users/me/profile-image - Upload profile image
GET    /api/v1/pt-users/me/stats        - Get PT statistics
```

### Response Format

```json
{
  "id": 1,
  "userId": 3,
  "bio": "Certified personal trainer...",
  "specializations": "Strength Coaching,Fat Loss,Mobility",
  "certifications": "ACE CPT,Precision Nutrition",
  "yearsOfExperience": 6,
  "profileImageUrl": "https://...",
  "locationId": 2,
  "active": true,
  "verified": true,
  "user": {
    "id": 3,
    "email": "trainer@easybody.com",
    "firstName": "Minh",
    "lastName": "Nguyen",
    "phoneNumber": "+8488880003",
    "role": "PT_USER"
  },
  "location": {
    "id": 2,
    "latitude": 10.7801,
    "longitude": 106.6997,
    "formattedAddress": "72 Lê Thánh Tôn, Quận 1, TP. Hồ Chí Minh"
  }
}
```

## Testing Checklist

### Manual Testing

- [ ] Login as PT user (`trainer@easybody.com` / `password123`)
- [ ] Navigate to `/dashboard/pt/profile`
- [ ] Verify profile data loads correctly
- [ ] Click "Edit Profile" button
- [ ] Update bio, phone, location
- [ ] Add new specialization
- [ ] Remove specialization
- [ ] Add new certification
- [ ] Remove certification
- [ ] Upload new profile image
- [ ] Click "Save Changes"
- [ ] Verify changes are saved
- [ ] Refresh page and verify changes persist

### API Testing

- [ ] Test GET `/api/v1/pt-users/me` returns correct data
- [ ] Test PUT `/api/v1/pt-users/me` updates profile
- [ ] Test POST `/api/v1/pt-users/me/profile-image` uploads image
- [ ] Test error handling for invalid data
- [ ] Test authentication required

## Implementation Priority

### Phase 1: Basic Integration (High Priority)
1. Add API endpoints to `lib/api.ts`
2. Fetch real profile data
3. Display real data in UI
4. Add loading states

### Phase 2: Edit Functionality (High Priority)
1. Implement save profile
2. Add form validation
3. Add error handling
4. Add success/error toasts

### Phase 3: Advanced Features (Medium Priority)
1. Image upload
2. Specializations management
3. Certifications management
4. Location autocomplete

### Phase 4: Polish (Low Priority)
1. Add animations
2. Improve error messages
3. Add confirmation dialogs
4. Add keyboard shortcuts

## Related Files

- `app/dashboard/pt/profile/page.tsx` - Main profile page
- `lib/api.ts` - API client
- `types/index.ts` - TypeScript types
- `components/ui/Badge.tsx` - Badge component
- `components/ui/Button.tsx` - Button component
- `components/ui/Input.tsx` - Input component

## Next Steps

1. **Implement API endpoints** in `lib/api.ts`
2. **Update PT profile page** to use real data
3. **Test with seeded PT user** (`trainer@easybody.com`)
4. **Add image upload** functionality
5. **Add specializations/certifications** management

---

**Status:** 📋 Plan Ready
**Priority:** High
**Estimated Time:** 2-3 hours
**Dependencies:** Backend PT Users API endpoints
