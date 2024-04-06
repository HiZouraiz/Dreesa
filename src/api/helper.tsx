import { encode } from "base-64";
import {
  Base_URL,
  Base_URL_AUTH,
  Base_URL_CUSTOM,
  Base_URL_FORGOT_PASSWORD,
  Base_URL_WP,
} from "./constants";

export const Register = async (username: any, email: any, password: any) => {
  const response = await fetch(`${Base_URL}customers`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization:
        "Basic " +
        encode(
          `${process.env["EXPO_PUBLIC_WOO_COMMERCE_CONSUMER_KEY"]}:${process.env["EXPO_PUBLIC_WOO_COMMERCE_CONSUMER_SECRET_KEY"]}`
        ),
    },
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });

  return response;
};

export const Login = async (username: any, password: any) => {
  const response = await fetch(`${Base_URL_AUTH}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });

  return response;
};

export const getCurrentUserProfile = async (token: any) => {
  const response = await fetch(`${Base_URL_WP}users/me`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

export const updateCurrentUserPassword = async (
  token: any,
  user_id: any,
  password: any
) => {
  const response = await fetch(`${Base_URL_WP}users/${user_id}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      password,
    }),
  });

  return response;
};

export const getAllProducts = async (PAGE: any) => {
  const url = `${Base_URL}products?page=${PAGE}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization:
        "Basic " +
        encode(
          `${process.env["EXPO_PUBLIC_WOO_COMMERCE_CONSUMER_KEY"]}:${process.env["EXPO_PUBLIC_WOO_COMMERCE_CONSUMER_SECRET_KEY"]}`
        ),
    },
  });

  return response;
};

export const getAllCategories = async () => {
  const response = await fetch(`${Base_URL}products/categories`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization:
        "Basic " +
        encode(
          `${process.env["EXPO_PUBLIC_WOO_COMMERCE_CONSUMER_KEY"]}:${process.env["EXPO_PUBLIC_WOO_COMMERCE_CONSUMER_SECRET_KEY"]}`
        ),
    },
  });

  return response;
};

export const getAllProductsByCategory = async (CATEGORY_ID: any, PAGE: any) => {
  const response = await fetch(
    `${Base_URL}products?category=${CATEGORY_ID}&page=${PAGE}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization:
          "Basic " +
          encode(
            `${process.env["EXPO_PUBLIC_WOO_COMMERCE_CONSUMER_KEY"]}:${process.env["EXPO_PUBLIC_WOO_COMMERCE_CONSUMER_SECRET_KEY"]}`
          ),
      },
    }
  );

  return response;
};

export const getProductDetails = async (PRODUCT_ID: any) => {
  const response = await fetch(`${Base_URL}products/${PRODUCT_ID}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization:
        "Basic " +
        encode(
          `${process.env["EXPO_PUBLIC_WOO_COMMERCE_CONSUMER_KEY"]}:${process.env["EXPO_PUBLIC_WOO_COMMERCE_CONSUMER_SECRET_KEY"]}`
        ),
    },
  });

  return response;
};

export const getProductReviewByID = async (
  PRODUCT_ID: any,
  PER_PAGE: any,
  PAGE: any
) => {
  const response = await fetch(
    `${Base_URL}products/reviews/?product=${PRODUCT_ID}&status="approved"&per_page=${PER_PAGE}&page=${PAGE}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization:
          "Basic " +
          encode(
            `${process.env["EXPO_PUBLIC_WOO_COMMERCE_CONSUMER_KEY"]}:${process.env["EXPO_PUBLIC_WOO_COMMERCE_CONSUMER_SECRET_KEY"]}`
          ),
      },
    }
  );

  return response;
};

export const getProductsAllVariations = async (PRODUCT_ID: any) => {
  const response = await fetch(
    `${Base_URL}products/${PRODUCT_ID.toString()}/variations?per_page=100`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization:
          "Basic " +
          encode(
            `${process.env["EXPO_PUBLIC_WOO_COMMERCE_CONSUMER_KEY"]}:${process.env["EXPO_PUBLIC_WOO_COMMERCE_CONSUMER_SECRET_KEY"]}`
          ),
      },
    }
  );

  return response;
};

export const createCustomerReview = async (
  PRODUCT_ID: any,
  REVIEW: any,
  RATING: any,
  REVIEWER_NAME: any,
  REVIEWER_EMAIL: any
) => {
  const response = await fetch(`${Base_URL}products/reviews`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization:
        "Basic " +
        encode(
          `${process.env["EXPO_PUBLIC_WOO_COMMERCE_CONSUMER_KEY"]}:${process.env["EXPO_PUBLIC_WOO_COMMERCE_CONSUMER_SECRET_KEY"]}`
        ),
    },
    body: JSON.stringify({
      product_id: PRODUCT_ID,
      review: REVIEW,
      rating: RATING,
      reviewer: REVIEWER_NAME,
      reviewer_email: REVIEWER_EMAIL,
    }),
  });

  return response;
};

