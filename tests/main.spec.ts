describe('TODO', () => {
  jest.useFakeTimers();

  beforeAll(() => {
    jest.runOnlyPendingTimers();
  });

  it('assert true', () => {
    expect(true).toBeTruthy();
  });
});
