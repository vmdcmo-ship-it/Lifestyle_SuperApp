import { api } from './api';

export const missionsService = {
  getList: () => api.get<any>('/missions'),
  claimReward: (missionId: string) => api.post<any>(`/missions/${missionId}/claim`),
};
