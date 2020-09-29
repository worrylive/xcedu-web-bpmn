<template>
  <section class="app-header">
    <div class="logo">
      <Logo />
    </div>
    <div class="user">
      <User />
    </div>
  </section>
</template>

<script>
export default {
  name: 'Headder',
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>
<style scoped>
  .app-header {
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.35);
    padding: 0 50px;
  }
</style>
