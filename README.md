<!-- 顶部 banner -->
<div align="center">

# 💊 慢病用药小管家

<p>
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=18&duration=2800&pause=900&color=FF2C55&center=true&vCenter=true&width=560&lines=AI+%E8%BE%85%E5%8A%A9%E7%9A%84%E6%85%A2%E7%97%85%E7%94%A8%E8%8D%AF%E7%AE%A1%E7%90%86%E5%8A%A9%E6%89%8B;%E8%AE%A9%E7%88%B6%E6%AF%8D%E4%B8%8D%E5%86%8D%E5%BF%98%E6%9C%8D%E8%8D%AF%2C+%E8%AE%A9%E5%AE%B6%E5%B1%9E%E5%B0%91%E6%93%8D%E5%BF%83;%E2%9C%85+%E6%89%93%E5%8D%A1+%C2%B7+%E2%8F%B0+%E6%8F%90%E9%86%92+%C2%B7+%F0%9F%92%8A+%E7%BB%AD%E6%96%B9+%C2%B7+%F0%9F%A4%96+AI+%E7%9B%B8%E4%BA%92%E4%BD%9C%E7%94%A8" alt="Typing animation" />
</p>

**美团 AI Coding Test 答题作品**

<p>
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-16-000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js"/></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind"/></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License"/></a>
</p>

[**🚀 快速开始**](#-快速开始) · [**✨ 功能亮点**](#-功能亮点) · [**🛠 技术栈**](#-技术栈) · [**🎯 设计决策**](./DEVELOPMENT.md)

</div>

---

## 🎯 这是什么

> **复诊开药不难，难在坚持按时吃药。**

慢病患者线上复诊后最痛的不是「看不到病」，而是后面 30 天里：

- 🤔 早饭后那粒到底吃了没？
- 📅 下次复诊是哪天来着？
- 💊 这个药剩 3 天，要续方还是再去趟医院？
- ⚠️ 我同时吃这两种药，会不会冲突？

**慢病用药小管家** 把"问诊→购药→用药→续方"压成一个闭环，
聚焦于**用药这段路**——可执行、可追踪、可提醒。

> ⚠️ **AI 安全边界**：本应用 **不诊断、不开处方、不替代医嘱**。每个 AI 输出都附带"请咨询医生或药师确认"。

---

## ✨ 功能亮点

<table>
<tr>
<td width="50%" valign="top">

### 📅 今日用药 + 极速问诊
- 时间线分组：`待服药 / 已服药`
- 一键打卡，进度条实时更新依从率
- 误触可撤销，重新点击恢复待服
- 内置「联系医生 / AI 检症状」快捷入口

### 🛒 购药续方
- 药箱库存预警（按到期日排序）
- 一键「美团买药」复购（模拟接口）
- 处方有效期倒计时
- 申请线上续方（模拟接口）

### 📷 拍照识别（OCR Mock）
- 模拟扫描处方/药盒
- 提取药品名 / 剂量 / 用药时间 / 餐时关系 / 有效期
- 人工核对修改后同步到用药计划

</td>
<td width="50%" valign="top">

### 🩺 健康档案
- 4 类慢病模板（糖尿病/高血压/高血脂/其他）
- 复诊提醒日历（模拟）
- 智能设备数据同步（模拟）
- 折线图展示血糖 / 血压 / 心率趋势

### 🔍 药物相互作用查询（AI）
- 输入两种药物，AI 检查是否冲突
- 高 / 中 / 低风险分级
- 默认 `gpt-4o-mini`，BYOK 兼容 OpenAI / DeepSeek

### 👴 关怀模式（适老化）
- 一键切换大字号 / 大按钮 / 高对比度
- CSS 变量缩放 rem，**一套代码两种体验**

### 🔑 BYOK / Mock 双模式
- 自带 API Key 解锁所有 AI 功能
- 不配置则走本地 Mock，演示流畅不掉链

</td>
</tr>
</table>

---

## 🚀 快速开始

```bash
git clone https://github.com/theAtlantic-zza/meituan-ai-coding-test--chronic-med-care.git
cd meituan-ai-coding-test--chronic-med-care
npm install
npm run dev
```

打开 `http://localhost:3000` 即可。

### 配置 AI（可选）

点击页面右上角 🔑 按钮，输入 API Key 和 Base URL。
**密钥仅存储在浏览器本地**，不上传任何服务器。

> 💡 不配置 Key 也能完整体验：所有 AI 功能会自动 fallback 到 Mock 数据。

---

## 🛠 技术栈

| 层 | 选型 | 备注 |
|---|---|---|
| 框架 | **Next.js 16** | App Router |
| 语言 | **TypeScript** | strict 模式 |
| 样式 | **Tailwind CSS v4** | 原子化 |
| 状态 | **React Context + localStorage** | 无 Redux 心智负担 |
| AI | **OpenAI 兼容 API + Mock 兜底** | BYOK 友好 |

---

## 🗂 项目结构

```
src/
├── app/
│   ├── api/check-interaction/route.ts  → 药物相互作用 AI 接口
│   ├── page.tsx                        → 单页应用主入口
│   ├── layout.tsx                      → 根布局
│   └── globals.css                     → 全局样式 + 关怀模式
├── components/
│   ├── header.tsx                      → 顶栏（关怀模式 + API Key）
│   ├── nav-bar.tsx                     → 底部三栏导航
│   ├── dashboard-view.tsx              → 今日用药 + 极速问诊
│   ├── pharmacy-view.tsx               → 购药续方主页面
│   ├── health-view.tsx                 → 健康档案主页面
│   ├── interaction-view.tsx            → 药物相互作用查询
│   ├── device-view.tsx                 → 设备数据面板
│   ├── add-medication-modal.tsx        → 新增药物弹窗
│   └── quick-actions-sheet.tsx         → 快捷操作面板
└── lib/
    ├── types.ts                        → 核心类型定义
    ├── mock-data.ts                    → 疾病模板 + Mock 数据
    ├── store.ts                        → localStorage 持久化
    └── context.tsx                     → React Context 全局状态
```

---

## 📚 配套文档

- 📐 [**DEVELOPMENT.md**](./DEVELOPMENT.md) — 设计决策与权衡（为什么这样做）
- 🧠 [**CONTEXT.md**](./CONTEXT.md) — 上下文压缩 / harness engineering
- 🤖 [**CLAUDE.md**](./CLAUDE.md) — AI 协作规范

---

## 📄 License

[MIT](./LICENSE) © 2026 theAtlantic-zza

<div align="center">

---

**慢病用药小管家** — AI 辅助，你做决定。

<sub>本项目为美团 AI Coding Test 答题作品，仅供学习交流。所有医疗建议请以执业医师诊断为准。</sub>

</div>
