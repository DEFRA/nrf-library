import { formatDate } from './index.js'

describe('#formatDate', () => {
  beforeAll(() => {
    vi.useFakeTimers({
      now: new Date('2023-02-01')
    })
  })

  afterAll(() => {
    vi.useRealTimers()
  })

  describe('With defaults', () => {
    it('should format an ISO date string as expected', () => {
      expect(formatDate('2023-02-01T11:40:02.242Z')).toBe(
        'Wed 1st February 2023'
      )
    })
  })

  describe('With a Date object', () => {
    it('should format the date as expected', () => {
      expect(formatDate(new Date())).toBe('Wed 1st February 2023')
    })
  })

  describe('With a format attribute', () => {
    it('should use the provided format', () => {
      expect(
        formatDate(
          '2023-02-01T11:40:02.242Z',
          "h:mm aaa 'on' EEEE do MMMM yyyy"
        )
      ).toBe('11:40 am on Wednesday 1st February 2023')
    })
  })
})
