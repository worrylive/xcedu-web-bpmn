<template>
  <div class="modeler-wrapper">
    <div ref="container" class="vue-bpmn-diagram-container" />
    <panel v-if="bpmnModeler" :modeler="bpmnModeler" />
  </div>
</template>

<script>
import BpmnModeler from 'bpmn-js/dist/bpmn-modeler.production.min.js'
import panel from './PropertyPanel' // 属性面板
import BpmData from './BpmData'

export default {
  name: 'BpmnModeler',
  components: {
    panel
  },
  props: {
    url: {
      type: String,
      default: ''
    }
  },
  data: function () {
    return {
      bpmnModeler: null,
      bpmData: new BpmData()
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
          self.importDiagram(text)
        })
        .catch(function (err) {
          self.$emit('error', err)
        })
    },
    importDiagram: function (val) {
      var self = this
      this.bpmnModeler.importXML(val).then(function (result) {
        const { warnings } = result
        self.$emit('shown', warnings)
        self.bpmnModeler.get('canvas').zoom('fit-viewport')
        self.adjustPalette()
      }).catch(function (err) {
        self.$emit('error', err)
        throw err
      })
    },
    exportDiagram: function () {
      return this.bpmnModeler.saveXML({ format: true }).then(function (result) {
        return result.xml
      }).catch(function (err) {
        console.error('could not save BPMN 2.0 diagram', err)
        throw err
      })
    },
    // 调整左侧工具栏排版
    adjustPalette: function () {
      try {
        // 获取 bpmn 设计器实例
        const canvas = this.$refs.container
        const djsPalette = canvas.children[0].children[1].children[4]
        const djsPalStyle = {
          width: '130px',
          padding: '5px',
          background: 'white',
          left: '20px',
          borderRadius: 0
        }
        for (var key in djsPalStyle) {
          djsPalette.style[key] = djsPalStyle[key]
        }
        const palette = djsPalette.children[0]
        const allGroups = palette.children
        allGroups[0].style.display = 'none'
        // 修改控件样式
        for (var gKey in allGroups) {
          const group = allGroups[gKey]
          for (var cKey in group.children) {
            const control = group.children[cKey]
            const controlStyle = {
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: '100%',
              padding: '5px'
            }
            if (
              control.className &&
              control.dataset &&
              control.className.indexOf('entry') !== -1
            ) {
              const controlProps = this.bpmData.getControl(
                control.dataset.action
              )
              control.innerHTML = `<div style='font-size: 14px;font-weight:500;margin-left:15px;'>${
                controlProps.title
              }</div>`
              for (var csKey in controlStyle) {
                control.style[csKey] = controlStyle[csKey]
              }
            }
          }
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style scoped>
  /* 左边工具栏以及编辑节点的样式 */
  @import "~bpmn-js/dist/assets/diagram-js.css";
  @import "~bpmn-js/dist/assets/bpmn-font/css/bpmn.css";

  .modeler-wrapper {
    position: relative;
    background-color: #ffffff;
    width: 100%;
    height: 100%;
  }

  .vue-bpmn-diagram-container {
    height: 100%;
    width: 100%;
  }
</style>
