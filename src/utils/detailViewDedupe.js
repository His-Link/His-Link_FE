const WINDOW_MS = 2500;
const lastViewAtByKey = new Map();

/** React Strict Mode·짧은 시간 내 중복 상세 요청 시 조회수를 한 번만 올리기 위함 */
export function shouldIncrementDetailView(scope, resourceId) {
  const key = `${scope}:${resourceId}`;
  const now = Date.now();
  const prev = lastViewAtByKey.get(key);
  if (prev != null && now - prev < WINDOW_MS) {
    return false;
  }
  lastViewAtByKey.set(key, now);
  return true;
}
