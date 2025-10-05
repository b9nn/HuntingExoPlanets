import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(value: number | string | null | undefined, decimals: number = 2): string {
  const num = typeof value === 'number' ? value : value != null ? Number(value) : NaN;
  if (!Number.isFinite(num)) return 'NA';
  return num.toFixed(decimals);
}

export function formatPercentage(value: number | string | null | undefined, decimals: number = 1): string {
  const num = typeof value === 'number' ? value : value != null ? Number(value) : NaN;
  if (!Number.isFinite(num)) return 'NA';
  return `${(num * 100).toFixed(decimals)}%`;
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getPredictionColor(prediction: string): string {
  switch (prediction) {
    case 'confirmed':
      return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900';
    case 'candidate':
      return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900';
    case 'false_positive':
      return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900';
    default:
      return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900';
  }
}

export function getPredictionEmoji(prediction: string): string {
  switch (prediction) {
    case 'confirmed':
      return '🪐';
    case 'candidate':
      return '🔍';
    case 'false_positive':
      return '❌';
    default:
      return '❓';
  }
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function downloadCSV(data: any[], filename: string): void {
  if (!data || data.length === 0) return;
  const headers = Object.keys(data[0] || {});
  const csv = [
    headers.join(','),
    ...data.map(row => headers.map(h => row[h]).join(','))
  ].join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}
