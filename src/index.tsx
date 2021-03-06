import { run } from '@cycle/run'
import { withState } from '@cycle/state'
import { makeHTTPDriver } from '@cycle/http'
import { timeDriver } from '@cycle/time'
import { makeHashHistoryDriver } from '@cycle/history'

import { App } from './view/App'

import 'uikit/dist/css/uikit.css'

import UIkit from 'uikit/dist/js/uikit.js'
import UIkitIcons from 'uikit/dist/js/uikit-icons.js'

import withPower, { makeDOMDriver } from 'cyrena'

// Workaround of TS not yet supporting custom jsx pragma for fragments
// @ts-ignore 2339
// window.React = { createElement: withPower.pragma, Fragment: withPower.Fragment }

import { Polly } from '@pollyjs/core'
import XHRAdapter from '@pollyjs/adapter-xhr'
import FetchAdapter from '@pollyjs/adapter-fetch'
import RESTPersister from '@pollyjs/persister-rest'

if (
  process.env.NODE_ENV === 'development' &&
  !/\.csb\.app$/.test(window.location.hostname)
) {
  Polly.register(XHRAdapter)
  Polly.register(FetchAdapter)
  Polly.register(RESTPersister)

  // @ts-ignore 2339
  window.polly = new Polly('tmdbui', {
    adapters: ['xhr', 'fetch'],
    persister: 'rest'
  })
}

const drivers = {
  react: makeDOMDriver(document.getElementById('root')),
  HTTP: makeHTTPDriver(),
  history: makeHashHistoryDriver(),
  Time: timeDriver,
  util: () => ({
    getFullUrl: url =>
      url
        .replace(/^/, 'https://api.themoviedb.org/3')
        .replace(/(\?|$)/, '?api_key=bf6b860ab05ac2d94054ba9ca96cf1fa&')
  })
}

UIkitIcons(UIkit)
run(withPower(App), drivers)
