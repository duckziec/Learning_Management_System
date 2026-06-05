import { describe, it, expect, vi, beforeEach } from 'vitest';
import apiClient from '../../services/api.client';

describe('apiClient configuration', () => {
  it('has correct base URL from env', () => {
    expect(apiClient.defaults.baseURL).toBe('http://localhost:8080');
  });

  it('has correct timeout', () => {
    expect(apiClient.defaults.timeout).toBe(15000);
  });

  it('has JSON content-type default', () => {
    expect(apiClient.defaults.headers['Content-Type']).toBe('application/json');
  });
});

describe('Request interceptor', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('attaches Bearer token from localStorage', async () => {
    localStorage.setItem('access_token', 'test-token');
    const config = { headers: {} };
    const result = await apiClient.interceptors.request.handlers[0].fulfilled(config);
    expect(result.headers.Authorization).toBe('Bearer test-token');
  });

  it('attaches Bearer token from sessionStorage when localStorage is empty', async () => {
    sessionStorage.setItem('access_token', 'session-token');
    const config = { headers: {} };
    const result = await apiClient.interceptors.request.handlers[0].fulfilled(config);
    expect(result.headers.Authorization).toBe('Bearer session-token');
  });

  it('removes Content-Type for FormData', async () => {
    const formData = new FormData();
    const config = { headers: {}, data: formData };
    const result = await apiClient.interceptors.request.handlers[0].fulfilled(config);
    expect(result.headers['Content-Type']).toBeUndefined();
  });

  it('skips auth when skipAuth flag is set', async () => {
    const config = { headers: {}, skipAuth: true };
    const result = await apiClient.interceptors.request.handlers[0].fulfilled(config);
    expect(result.headers.Authorization).toBeUndefined();
  });
});
