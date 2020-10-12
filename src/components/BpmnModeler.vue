<template>
  <div ref="container" class="vue-bpmn-diagram-container" />
</template>

<script>
import BpmnModeler from 'bpmn-js/dist/bpmn-modeler.production.min.js'

export default {
  name: 'BpmnModeler',
  props: {
    url: {
      type: String,
      required: true
    }
  },
  data: function () {
    return {
    }
  },
  watch: {
    url: function (val) {
      this.$emit('loading')
      this.fetchDiagram(val)
    }
  },
  mounted: function () {
    var container = this.$refs.container

    this.bpmnModeler = new BpmnModeler({
      container: container,
      keyboard: {
        bindTo: window
      }
    })

    if (this.url) {
      this.fetchDiagram(this.url)
    }
  },
  beforeDestroy: function () {
    this.bpmnModeler.destroy()
  },
  methods: {
    fetchDiagram: function (url) {
      var self = this

      axios.get(url)
        .then(function (response) {
          return response.data
        })
        .then(function (text) {
          self.openDiagram(text)
        })
        .catch(function (err) {
          self.$emit('error', err)
        })
    },
    openDiagram: function (val) {
      var self = this
      this.bpmnModeler.importXML(val).then(function (result) {
        const { warnings } = result
        self.$emit('shown', warnings)
        self.bpmnModeler.get('canvas').zoom('fit-viewport')
      }).catch(function (err) {
        self.$emit('error', err)
      })
    },
    exportDiagram: function () {
      this.bpmnModeler.saveXML({ format: true }).then(function (result) {
        return result.xml
      }).catch(function (err) {
        console.error('could not save BPMN 2.0 diagram', err)
      })
    }
  }
}
</script>

<style>
  /* 左边工具栏以及编辑节点的样式 */

  @import "~bpmn-js/dist/assets/diagram-js.css";
  @import "~bpmn-js/dist/assets/bpmn-font/css/bpmn.css";

  .vue-bpmn-diagram-container {
    height: 100%;
    width: 100%;
  }
</style>
