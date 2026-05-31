<template>
  <div class="phone-wrapper">
    <div class="phone" :class="{ 'is-tablet': mode === 'tablet' }">
      <div class="phone-camera"></div>
      <div class="phone-screen">
        <!-- 状态栏图片：在 phone-screen 内部绝对定位 -->
        <!-- 超出圆角的部分会被 overflow:hidden 自动裁剪 -->
        <img v-if="MOCK_STATUS_BAR && mode !== 'tablet'" :src="MOCK_STATUS_BAR" class="phone-status-bar" alt="status bar" />
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { MOCK_STATUS_BAR } from '@/config'

defineProps({
  mode: {
    type: String,
    default: 'phone',
    validator: v => ['phone', 'tablet'].includes(v)
  }
})
</script>

<style scoped>
.phone-wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
  background: transparent;
  -webkit-user-select: none;
  user-select: none;
}

/* 大屏幕垂直居中 */
@media (min-height: 920px) {
  .phone-wrapper {
    align-items: center;
    padding-top: 0;
  }
}

.phone {
  width: 390px;
  height: 844px;
  background: #000;
  border-radius: 44px;
  padding: 12px;
  box-shadow:
    0 0 0 2px #333,
    0 30px 80px rgba(0, 0, 0, 0.4);
  position: relative;
  flex-shrink: 0;
}

/* 右侧音量键 */
.phone::before {
  content: '';
  position: absolute;
  right: -3px;
  top: 120px;
  width: 3px;
  height: 30px;
  background: #333;
  border-radius: 0 2px 2px 0;
  box-shadow:
    0 40px 0 0 #333,
    0 80px 0 0 #333;
}

/* 前置摄像头 */
.phone-camera {
  position: absolute;
  top: 22px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  background: #1a1a1a;
  border-radius: 50%;
  z-index: 20;
  box-shadow: 0 0 0 1.5px #000;
}

/* 手机屏幕（黑边内部区域）*/
.phone-screen {
  width: 100%;
  height: 100%;
  border-radius: 32px;
  overflow: hidden;
  background: #fff;
  /* 关键：裁剪超出圆角的部分 */
  position: relative;
  display: flex;
  padding-top: 38px;

  flex-direction: column;
}

/* 顶部状态栏图片：相对于 phone-screen 绝对定位 */
/* 超出圆角的部分被 phone-screen 的 overflow:hidden 自动裁剪 */
.phone-status-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 40px;
  object-fit: cover;
  pointer-events: none;
  /* 不需要手动设 border-radius，父元素 overflow:hidden 会自动裁剪 */
}

/* ========== 平板模式 ========== */
.phone.is-tablet {
  width: 1260px;
  height: 800px;
  border-radius: 24px;
  padding: 6px;
  background: #1a1a1a;
}

/* 平板模式：始终居中 */
.phone-wrapper:has(.is-tablet) {
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.phone.is-tablet .phone-screen {
  border-radius: 18px;
  padding-top: 0;
}

.phone.is-tablet::before {
  display: none;
}

.phone.is-tablet .phone-camera {
  top: 12px;
  width: 6px;
  height: 6px;
  background: #333;
  box-shadow: 0 0 0 1px #000;
}

.phone.is-tablet .phone-screen {
  border-radius: 20px;
  padding-top: 0;
}

/* 移动端：去掉模拟框 */
@media (max-width: 480px) {
  .phone-wrapper {
    padding: 0;
    background: #f5f5f5;
    min-height: 100dvh;
  }

  .phone {
    width: 100%;
    height: 100dvh;
    border-radius: 0;
    padding: 0;
    box-shadow: none;
    background: transparent;
  }

  .phone::before,
  .phone-camera {
    display: none;
  }

  .phone-screen {
    border-radius: 0;
  }

  .phone-status-bar {
    display: none;
  }
}
</style>
