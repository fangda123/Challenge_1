import { render, screen } from '@testing-library/react';
import UsersTable from '../src/components/UsersTable';
test('renders search input and table', () => {
  render(<UsersTable />);
  expect(screen.getByPlaceholderText(/ค้นหา/)).toBeTruthy();
});
