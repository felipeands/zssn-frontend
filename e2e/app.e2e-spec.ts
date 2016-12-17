import { ZssnPage } from './app.po';

describe('zssn App', function() {
  let page: ZssnPage;

  beforeEach(() => {
    page = new ZssnPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
