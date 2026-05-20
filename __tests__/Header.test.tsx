import React from 'react';
import { render, screen } from '@testing-library/react';

// Header dépend de next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

// next/link -> simple anchor
jest.mock('next/link', () => {
  const MockLink = ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  );

  MockLink.displayName = 'MockLink';

  return MockLink;
});

import Header from '@/components/ui/Header';

describe('Header', () => {
  it('renders main navigation and CTA', () => {
    render(<Header />);

    expect(screen.getAllByText('Accueil').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Services').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Espace Win').length).toBeGreaterThan(0);
  });
});

