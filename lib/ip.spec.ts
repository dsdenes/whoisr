import { mergeIPRanges } from './ip'
const range1 = '127.0.0.1-127.0.0.2'
const range2 = '127.0.0.3-127.0.0.4'
const range3 = '127.0.0.1-127.0.0.4'
const range4 = '127.0.0.2-127.0.0.4'
const range5 = '127.0.0.4-127.0.0.5'

describe('mergeRanges', () => {
  it('should return empty range', () => {
    expect(mergeIPRanges([])).toEqual([])
  })
  it('should return one range if one range is given', () => {
    expect(mergeIPRanges([range1])).toEqual([range1])
  })
  it('should dedupe same ranges', () => {
    expect(mergeIPRanges([range1, range1])).toEqual([range1])
    expect(mergeIPRanges([range1, range1, range1])).toEqual([range1])
    expect(mergeIPRanges([range1, range1, range5])).toEqual([range1, range5])
  })
  it('should return two ranges if there is no overlap', () => {
    expect(mergeIPRanges([range1, range5])).toEqual([range1, range5])
  })
  it('should return with bigger range if one of the ranges contains the other', () => {
    expect(mergeIPRanges([range1, range3])).toEqual([range3])
    expect(mergeIPRanges([range3, range1])).toEqual([range3])
    expect(mergeIPRanges([range1, range2, range3])).toEqual([range3])
    expect(mergeIPRanges([range3, range2, range1])).toEqual([range3])
  })
  it('should return with a new range if there is a partly overlap', () => {
    expect(mergeIPRanges([range1, range4])).toEqual([range3])
    expect(mergeIPRanges([range1, range2, range4])).toEqual([range3])
  })
  it('should return with a new range if ranges are next to each other', () => {
    expect(mergeIPRanges([range1, range2])).toEqual([range3])
  })
})
