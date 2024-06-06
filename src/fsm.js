export const FSM = (initState, transitions) => {
  const subscriptions = []
  const subscriptionsRelatedToTriggers = {}

  return {
    state: initState,
    subscribe(f, trigger = null) {
      if (trigger) {
        const subscriptionsByTrigger = subscriptionsRelatedToTriggers[trigger] || []
        subscriptionsByTrigger.push(f)
        subscriptionsRelatedToTriggers[trigger] = subscriptionsByTrigger
        return
      }

      subscriptions.push(f)
    },
    send(trigger) {
      const currentState = this.state
      const nextState =
        transitions[currentState] && transitions[currentState][trigger]
          ? transitions[currentState][trigger]
          : this.state

      if (nextState !== currentState) {
        this.state = nextState
        subscriptions.forEach((f) => f(this.state))
        const subscriptionsByTrigger = subscriptionsRelatedToTriggers[trigger]
        if (subscriptionsByTrigger) {
          subscriptionsByTrigger.forEach((f) => f(this.state))
        }
      }
    },
  }
}
