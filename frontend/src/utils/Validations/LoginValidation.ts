// utils/validation/signupValidation.ts
import { checkEmailExists } from "../../services/authService";

export interface LoginFormValues {
    email: string;
    password: string;
}

export interface ValidationResult {
    isValid: boolean;
    errors: Partial<Record<keyof LoginFormValues, string>>; // Partial allows for some keys to be missing
}

// Async function to validate if the email exists in the database
export async function validateEmailExsistance(email: string): Promise<string | null> {
    email = email.trim();
    if (!email) {
        return "Email is required.";
    }

   try {
        const exists = await checkEmailExists(email);
        if (!exists) {
            return "Email does not exsist.";
        }
        return null;
   } catch {
        return "Error checking email existence.";
   }
}

//Async function to validate the username field in the signup form
export function validatePasswordExsistance(password: string, email: string): string | null {
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
    const emailError = await validateEmailExsistance(form.email);
    if (emailError) {
        errors.email = emailError;
        isValid = false;
    }

    //Password validation
    const passwordError = validatePasswordExsistance(form.password, form.email);
    if (passwordError) {
        errors.password = passwordError;
        isValid = false;

    }

    return {isValid, errors};
};
