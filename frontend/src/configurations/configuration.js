import { GOOGLE_AUTH_URI } from './env';

export const OAuthConfig = {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || "1813930079-32b8ul25qad5h29rhmkfqcq9lr6lrphn.apps.googleusercontent.com",
    redirectUri: import.meta.env.VITE_GOOGLE_REDIRECT_URI || "http://localhost:5173/authenticate",
    authUri: GOOGLE_AUTH_URI,
};
