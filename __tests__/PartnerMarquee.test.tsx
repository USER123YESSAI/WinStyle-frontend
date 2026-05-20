import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('next/image', () => {
  const MockedImage = ({ alt, ...props }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} {...props} />
  );
  MockedImage.displayName = 'MockedImage';
  return MockedImage;
});

import PartnerMarquee from '@/components/ui/PartnerMarquee';

describe('PartnerMarquee', () => {
  it('renders partner logos with alt text (duplicated list)', () => {
    const partenaires = [
      { nom: 'RASMA', logo: '/images/partenaires/partenaire2.png' },
      { nom: 'Partenaire 3', logo: '/images/partenaires/partenaire3.png' },
    ];

    render(<PartnerMarquee partenaires={partenaires} />);

    // la liste est doublée -> on peut juste vérifier que le alt existe
    expect(screen.getAllByAltText('RASMA').length).toBeGreaterThan(0);
    expect(screen.getAllByAltText('Partenaire 3').length).toBeGreaterThan(0);
  });
});

