import HomePage from '@mvp/pages/index.page';
import {
  act,
  renderWithProviders,
  screen,
} from '@/lib/testing/utils/testing-library-utils';

describe('Home page', () => {
  it('renders a heading', async () => {
    await act(async () => {
      renderWithProviders(<HomePage />);
    });

    const heading = screen.getByRole('heading', {
      name: /first point of contact with finland/i,
    });

    expect(heading).toBeInTheDocument();
  });
});
