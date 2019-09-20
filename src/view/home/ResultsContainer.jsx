import withPower from 'powercycle'
import { $, collection, $not, $or } from 'powercycle/util'
import sample from 'xstream-sample'
import xs from 'xstream'

import './ResultsContainer.css'

export function ResultsContainer ({ props: { isLoading$, errorMessage$, thumbnails$ } }) {
  return (
    <div className='ResultsContainer'>
      <div if={errorMessage$}>Network error: {errorMessage$}</div>
      <div if={isLoading$}>Loading...</div>
      <div if={$not($or(isLoading$, $(thumbnails$).results.length))}>
        No results found
      </div>

      <ul className={isLoading$.map($ => 'uk-thumbnav ' + ($ ? 'loading' : ''))}>
        {collection($(thumbnails$).results, {
          itemKey: 'backdrop_path',
          itemCmp: ({ props: { item$ } }) =>
            <li className='uk-margin-bottom' if={$(item$).backdrop_path}>
              <a className='ResultsContainer__result-item' onClick={{
                state: ev$ => sample(item$)(ev$).map(item => ['select', item])
              }}>
                <div className='ResultsContainer__thumbnail-holder'>
                  <img src={item$.map(item => `http://image.tmdb.org/t/p/w300${item.backdrop_path}`)} />
                </div>
                <div className='ResultsContainer__caption uk-text-small uk-text-muted'>
                  {$(item$).title}
                </div>
              </a>
            </li>
        })}
      </ul>
    </div>
  )
}
