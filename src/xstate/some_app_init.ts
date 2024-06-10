import { setup, createActor, createMachine } from 'xstate'

type Events =
  // | CreateEvent<'init'>
  | CreateEvent<'detectDomain'>
  | CreateEvent<'resolveDetectDomain'>
  | CreateEvent<'failedDetectDomain'>
  // user...
  | CreateEvent<'getHasLoggedUser'>
  | CreateEvent<'notLoggedUser'>
  | CreateEvent<'fetchUser'>
  | CreateEvent<'failedFetchUser'>
  | CreateEvent<'verifyUserEmail'>
  | CreateEvent<'getWorkspacesDepOnDomain'>
  | CreateEvent<'viewPage'>
  | CreateEvent<'baseDomainSignIn'>
  | CreateEvent<'customDomainSignIn'>
  | CreateEvent<'resolveInitialize'>

//...
// | CreateEvent<'checkIsDetectDomain'>
// | CreateEvent<'isLoggedUser'>
// | CreateEvent<'detectDomain'>
// | CreateEvent<'redirectToNotConnectedDomain'>
// | CreateEvent<'signIn'>
// | CreateEvent<'checkIsWorkspaceRoute'>
// | CreateEvent<'fetchWorkspaces'>
// | CreateEvent<'fetchWorkspace'>
// | CreateEvent<'selectWorkspace'>
type CreateEvent<Type> = { type: Type }
type Context = {
  isBaseHost: boolean
}

const States = {
  Initial: 'initial',
  CheckConnectedDomain: 'CheckConnectedDomain',
  CheckHasLoggedUser: 'CheckHasLoggedUser',
  GetUser: 'GetUser',
  UnLoggedUser: 'UnLoggedUser',
  RedirectToNotConnectedDomain: 'RedirectToNotConnectedDomain',
  RedirectToVerifyUserEmail: 'RedirectToVerifyUserEmail',
  RedirectToBaseDomainSignIn: 'RedirectToBaseDomainSignIn',
  RedirectToCustomDomainSignIn: 'RedirectToCustomDomainSignIn',
  ResolveInitialize: 'ResolveInitialize',

  // failed: 'failed',
  // success: 'success',

  // GetWorkspacesDepOnDomain: 'get_workspaces_dep_on_domain',
  // CheckIsDetectDomain: 'check_is_detect_domain',
  // CheckDomain: 'check_domain',
  // CheckIsWorkspaceRoute: 'check_is_workspace_route',
  // GetWorkspaces: 'get_workspaces',
  // GetWorkspace: 'get_workspace',
  // SelectWorkspace: 'select_workspace',
}

const appMachine = createMachine({
  types: {
    events: {} as Events,
  },
  context: { isBaseHost: false } as Context,
  id: 'appInitial',
  initial: States.Initial,
  states: {
    [States.Initial]: {
      // on: { getWorkspacesDepOnDomain: States.GetWorkspacesDepOnDomain },
      on: { detectDomain: States.CheckConnectedDomain, getHasLoggedUser: States.CheckHasLoggedUser },
    },
    [States.CheckConnectedDomain]: {
      on: { failedDetectDomain: States.RedirectToNotConnectedDomain, resolveDetectDomain: States.CheckHasLoggedUser },
    },
    [States.CheckHasLoggedUser]: {
      on: {
        notLoggedUser: States.UnLoggedUser,
        fetchUser: States.GetUser,
        resolveInitialize: States.ResolveInitialize,
      },
    },
    [States.GetUser]: {
      // on: { failedFetchUserData: States.UnLoggedUser, checkIsWorkspaceRoute: States.CheckIsWorkspaceRoute },
      on: { failedFetchUser: States.UnLoggedUser, verifyUserEmail: States.RedirectToVerifyUserEmail },
    },
    [States.UnLoggedUser]: {
      on: {
        baseDomainSignIn: States.RedirectToBaseDomainSignIn,
        customDomainSignIn: States.RedirectToCustomDomainSignIn,
      },
    },
    // // view some page
    // [States.ViewPage]: {},
    [States.ResolveInitialize]: {
      type: 'final',
    },

    // redirects
    [States.RedirectToNotConnectedDomain]: {
      on: { resolveInitialize: States.ResolveInitialize },
    },
    [States.RedirectToVerifyUserEmail]: {
      on: { resolveInitialize: States.ResolveInitialize },
    },
    [States.RedirectToBaseDomainSignIn]: {
      on: { resolveInitialize: States.ResolveInitialize },
    },
    [States.RedirectToCustomDomainSignIn]: {
      on: { resolveInitialize: States.ResolveInitialize },
    },

    // [States.CheckIsDetectDomain]: {
    //   // on: { checkIsDetectDomain: States.DetectDomain, isLoggedUser: States.CheckIsLoggedUser },
    //   on: { isLoggedUser: States.CheckIsLoggedUser },
    // },

    // [States.CheckDomain]: {
    //   on: {
    //     // detectDomain: States.DetectDomain,
    //     // isLoggedUser: States.CheckIsLoggedUser,
    //     fetchWorkspace: States.GetWorkspace,
    //     fetchWorkspaces: States.GetWorkspaces,
    //     // redirectToBaseDomainSignIn: States.RedirectToBaseDomainSignIn,
    //     // redirectToCustomDomainSignIn: States.RedirectToCustomDomainSignIn,
    //   },
    // }
    // [States.CheckIsWorkspaceRoute]: {
    //   on: {
    //     viewPage: States.ViewPage,
    //     // fetch workspaces dep on domain
    //     getWorkspacesDepOnDomain: States.GetWorkspacesDepOnDomain,
    //     selectWorkspace: States.SelectWorkspace,
    //   },
    // },
    // [States.GetWorkspacesDepOnDomain]: {
    //   on: {
    //     fetchWorkspace: States.GetWorkspace,
    //     fetchWorkspaces: States.GetWorkspaces,
    //   },
    // },
    // [States.GetWorkspace]: {
    //   on: { selectWorkspace: States.SelectWorkspace },
    // },
    // [States.GetWorkspaces]: {
    //   on: { checkIsWorkspaceRoute: States.CheckIsWorkspaceRoute },
    // },
    // [States.SelectWorkspace]: {},
  },
})

const app = createActor(appMachine)
app.subscribe((snapshot) => {
  console.log('value:', snapshot.value)
})
app.start()
// app.send({ type: 'checkIsBaseDomain' })
// app.send({ type: '' })
