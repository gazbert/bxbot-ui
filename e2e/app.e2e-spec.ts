
describe('QuickStart E2E Tests', function () {

  let expectedMsg = 'BX-Bot UI';


  beforeEach(function () {
    browser.get('');
  });

  it('should display: ' + expectedMsg, function () {
    expect(element(by.css('h1')).getText()).toEqual(expectedMsg);
  });

});
