import inherits from 'inherits'

import RuleProvider from 'diagram-js/lib/features/rules/RuleProvider'

import {
  is
} from 'bpmn-js/lib/util/ModelUtil'

import {
  isAny
} from 'bpmn-js/lib/features/modeling/util/ModelingUtil'

var HIGH_PRIORITY = 1500

/**
 * A custom rule provider that decides what elements can be
 * dropped where based on a `vendor:allowDrop` BPMN extension.
 *
 * See {@link BpmnRules} for the default implementation
 * of BPMN 2.0 modeling rules provided by bpmn-js.
 *
 * @param {EventBus} eventBus
 */
export default function CustomRules (eventBus) {
  RuleProvider.call(this, eventBus)
}

inherits(CustomRules, RuleProvider)

CustomRules.$inject = ['eventBus']

CustomRules.prototype.init = function () {
  this.addRule('connection.create', HIGH_PRIORITY, function (context) {
    var source = context.source
    var target = context.target
    if (is(source, 'bpmn:UserTask')) {
      var sourceRef = source.outgoing// .get('outgoing');
      if (sourceRef.length > 0) {
        return false
      }
    }

    if (isAny(source, [
      'bpmn:ParallelGateway',
      'bpmn:ExclusiveGateway',
      'bpmn:InclusiveGateway'
    ]) && isAny(target, [
      'bpmn:ParallelGateway',
      'bpmn:ExclusiveGateway',
      'bpmn:InclusiveGateway'
    ])) {
      return false
    }
  })
}
