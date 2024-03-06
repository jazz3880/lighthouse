/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import assert from 'assert/strict';

import {PageDependencyGraph} from '../../computed/page-dependency-graph.js';
import {BaseNode} from '../../lib/lantern/base-node.js';
import {getURLArtifactFromDevtoolsLog, readJson} from '../test-utils.js';

const sampleTrace = readJson('../fixtures/traces/iframe-m79.trace.json', import.meta);
const sampleDevtoolsLog = readJson('../fixtures/traces/iframe-m79.devtoolslog.json', import.meta);

describe('PageDependencyGraph computed artifact', () => {
  describe('#compute_', () => {
    it('should compute the dependency graph', () => {
      const context = {computedCache: new Map()};
      return PageDependencyGraph.request({
        trace: sampleTrace,
        devtoolsLog: sampleDevtoolsLog,
        URL: getURLArtifactFromDevtoolsLog(sampleDevtoolsLog),
      }, context).then(output => {
        assert.ok(output instanceof BaseNode, 'did not return a graph');

        const dependents = output.getDependents();
        const nodeWithNestedDependents = dependents.find(node => node.getDependents().length);
        assert.ok(nodeWithNestedDependents, 'did not link initiators');
      });
    });

    it('should compute the dependency graph with URL backport', () => {
      const context = {computedCache: new Map()};
      return PageDependencyGraph.request({
        trace: sampleTrace,
        devtoolsLog: sampleDevtoolsLog,
      }, context).then(output => {
        assert.ok(output instanceof BaseNode, 'did not return a graph');

        const dependents = output.getDependents();
        const nodeWithNestedDependents = dependents.find(node => node.getDependents().length);
        assert.ok(nodeWithNestedDependents, 'did not link initiators');
      });
    });
  });
});
