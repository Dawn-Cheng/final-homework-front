<template>
  <div class="dashboard">
    <h2>数据看板</h2>
    <div class="stat-cards">
      <div class="stat-card">
        <div class="stat-icon" style="background:#e6f7ff;color:#1890ff">▦</div>
        <div class="stat-body">
          <div class="stat-value">{{ stats[0].value }}</div>
          <div class="stat-label">商品总数</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:#f6ffed;color:#52c41a">▤</div>
        <div class="stat-body">
          <div class="stat-value">{{ stats[1].value }}</div>
          <div class="stat-label">分类总数</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:#fff7e6;color:#fa8c16">▥</div>
        <div class="stat-body">
          <div class="stat-value">{{ stats[2].value }}</div>
          <div class="stat-label">轮播图数量</div>
        </div>
      </div>
    </div>

    <div class="chart-box">
      <div ref="chartRef" class="chart-inner"></div>
    </div>

    <div class="quick-links">
      <div class="quick-card" @click="$router.push('/admin/goods')">
        <span>▣</span>商品管理
      </div>
      <div class="quick-card" @click="$router.push('/admin/categories')">
        <span>▤</span>分类管理
      </div>
      <div class="quick-card" @click="$router.push('/admin/banners')">
        <span>▥</span>轮播图管理
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import adminHttp from '@/api/admin-index'

const chartRef = ref(null)
const stats = reactive([
  { label: '商品总数', value: 0 },
  { label: '分类总数', value: 0 },
  { label: '轮播图数量', value: 0 },
])

onMounted(async () => {
  try {
    const [goodsRes, catRes, bannerRes] = await Promise.all([
      adminHttp.get('/api/admin/goods'),
      adminHttp.get('/api/admin/categories'),
      adminHttp.get('/api/admin/banners'),
    ])
    stats[0].value = (goodsRes.data?.list || []).length
    stats[1].value = (catRes.data || []).length
    stats[2].value = (bannerRes.data || []).length

    await nextTick()
    const chart = echarts.init(chartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: 50, right: 30, top: 30, bottom: 30 },
      xAxis: {
        type: 'category',
        data: ['商品', '分类', '轮播图'],
        axisLabel: { fontSize: 14 },
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
      },
      series: [{
        name: '数量',
        type: 'bar',
        barWidth: 80,
        data: [
          { value: stats[0].value, itemStyle: { color: '#1890ff', borderRadius: [4, 4, 0, 0] } },
          { value: stats[1].value, itemStyle: { color: '#52c41a', borderRadius: [4, 4, 0, 0] } },
          { value: stats[2].value, itemStyle: { color: '#fa8c16', borderRadius: [4, 4, 0, 0] } },
        ],
      }],
    })
    window.addEventListener('resize', () => chart.resize())
  } catch {}
})
</script>

<style scoped>
.dashboard h2 {
  font-size: 22px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 24px;
}

/* 统计卡片 */
.stat-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}
.stat-card {
  background: #fff;
  border-radius: 8px;
  padding: 28px 24px;
  display: flex;
  align-items: center;
  gap: 18px;
  box-shadow: 0 1px 3px rgba(0,0,0,.06);
  transition: box-shadow .2s;
}
.stat-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,.08);
}
.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  flex-shrink: 0;
}
.stat-body {
  flex: 1;
}
.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a2e;
  line-height: 1.2;
}
.stat-label {
  font-size: 14px;
  color: #999;
  margin-top: 4px;
}

/* 图表 */
.chart-box {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,.06);
  margin-bottom: 24px;
}
.chart-inner {
  width: 100%;
  height: 380px;
}

/* 快捷入口 */
.quick-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.quick-card {
  background: #fff;
  border-radius: 8px;
  padding: 22px;
  text-align: center;
  font-size: 15px;
  color: #555;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0,0,0,.06);
  transition: all .2s;
}
.quick-card span {
  font-size: 28px;
  display: block;
  margin-bottom: 8px;
  color: #1890ff;
}
.quick-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,.1);
  color: #1890ff;
  transform: translateY(-2px);
}
</style>
