// utils/validation/signupValidation.ts
export interface SignupFormValues {
    username: string;
    email: string;
    password: string;
    confirm_password: string;
}

export interface ValidationResult {
    isValid: boolean;
    errors: Partial<Record<keyof SignupFormValues, string>>; // Partial allows for some keys to be missing
}

//Function to validate the username field in the signup form
// This function checks if the username is empty, less than 5 characters, or more than 20 characters
// and returns an error message if any of these conditions are met. Otherwise, it returns null.
export function validateUsername(username: string): string | null {
    //Prepared statement must be used when quering username from database to avoid SQL injection
    username = username.trim();
    if (!username) {
        return "Username is required.";
    }

    if (username.length < 5) {
        return "Username must be at least 5 characters long.";
    }

    if (username.length > 20) {
        return "Username cannot exceed 20 characters.";
    }

    return null;
}

//Function to validate the email field in the signup form
// This function checks if the email is empty or does not match the regex pattern for a valid email format
// and returns an error message if any of these conditions are met. Otherwise, it returns null.
// The regex pattern checks for a valid email format with alphanumeric characters, dots, underscores, and hyphens
// before the '@' symbol, followed by a domain name and a top-level domain (TLD) of at least 2 characters.
// THE TLD MUST BE AT LEAST 2 CHARACTERS LONG
// and can contain letters only. The domain name can contain alphanumeric characters and hyphens.
// The '@' symbol is mandatory and must be followed by a domain name and a TLD.
export function validateEmail(email: string): string | null {
    email = email.trim();
    if (!email) {
        return "Email is required.";
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
        return "Invalid email format.";
    }

    return null;
}

//Function to validate the password field in the signup form
// This function checks if the password is empty, less than 8 characters, or does not match the regex pattern for a valid password format
// and returns an error message if any of these conditions are met. Otherwise, it returns null.
// The regex pattern checks for a password that contains at least one uppercase letter, one lowercase letter, one number, and one special character
// and is at least 8 characters long. The special characters allowed are: @$!%*?&.
export function validatePassword(password: string): string | null {
    password = password.trim();
    if (!password) {
        return "Paswword is required.";
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        return "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
    }

    return null;
}

export function validateconfirmPassword(password: string, confirm_password: string): string | null {
    confirm_password = confirm_password.trim();
    if (!confirm_password) {
        return "Confirm password is required.";
    }

    if (password !== confirm_password) {
        return "Passwords do not match.";
    }

    return null;
}

export const validateSignupForm = (form: SignupFormValues): ValidationResult => {
    const errors: Partial<Record<keyof SignupFormValues, string>> = {};

    let isValid: boolean = true;
    //Username validation
    const usernameError = validateUsername(form.username);
    if (usernameError) {
        errors.username = usernameError;
        isValid = false;
    }

    //Email validation
    const emailError = validateEmail(form.email);
    if (emailError) {
        errors.email = emailError;
        isValid = false;
    }

    //Password validation
    const passwordError = validatePassword(form.password);
    if (passwordError) {
        errors.password = passwordError;
        isValid = false;

    }

    //Confirm password validation
    const confirm_passwordError = validateconfirmPassword(form.password, form.confirm_password);
    if (confirm_passwordError) {
        errors.confirm_password = confirm_passwordError;
        isValid = false;
    }

    return {isValid, errors};
};
