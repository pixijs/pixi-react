import * as index from '../src'

describe('index', () => {
  test('export modules', () => {
    expect(index).toMatchSnapshot()
  })
})
