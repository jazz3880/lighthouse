/**
 * @license Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import LayoutShiftElementsAudit from '../../audits/layout-shift-elements.js';
import {createTestTrace} from '../create-test-trace.js';

describe('Performance: layout-shift-elements audit', () => {
  it('correctly surfaces a single CLS element', async () => {
    const trace = createTestTrace({});
    trace.traceEvents.push({
      args: {
        data: {
          had_recent_input: false,
          is_main_frame: true,
          weighted_score_delta: 0.3,
          impacted_nodes: [{
            node_id: 1,
            old_rect: [0, 0, 1, 1],
            new_rect: [0, 0, 2, 2],
          }],
        },
        frame: 'ROOT_FRAME',
      },
      name: 'LayoutShift',
      cat: 'loading',
    }, {
      args: {
        data: {
          had_recent_input: false,
          is_main_frame: true,
          weighted_score_delta: 0.1,
          impacted_nodes: [{
            node_id: 1,
            old_rect: [0, 0, 1, 1],
            new_rect: [0, 0, 2, 2],
          }],
        },
        frame: 'ROOT_FRAME',
      },
      name: 'LayoutShift',
      cat: 'loading',
    });

    const artifacts = {
      traces: {defaultPass: trace},
      TraceElements: [{
        traceEventType: 'layout-shift-element',
        nodeId: 1,
        node: {
          devtoolsNodePath: '1,HTML,3,BODY,5,DIV,0,HEADER',
          selector: 'div.l-header > div.chorus-emc__content',
          nodeLabel: 'My Test Label',
          snippet: '<h1 class="test-class">',
        },
      }],
    };

    const auditResult = await LayoutShiftElementsAudit.audit(artifacts, {computedCache: new Map()});
    expect(auditResult.score).toEqual(0);
    expect(auditResult.displayValue).toBeDisplayString('1 element found');
    expect(auditResult.metricSavings).toEqual({CLS: 0.4});
    expect(auditResult.details.items).toHaveLength(1);
    expect(auditResult.details.items[0]).toHaveProperty('node');
    expect(auditResult.details.items[0].node).toHaveProperty('type', 'node');
    expect(auditResult.details.items[0].score).toEqual(0.4);
  });

  it('correctly surfaces multiple CLS elements', async () => {
    const trace = createTestTrace({});
    const traceElements = [];

    for (let i = 1; i <= 4; ++i) {
      trace.traceEvents.push({
        args: {
          data: {
            had_recent_input: false,
            is_main_frame: true,
            weighted_score_delta: 0.3,
            impacted_nodes: [{
              node_id: i,
              old_rect: [0, 0, 1, 1],
              new_rect: [0, 0, 2, 2],
            }],
          },
          frame: 'ROOT_FRAME',
        },
        name: 'LayoutShift',
        cat: 'loading',
      });

      traceElements.push({
        traceEventType: 'layout-shift-element',
        nodeId: i,
        node: {
          devtoolsNodePath: '1,HTML,3,BODY,5,DIV,0,HEADER',
          selector: 'div.l-header > div.chorus-emc__content',
          nodeLabel: 'My Test Label',
          snippet: '<h1 class="test-class">',
        },
      });
    }

    const artifacts = {
      traces: {defaultPass: trace},
      TraceElements: traceElements,
    };

    const auditResult = await LayoutShiftElementsAudit.audit(artifacts, {computedCache: new Map()});
    expect(auditResult.score).toEqual(0);
    expect(auditResult.notApplicable).toEqual(false);
    expect(auditResult.displayValue).toBeDisplayString('4 elements found');
    expect(auditResult.details.items).toHaveLength(4);
  });

  it('aggregates elements missing from TraceElements', async () => {
    // Create 20 shift events on 20 unique elements
    const trace = createTestTrace({});
    for (let i = 1; i <= 20; ++i) {
      trace.traceEvents.push({
        args: {
          data: {
            had_recent_input: false,
            is_main_frame: true,
            weighted_score_delta: 0.1,
            impacted_nodes: [{
              node_id: i,
              old_rect: [0, 0, 1, 1],
              new_rect: [0, 0, 2, 2],
            }],
          },
          frame: 'ROOT_FRAME',
        },
        name: 'LayoutShift',
        cat: 'loading',
      });
    }

    // Only create element data for the first 15 elements
    const traceElements = [];
    for (let i = 1; i <= 15; ++i) {
      traceElements.push({
        traceEventType: 'layout-shift-element',
        nodeId: i,
        node: {
          devtoolsNodePath: '1,HTML,3,BODY,5,DIV,0,HEADER',
          selector: 'div.l-header > div.chorus-emc__content',
          nodeLabel: 'My Test Label',
          snippet: '<h1 class="test-class">',
        },
      });
    }

    const artifacts = {
      traces: {defaultPass: trace},
      TraceElements: traceElements,
    };

    const auditResult = await LayoutShiftElementsAudit.audit(artifacts, {computedCache: new Map()});
    expect(auditResult.score).toEqual(0);
    expect(auditResult.notApplicable).toEqual(false);
    expect(auditResult.displayValue).toBeDisplayString('20 elements found');
    expect(auditResult.details.items).toHaveLength(16);

    expect(auditResult.details.items[15].node.type).toEqual('code');
    expect(auditResult.details.items[15].node.value).toBeDisplayString('Other');
    expect(auditResult.details.items[15].score).toBeCloseTo(5 * 0.1);
  });

  it('correctly handles when there are no CLS elements to show', async () => {
    const artifacts = {
      traces: {defaultPass: createTestTrace({})},
      TraceElements: [],
    };

    const auditResult = await LayoutShiftElementsAudit.audit(artifacts, {computedCache: new Map()});
    expect(auditResult.score).toEqual(1);
    expect(auditResult.notApplicable).toEqual(true);
    expect(auditResult.displayValue).toBeUndefined();
    expect(auditResult.metricSavings).toEqual({CLS: 0});
    expect(auditResult.details.items).toHaveLength(0);
  });
});
