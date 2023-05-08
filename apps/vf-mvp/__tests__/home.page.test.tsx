import HomePage from '@pages/index.page';
import {
  renderWithProviders,
  screen,
} from '@/lib/testing/utils/testing-library-utils';

describe('Home page', () => {
  it('renders a heading', () => {
    renderWithProviders(<HomePage />);

    const heading = screen.getByRole('heading', {
      name: /the only service you need for moving into Finland/i,
    });

    expect(heading).toBeInTheDocument();
  });
});
