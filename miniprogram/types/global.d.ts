declare module 'vue' {
    import type { App, Component } from '@vue/runtime-core'
    export * from '@vue/runtime-core'
    export { App, Component }
}

declare module '@dcloudio/uni-app' {
    export function onLoad(callback: (options: any) => void): void
    export function onShow(callback: () => void): void
    export function onReady(callback: () => void): void
    export function onHide(callback: () => void): void
    export function onUnload(callback: () => void): void
    export function onPullDownRefresh(callback: () => void): void
    export function onReachBottom(callback: () => void): void
}
