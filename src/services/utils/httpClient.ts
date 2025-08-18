'use server';

import axios from 'axios';
import { cookies } from 'next/headers';

export const httpClient = axios.create({
  baseURL: 'http://localhost:3001',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - adds the authorization header to requests
httpClient.interceptors.request.use(async (config) => {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
