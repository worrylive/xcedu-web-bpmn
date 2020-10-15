<template>
  <div ref="processPropertyPanel" class="property-panel">
    <el-form
      :model="processData"
      label-width="100px"
      size="small"
    >
      <el-form-item label="流程名称">
        <el-input v-model="processData.name" />
      </el-form-item>
      <el-form-item label="流程Key">
        <el-input v-model="processData.id" disabled />
      </el-form-item>
      <el-form-item label="流程描述">
        <el-input v-model="processData.description" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'ProcessPropertyPanel',
  props: {
    processData: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
  .property-panel {
    padding: 10px;
    width: 100%;
  }
</style>
