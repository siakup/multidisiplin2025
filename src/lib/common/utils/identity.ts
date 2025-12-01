const normalize = (value?: string | null) =>
  value ? value.trim().toLowerCase() : '';

const normalizeRoleSeparators = (value?: string | null) =>
  value ? value.trim().toLowerCase().replace(/[\s_-]+/g, ' ') : '';

export const normalizeRoleValue = (value?: string | null) =>
  normalizeRoleSeparators(value);

export const normalizeUsernameValue = (value?: string | null) => normalize(value);

export const isRoleAllowed = (roleValue: string | null, allowedRoles: string[] = []) => {
  if (!allowedRoles.length) return true;
  const normalizedRole = normalizeRoleValue(roleValue);
  return allowedRoles.some((role) => normalizeRoleValue(role) === normalizedRole);
};

export const isUsernameAllowed = (usernameValue: string | null, allowedUsernames: string[] = []) => {
  if (!allowedUsernames.length) return true;
  const normalizedUsername = normalizeUsernameValue(usernameValue);
  return allowedUsernames.some((username) => normalize(username) === normalizedUsername);
};


