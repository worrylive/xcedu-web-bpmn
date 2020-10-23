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
  watch: {
    'form.description': {
      handler (val) {
        this.element.businessObject.useTableTree = '2c90abb8750fedef0175103068b800cf'
        this.element.businessObject.processbuttype = '0'
        this.element.businessObject.flowType = '1'
        this.element.businessObject.commentSort = '0'
        this.element.businessObject.formType = '0'
        this.element.businessObject.formId = '2c90abb8750fedef0175103068b800cf'

        var moddle = this.modeler.get('moddle')

        var extensionElements = this.element.businessObject.get('extensionElements')

        if (!extensionElements) {
          extensionElements = moddle.create('bpmn:ExtensionElements')
        }

        extensionElements = moddle.create('bpmn:ExtensionElements')
        // key
        var elemkey = moddle.create('flowable:xcField', { name: 'ssss' })
        // value
        var elemvalue = moddle.create('flowable:xcString', {
          // eslint-disable-next-line
          body: '${ value > 100 }'
        })
        elemkey.get('xcString').push(elemvalue)
        extensionElements.get('values').push(elemkey)
        this.modeler.get('modeling').updateProperties(this.element, { extensionElements: extensionElements })
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
