describe('Unit Test Example', () => {
  it('should demonstrate a passing unit test', () => {
    const sum = (a: number, b: number) => a + b;
    expect(sum(2, 3)).toBe(5);
  });

  it('should handle edge cases', () => {
    const sum = (a: number, b: number) => a + b;
    expect(sum(0, 0)).toBe(0);
    expect(sum(-1, 1)).toBe(0);
  });
});
