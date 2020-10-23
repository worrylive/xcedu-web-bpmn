<template>
  <div ref="propertyPanel" class="property-panel">
    <el-form v-show="element" :model="form" label-width="100px" size="small">
      <el-form-item label="节点ID">
        <el-input v-model="form.id" disabled />
      </el-form-item>
      <el-form-item label="节点名称">
        <el-input v-model="form.name" @input="nameChange" />
      </el-form-item>
      <el-form-item label="节点颜色">
        <el-color-picker v-model="form.color" @change="colorChange" />
      </el-form-item>
      <!--<el-form-item label="必须项">
        <el-input v-model="form.required" @input="itemChange($event, 'required')" />
      </el-form-item>-->
      <!-- 任务节点允许选择人员 -->
      <el-form-item v-if="userTask" label="节点人员">
        <el-select v-model="form.userType" placeholder="请选择" @change="typeChange">
          <el-option value="assignee" label="指定人员" />
          <el-option value="candidateUsers" label="候选人员" />
          <el-option value="candidateGroups" label="角色/岗位" />
        </el-select>
      </el-form-item>
      <!-- 指定人员 -->
      <el-form-item v-if="userTask && form.userType === 'assignee'" label="指定人员">
        <el-select
          key="1"
          v-model="form.assignee"
          placeholder="请选择"
          @change="(value) => addUser({assignee: value})"
        >
          <el-option
            v-for="item in users"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <!-- 候选人员 -->
      <el-form-item v-else-if="userTask && form.userType === 'candidateUsers'" label="候选人员">
        <el-select
          key="2"
          v-model="form.candidateUsers"
          placeholder="请选择"
          multiple
          @change="(value) => addUser({candidateUsers: value.join(',') || value})"
        >
          <el-option
            v-for="item in users"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <!-- 角色/岗位 -->
      <el-form-item v-else-if="userTask && form.userType === 'candidateGroups'" label="角色/岗位">
        <el-select
          v-model="form.candidateGroups"
          placeholder="请选择"
          @change="(value) => addUser({candidateGroups: value})"
        >
          <el-option
            v-for="item in roles"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <!-- 分支允许添加条件 -->
      <el-form-item v-if="sequenceFlow" label="分支条件">
        <el-select v-model="form.user" placeholder="请选择">
          <el-option
            v-for="item in users"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'PropertyPanelPop',
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
        color: null
      },
      users: [
        {
          value: 'zhangsan',
          label: '张三'
        },
        {
          value: 'lisi',
          label: '李四'
        },
        {
          value: 'wangwu',
          label: '王五'
        }
      ],
      roles: [
        {
          value: 'manager',
          label: '经理'
        },
        {
          value: 'personnel',
          label: '人事'
        },
        {
          value: 'charge',
          label: '主管'
        }
      ]
    }
  },
  computed: {
    userTask () {
      if (!this.element) {
        return
      }
      return this.element.type === 'bpmn:UserTask'
    },
    sequenceFlow () {
      if (!this.element) {
        return
      }
      return this.element.type === 'bpmn:SequenceFlow'
    }
  },
  watch: {
    'form.name': {
      handler (val) {
        // 演示 任务、连线属性
        if (this.element && this.element.type === 'bpmn:UserTask') {
          this.element.businessObject.formKey = '2c90abb8750fedef0175103068b800cf'
          this.element.businessObject.taskButtons = 'bpmsaveButton,bpmbackButton,bpmsendButton,bpmcompletereadButton,bpmrecallButton,bpmreacallreadButton,bpmprintButton,bpmsendReadButton,bpmfocusButton'
          this.element.businessObject.editFieldIds = 'custom_auto_20201010094649113-column_1602294402036,custom_auto_20201010094649113-column_1602294404180'
          this.element.businessObject.actneedRead = '1'
          this.element.businessObject.actnullSkip = '1'
          this.element.businessObject.actcanSkip = '1'
          this.element.businessObject.actDealAutoChooseAll = '1'
          this.element.businessObject.actReadAutoChooseAll = '1'
          this.element.businessObject.actneedDueDate = '1'
          this.element.businessObject.actneedAutoComplete = '1'
          this.element.businessObject.actneedRemindDueDat = '1'
          this.element.businessObject.formKeyName = '2c90abb8750fedef0175103068b800cf'
          this.element.businessObject.participantMode = '2'
          this.element.businessObject.participantType = 'defaultUser'
          this.element.businessObject.participantRule = '2c90abb8750fedef0175103068b800cf'
        }

        if (this.element && this.element.type === 'bpmn:SequenceFlow') {
          // this.element.businessObject.conditionExpression = 'ss>1'
          // eslint-disable-next-line
          debugger

          var moddle = this.modeler.get('moddle')

          const modeling = this.modeler.get('modeling')

          var newCondition = moddle.create('bpmn:FormalExpression', {
            // eslint-disable-next-line
            body: '${value>100}'
          })
          // when
          modeling.updateProperties(this.element, {
            conditionExpression: newCondition
          })
        }
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
      if (this.element.type === 'bpmn:UserTask' && this.form.userType === 'candidateUsers') {
        this.form.candidateUsers =
          this.form.candidateUsers.split(',') || []
      }
    },
    // 属性面板名称，更新回流程节点
    nameChange (name) {
      const modeling = this.modeler.get('modeling')
      modeling.updateLabel(this.element, name)
    },
    // 属性面板颜色，更新回流程节点
    colorChange (color) {
      const modeling = this.modeler.get('modeling')
      modeling.setColor(this.element, {
        fill: null,
        stroke: color
      })
      modeling.updateProperties(this.element, { color: color })
    },
    itemChange (value, key) {
      const modeling = this.modeler.get('modeling')
      var p = {}
      p[key] = value
      modeling.updateProperties(this.element, p)
    },
    // 任务节点配置人员
    addUser (properties) {
      this.updateProperties(
        Object.assign(properties, {
          userType: Object.keys(properties)[0]
        })
      )
    },
    // 切换人员类型
    typeChange () {
      const types = ['assignee', 'candidateUsers', 'candidateGroups']
      types.forEach(type => {
        delete this.element.businessObject.$attrs[type]
        delete this.form[type]
      })
    },
    // 在这里我们封装一个通用的更新节点属性的方法
    updateProperties (properties) {
      const modeling = this.modeler.get('modeling')
      modeling.updateProperties(this.element, properties)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
