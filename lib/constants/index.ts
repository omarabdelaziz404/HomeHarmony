export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Homeharmony";

export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  "**Home Harmony** is an innovative platform that transforms home design by seamlessly integrating interior design services with furniture sales. It offers a user-friendly space for homeowners, designers, and furniture sellers to collaborate, featuring a dynamic project dashboard, designer portfolios, and a furniture comparison tool. By bridging technology with home aesthetics, Home Harmony simplifies the design process, enhances user experience, and creates a seamless marketplace for stylish and functional living spaces.";

export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

export const LATEST_PROFUCTS_LIMIT =
  Number(process.env.LATEST_PROFUCTS_LIMIT) || 9;

export const signInDefaultValues = {
  email: "",
  password: "",
};

export const signUpDefaultValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};
export const shippingAddressDefaultValues = {
  fullName: "",
  streetAddress: "",
  city: "",
  postalCode: "",
  country: "",
};

export const PAYMENT_METHODS = process.env.PAYMENT_METHODS
  ? process.env.PAYMENT_METHODS.split(", ")
  : ["PayPal", "Stripe", "CashOnDelivery"];
export const DEFAULT_PAYMENT_METHOD =
  process.env.DEFAULT_PAYMENT_METHOD || "PayPal";

  export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 5;
  export const SENDER_EMAIL = process.env.SENDER_EMAIL || 'onboarding@resend.dev';

  export const productDefaultValues = {
    name: '',
    slug: '',
    category: '',
    images: [],
    brand: '',
    description: '',
    price: '0',
    stock: 0,
    rating: '0',
    numReviews: '0',
    isFeatured: false,
    banner: null,
  };
export const USER_ROLES = process.env.USER_ROLES
  ? process.env.USER_ROLES.split(', ')
  : ['admin', 'user', 'designer', 'seller'];
