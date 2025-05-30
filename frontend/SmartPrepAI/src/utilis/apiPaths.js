// export const BASE_URL = "http://localhost:8000";
// src/api.js or src/services/api.js

export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";


export async function fetchData() {
    const response = await fetch(`${BASE_URL}/api/data`);
    return response.json();
  }
  


export const API_PATHS = {
    AUTH: {
        REGISTER: "/api/auth/register",
        LOGIN: "/api/auth/login",
        GET_PROFILE: "/api/auth/profile",
    },

    IMAGE: {
        UPLOAD_IMAGE: "/api/auth/upload-image",
    },

    AI: {
        GENERATE_QUESTIONS: "/api/ai/generate-questions",
        GENERATE_EXPLANATION: "/api/ai/generate-explanation",
        ADD_CUSTOM_QUESTION: "/api/ai/custom",
    },

    SESSION: {
        CREATE: "/api/sessions/create",
        GET_ALL: "/api/sessions/my-sessions",
        GET_ONE: (id)=> `/api/sessions/${id}`,
        DELETE: (id)=> `/api/sessions/${id}`,
    },

    QUESTION: {
        ADD_TO_SESSION: "/api/question/add",
        PIN: (id)=> `/api/question/${id}/pin`,
        UPDATE_NOTE: (id)=>`/api/question/${id}/note`,
        DELETE: (id) => `/api/question/${id}`,
        

    },
};