import { formatDateTimeVN } from './dateTime';

export function formatLimit(value, unit) {
  if (value === null || value === undefined || value === '') return 'Chưa thiết lập';
  return `${value} ${unit}`;
}

export function formatSubmittedAt(value) {
  if (!value) return 'Chưa có thời gian';

  return formatDateTimeVN(value) || value;
}

export function formatSubmissionStatus(status) {
  const statusMap = {
    ACCEPTED: 'Accepted',
    WRONG_ANSWER: 'Wrong answer',
    TIME_LIMIT_EXCEEDED: 'Time limit',
    MEMORY_LIMIT_EXCEEDED: 'Memory limit',
    COMPILATION_ERROR: 'Compile error',
    RUNTIME_ERROR: 'Runtime error',
    INTERNAL_ERROR: 'Internal error',
    PENDING: 'Pending',
    JUDGING: 'Judging',
  };

  return statusMap[status] || status || 'Unknown';
}
