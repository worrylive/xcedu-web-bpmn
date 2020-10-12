<template>
  <div ref="container" class="vue-bpmn-diagram-container" />
</template>

<script>
// 可拖动的
import BpmnViewer from 'bpmn-js/dist/bpmn-navigated-viewer.production.min.js'
// 不可拖动的
// import BpmnViewer from 'bpmn-js'

export default {
  name: 'BpmnViewer',
  props: {
    url: {
      type: String,
      required: true
    }
  },
  data: function () {
    return {
      diagramXML: null
    }
  },
  watch: {
    url: function (val) {
      this.$emit('loading')
      this.fetchDiagram(val)
    },
    diagramXML: function (val) {
      var self = this
      this.bpmnViewer.importXML(val).then(function (result) {
        const { warnings } = result
        self.$emit('shown', warnings)
        self.bpmnViewer.get('canvas').zoom('fit-viewport')
      }).catch(function (err) {
        self.$emit('error', err)
      })
    }
  },
  mounted: function () {
    var container = this.$refs.container

    this.bpmnViewer = new BpmnViewer({
      container: container
    })

    if (this.url) {
      this.fetchDiagram(this.url)
    }
  },
  beforeDestroy: function () {
    this.bpmnViewer.destroy()
  },
  methods: {
    fetchDiagram: function (url) {
      var self = this

      axios.get(url)
        .then(function (response) {
          return response.data
        })
        .then(function (text) {
          self.diagramXML = text
        })
        .catch(function (err) {
          self.$emit('error', err)
        })
    }
  }
}
</script>

<style>
  .vue-bpmn-diagram-container {
    height: 100%;
    width: 100%;
  }
</style>
