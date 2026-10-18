// Matches the API's Bangladeshi mobile validation; used for instant browser feedback.
// Accepts 01XXXXXXXXX, optionally with +88/88, with spaces or dashes anywhere between digits.
// Written without character classes containing "-" so it is valid in the "v" regex mode
// browsers use for the HTML pattern attribute.
export const BD_PHONE_PATTERN = String.raw`\s*(\+?88)?(\s|-)*0(\s|-)*1(\s|-)*[3-9]((\s|-)*\d){8}\s*`;
export const BD_PHONE_HINT = "Bangladeshi mobile number, e.g. 01712345678";
