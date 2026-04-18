describe('Integration Test Example', () => {
  describe('Service integration', () => {
    it('should perform a multi-step operation', () => {
      const data = { name: 'Test' };
      const processed = { ...data, processed: true };
      const validated = { ...processed, valid: true };

      expect(validated).toEqual({
        name: 'Test',
        processed: true,
        valid: true
      });
    });

    it('should handle async operations', async () => {
      const mockFetch = jest.fn()
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ id: 1 }) });

      const result = await mockFetch();
      expect(result.ok).toBe(true);
    });
  });
});
