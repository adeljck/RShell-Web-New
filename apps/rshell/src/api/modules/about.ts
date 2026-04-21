import { resultRequestClient } from '../request';

export interface AboutInfo {
  updates: string[];
  version: string;
}

export async function getAboutInfoApi() {
  return resultRequestClient.get<AboutInfo>('/about');
}

export function getMockAboutInfo(): AboutInfo {
  return {
    version: 'v4.9.3',
    updates: [
      '增加了监听器功能',
      '数据库弃用了 json 文件改用 sqlite3，增强数据稳定性',
      '优化了前端页面，更换了部分图标，现在速度更快，使用更流畅',
      '心跳时间现在更加准确了',
      '修复了 Windows 下非交互 shell 乱码问题',
      '增加了屏幕监控功能，但部分功能还不完善谨慎使用',
      '降低了 golang 的版本，恢复支持低版本系统（高版本 golang 放弃支持某些旧的系统）',
    ],
  };
}
