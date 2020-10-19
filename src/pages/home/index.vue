<template>
  <div>
    <el-button @click="changeDiagram">切换图表</el-button>
    <el-upload
      action=""
      :show-file-list="false"
      :before-upload="beforeUpload"
      style="display: inline;"
    >
      <el-button>导入图表</el-button>
    </el-upload>
    <el-button @click="exportDiagram">导出图表</el-button>
    <el-button @click="setProcessProperty">流程属性</el-button>
    <el-button @click="handleUndo">撤销</el-button>
    <el-button @click="handleRedo">重做</el-button>
    <div class="diagram-container">
      <bpmn-modeler
        ref="modeler"
        :url="publicPath + urls[currentUrlIndex]"
      />
    </div>
    <div v-if="testViewerOn" class="diagram-container">
      <bpmn-viewer
        :url="publicPath + urls[currentUrlIndex]"
        @error="handleError"
        @shown="handleShown"
      />
    </div>
  </div>
</template>

<script>
import BpmnViewer from '@component/BpmnViewer'
import BpmnModeler from '@component/BpmnModeler/index'

export default {
  components: {
    BpmnViewer,
    BpmnModeler
  },
  data () {
    return {
      publicPath: process.env.WEB_PUBLIC_PATH,
      urls: [
        'diagram.bpmn',
        'pizza-collaboration.bpmn'
      ],
      currentUrlIndex: 0,
      testViewerOn: false
    }
  },
  methods: {
    changeDiagram: function () {
      this.currentUrlIndex++
      if (this.currentUrlIndex >= this.urls.length) {
        this.currentUrlIndex = 0
      }
    },
    beforeUpload: function (file) {
      var that = this
      var reader = new FileReader()
      reader.onload = function (e) {
        var xml = e.target.result
        that.$refs.modeler.importDiagram(xml)
      }
      reader.readAsText(file)
      return false
    },
    exportDiagram: function () {
      this.$refs.modeler.exportDiagram().then(function (xml) {
        if (xml) {
          var encodedData = encodeURIComponent(xml)
          var a = document.createElement('a')
          a.style.display = 'none'
          a.href = 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData
          a.setAttribute('download', 'diagram.bpmn')
          if (typeof a.download === 'undefined') {
            a.setAttribute('target', '_blank')
          }
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
        }
      })
    },
    setProcessProperty: function () {
      this.$refs.modeler.setProcessProperty()
    },
    handleError: function (err) {
      console.error('failed to show diagram', err)
    },
    handleShown: function () {
      console.log('diagram shown')
    },
    handleUndo: function () {
      this.$refs.modeler.undo()
    },
    handleRedo: function () {
      this.$refs.modeler.redo()
    }
  }
}
</script>

<style>
  /* 去除bpmn.io水印 */
  .bjs-powered-by {
    display: none;
  }
</style>

<style scoped>
  .diagram-container {
    border: 1px solid gray;
    height: 500px;
    margin-top: 10px;
  }
</style>
