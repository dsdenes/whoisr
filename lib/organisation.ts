import { state } from './state'

interface Organisation {
  id: string
  networks: Network[]
}

export type Network = [string, string]

export interface Model<T> {
  addNetwork: (network: Network) => void
  persist: () => void
}

export function NewOrganisation(organisation: Organisation): Model<Organisation> {
  function persist() {
    state.persist('organisations', organisation.id, organisation)
  }

  function addNetwork(network: Network) {
    organisation.networks.push(network)
    persist()
  }

  persist()

  return {
    persist,
    addNetwork
  }
}

export function Organisation(orgId: string): Model<Organisation> {
  const storedOrg = state.get('organisations', orgId)
  return NewOrganisation(storedOrg ?? { id: orgId, networks: [] })
}
