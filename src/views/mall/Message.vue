<template>
  <div class="message-page">
    <div v-if="messages.length" class="msg-list">
      <div v-for="msg in messages" :key="msg.id" class="msg-item">
        <img :src="msg.avatar" class="msg-avatar" @error="e => e.target.style.display = 'none'" />
        <div class="msg-info">
          <div class="msg-top">
            <span class="msg-title">{{ msg.title }}</span>
            <span class="msg-time">{{ msg.lastTime }}</span>
          </div>
          <p class="msg-preview">{{ msg.lastMessage }}</p>
        </div>
      </div>
    </div>
    <div v-else class="empty-state">
      <p>暂无消息</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getMessages } from '@/api/message'

const messages = ref([])

onMounted(async () => {
  try {
    const res = await getMessages()
    messages.value = res.data || []
  } catch { messages.value = [] }
})
</script>

<style scoped>
.message-page {
  background: var(--color-white);
}

.msg-item {
  display: flex;
  align-items: center;
  padding: 14px;
  border-bottom: 1px solid var(--color-border);
  gap: 12px;
  cursor: pointer;
}

.msg-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  background: #f0f0f0;
  flex-shrink: 0;
}

.msg-info {
  flex: 1;
  min-width: 0;
}

.msg-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.msg-title {
  font-size: var(--font-md);
  font-weight: 500;
}

.msg-time {
  font-size: var(--font-xs);
  color: var(--color-text-light);
}

.msg-preview {
  font-size: var(--font-sm);
  color: var(--color-text-light);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
