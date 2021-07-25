export interface Record {
  inetnum: string
  startAddress?: string
  endAddress?: string
  netname: string
  name?: string
  country?: string
  descr?: string[] | string
  org?: string
  notify?: string
  status?: string
  members?: string[]
  origin?: string
}
