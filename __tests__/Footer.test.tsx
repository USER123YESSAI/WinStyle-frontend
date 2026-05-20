import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

jest.mock('next/link', () => {
  const MockLink = ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

import Footer from '@/components/ui/Footer';

describe('Footer', () => {
  it('renders footer sections and links', () => {
    render(<Footer />);

    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText('Navigation')).toBeInTheDocument();
    expect(screen.getByText('WIN\'S')).toBeInTheDocument();

    // un lien de services (depuis SERVICES constante)
    expect(screen.getByText('Confection sur Mesure')).toBeInTheDocument();
  });
});

