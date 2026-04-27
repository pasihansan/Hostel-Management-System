import Constants from 'expo-constants';
import { Platform } from 'react-native';

export type ResidentFeedback = {
  rating: number;
  comment?: string;
  createdAt?: string;
};

export type Resident = {
  id: string;
  fullName: string;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth?: string;
  roomNumber: string;
  phone: string;
  email: string;
  guardianName?: string;
  emergencyContact?: {
    name?: string;
    relation?: string;
    phone?: string;
  };
  address?: string;
  notes?: string;
  isActive: boolean;
  averageRating: number;
  feedback: ResidentFeedback[];
  createdAt?: string;
  updatedAt?: string;
};

export type ResidentSummary = {
  totalResidents: number;
  activeResidents: number;
  averageOccupantRating: number;
  topResidents: Array<{
    id: string;
    fullName: string;
    roomNumber: string;
    averageRating: number;
  }>;
};

export type ResidentPayload = {
  fullName: string;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth?: string;
  roomNumber: string;
  phone: string;
  email: string;
  guardianName?: string;
  emergencyContact?: {
    name?: string;
    relation?: string;
    phone?: string;
  };
  address?: string;
  notes?: string;
  isActive: boolean;
};

type ValidationErrors = Record<string, string>;

const envApiUrl = process.env.EXPO_PUBLIC_RESIDENT_API_URL;
const fallbackApiUrl = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';
const configuredApi =
  envApiUrl ?? (Constants.expoConfig?.extra?.residentApiUrl as string | undefined) ?? fallbackApiUrl;

const API_BASE_URL = configuredApi.replace(/\/$/, '');

function ensureOk(response: Response, body: unknown): void {
  if (!response.ok) {
    const message =
      typeof body === 'object' && body && 'message' in body
        ? String((body as { message: string }).message)
        : 'Request failed.';
    throw new Error(message);
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  const data = await response.json();
  ensureOk(response, data);
  return data as T;
}

export function validateResidentInput(payload: Partial<ResidentPayload>): ValidationErrors {
  const errors: ValidationErrors = {};

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(payload.email || '').trim());
  const isPhoneValid = /^\+?[0-9\-\s]{7,20}$/.test(String(payload.phone || '').trim());

  if (!payload.fullName?.trim()) {
    errors.fullName = 'Full name is required.';
  }
  if (!payload.roomNumber?.trim()) {
    errors.roomNumber = 'Room number is required.';
  }
  if (!payload.phone?.trim()) {
    errors.phone = 'Phone number is required.';
  } else if (!isPhoneValid) {
    errors.phone = 'Invalid phone number format.';
  }
  if (!payload.email?.trim()) {
    errors.email = 'Email is required.';
  } else if (!isEmailValid) {
    errors.email = 'Invalid email format.';
  }

  return errors;
}

export async function fetchResidents(searchText: string): Promise<Resident[]> {
  const query = searchText.trim() ? `?q=${encodeURIComponent(searchText.trim())}` : '';
  return request<Resident[]>(`/api/residents${query}`);
}

export async function fetchResidentById(id: string): Promise<Resident> {
  return request<Resident>(`/api/residents/${id}`);
}

export async function fetchResidentSummary(): Promise<ResidentSummary> {
  return request<ResidentSummary>('/api/residents/summary/insights');
}

export async function createResident(payload: ResidentPayload): Promise<Resident> {
  return request<Resident>('/api/residents', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateResident(id: string, payload: Partial<ResidentPayload>): Promise<Resident> {
  return request<Resident>(`/api/residents/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteResident(id: string): Promise<{ message: string }> {
  return request<{ message: string }>(`/api/residents/${id}`, {
    method: 'DELETE',
  });
}

export async function addResidentFeedback(
  id: string,
  payload: {
    rating: number;
    comment?: string;
  }
): Promise<Resident> {
  return request<Resident>(`/api/residents/${id}/feedback`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export { API_BASE_URL };
