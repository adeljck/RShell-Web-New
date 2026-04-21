import { resultRequestClient } from '../request';

export interface SettingResult {
  dingding_access_token: string;
  dingding_key_word: string;
  wx_key: string;
}

export async function getSettingApi() {
  return resultRequestClient.get<SettingResult>('/setting');
}

export async function updateSettingApi(data: SettingResult) {
  return resultRequestClient.post<SettingResult>('/setting', data);
}

export function getMockSetting(): SettingResult {
  return {
    dingding_access_token: '',
    dingding_key_word: '',
    wx_key: '1c726933-fc02-4290-88f8-40e836016f19',
  };
}
