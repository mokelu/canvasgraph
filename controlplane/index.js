import { app } from '../state/app.js'
import { panels } from '../state/panels.js'
import { workspace } from '../state/workspace.js'
import { user } from '../state/user.js'

const state = { app, panels, workspace, user }

const history = []

export function observe() {
  return JSON.parse(JSON.stringify(state))
}

export function propose({ target, action, property, value }) {
  return {
    id: crypto.randomUUID(),
    target,
    action,
    property,
    value,
    timestamp: Date.now()
  }
}

export function approve(proposal) {
  return true
}

export function execute(proposal) {
  const { target, property, value } = proposal
  const previous = state[target][property]
  state[target][property] = value
  return { previous, current: state[target][property] }
}

export function result(proposal, execution) {
  const record = {
    proposal,
    success: true,
    previous: execution.previous,
    current: execution.current,
    timestamp: Date.now()
  }
  history.push(record)
  return record
}

export function run(proposal) {
  if (!approve(proposal)) {
    return { success: false, reason: 'rejected' }
  }
  const execution = execute(proposal)
  return result(proposal, execution)
}

export function getHistory() {
  return [...history]
}
