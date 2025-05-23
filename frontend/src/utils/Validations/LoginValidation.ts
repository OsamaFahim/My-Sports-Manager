// utils/validation/LoginValidation.ts

export interface LoginFormValues {
    username: string;
    password: string;
}

export interface ValidationResult {
    isValid: boolean;
    errors: Partial<Record<keyof LoginFormValues, string>>; // Partial allows for some keys to be missing
}

// Async function to validate if the username exists in the database
export async function validateUsernameExsistance(username: string): Promise<string | null> {
    username = username.trim();
    if (!username) {
        return "Username is required.";
    }

    return null;
}

//Async function to validate the username field in the signup form
export async function validatePasswordExsistance(password: string): Promise<string | null> {
    password = password.trim();
    if (!password) {
        return "Paswword is required.";
    }

    return null;
}

export const validateLoginForm = async (form: LoginFormValues): Promise<ValidationResult> => {
    const errors: Partial<Record<keyof LoginFormValues, string>> = {};

    let isValid: boolean = true;

    //Email validation
    const usernameError = await validateUsernameExsistance(form.username);
    if (usernameError) {
        errors.username = usernameError;
        isValid = false;
    }

    //Password validation
    const passwordError = await validatePasswordExsistance(form.password);
    if (passwordError) {
        errors.password = passwordError;
        isValid = false;

    }

    return {isValid, errors};
};
