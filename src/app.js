import { FSM } from './fsm.js'

const states = {
  happy: 'happy',
  leave: 'leave',
  sad: 'sad',
  come: 'come',
}

const transitions = {
  happy: {
    leave: 'sad',
  },
  sad: {
    come: 'happy',
  },
}

const machine = FSM(states.happy, transitions)
