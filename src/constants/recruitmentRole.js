export const RECRUITMENT_ROLE_LABEL = {
  FRONTEND: "프론트엔드",
  BACKEND: "백엔드",
  AI_DATA: "AI·데이터",
  DESIGN: "디자인",
  PM: "PM",
  OTHER: "기타",
};

export const RECRUITMENT_ROLES = [
  { value: "", label: "전체 역할" },
  { value: "FRONTEND", label: RECRUITMENT_ROLE_LABEL.FRONTEND },
  { value: "BACKEND", label: RECRUITMENT_ROLE_LABEL.BACKEND },
  { value: "AI_DATA", label: RECRUITMENT_ROLE_LABEL.AI_DATA },
  { value: "DESIGN", label: RECRUITMENT_ROLE_LABEL.DESIGN },
  { value: "PM", label: RECRUITMENT_ROLE_LABEL.PM },
  { value: "OTHER", label: RECRUITMENT_ROLE_LABEL.OTHER },
];

export const RECRUITMENT_STATUS_OPTIONS = [
  { value: "", label: "전체 상태" },
  { value: "OPEN", label: "모집중" },
  { value: "CLOSED", label: "마감" },
];
