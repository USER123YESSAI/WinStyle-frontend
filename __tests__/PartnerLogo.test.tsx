import { render, screen } from '@testing-library/react';
import PartnerLogo from '@/components/ui/PartnerLogo';

describe('PartnerLogo', () => {
  it('renders the partner logo with the correct alt text', () => {
    render(<PartnerLogo nom="Win's Agency" logo="/images/partenaires/partenaire2.png" />);

    const logoImage = screen.getByAltText("Win's Agency");
    expect(logoImage).toBeInTheDocument();
  });
});
