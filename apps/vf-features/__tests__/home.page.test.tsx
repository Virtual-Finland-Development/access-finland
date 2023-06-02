import HomePage from '@pages/index.page';
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
      name: /the only service you need for moving into Finland/i,
    });

    expect(heading).toBeInTheDocument();
  });
});
