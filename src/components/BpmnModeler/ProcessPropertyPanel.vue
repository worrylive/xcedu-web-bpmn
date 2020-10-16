<template>
  <div ref="processPropertyPanel" class="property-panel">
    <el-form
      :model="form"
      label-width="100px"
      size="small"
    >
      <el-form-item label="流程Key">
        <el-input v-model="form.id" disabled />
      </el-form-item>
      <el-form-item label="流程名称">
        <el-input v-model="form.name" @input="itemChange($event, 'name')" />
      </el-form-item>
      <el-form-item label="流程描述">
        <el-input v-model="form.description" @input="itemChange($event, 'description')" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'ProcessPropertyPanel',
  props: {
    modeler: {
      type: Object,
      required: true
    },
    element: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      form: {
        id: '',
        name: '',
        description: ''
      }
    }
  },
  mounted () {
    this.handleElement()
  },
  methods: {
    handleElement () {
      const element = this.element
      if (!element) return
      this.form = {
        ...element.businessObject,
        ...element.businessObject.$attrs
      }
    },
    itemChange (value, key) {
      const modeling = this.modeler.get('modeling')
      var p = {}
      p[key] = value
      modeling.updateProperties(this.element, p)
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
