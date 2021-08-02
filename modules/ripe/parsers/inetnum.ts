// https://www.ripe.net/manage-ips-and-asns/db/support/documentation/ripe-database-documentation/rpsl-object-types/4-2-descriptions-of-primary-objects/4-2-4-description-of-the-inetnum-object

import { Organisation } from '../../../lib/organisation'

interface Inetnum {
  inetnum: string
  netname: string
  org?: string
  country: string // "Therefore, it cannot be used in any reliable way to map IP addresses to countries."
  descr?: string
  status: InetnumStatus
}

type InetnumStatus =
  | 'LEGACY'
  | 'ALLOCATED UNSPECIFIED'
  | 'ALLOCATED PA'
  | 'LIR-PARTITIONED PA'
  | 'SUB-ALLOCATED PA'
  | 'ASSIGNED PA'
  | 'ASSIGNED PI'
  | 'ASSIGNED ANYCAST'

export const inetnumStats = {
  total: 0,
  org: 0
}

export function parseInetnum(obj: Inetnum) {
  inetnumStats.total++
  if (obj.status === 'ASSIGNED PA') {
    if (obj.org) {
      const organisation = Organisation(obj.org)

      const ipMatch = obj.inetnum?.match(
        /((?:[0-9]{1,3}\.){3}[0-9]{1,3})\s+-\s+((?:[0-9]{1,3}\.){3}[0-9]{1,3})/
      )
      const first = ipMatch?.[1] as string
      const last = ipMatch?.[2] as string

      organisation.addNetwork([first, last])
      inetnumStats.org++
    }
  }
  // 1: parse CIDR
  // 2: identify organisation
}
