import { isSinunaDisabled } from '@mvp/lib/shared/sinuna-status';

describe('isSinunaDisabled', () => {
  it('returns true if the current date is after 28th of February, 2024', () => {
    const currentDate = new Date(2024, 1, 29); // 29th of February, 2024
    expect(isSinunaDisabled(currentDate)).toBe(true);
  });

  it('returns true if the current date is on 28th of February, 2024', () => {
    const currentDate = new Date(2024, 1, 28); // 28th of February, 2024
    expect(isSinunaDisabled(currentDate)).toBe(true);
  });

  it('returns false if the current date is before 28th of February, 2024', () => {
    const currentDate = new Date(2024, 1, 27); // 27th of February, 2024
    expect(isSinunaDisabled(currentDate)).toBe(false);
  });
});
