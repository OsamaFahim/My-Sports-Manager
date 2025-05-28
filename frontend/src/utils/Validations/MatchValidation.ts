export interface MatchFormValues {
  teamA: string;
  teamB: string;
  ground: string;
  date: string;
  time: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof MatchFormValues, string>>;
}

export function validateTeams(teamA: string, teamB: string): string | null {
  if (!teamA || !teamB) return "Both teams are required.";
  if (teamA === teamB) return "A team cannot play against itself.";
  return null;
}

export function validateGround(ground: string): string | null {
  if (!ground) return "Ground is required.";
  return null;
}

export function validateDate(date: string): string | null {
  if (!date) return "Date is required.";
  // check for past date
  if (new Date(date) < new Date(new Date().toDateString())) {
    return "Date cannot be in the past.";
  }
  return null;
}

export function validateTime(time: string): string | null {
  if (!time) return "Time is required.";
  return null;
}

export const validateMatchForm = (form: MatchFormValues): ValidationResult => {
  const errors: Partial<Record<keyof MatchFormValues, string>> = {};
  let isValid = true;

  const teamsError = validateTeams(form.teamA, form.teamB);
  if (teamsError) {
    errors.teamA = teamsError;
    errors.teamB = teamsError;
    isValid = false;
  }

  const groundError = validateGround(form.ground);
  if (groundError) {
    errors.ground = groundError;
    isValid = false;
  }

  const dateError = validateDate(form.date);
  if (dateError) {
    errors.date = dateError;
    isValid = false;
  }

  const timeError = validateTime(form.time);
  if (timeError) {
    errors.time = timeError;
    isValid = false;
  }

  return { isValid, errors };
};