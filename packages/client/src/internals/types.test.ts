import { expectTypeOf } from 'expect-type';
import isomorphicFetch from 'isomorphic-fetch';
import nodeFetch from 'node-fetch';
import type { fetch as undiciFetch } from 'undici';
import { getFetch } from '../getFetch';
import { getAbortController } from './fetchHelpers';
import {
  AbortControllerEsque,
  AbortControllerInstanceEsque,
  AbortSignalEsque,
  FetchEsque,
  ResponseEsque,
} from './types';

describe('AbortController', () => {
  test('AbortControllerEsque', () => {
    expectTypeOf(
      getAbortController,
    ).returns.toEqualTypeOf<AbortControllerEsque | null>();

    getAbortController(
      null as unknown as typeof import('abort-controller')['AbortController'],
    );

    expectTypeOf(() => {
      const AbortController = getAbortController(undefined)!;
      return new AbortController();
    }).returns.toEqualTypeOf<AbortControllerInstanceEsque>();
  });
});

describe('fetch', () => {
  test('FetchEsque', () => {
    expectTypeOf(getFetch).returns.toEqualTypeOf<FetchEsque>();

    expectTypeOf(() =>
      getFetch()('', {
        body: '',
        headers: Math.random() > 0.5 ? [['a', 'b']] : { a: 'b' },
        method: 'GET',
        signal: new AbortSignal(),
      }),
    ).returns.toEqualTypeOf<Promise<ResponseEsque>>();

    getFetch({} as unknown as typeof fetch);
  });

  test('NativeFetchEsque', () => {
    getFetch(isomorphicFetch);
    getFetch(nodeFetch);

    // Passing in undiciFetch directly in Node v18.7.0 gives:
    // ReferenceError: TextEncoder is not defined
    // 🤷
    getFetch({} as unknown as typeof undiciFetch);
  });
});

describe('integrate', () => {
  test('pass AbortSignalEsque to undiciFetch', () => {
    const myFetch = {} as typeof undiciFetch;
    myFetch('', {
      signal: {} as AbortSignalEsque,
    });
  });

  test('pass AbortSignalEsque to node-fetch', () => {
    const myFetch = {} as typeof nodeFetch;
    myFetch('', {
      signal: {} as AbortSignalEsque,
    });
  });

  test('pass AbortSignalEsque to isomorphic-fetch', () => {
    const myFetch = {} as typeof isomorphicFetch;
    myFetch('', {
      signal: {} as AbortSignalEsque,
    });
  });
});
