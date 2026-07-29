import { api } from './api';
import { useApi } from './useApi';

export function useBusinessProfile() {
  return useApi(api.getBusinessProfile, []);
}
