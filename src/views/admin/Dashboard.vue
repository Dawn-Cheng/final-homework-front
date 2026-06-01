<template>
  <div class="dashboard">
    <h2>数据看板</h2>

    <!-- 6 统计卡片 -->
    <div class="stat-cards">
      <div class="stat-card" v-for="s in statCards" :key="s.label">
        <div class="stat-icon" :style="{ background: s.bg, color: s.color }">{{ s.icon }}</div>
        <div class="stat-body">
          <div class="stat-value">{{ s.value }}</div>
          <div class="stat-label">{{ s.label }}</div>
        </div>
      </div>
    </div>

    <!-- 柱状图 -->
    <div class="chart-box">
      <div ref="chartRef" class="chart-inner"></div>
    </div>

    <!-- AI 分析面板 -->
    <div class="ai-section">
      <div class="ai-header">
        <h3>🤖 AI 数据分析</h3>
        <button class="btn-ai" @click="handleAiAnalyze" :disabled="aiLoading">
          {{ aiLoading ? '分析中...' : '开始分析' }}
        </button>
      </div>
      <div v-if="aiResult" class="ai-result">{{ aiResult }}</div>
      <div v-if="!aiResult && !aiLoading" class="ai-placeholder">
        点击上方按钮，让 AI 分析当前经营数据并提出建议
      </div>
    </div>

    <!-- 快捷入口 -->
    <div class="quick-links">
      <div class="quick-card" @click="$router.push('/admin/orders')"><span>📋</span>订单管理</div>
      <div class="quick-card" @click="$router.push('/admin/goods')"><span>▣</span>商品管理</div>
      <div class="quick-card" @click="$router.push('/admin/categories')"><span>▤</span>分类管理</div>
      <div class="quick-card" @click="$router.push('/admin/banners')"><span>▥</span>轮播图管理</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { getDashboardStats, aiAnalyze } from '@/api/admin-index'
import { showToast } from '@/utils'

const chartRef = ref(null)
const stats = ref({})

const statCards = computed(() => {
  const s = stats.value
  const fmt = (n) => (n != null ? Number(n).toFixed(Number(n) % 1 !== 0 ? 2 : 0) : '0')
  return [
    { label: '商品总数', value: s.goodsCount ?? 0, icon: '▦', bg: '#e6f7ff', color: '#1890ff' },
    { label: '订单总数', value: s.orderCount ?? 0, icon: '▧', bg: '#f6ffed', color: '#52c41a' },
    { label: '用户总数', value: s.userCount ?? 0, icon: '▤', bg: '#fff7e6', color: '#fa8c16' },
    { label: '今日订单', value: s.todayOrderCount ?? 0, icon: '▥', bg: '#f0f5ff', color: '#722ed1' },
    { label: '今日营收', value: '¥' + fmt(s.todayRevenue), icon: '▨', bg: '#fff1f0', color: '#f5222d' },
    { label: '总营收', value: '¥' + fmt(s.totalRevenue), icon: '▩', bg: '#e6fffb', color: '#13c2c2' },
  ]
})

// ---- AI 分析 ----
const aiLoading = ref(false)
const aiResult = ref('')

async function handleAiAnalyze() {
  aiLoading.value = true
  aiResult.value = ''
  try {
    const res = await aiAnalyze('请分析当前经营数据，给出简要总结和建议')
    aiResult.value = res.data || '暂无分析结果'
  } catch (e) {
    showToast(e.message || 'AI 分析失败')
  } finally { aiLoading.value = false }
}

onMounted(async () => {
  try {
    const res = await getDashboardStats()
    stats.value = res.data || {}
  } catch { stats.value = {} }

  await nextTick()
  const s = stats.value
  const chart = echarts.init(chartRef.value)
  chart.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: 60, right: 30, top: 20, bottom: 30 },
    xAxis: {
      type: 'category',
      data: ['商品数', '订单总数', '今日订单', '用户数'],
      axisLabel: { fontSize: 13 },
    },
    yAxis: { type: 'value', minInterval: 1 },
    series: [{
      name: '数量',
      type: 'bar',
      barWidth: 64,
      data: [
        { value: s.goodsCount ?? 0, itemStyle: { color: '#1890ff', borderRadius: [4, 4, 0, 0] } },
        { value: s.orderCount ?? 0, itemStyle: { color: '#52c41a', borderRadius: [4, 4, 0, 0] } },
        { value: s.todayOrderCount ?? 0, itemStyle: { color: '#722ed1', borderRadius: [4, 4, 0, 0] } },
        { value: s.userCount ?? 0, itemStyle: { color: '#fa8c16', borderRadius: [4, 4, 0, 0] } },
      ],
    }],
  })
  window.addEventListener('resize', () => chart.resize())
})
</script>

<style scoped>
.dashboard h2 { font-size: 22px; font-weight: 600; color: #1a1a2e; margin-bottom: 24px; }

.stat-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 24px; }
.stat-card {
  background: #fff; border-radius: 8px; padding: 28px 24px;
  display: flex; align-items: center; gap: 18px;
  box-shadow: 0 1px 3px rgba(0,0,0,.06); transition: box-shadow .2s;
}
.stat-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,.08); }
.stat-icon {
  width: 56px; height: 56px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 26px; flex-shrink: 0;
}
.stat-body { flex: 1; min-width: 0; }
.stat-value {
  font-size: 28px; font-weight: 700; color: #1a1a2e;
  line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.stat-label { font-size: 14px; color: #999; margin-top: 4px; }

.chart-box {
  background: #fff; border-radius: 8px; padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,.06); margin-bottom: 24px;
}
.chart-inner { width: 100%; height: 380px; }

.ai-section {
  background: #fff; border-radius: 8px; padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,.06); margin-bottom: 24px;
}
.ai-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.ai-header h3 { font-size: 16px; font-weight: 600; color: #1a1a2e; }
.btn-ai {
  padding: 8px 24px; background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff; border: none; border-radius: 6px; font-size: 14px; cursor: pointer;
  transition: opacity .2s;
}
.btn-ai:hover { opacity: .85; }
.btn-ai:disabled { opacity: .5; cursor: not-allowed; }
.ai-result {
  background: #f8f9ff; border-radius: 6px; padding: 16px 20px;
  font-size: 14px; line-height: 1.8; color: #333; white-space: pre-wrap;
}
.ai-placeholder { color: #bbb; font-size: 14px; text-align: center; padding: 20px 0; }

.quick-links { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.quick-card {
  background: #fff; border-radius: 8px; padding: 22px; text-align: center;
  font-size: 15px; color: #555; cursor: pointer;
  box-shadow: 0 1px 3px rgba(0,0,0,.06); transition: all .2s;
}
.quick-card span { font-size: 28px; display: block; margin-bottom: 8px; color: #1890ff; }
.quick-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,.1); color: #1890ff; transform: translateY(-2px); }
</style>