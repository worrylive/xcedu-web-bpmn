<template>
  <div>
    <el-button @click="changeDiagram">切换图表</el-button>
    <div class="diagram-container">
      <vue-bpmn
        :url="publicPath + urls[currentUrlIndex]"
        @error="handleError"
        @shown="handleShown"
      />
    </div>
  </div>
</template>

<script>
import VueBpmn from '@component/VueBpmn'

export default {
  components: {
    VueBpmn
  },
  data () {
    return {
      publicPath: process.env.WEB_PUBLIC_PATH,
      urls: [
        'diagram.bpmn',
        'pizza-collaboration.bpmn'
      ],
      currentUrlIndex: 0
    }
  },
  methods: {
    changeDiagram: function () {
      this.currentUrlIndex++
      if (this.currentUrlIndex >= this.urls.length) {
        this.currentUrlIndex = 0
      }
    },
    handleError: function (err) {
      console.error('failed to show diagram', err)
    },
    handleShown: function () {
      console.log('diagram shown')
    }
  }
}
</script>

<style scoped>
  .diagram-container {
    border: 1px solid gray;
    height: 500px;
    margin-top: 10px;
  }
</style>
