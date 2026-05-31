const http = require('http')
const fs = require('fs')
const path = require('path')

// 读取当前文件内容，检查是否有语法错误
const files = [
  'D:\\project\\Vue\\mall_f_a\\src\\views\\mall\\MallLayout.vue',
  'D:\\project\\Vue\\mall_f_a\\src\\styles\\global.css'
]

for (const f of files) {
  console.log(`\n=== ${path.basename(f)} ===`)
  const content = fs.readFileSync(f, 'utf8')
  // 检查是否有明显问题
  console.log('Has <style scoped>:', content.includes('<style scoped>'))
  console.log('Has position: fixed:', content.includes('position: fixed'))
  console.log('Has overflow: hidden:', content.includes('overflow: hidden'))
  console.log('File size:', content.length, 'bytes')
}
