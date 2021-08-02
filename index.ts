// @ts-ignore
import WhoisParser from 'bulk-whois-parser'
import { shapeDetector } from './lib/shape-detector'
import { inetnumStats, parseInetnum } from './modules/ripe/parsers/inetnum'
import { Record } from './types/record.type'

// const pool = new Pool({
//   connectionString: 'postgresql://shoprice:shoprice@localhost:5432/shoprice',
//   max: 20
// })

// const conn = pool.connect()

interface Organisation {
  startIp?: string
  orgName?: string | null
  country?: string
  endIp?: string
  ripeNetname?: string
  ripeOrg?: string
  apnicNetname?: string
  source: string
}

const knownRIPE = [
  'inetnum',
  'netname',
  'descr',
  'country',
  'tech-c',
  'admin-c',
  'status',
  'notify',
  'mnt-by',
  'created',
  'last-modified',
  'source',
  'remarks'
]

const knownLACNIC = ['inetnum', 'status', 'city', 'country', 'created', 'changed', 'source']

function getAPNICOrgName(record: Record) {
  if (!Array.isArray(record.descr)) {
    return record.descr
  } else if (record.descr?.[0]?.match(/~{/) !== null) {
    return record.descr?.[1]
  } else {
    return record.descr?.[0]
  }
}

// const parseInetnum = (record: Record) => {
//   const source = 'afrinic'

//   // console.log(record)

//   // if (record.origin === 'AS6713') {
//   //   console.log(record)
//   // }
//   // console.log(record)

//   let first, last
//   const ipMatch = record.inetnum?.match(
//     /((?:[0-9]{1,3}\.){3}[0-9]{1,3})\s+-\s+((?:[0-9]{1,3}\.){3}[0-9]{1,3})/
//   )
//   if (ipMatch !== null) {
//     first = ipMatch[1]
//     last = ipMatch[2]
//   }

//   if (record.inetnum?.match(/\//)) {
//     const { base: f, broadcast: l } = new Netmask(record.inetnum)
//     first = f
//     last = l
//   }

//   // if (record.startAddress && record.endAddress) {
//   //   first = record.startAddress
//   //   last = record.endAddress
//   // }

//   let descr = Array.isArray(record.descr) ? record.descr[0] : record.descr
//   descr = descr || record.org

//   // const notify = Array.isArray(record.notify) ? record.notify[0] : record.notify
//   // const host = notify?.match(/@(.*)/)?.[1]

//   // console.log(record)

//   // if (omit(Object.keys(record), knownLACNIC).length > 0) {
//   //   console.log(record)
//   // }

//   const org: Organisation = {
//     startIp: first,
//     endIp: last,
//     country: record.country,
//     source,
//     // @ts-ignore
//     ...(source !== 'apnic' && { orgName: record.org ? null : descr ?? record.netname }),
//     // @ts-ignore
//     ...(source === 'apnic' && { orgName: getAPNICOrgName(record) }),
//     // @ts-ignore
//     ...(source === 'ripe' && { ripeNetname: record.netname }),
//     // @ts-ignore
//     ...(source === 'apnic' && { apnicNetname: record.netname }),
//     // @ts-ignore
//     ...(source === 'afrinic' && { afrinicNetname: record.netname }),
//     // @ts-ignore
//     ...(source === 'arin' && { arinNetname: record.name }),
//     // @ts-ignore
//     ...(source === 'ripe' && { ripeOrg: record.org })
//   }

//   // console.log(`${org.startIp} ${org.orgName}`)

//   if (org.startIp?.match(/^76\.77/)) {
//     console.log(org)
//   }

//   if (record.inetnum?.match(/76\.77\.128/)) {
//     console.log(org)
//   }

//   // // if (org.orgName?.match(/broadband/)) {
//   // //   console.log(record, org)
//   // // }

//   // // if (Object.values(org).some((v) => !v)) {
//   // //   console.log(record)
//   // // }

//   return false
// }

let tasks = 0
let allTasks = 0

async function parseRoute(r: any) {
  try {
    process.stdout.write('.')
    tasks++
    allTasks++
    // await pool.query(`
    //   INSERT INTO ass (as_id, name)
    //   VALUES('${r.origin}', NULL)
    //   ON CONFLICT (as_id)
    //   DO NOTHING;
    // `)
    // await pool.query(`
    //   INSERT INTO routes (cidr, as_id)
    //   VALUES('${r.route}', '${r.origin}')
    //   ON CONFLICT (cidr)
    //   DO NOTHING;
    // `)
  } catch (err) {
    // process.stdout.write('??')
    console.log(r, err)
    //   console.log(`
    //   INSERT INTO routes (cidr, as_id)
    //   VALUES('${r.route}', '${r.origin}')
    //   ON CONFLICT (cidr)
    //   DO NOTHING;
    // `)
  } finally {
    tasks--
  }
}

async function parseAsn(id: string, name: string, countryCode: string) {
  tasks++
  allTasks++
  // let asnName
  // let asnDescr
  // const asnMatch = name.match(/^([^\s]+)\s+(.*)/)
  // if (asnMatch !== null) {
  //   asnName = asnMatch[1]
  //   asnDescr = asnMatch[2]
  // }
  name = name.replace(/'/g, "''")
  // const matchAS = name.match(/^[A-Z-]*AS[A-Z-]*\s+(.*)/)
  // if (matchAS !== null) {
  //   name = matchAS[1]
  // }
  const query = `
    INSERT INTO ass (as_id, name, country_code)
    VALUES('${id}', '${name}', '${countryCode}')
    ON CONFLICT (as_id)
    DO UPDATE SET name='${name}', country_code='${countryCode}' WHERE ass.as_id='${id}';
  `
  try {
    // await pool.query(query)
  } catch (err) {
    console.log(query)
    console.log(err)
  } finally {
    tasks--
  }
}

// 76.77.128.0/22

// function parseAS(r: any) {
//   // console.log('.')
//   if (r['origin'] === 'AS62370') {
//     console.log(r)
//   }
// }

const { addRecord, printResult } = shapeDetector()

function onEnd() {
  printResult()
  console.log(inetnumStats)
  // process.exit(0)
}

let lastTimer = setTimeout(onEnd, 500)
let i = 0
// 'ripe', 'lacnic', 'apnic', 'afrinic', 'arin'
new WhoisParser({ repos: ['ripe'] })
  .getObjects(
    ['inetnum'],
    (record: any) => {
      addRecord(record)
      parseInetnum(record)
      try {
        clearTimeout(lastTimer)
      } catch {}
      lastTimer = setTimeout(onEnd, 5000)
    },
    null
  )
  .then(() => {
    console.log('OK')
  })

// ;(async () => {
//   const fileStream = fs.createReadStrpeam('./src/asn.txt')

//   await pool.query(`
//   CREATE TABLE IF NOT EXISTS ass (
//     as_id VARCHAR(255) PRIMARY KEY,
//     name VARCHAR(255),
//     country_code VARCHAR(255)
//   );`)

//   await pool.query(`
//   CREATE TABLE IF NOT EXISTS routes (
//     cidr CIDR PRIMARY KEY,
//     as_id VARCHAR(255),
//     CONSTRAINT fk_ass
//       FOREIGN KEY(as_id)
//         REFERENCES ass(as_id)
//   );`)

//   const rl = readline.createInterface({
//     input: fileStream,
//     crlfDelay: Infinity
//   })

//   for await (const line of rl) {
//     const m = line.match(/([0-9]+)\s+(.+),\s*([A-Z]{2})$/)
//     if (m !== null) {
//       parseAsn(`AS${m[1]}`, m[2], m[3].trim())
//     } else {
//       console.log('CANNOT PARSE', line)
//     }
//   }
// })()

// let j = 0
// let prevAllTasks = 0
// function checkProcess() {
//   console.log(`${allTasks} ${tasks}`)
//   if (tasks === 0 && prevAllTasks === allTasks && j++ > 5) {
//     console.log('READY')
//     process.exit(0)
//   }
//   prevAllTasks = allTasks
//   setTimeout(checkProcess, 1000)
// }

// checkProcess()
