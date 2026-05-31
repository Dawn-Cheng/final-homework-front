/**
 * 商城手机模拟框配置
 * 修改后重启 dev server 生效
 */

// 是否启用手机模拟框（桌面端）
// 设为 false 则直接渲染内容，不包手机外壳
export const MOCK_PHONE = true

// 手机顶部状态栏图片（public 目录下）
// phont_tab.jpg 是顶部导航栏（时间/信号/电量），不是底部标签栏
// 设为空字符串则不显示
export const MOCK_STATUS_BAR = '/phont_tab.jpg'

// 手机底部标签栏背景图片（public 目录下）
// 设为空字符串则使用默认白色背景
export const MOCK_TAB_BG = ''
