<template>
  <div class="modeler-wrapper">
    <div ref="container" class="vue-bpmn-diagram-container" />
    <div v-if="testPanelOn" class="property-panel-container">
      <panel v-if="bpmnModeler" :modeler="bpmnModeler" />
    </div>
    <el-dialog
      :close-on-click-modal="false"
      title="节点属性"
      :visible.sync="panelVisible"
      width="50%"
    >
      <panel-pop v-if="panelVisible && bpmnModeler" :element="selectedElement" :modeler="bpmnModeler" />
      <!--<div slot="footer">
        <el-button type="primary" @click="">保存</el-button>
      </div>-->
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      title="流程属性"
      :visible.sync="processPanelVisible"
      width="50%"
    >
      <process-panel v-if="processPanelVisible && bpmnModeler" :element="selectedElement" :modeler="bpmnModeler" />
      <!--<div slot="footer">
        <el-button type="primary" @click="">保存</el-button>
      </div>-->
    </el-dialog>
  </div>
</template>

<script>
import BpmnModeler from './lib/bpmn-modeler.development.js' // 'bpmn-js/dist/bpmn-modeler.production.min.js'
import panel from './PropertyPanel' // 节点属性面板
import panelPop from './PropertyPanelPop' // 弹出式节点属性面板
import processPanel from './ProcessPropertyPanel' // 流程属性面板
import BpmData from './BpmData'

import paletteProvider from './custom-palette'
import contextPadProvider from './context-pad'
import flowableExtensionModule from './jp-flowable-bpmn-moddle/lib'
import flowableModdle from './jp-flowable-bpmn-moddle/resources/flowable'
import baseModedle from './jp-flowable-bpmn-moddle/resources/base'

import customRules from './custom-rules'

export default {
  name: 'BpmnModeler',
  components: {
    panel,
    panelPop,
    processPanel
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
      // bpmData: new BpmData(),
      panelVisible: false,
      selectedElement: null,
      processPanelVisible: false,
      testPanelOn: false
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

      additionalModules: [
        paletteProvider,
        contextPadProvider,
        flowableExtensionModule,
        customRules
      ],
      moddleExtensions: {
        flowable: flowableModdle,
        base: baseModedle
      },
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
        self.addDbClickHandler()
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
          width: '60px',
          padding: '5px',
          background: 'white',
          left: '20px',
          borderRadius: 0
        }
        for (var key in djsPalStyle) {
          djsPalette.style[key] = djsPalStyle[key]
        }

        /*
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
        } */
      } catch (e) {
        console.log(e)
      }
    },
    // 添加双击事件响应
    addDbClickHandler: function () {
      var that = this
      var eventBus = this.bpmnModeler.get('eventBus')
      eventBus.on('element.dblclick', function (e) {
        // e.element = the model element
        // e.gfx = the graphical element
        if (e.element.type === 'bpmn:Process') {
          that.selectedElement = e.element
          that.processPanelVisible = true
          return
        }
        const modeling = that.bpmnModeler.get('modeling')
        modeling.updateProperties(e.element, {}) // 覆盖默认的双击编辑名称
        that.selectedElement = e.element
        that.panelVisible = true
      })
    },
    setProcessProperty: function () {
      const elementRegistry = this.bpmnModeler.get('elementRegistry')
      this.selectedElement = elementRegistry.filter(item => {
        return item.type === 'bpmn:Process'
      })[0]
      if (this.selectedElement) {
        this.processPanelVisible = true
      }
    },
    undo: function () {
      this.bpmnModeler.get('commandStack').undo()
    },
    redo: function () {
      this.bpmnModeler.get('commandStack').redo()
    }
  }
}
</script>

<style scoped>
  /* 左边工具栏以及编辑节点的样式 */
  @import "~bpmn-js/dist/assets/diagram-js.css";
  @import "~bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
  @import "~bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
  @import "~bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";

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

  .property-panel-container {
    position: absolute;
    right: 0;
    top: 0;
    border-left: 1px solid #cccccc;
    padding: 20px 5px;
    width: 300px;
    height: 100%;
  }
</style>
