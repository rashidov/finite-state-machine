import { FSM } from './fsm.js'

/**
 * Simple example custom fsm machine
 */

const states = {
  happy: 'happy',
  leave: 'leave',
  sad: 'sad',
  come: 'come',
}

const transitions = {
  // state
  happy: {
    // transition
    leave: 'sad',
  },
  sad: {
    come: 'happy',
  },
}

const machine = FSM(states.happy, transitions)
