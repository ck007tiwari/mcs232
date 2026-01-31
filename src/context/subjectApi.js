import api from "./api";

export const createSubject = async (subjectData) => {
  const response = await api.post(`/users/subjects/`, subjectData);
  return { data: response.data, status: response.status };
};

export const getSubjects = async () => {
  const response = await api.get(`/users/subjects/`);
  return { data: response.data, status: response.status };
};

export const deleteSubjectApi = async (subjectId) => {
  const response = await api.delete(`/users/subjects/${subjectId}/`);
  return { data: response.data, status: response.status };
};

export const updateSubject = async (subjectId, subjectData) => {
  const response = await api.put(`/users/subjects/${subjectId}/`, subjectData);
  return { data: response.data, status: response.status };
};

export const getSubjectById = async (subjectId) => {
  const response = await api.get(`/users/subjects/${subjectId}/`);
  return { data: response.data, status: response.status };
};

export const uploadPdfToSubject = async (pdfData) => {
  const response = await api.post(`/users/files/`, pdfData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return { data: response.data, status: response.status };
};

export const deletePdfFromSubject = async (pdfId) => {
  const response = await api.delete(`/users/files/${pdfId}/`);
  return { data: response.data, status: response.status };
};

export const updatePdfProgress = async (pdfId, progressData) => {
  const response = await api.put(`/users/files/${pdfId}/`, progressData);
  return { data: response.data, status: response.status };
};

export const getPdfProgress = async (pdfId) => {
  const response = await api.get(`/users/files/${pdfId}/`);
  return { data: response.data, status: response.status };
};

export const getQAHistory = async (endpoint) => {
  try {
    const response = await api.get(endpoint);
    return { data: response.data, status: response.status };
  } catch (error) {
    return { data: null, status: error.response?.status || 500 };
  }
};
