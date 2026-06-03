export function appendRecruitmentPostFields(formData, fields, { techStackIds, deleteImageIds, newFiles } = {}) {
  formData.append("title", fields.title);
  formData.append("description", fields.description);
  formData.append("activityType", fields.activityType);
  formData.append("recruitmentRole", fields.recruitmentRole);
  formData.append("status", fields.status);
  formData.append("participantLimit", String(fields.participantLimit));

  if (fields.deadline) {
    formData.append("deadline", fields.deadline);
  }
  if (fields.contactMethod) {
    formData.append("contactMethod", fields.contactMethod);
  }

  techStackIds?.forEach((id) => formData.append("techStackIds", String(id)));
  deleteImageIds?.forEach((id) => formData.append("deleteImageIds", String(id)));
  newFiles?.forEach((file) => formData.append("images", file));
}
