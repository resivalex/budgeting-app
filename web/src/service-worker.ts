/// <reference lib="webworker" />

import { clientsClaim } from 'workbox-core'
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'

declare const self: ServiceWorkerGlobalScope

clientsClaim()

precacheAndRoute(self.__WB_MANIFEST)

const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$')
registerRoute(({ request, url }: { request: Request; url: URL }) => {
  if (request.mode !== 'navigate') return false
  if (url.pathname.startsWith('/_')) return false
  if (url.pathname.match(fileExtensionRegexp)) return false
  return true
}, createHandlerBoundToURL('/index.html'))

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
