// https://www.ripe.net/manage-ips-and-asns/db/support/documentation/ripe-database-documentation/rpsl-object-types/4-2-descriptions-of-primary-objects/4-2-4-description-of-the-inetnum-object

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

export function parseInetnum(object: Inetnum) {
  // 1: parse CIDR
  // 2: identify organisation
}
