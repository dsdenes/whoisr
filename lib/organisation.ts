import { cloneDeep } from 'lodash'
import { mergeIPRanges } from './ip'
import { state } from './state'

export interface Organisation {
  id: string
  networks: string[]
}

export interface Model<T> {
  addNetwork: (network: string) => void
  networks: ReadonlyArray<string>
  persist: () => void
}

export function NewOrganisation(initialOrganisation: Organisation): Model<Organisation> {
  const organisation = cloneDeep(initialOrganisation)

  function persist() {
    state.persist('organisations', organisation.id, organisation)
  }

  function addNetwork(network: string) {
    organisation.networks = mergeIPRanges([network, ...organisation.networks])
    persist()
  }

  persist()

  return {
    persist,
    addNetwork,
    networks: organisation.networks
  }
}

export function Organisation(orgId: string): Model<Organisation> {
  const storedOrg = state.getById('organisations', orgId)
  return NewOrganisation(storedOrg ?? { id: orgId, networks: [] })
}
