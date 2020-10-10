<template>
  <section class="module-layout">
    <headder />
    <div class="content">
      <router-view />
    </div>
  </section>
</template>

<script>
import { getUserInfo } from '@api/index'
import headder from '@/pages/components/headder'
function getParam (queryName) {
  var reg = new RegExp('(^|&)' + queryName + '=([^&]*)(&|$)', 'i')
  var r = window.location.search.substr(1).match(reg)
  if (r !== null) {
    return decodeURI(r[2])
  } else {
    return ''
  }
}
export default {
  components: {
    headder
  },
  data () {
    return {

    }
  },
  beforeRouteEnter (to, from, next) {
    // window.webStorage.setItem('DirectHost', '192.168.20.144')
    const token = getParam('token')
    if (token) {
      window.webStorage.setItem('token', token)
    } else {
      // const tmpToken = ''
      // const tmpToken = 'eyJhbGciOiJIUzUxMiIsInppcCI6IkRFRiJ9.eNqMU81u00AQfhefnWodO7aTW8UJqXDiBfZn7Gxjr61db2IHIQHiyAUhDtzKhVslBJe2gHiZpoW3YNZO0hQ44IN3vm-_mZ2dmX3qnTbSm3kxFyLIaDZiwINRRNN4NE0mkxGQJIogGIeTKfV8z1iG4pTSMImjNBaETVmSkiAWQUiySSYYIaETSmNQWHZVlkkOdUEbGDXVAtTIgF6CdhLaeLNgMk3GaZpEoe9BWw9EGAZTR1Q6P6lU_piWgME2lz9-vX1xffH8-uL86Pb99-urNzdnHzavr45u3n3anH-8_frK6322-kOWV7p-KJAkCGrQ5YNKgMuQF9QYDaBmhAR-n62kxcxA82-C1eWspIrmoHvczutHPfwLjX0qhAZjTqQZfI3Mla237j0zr6yRKr9nLyWseqLRtBuiaR9aWu5sg5eBO9kAnZVrKiwWersXYAJLaeDwwLLSeBne8eIQ72MNUNCGzvaoP6MzDewTUJUuabFDmKZUfyY-MD2QJTyhrDjI-I5yaAnKwr2aYtEqq3m_7eakzPvWjfmUUMbSJCBsnEQBCZwVUpxESkg0GZrvGotiM7etBaQsztsx55VVjWv3HFRjlZtkaLfjoKsCduMg1qzOi27f92NRSuUb9Kqlzxd5oTtczBqXBieztaqwPiudi8EGrkDt1lbSamcze2eVKMnXXeZc8FkF_oJWK-vzOV1Q5a9AzjGg7MA_lVR1SIkuL_y2cfpTU7cIFgx_PHc0W3duI8vbQmwvu3st385-vvy8ufyypfsS_sfDxRLel3IWZHGK1UZrHE1JEhP8Eu_ZbwAAAP__.PgBaMryxsZItnP032cTnuEjx_er3urOVzgVGCc0LcIxNEJRJNRm6rd88Xa0LGeE4NfSqrO4qmnD4uweDVAaAww'
      // window.webStorage.setItem('token', tmpToken)
    }
    getUserInfo().then(res => {
      window.webStorage.setItem('userInfo', JSON.stringify(res))
      next()
    })
  }
}
</script>

<style scoped>
  .module-layout {
    height: 100%;
  }

  .module-layout .content {
    height: calc(100% - 60px);
    overflow: auto;
    padding: 20px 50px;
  }
</style>
