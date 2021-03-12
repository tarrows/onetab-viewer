import { divide } from './divide'

describe('divide', () => {
  it('splits array into arrays which has n elements', () => {
    const a = [1, 2, 3, 4, 5]
    const expected = [[1, 2, 3], [4, 5]]
    const actual = divide(a, 3)
    expect(actual).toEqual(expected)
  })
})
