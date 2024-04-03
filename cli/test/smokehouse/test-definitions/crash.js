/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

const config = {
  extends: 'lighthouse:default',
  settings: {
    maxWaitForLoad: 5000,
    onlyAudits: [
      'first-contentful-paint',
    ],
  },
};

/**
 * @type {Smokehouse.ExpectedRunnerResult}
 */
const expectations = {
  lhr: {
    requestedUrl: 'chrome://crash',
    finalDisplayedUrl: /(chrome-error)/,
    runtimeError: {code: 'TARGET_CRASHED'},
    runWarnings: [
    ],
    audits: {

    },
  },
};

export default {
  id: 'crash',
  expectations,
  runSerially: true,
  config,
};
