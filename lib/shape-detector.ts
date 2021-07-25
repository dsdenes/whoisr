export function shapeDetector() {
  const result: {
    [key: string]: any
  } = {}
  const freq: {
    [key: string]: number
  } = {}
  let linesCount = 0

  function addRecord(data: any) {
    linesCount++
    Object.keys(data).forEach((key) => {
      if (freq[key] === undefined) {
        freq[key] = 1
      } else {
        freq[key]++
      }
      result[key] = freq[key] / linesCount
    })
  }

  function printResult() {
    const typeString = `
export interface Record {
  ${Object.keys(result)
    .map((key) => {
      if (Math.round(result[key] * 100) < 5) {
        return ''
      }
      return `"${key}"${result[key] !== 1 ? '?' : ''}: string // ${Math.round(result[key] * 100)}%`
    })
    .join(`\n  `)}
}
`
    console.log(typeString)
  }

  return {
    addRecord,
    printResult
  }
}