export const searchProducts = async (
  QUERY: any,
  PAGE: any,
  minPrice?: number,
  maxPrice?: number,
  category?: string
) => {
  let url = `${Base_URL}products?search=${QUERY}&page=${PAGE}&per_page=100&min_price=${minPrice}&max_price=${maxPrice}&category=${
    category ? category : ""
  }`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization:
        "Basic " +
        encode(
          `${process.env["EXPO_PUBLIC_WOO_COMMERCE_CONSUMER_KEY"]}:${process.env["EXPO_PUBLIC_WOO_COMMERCE_CONSUMER_SECRET_KEY"]}`
        ),
    },
  });

  return response;
};

export const stripePaymentInit = async (amount: any) => {
  var collectData = {
    amount: amount,
    currency: "EUR",
  };

  const response = await fetch(
    `${process.env["EXPO_PUBLIC_STRIPE_INTENT_URL"]}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify(collectData),
    }
  );

  return response;
};

export const updateShippingAddress = async (USER_ID: any, DATA: any) => {
  const response = await fetch(`${Base_URL}customers/${USER_ID}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization:
        "Basic " +
        encode(
          `${process.env["EXPO_PUBLIC_WOO_COMMERCE_CONSUMER_KEY"]}:${process.env["EXPO_PUBLIC_WOO_COMMERCE_CONSUMER_SECRET_KEY"]}`
        ),
    },
    body: JSON.stringify({ shipping: DATA }),
  });

  return response;
};

export const getAllShippingZones = async () => {
  const response = await fetch(`${Base_URL}shipping/zones`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization:
        "Basic " +
        encode(
          `${process.env["EXPO_PUBLIC_WOO_COMMERCE_CONSUMER_KEY"]}:${process.env["EXPO_PUBLIC_WOO_COMMERCE_CONSUMER_SECRET_KEY"]}`
        ),
    },
  });

  return response;
};

export const getUserProfile = async (USER_ID: any) => {
  const response = await fetch(`${Base_URL}customers/${USER_ID}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization:
        "Basic " +
        encode(
          `${process.env["EXPO_PUBLIC_WOO_COMMERCE_CONSUMER_KEY"]}:${process.env["EXPO_PUBLIC_WOO_COMMERCE_CONSUMER_SECRET_KEY"]}`
        ),
    },
  });

  return response;
};

export const updateUserProfile = async (
  USER_ID: any,
  FIRST_NAME: any,
  LAST_NAME: any,
  EMAIL: any
) => {
  const response = await fetch(`${Base_URL}customers/${USER_ID}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization:
        "Basic " +
        encode(
          `${process.env["EXPO_PUBLIC_WOO_COMMERCE_CONSUMER_KEY"]}:${process.env["EXPO_PUBLIC_WOO_COMMERCE_CONSUMER_SECRET_KEY"]}`
        ),
    },
    body: JSON.stringify({
      first_name: FIRST_NAME,
      last_name: LAST_NAME,
      email: EMAIL,
    }),
  });

  return response;
};

export const fetchShippingMethods = async (ZONE_ID: any) => {
  const response = await fetch(`${Base_URL}shipping/zones/${ZONE_ID}/methods`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization:
        "Basic " +
        encode(
          `${process.env["EXPO_PUBLIC_WOO_COMMERCE_CONSUMER_KEY"]}:${process.env["EXPO_PUBLIC_WOO_COMMERCE_CONSUMER_SECRET_KEY"]}`
        ),
    },
  });

  return response;
};

export const createNewOrder = async (
  customer_id: any,
  billing: any,
  shipping: any,
  line_items: any,
  shipping_lines: any
) => {
  const response = await fetch(`${Base_URL}orders`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization:
        "Basic " +
        encode(
          `${process.env["EXPO_PUBLIC_WOO_COMMERCE_CONSUMER_KEY"]}:${process.env["EXPO_PUBLIC_WOO_COMMERCE_CONSUMER_SECRET_KEY"]}`
        ),
    },
    body: JSON.stringify({
      customer_id: customer_id,
      payment_method: "bacs",
      payment_method_title: "Direct Bank Transfer",
      set_paid: true,
      billing: billing,
      shipping: shipping,
      line_items: line_items,
      shipping_lines: shipping_lines,
    }),
  });

  return response;
};

export const getAllOrders = async (USER_ID: any) => {
  const response = await fetch(
    `${Base_URL}orders?customer=${USER_ID}&per_page=100`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization:
          "Basic " +
          encode(
            `${process.env["EXPO_PUBLIC_WOO_COMMERCE_CONSUMER_KEY"]}:${process.env["EXPO_PUBLIC_WOO_COMMERCE_CONSUMER_SECRET_KEY"]}`
          ),
      },
    }
  );

  return response;
};

export const forgotPassword = async (email: any) => {
  const response = await fetch(`${Base_URL_FORGOT_PASSWORD}reset-password`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      email: email,
    }),
  });

  return response;
};

export const validateVerificationCode = async (email: any, code: any) => {
  const response = await fetch(`${Base_URL_FORGOT_PASSWORD}validate-code`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      code: code,
    }),
  });

  return response;
};

export const createUserNewPassword = async (
  email: any,
  code: any,
  password: any
) => {
  const response = await fetch(`${Base_URL_FORGOT_PASSWORD}set-password`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      code: code,
      password: password,
    }),
  });

  return response;
};

export const deleteUserNotificationToken = async (USER_ID: any) => {
  const response = await fetch(
    `${Base_URL_CUSTOM}delete-notification-token/${USER_ID}`,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({}),
    }
  );

  return response;
};
