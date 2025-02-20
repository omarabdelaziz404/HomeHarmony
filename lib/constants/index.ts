export const APP_NAME = 
process.env.NEXT_PUBLIC_APP_NAME || "Homeharmony";

export const APP_DESCRIPTION = 
process.env.NEXT_PUBLIC_APP_DESCRIPTION || "**Home Harmony** is an innovative platform that transforms home design by seamlessly integrating interior design services with furniture sales. It offers a user-friendly space for homeowners, designers, and furniture sellers to collaborate, featuring a dynamic project dashboard, designer portfolios, and a furniture comparison tool. By bridging technology with home aesthetics, Home Harmony simplifies the design process, enhances user experience, and creates a seamless marketplace for stylish and functional living spaces.";

export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';

export const LATEST_PROFUCTS_LIMIT = Number(process.env.LATEST_PROFUCTS_LIMIT) || 9;

export const signInDefaultValues = {
    email:'',
    password:'',
};

export const signUpDefaultValues = {
    name:'',
    email:'',
    password:'',
    confirmPassword: '',
};
export const shippingAddressDefaultValues = {
    fullName: '',
    streetAddress: '',
    city: '',
    postalCode: '',
    country: '',
  };