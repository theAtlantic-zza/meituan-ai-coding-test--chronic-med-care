<div align="center">

# 💊 慢病用药小管家

**帮助慢性病患者管理用药计划、智能提醒、药物查询的 AI 助手**

![Next.js](https://img.shields.io/badge/Next.js_16-000?logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?logo=tailwindcss&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?logo=react&logoColor=black)

</div>

---

## Why / 为什么做这个项目？

> **复诊开药不难，难在坚持按时吃药。**

慢病患者线上复诊开药后，最常见的问题是：
- 忘记按时服药 / 漏服
- 重复购买 / 不知道是否该续方
- 家属无法轻量地帮老人做用药管理

本项目的目标不是做“医疗诊断”，而是把“用药”这段链路做成可执行、可追踪、可提醒的闭环。

## 产品背景

> 慢性病患者线上复诊开药后，常忘记按时服药或重复购买，缺乏从"问诊→购药→用药→续方"的连贯服务。

本应用聚焦**用药管理**环节，帮助患者（尤其是老年人）：

- 按时间线管理每日用药，一键打卡
- 查询药物相互作用（AI 驱动）
- 追踪处方有效期，提醒及时续方
- 连接智能设备数据，关联用药效果

## 功能亮点

### 📋 今日用药

按时间段（早晨/中午/傍晚/睡前）展示用药计划，点击即可打卡。进度条实时显示今日依从率。

> 默认是**空白模式**：只有你手动点击“示例模式（Mock）”才会导入演示数据。

### ➕ 快速添加药物（首页左下角）

首页左下角 “+” 悬浮按钮，一步跳转并打开新增药物弹窗，降低操作成本（适合老人/家属快速录入）。

### 💊 药箱管理

支持按病种（糖尿病/高血压/高血脂）分类管理药物。内置常见药物模板，老年用户无需手动输入复杂信息。

### 📷 拍照识别处方（模拟示例）

提供“处方拍照识别”的演示入口：上传任意图片触发模拟解析结果，展示产品已考虑该能力（本 demo 不做真实 OCR）。

### 🔍 药物相互作用查询（AI）

输入两种药物，AI 检查是否存在相互作用，按高/中/低风险分级展示，并给出用药建议。

**Token 消耗策略**：简单提醒用本地规则（零 token），仅药物查询等复杂场景调用 AI（gpt-4o-mini，约 200 token/次）。

### 📱 健康数据（设备 Mock）

模拟对接血糖仪、血压计、智能手表的数据。当血糖偏高时自动提示关注用药。

> 当前为 Mock 接口，展示产品与智能设备的数据联动设计。实际产品对接设备厂商 SDK。

### 📅 续方管理

追踪每种药物的处方有效期，按紧急度颜色标记（红/黄/绿），到期前提醒用户线上续方。

### 👴 关怀模式（适老化）

一键切换大字号、大按钮、高对比度。技术实现：CSS 变量缩放 rem 基准值，一套代码两种体验。

### 🔑 BYOK（自带 API Key）

支持 OpenAI / DeepSeek 等兼容接口。不配置 Key 则自动使用演示数据（Mock），体验完全一致。

## AI 安全边界

本应用严格遵守医疗 AI 边界：

- **不诊断、不开处方、不替代医嘱**
- 每个 AI 输出页面均有免责提示
- 设备数据异常提示措辞为"建议关注"，不做诊断性判断
- 药物查询结果始终附带"请咨询医生或药师确认"

## 快速开始

```bash
git clone https://github.com/theAtlantic-zza/meituan-ai-coding-test--chronic-med-care.git
cd meituan-ai-coding-test--chronic-med-care
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

### 配置 AI（可选）

点击页面右上角 🔑 按钮，输入 API Key 和 Base URL。密钥仅存储在浏览器本地。

## 项目结构

```
src/
├── app/
│   ├── api/check-interaction/route.ts  → 药物相互作用 AI 接口
│   ├── page.tsx                        → 单页应用主入口
│   ├── layout.tsx                      → 根布局
│   └── globals.css                     → 全局样式 + 关怀模式
├── components/
│   ├── header.tsx                      → 顶栏（关怀模式 + API Key）
│   ├── nav-bar.tsx                     → 底部导航
│   ├── dashboard-view.tsx              → 今日用药时间线
│   ├── plan-view.tsx                   → 药箱管理 + 添加药物
│   ├── interaction-view.tsx            → 药物相互作用查询
│   ├── device-view.tsx                 → 设备数据面板
│   └── renewal-view.tsx                → 续方管理
└── lib/
    ├── types.ts                        → 核心类型定义
    ├── mock-data.ts                    → 疾病模板 + Mock 数据
    ├── store.ts                        → localStorage 持久化
    └── context.tsx                     → React Context 全局状态
```

## 设计决策

详见 [DEVELOPMENT.md](./DEVELOPMENT.md)。

## 上下文压缩（harness engineering）

可复用的“关键上下文包”在 [CONTEXT.md](./CONTEXT.md)。

## 技术栈

| 层 | 技术 |
|---|---|
| 框架 | Next.js 16 (App Router) |
| 语言 | TypeScript (strict) |
| 样式 | Tailwind CSS v4 |
| 状态管理 | React Context + localStorage |
| AI | OpenAI-compatible API + Mock fallback |

---

<div align="center">

**慢病用药小管家** — AI 辅助，你做决定。

</div>
