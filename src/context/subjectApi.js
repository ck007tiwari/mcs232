import api from "./api";

export const createSubject = async (subjectData) => {
  const response = await api.post(`/users/subjects/`, subjectData);
  return response.data;
};

export const getSubjects = async () => {
  const response = await api.get(`/users/subjects/`);
  return response.data;
};

export const deleteSubjectApi = async (subjectId) => {
  const response = await api.delete(`/users/subjects/${subjectId}/`);
  return response.data;
};

export const updateSubject = async (subjectId, subjectData) => {
  const response = await api.put(`/users/subjects/${subjectId}/`, subjectData);
  return response.data;
};

export const getSubjectById = async (subjectId) => {
  const response = await api.get(`/users/subjects/${subjectId}/`);
  return response.data;
};

export const uploadPdfToSubject = async (pdfData) => {
  const response = await api.post(`/users/files/`, pdfData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
