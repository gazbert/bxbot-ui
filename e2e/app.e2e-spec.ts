describe('BX-bot Admin E2E Tests', function () {

  let expectedMsg = 'BX-bot Admin Console';

  beforeEach(function () {
    browser.get('');
  });

  it('should display: ' + expectedMsg, function () {
    expect(element(by.css('h1')).getText()).toEqual(expectedMsg);
  });

});
