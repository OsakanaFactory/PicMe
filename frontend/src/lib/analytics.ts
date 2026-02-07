import api from './api';

export interface AnalyticsSummary {
  totalViews: number;
  todayViews: number;
  weekViews: number;
  monthViews: number;
  topReferrers: { referrer: string; count: number }[];
}

export interface TimelineEntry {
  date: string;
  views: number;
}

/**
 * 解析サマリー取得
 */
export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const response = await api.get('/api/analytics/summary');
  return response.data.data;
}

/**
 * タイムラインデータ取得
 */
export async function getAnalyticsTimeline(days: number = 30): Promise<TimelineEntry[]> {
  const response = await api.get(`/api/analytics/timeline?days=${days}`);
  return response.data.data;
}
