describe('Simple Test Suite', () => {
  it('should work', () => {
    expect(1 + 1).toBe(2)
  })

  it('should handle basic math', () => {
    expect(5 * 3).toBe(15)
  })

  it('should handle strings', () => {
    expect('hello' + ' world').toBe('hello world')
  })
})
