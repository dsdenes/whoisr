// @ts-ignore
import ipToInt from 'ip-to-int'
type IPRange = [number, number]

const intersection = (arr: any[], ...args: any) =>
  arr.filter((item) => args.every((arr: any) => arr.includes(item)))

export function mergeIPRanges(ranges: string[]): string[] {
  const ipRanges: IPRange[] = ranges.map(ipRangeStringToIpRange)
  for (let i = 0; i < ipRanges.length; i++) {
    for (let j = 0; j < ipRanges.length; j++) {
      if (ipRanges[i][0] <= ipRanges[j][0] && ipRanges[i][1] >= ipRanges[j][1] && i !== j) {
        const ipRangeStrings = [...ipRanges.slice(0, j), ...ipRanges.slice(j + 1)].map(
          ipRangeToIpRangeString
        )
        return mergeIPRanges(ipRangeStrings)
      }
      if (ipRanges[i][0] < ipRanges[j][0] && ipRanges[i][1] >= ipRanges[j][0] - 1 && i !== j) {
        const withoutFirstRange = [...ipRanges.slice(0, i), ...ipRanges.slice(i + 1)]
        const withoutSecondRange = [...ipRanges.slice(0, j), ...ipRanges.slice(j + 1)]
        const newRange = [ipRanges[i][0], ipRanges[j][1]]
        const ipRangeStrings = [
          ...intersection(withoutFirstRange, withoutSecondRange),
          newRange
        ].map(ipRangeToIpRangeString)
        return mergeIPRanges(ipRangeStrings)
      }
    }
  }
  return ranges
}

export function isSubnetOf(parentRangeString: string, subRangeString: string) {
  const parentIpRange = ipRangeStringToIpRange(parentRangeString)
  const subIpRange = ipRangeStringToIpRange(subRangeString)
}

export function ipRangeToIpRangeString(ipRange: IPRange): string {
  return `${ipToInt(ipRange[0]).toIP()}-${ipToInt(ipRange[1]).toIP()}`
}

export function ipRangeStringToIpRange(IPRangeString: string): IPRange {
  const [startIP, endIP] = IPRangeString.split('-')
  return [ipToInt(startIP).toInt(), ipToInt(endIP).toInt()]
}
