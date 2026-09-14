export interface SendOtpPayload {
  fullName: string;
  email: string;
  uniqueUserId: string;
  password: string;
  confirmPassword?: string;
  accountType?: 'student' | 'recruiter';
}

export interface SendOtpResponse {
  success: boolean;
  message?: string;
  email?: string;
  expiresAt?: number;
  error?: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message?: string;
  regToken?: string;
  email?: string;
  fullName?: string;
  uniqueUserId?: string;
  error?: string;
  attemptsRemaining?: number;
}

export interface CompleteRegistrationPayload {
  regToken: string;
  email?: string;
  college?: string;
  branch?: string;
  gradYear?: string;
  skills?: string[];
  githubUsername?: string;
  leetcodeUsername?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  fullName: string;
  email: string;
  username: string;
  uniqueUserId: string;
  role: string;
  bio: string;
  college?: string;
  branch?: string;
  gradYear?: string;
  education?: string;
  location?: string;
  avatar: string;
  overallScore: number;
  accountType: 'student' | 'recruiter';
  skills: any[];
  projects?: any[];
  certifications?: any[];
  githubUsername?: string;
  leetcodeUsername?: string;
  isPro?: boolean;
}

const AUTH_TOKEN_KEY = 'recruitcred_auth_token';

export const getStoredAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const setStoredAuthToken = (token: string) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const clearStoredAuthToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

/**
 * Step 1: Dispatch OTP to authorized email
 */
export const apiSendOtp = async (payload: SendOtpPayload): Promise<SendOtpResponse> => {
  try {
    const res = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Failed to send verification code.' };
    }
    return data;
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error connecting to auth server.' };
  }
};

/**
 * Step 2: Verify OTP
 */
export const apiVerifyOtp = async (email: string, otp: string): Promise<VerifyOtpResponse> => {
  try {
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    });
    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        error: data.error || 'Invalid verification code.',
        attemptsRemaining: data.attemptsRemaining
      };
    }
    return data;
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error verifying code.' };
  }
};

/**
 * Step 3: Complete Registration
 */
export const apiCompleteRegistration = async (payload: CompleteRegistrationPayload): Promise<{
  success: boolean;
  user?: AuthUser;
  token?: string;
  error?: string;
}> => {
  try {
    const res = await fetch('/api/auth/complete-registration', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Registration completion failed.' };
    }
    if (data.token) {
      setStoredAuthToken(data.token);
    }
    return data;
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error creating account.' };
  }
};

/**
 * Sign In
 */
export const apiLogin = async (identifier: string, password?: string): Promise<{
  success: boolean;
  user?: AuthUser;
  token?: string;
  error?: string;
}> => {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password })
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Sign in failed.' };
    }
    if (data.token) {
      setStoredAuthToken(data.token);
    }
    return data;
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error during sign in.' };
  }
};

/**
 * Sign Out
 */
export const apiLogout = async (): Promise<void> => {
  try {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
  } finally {
    clearStoredAuthToken();
  }
};

/**
 * Check Unique User ID availability on backend
 */
export const apiCheckUsername = async (username: string): Promise<boolean> => {
  try {
    if (!username || username.trim().length < 3) return false;
    const res = await fetch(`/api/users/check-username/${encodeURIComponent(username.trim())}`);
    const data = await res.json();
    return Boolean(data.available);
  } catch {
    return false;
  }
};

/**
 * Fetch Public Profile by Unique User ID
 */
export const apiGetPublicProfile = async (uniqueUserId: string): Promise<{
  success: boolean;
  profile?: any;
  error?: string;
  notFound?: boolean;
}> => {
  try {
    const res = await fetch(`/api/users/${encodeURIComponent(uniqueUserId)}/public-profile`);
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Profile not found.', notFound: res.status === 404 };
    }
    return data;
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to fetch public profile.' };
  }
};
