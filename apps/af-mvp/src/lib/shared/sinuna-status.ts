import { isAfter, isSameDay } from 'date-fns';

// Sinuna auth disabled on 28th of February, 2024
// The date was mentioned here: https://www.tivi.fi/uutiset/gdpr-huoliin-ratkaisua-luvannut-kotimainen-kirjautumispalvelu-lakkautetaan/4a022e33-1e9a-4d2d-bad3-a41df6d67e5c
export function isSinunaDisabled(date?: Date | undefined) {
  const currentDate = date || new Date();
  const targetDate = new Date(Date.UTC(2024, 1, 28, 2)); // 28th of February, 2024 in Finnish time (UTC+2)
  // Convert current UTC date to Finnish time (UTC+2)
  const finnishDate = new Date(
    currentDate.getUTCFullYear(),
    currentDate.getUTCMonth(),
    currentDate.getUTCDate(),
    currentDate.getUTCHours() + 2
  );
  return isSameDay(finnishDate, targetDate) || isAfter(finnishDate, targetDate);
}
