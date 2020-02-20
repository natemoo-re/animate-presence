import { newE2EPage } from '@stencil/core/testing';

describe('shadow-root', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<shadow-root></shadow-root>');
    const element = await page.find('shadow-root');
    expect(element).toHaveClass('hydrated');
  });{cursor}
});
