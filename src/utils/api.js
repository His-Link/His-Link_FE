export function unwrapApiResponse(payload) {
  if (payload == null) {
    return null;
  }
  if (typeof payload.success === "boolean" && !payload.success) {
    throw new Error(payload.message || "요청에 실패했습니다.");
  }
  return payload.data !== undefined ? payload.data : payload;
}

export function buildQueryParams(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item) => search.append(key, String(item)));
      return;
    }
    search.set(key, String(value));
  });
  return search;
}

export function toFormBody(data = {}) {
  const body = new URLSearchParams();
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item) => body.append(key, String(item)));
      return;
    }
    body.set(key, String(value));
  });
  return body;
}
