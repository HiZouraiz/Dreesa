const DOMAIN_NAME = process.env["EXPO_PUBLIC_APP_URL"];

export const Base_URL = `https://${DOMAIN_NAME}/wp-json/wc/v3/`;
export const Base_URL_AUTH = `https://${DOMAIN_NAME}/wp-json/jwt-auth/v1/token`;
export const Base_URL_WP = `https://${DOMAIN_NAME}/wp-json/wp/v2/`;
export const Base_URL_FORGOT_PASSWORD = `https://${DOMAIN_NAME}/wp-json/bdpwr/v1/`;
export const Base_URL_CUSTOM = `https://${DOMAIN_NAME}/wp-json/custom/v1/`;
