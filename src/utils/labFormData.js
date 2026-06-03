export function appendLabProjectFields(formData, fields, { techStackIds, deleteImageIds, newFiles } = {}) {
  formData.append("title", fields.title);
  formData.append("summary", fields.summary);

  if (fields.serviceUrl) {
    formData.append("serviceUrl", fields.serviceUrl);
  }
  if (fields.githubUrl) {
    formData.append("githubUrl", fields.githubUrl);
  }
  if (fields.testRequest) {
    formData.append("testRequest", fields.testRequest);
  }

  techStackIds?.forEach((id) => formData.append("techStackIds", String(id)));
  deleteImageIds?.forEach((id) => formData.append("deleteImageIds", String(id)));
  newFiles?.forEach((file) => formData.append("images", file));
}
