import { createActor, createMachine } from 'xstate'

/**
 * Simple example xstate machine
 */

const machine = createMachine({
  id: 'toggle',
  initial: 'Inactive',
  states: {
    Inactive: {
      on: { toggle: 'Active' },
    },
    Active: {
      on: { toggle: 'Inactive', off: 'Off' },
    },
    Off: {
      on: { off: 'Inactive' },
    },
  },
})

const actor = createActor(machine)

actor.subscribe((snapshot) => {
  console.log('val:', snapshot.value)
})

actor.start()
actor.send({ type: 'toggle' })
actor.send({ type: 'off' })
actor.send({ type: 'toggle' })
