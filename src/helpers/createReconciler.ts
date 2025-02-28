import Reconciler from 'react-reconciler';
import { type EventPriority } from '../typedefs/EventPriority';

export const createReconciler = Reconciler as unknown as <
    Type,
    Props,
    Container,
    Instance,
    TextInstance,
    SuspenseInstance,
    HydratableInstance,
    FormInstance,
    PublicInstance,
    HostContext,
    ChildSet,
    TimeoutHandle,
    NoTimeout,
    TransitionStatus,
>(
    config: Omit<
        Reconciler.HostConfig<
            Type,
            Props,
            Container,
            Instance,
            TextInstance,
            SuspenseInstance,
            HydratableInstance,
            PublicInstance,
            HostContext,
            null, // updatePayload
            ChildSet,
            TimeoutHandle,
            NoTimeout
        >,
    'getCurrentEventPriority' | 'prepareUpdate' | 'commitUpdate'
    > & {
        /**
         * This method should mutate the `instance` and perform prop diffing if needed.
         *
         * The `internalHandle` data structure is meant to be opaque. If you bend the rules and rely on its internal fields, be aware that it may change significantly between versions. You're taking on additional maintenance risk by reading from it, and giving up all guarantees if you write something to it.
         */
        commitUpdate?(
            instance: Instance,
            type: Type,
            prevProps: Props,
            nextProps: Props,
            internalHandle: Reconciler.OpaqueHandle,
        ): void

        // Undocumented
        // https://github.com/facebook/react/pull/26722
        NotPendingTransition: TransitionStatus | null

        // https://github.com/facebook/react/pull/28751
        setCurrentUpdatePriority(newPriority: EventPriority): void

        getCurrentUpdatePriority(): EventPriority

        resolveUpdatePriority(): EventPriority

        // https://github.com/facebook/react/pull/28804
        resetFormInstance(form: FormInstance): void

        // https://github.com/facebook/react/pull/25105
        requestPostPaintCallback(callback: (time: number) => void): void

        // https://github.com/facebook/react/pull/26025
        shouldAttemptEagerTransition(): boolean

        // https://github.com/facebook/react/pull/31528
        trackSchedulerEvent(): void

        // https://github.com/facebook/react/pull/31008
        resolveEventType(): null | string

        resolveEventTimeStamp(): number

        /**
         * This method is called during render to determine if the Host Component type and props require some kind of loading process to complete before committing an update.
         */
        maySuspendCommit(type: Type, props: Props): boolean

        /**
         * This method may be called during render if the Host Component type and props might suspend a commit. It can be used to initiate any work that might shorten the duration of a suspended commit.
         */
        preloadInstance(type: Type, props: Props): boolean

        /**
         * This method is called just before the commit phase. Use it to set up any necessary state while any Host Components that might suspend this commit are evaluated to determine if the commit must be suspended.
         */
        startSuspendingCommit(): void

        /**
         * This method is called after `startSuspendingCommit` for each Host Component that indicated it might suspend a commit.
         */
        suspendInstance(type: Type, props: Props): void

        /**
         * This method is called after all `suspendInstance` calls are complete.
         *
         * Return `null` if the commit can happen immediately.
         *
         * Return `(initiateCommit: Function) => Function` if the commit must be suspended. The argument to this callback will initiate the commit when called. The return value is a cancellation function that the Reconciler can use to abort the commit.
         *
         */
        waitForCommitToBeReady(): ((initiateCommit: (...args: unknown[]) => unknown) => (...args: unknown[]) => unknown) | null
    },
) => Reconciler.Reconciler<Container, Instance, TextInstance, SuspenseInstance, PublicInstance>;
