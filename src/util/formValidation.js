import * as yup from "yup";
import concessions from "../constants/concessionCards.js";

const today = new Date();
today.setHours(0, 0, 0, 0);

const eighteenCheck = new Date();
eighteenCheck.setFullYear(eighteenCheck.getFullYear() - 18);

export const addressValidationSchema = yup.object({
  site_street_no: yup.string().required("*required field"),
  site_street_name: yup.string().required("*required field"),
  site_street_type_code: yup.string().matches().required("*required field"),
  site_suburb: yup.string().required("*required field"),
  site_state: yup.string().required("*required field"),
  site_post_code: yup
    .string()
    .matches(/^\d{4}$/, "Invalid postcode")
    .required("*required field"),
});

const password = yup.object({
  password: yup
    .string("Enter your password")
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase and One Number",
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

const name = yup.object({
  title: yup.string().required("Title is required"),
  given_name: yup
    .string()
    .matches(/^[A-Za-z \-']*$/, "Please enter valid name")
    .max(40)
    .required("A given name is required"),
  family_name: yup
    .string()
    .matches(/^[A-Za-z \-']*$/, "Please enter valid name")
    .max(40)
    .required("A surname is required"),
});

const account_number = yup.object({
  account_number: yup
    .string("Enter your account number")
    .required("Account number is required")
    .matches(/\d{7}/, "Must be a valid account number."),
});

const email = yup.object({
  email: yup
    .string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required")
    .notOneOf(
      [yup.ref("excludeEmail")],
      "Primary and secondary contacts must use different email addresses",
    ),
});

const phone = yup.object({
  phone: yup
    .string()
    .matches(
      /^\({0,1}((0|\+61)(2|4|3|7|8)){0,1}\){0,1}( |-){0,1}[0-9]{2}( |-){0,1}[0-9]{2}( |-){0,1}[0-9]{1}( |-){0,1}[0-9]{3}$/,
      "Must be a valid Australian phone number with area code +61",
    )
    .required("A phone number is required"),
});

const dob = yup.object({
  dob: yup
    .date()
    .nullable()
    .required("Please enter your DOB")
    .typeError("Invalid date. Must be in format dd/mm/yyyy")
    .max(eighteenCheck, "You must be 18 years or older"),
});

const identification = yup.object({
  idType: yup.string().required("Identity Type is required"),
  idNumber: yup
    .string()
    .when("idType", {
      is: "Drivers Licence",
      then: (schema) =>
        schema
          .required("Drivers Licence number is required")
          .matches(
            /^[a-zA-Z0-9]{6,12}$/,
            "Licence Number must be at least 6 alphanumeric characters.",
          ),
    })
    .when("idType", {
      is: "Passport",
      then: (schema) =>
        schema
          .required("Passport number is required")
          .matches(
            /^[A-Za-z0-9]{8,12}$/,
            "Passport Number must must be at least 8 Alphanumeric characters.",
          ),
    })
    .when("idType", {
      is: "Medicare",
      then: (schema) =>
        schema
          .required("Medicare Number is required")
          .matches(/^[2-6]{1}[0-9]{10}$/, "Invalid Medicare number"),
    }),
  idExpiry: yup.date().when("idType", {
    is: (value) => value !== "Medicare",
    then: (schema) =>
      schema
        .nullable()
        .typeError("Invalid date. Must be in format dd/mm/yyyy")
        .required("ID expiry date is required")
        .min(today, "Date cannot be in the past."),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export const businessDetailsValidationSchema = yup.object({
  business_name: yup.string().required("Business name is required"),
  abn_number: yup
    .string()
    .required("ABN number is required")
    .matches(/^(\d *?){11}$/, "Invalid ABN number"),
});

export const winbackValidationSchema = email.concat(account_number);

export const userValidationSchema = name.concat(phone);
export const signUpValidationSchema = userValidationSchema
  .concat(email)
  .concat(password);
export const contactValidationSchema = name
  .concat(dob)
  .concat(phone)
  .concat(email);
export const contactValidationSchemaWithID =
  contactValidationSchema.concat(identification);

export const paymentValidationSchema = yup.object({
  method: yup.string().required("Payment method is required"),
  bsb: yup.string().when("method", {
    is: "DIRECT",
    then: (schema) =>
      schema
        .required("BSB is required")
        .matches(/^[0-9]{3}[--]?[0-9]{3}$/, "BSB must contain 6 digits only"),
    otherwise: (schema) => schema.notRequired(),
  }),
  account: yup.string().when("method", {
    is: "DIRECT",
    then: (schema) =>
      schema
        .required("Account number is required")
        .min(6, "Account number must be at least 6 digits")
        .max(9, "Account number must be no more than 9 digits"),
    otherwise: (schema) => schema.notRequired(),
  }),
  accountName: yup.string().when("method", {
    is: "DIRECT",
    then: (schema) => schema.required("Account name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export const moveInValidationSchema = yup.object({
  flag: yup.string().required(),
  date: yup.date().when("flag", {
    is: "true",
    then: (schema) =>
      schema
        .required("Move in date is required")
        .min(today, "Date cannot be in the past."),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export const concessionValidationSchema = yup.object({
  flag: yup.string().required(),
  // name: yup.string().when("flag", {
  //   is: "true",
  //   then: (schema) =>
  //     schema
  //       .required("A name is required")
  //       .matches(/^[A-Za-z \-']*$/, "Please enter valid name"),
  //   otherwise: (schema) => schema.notRequired(),
  // }),
  // type: yup.string().when("flag", {
  //   is: "true",
  //   then: (schema) => schema.required("Concession card type is required"),
  //   otherwise: (schema) => schema.notRequired(),
  // }),
  // number: yup.string().when("flag", {
  //   is: "true",
  //   then: (schema) =>
  //     schema
  //       .required("A concession card number is requred")
  //       .when("type", {
  //         is: (value) => concessions[value] == 1,
  //         then: (schema) =>
  //           schema.matches(/^[0-9]{9}[A-Za-z]{1}$/gm, {
  //             message: "Invalid concession card number",
  //           }),
  //       })
  //       .when("type", {
  //         is: (value) => concessions[value] == 2,
  //         then: (schema) =>
  //           schema
  //             .matches(/^[NVQWST]{1}[0-9A-Za-z]{3}[0-9]{4}[A-Za-z]?$/gm, {
  //               message: "Invalid concession card number",
  //             })
  //             .matches(/^[A-Za-z0-9]{2,9}$/gm, {
  //               message: "Invalid concession card number",
  //             }),
  //       })
  //       .when("type", {
  //         is: (value) => concessions[value] == 3,
  //         then: (schema) =>
  //           schema.matches(/^[NVQWST]{1}[A-Za-z]{0,3}[0-9]{1,6}[A-Za-z]?$/gm, {
  //             message: "Invalid concession card number",
  //           }),
  //       }),
  //   otherwise: (schema) => schema.notRequired(),
  // }),
  // expiryDate: yup
  //   .date()
  //   .nullable()
  //   .when("flag", {
  //     is: "true",
  //     then: (schema) =>
  //       schema
  //         .required("Expiry date is required")
  //         .min(today, "Date cannot be in the past."),
  //     otherwise: (schema) => schema.notRequired(),
  //   }),
});

export const lifeSupportValidationSchema = yup.object({
  flag: yup.string().required(),
  machineType: yup.string().when("flag", {
    is: "true",
    then: (schema) =>
      schema.required("Life support equipment type is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  notes: yup.string().when("machineType", {
    is: "OTHER",
    then: (schema) => schema.required("Please provide additional details"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export const enquiryValidationSchema = yup.object({
  name: yup
    .string()
    .matches(/^[A-Za-z \-']*$/, "Please enter valid name")
    .required("A name is required"),
  phone: yup
    .string()
    .matches(
      /^\({0,1}((0|\+61)(2|4|3|7|8)){0,1}\){0,1}( |-){0,1}[0-9]{2}( |-){0,1}[0-9]{2}( |-){0,1}[0-9]{1}( |-){0,1}[0-9]{3}$/,
      "Must be a valid Australian phone number",
    )
    .required("A phone number is required"),
  email: yup
    .string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required"),
  postcode: yup
    .string()
    .nullable()
    .matches(/^\d{4}$/, {
      message: "Must be a valid Australian postcode",
      excludeEmptyString: true,
    }),
});

export const resetPasswordValidationSchema = password.concat(
  yup.object({
    verificationCode: yup
      .string("Enter your verification code")
      .required("Verification code is required"),
  }),
);
