/**
 * @license
 * Copyright 2016 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/** @type {LH.Config} */
const config = {
  extends: 'lighthouse:default',
  settings: {
    onlyCategories: [
      'best-practices',
    ],
    onlyAudits: [
      'is-on-https',
      'viewport',
      'user-timings',
      'critical-request-chains',
      'render-blocking-resources',
      'aria-valid-attr',
      'aria-allowed-attr',
      'color-contrast',
      'image-alt',
      'label',
      'tabindex',
    ],
  },
};

/**
 * @type {Smokehouse.ExpectedRunnerResult}
 * Expected Lighthouse results from testing the a local test page that works
 * offline with a service worker.
 */
const expectations = {
  artifacts: {},
  lhr: {
    requestedUrl: 'http://localhost:10503/offline-ready.html',
    finalDisplayedUrl: 'http://localhost:10503/offline-ready.html',
    audits: {
      'is-on-https': {
        score: 1,
      },
      'viewport': {
        score: 1,
      },
      'user-timings': {
        scoreDisplayMode: 'notApplicable',
      },
      'critical-request-chains': {
        scoreDisplayMode: 'notApplicable',
      },
      'aria-valid-attr': {
        scoreDisplayMode: 'notApplicable',
      },
      'aria-allowed-attr': {
        scoreDisplayMode: 'notApplicable',
      },
      'color-contrast': {
        score: 1,
      },
      'image-alt': {
        score: 0,
      },
      'label': {
        scoreDisplayMode: 'notApplicable',
      },
      'tabindex': {
        scoreDisplayMode: 'notApplicable',
      },
    },
  },
};

export default {
  id: 'offline-ready',
  expectations,
  config,
  runSerially: true,
};
