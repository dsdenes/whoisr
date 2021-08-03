// https://www.ripe.net/manage-ips-and-asns/db/support/documentation/ripe-database-documentation/rpsl-object-types/4-2-descriptions-of-primary-objects/4-2-4-description-of-the-inetnum-object

// @ts-ignore
import ipToInt from 'ip-to-int'
import { Netmask } from 'netmask'
import { ipRangeStringToIpRange } from '../../../lib/ip'
import { Organisation } from '../../../lib/organisation'
import { state } from '../../../lib/state'

interface Route {
  route: string
  origin: string
}

export const routeStats = {
  total: 0,
  org: 0
}

const orgs: Organisation[] = Object.values(state.getCollection('organisations'))

export function parseRoute(obj: Route) {
  routeStats.total++

  const { base, broadcast } = new Netmask(obj.route)
  console.log('\n\n', base, broadcast)
  const firstIP = ipToInt(base).toInt()
  const lastIP = ipToInt(broadcast).toInt()
  // console.log(firstIP, lastIP)

  const org = orgs.find((org) =>
    org.networks.some((network) => {
      const [rangeFirstIP, rangeLastIP] = ipRangeStringToIpRange(network)
      if (firstIP >= rangeFirstIP && firstIP <= rangeLastIP) {
        return true
      }
      return false
    })
  )

  if (org) {
    console.log(`${obj.origin} => ${org.id}`)
  } else {
    console.log(obj)
  }

  routeStats.org++
}
