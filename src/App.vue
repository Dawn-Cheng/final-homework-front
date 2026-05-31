<template>
  <div class="mall-app">
    <!--
      用 router-view 的 v-slot 拿到当前路由组件，
      条件包 Phone 外壳，不直接写 <MallLayout />
    -->
    <router-view v-slot="{ Component }">
      <Phone v-if="showPhone">
        <component :is="Component" />
      </Phone>
      <component v-else :is="Component" />
    </router-view>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { MOCK_PHONE } from './config.js'
import Phone from './components/Phone.vue'

const route = useRoute()

const showPhone = computed(() => {
  if (!MOCK_PHONE) return false
  if (route.query.nomock !== undefined) return false
  return typeof window !== 'undefined' && window.innerWidth > 480
})
</script>
