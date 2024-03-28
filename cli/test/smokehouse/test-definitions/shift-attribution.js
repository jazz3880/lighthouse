/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @type {Smokehouse.ExpectedRunnerResult}
 */
const expectations = {
  lhr: {
    requestedUrl: 'http://localhost:10200/shift-attribution.html',
    finalDisplayedUrl: 'http://localhost:10200/shift-attribution.html',
    audits: {
      'layout-shifts': {
        details: {
          items: {
            // Order (aka shift size) may vary due to environment.
            _includes: [
              {
                node: {selector: 'body > div#blue'},
                subItems: {items: [{cause: /font/, extra: {value: /Regular\.ttf/}}]},
              },
              {
                node: {selector: 'body > div#blue'},
                // TODO: We can't get nodes from non-main frames yet. See runRootCauseAnalysis.
                subItems: {items: [{cause: /iframe/, extra: undefined}]},
              },
              {
                node: {selector: 'body > div#blue'},
                subItems: {items: [{cause: /Media/, extra: {selector: 'body > img'}}]},
              },
            ],
          },
        },
      },
    },
  },
};

export default {
  id: 'shift-attribution',
  expectations,
};
