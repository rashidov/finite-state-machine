export const FSM = (initState: any, transitions: any) => {
  const subscriptions: any[] = []
  const subscriptionsRelatedToTriggers: any = {}

  return {
    state: initState,
    subscribe(f: (arg: any) => void, trigger = null) {
      if (trigger) {
        const subscriptionsByTrigger = subscriptionsRelatedToTriggers[trigger] || []
        subscriptionsByTrigger.push(f)
        subscriptionsRelatedToTriggers[trigger] = subscriptionsByTrigger
        return
      }

      subscriptions.push(f)
    },
    send(trigger: any) {
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
          subscriptionsByTrigger.forEach((f: (arg: any) => void) => f(this.state))
        }
      }
    },
  }
}
