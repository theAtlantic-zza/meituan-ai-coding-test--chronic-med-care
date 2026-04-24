<div align="center">

# 💊 慢病用药小管家

**帮助慢性病患者管理用药计划、智能提醒、药物查询的 AI 助手**

**美团 AI Coding Test 作品 / Meituan AI Coding Test Submission**

![Next.js](https://img.shields.io/badge/Next.js_16-000?logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?logo=tailwindcss&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?logo=react&logoColor=black)

</div>

---

## Why / 为什么做这个项目？

> **复诊开药不难，难在坚持按时吃药。**

本项目为 **美团 AI Coding Test** 的答题作品，围绕题目背景：慢性病患者线上复诊开药后，常忘记按时服药或重复购买，缺乏从“问诊→购药→用药→续方”的连贯服务。

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

## 功能亮点（当前版本）

### 🧭 三栏主导航

- 今日用药
- 购药续方
- 健康档案

### 💊 今日用药（含极速问诊）

按时间段展示 `待服药 / 已服药`，支持一键打卡，进度条实时更新依从率。  
支持误触修正：已打卡条目可再次点击撤销，回到待服状态。

页面内置「极速问诊」入口，可选择：
- 联系复诊医生（模拟接口）
- AI 辅助常见症状检查（模拟接口）

### ⚡ 快捷操作

通过快捷面板统一触发：
- 恢复轻量示例（2 待服 + 2 已服）
- 加载完整示例数据
- 一键导入日历（模拟接口）
- 一键创建闹钟（模拟接口）

默认进入空白模式，但保留完整操作壳，方便演示。

### 🛒 购药续方

- 药箱库存预警（到期临近）
- 大按钮「美团买药 一键复购」（模拟接口）
- 处方记录按有效期展示（即将过期 / 有效）
- 到期前可触发「申请线上续方」（模拟接口）
- 支持删除药物

### 📷 拍照识别处方/药盒（模拟示例）

在购药续方页可触发 OCR 模拟流程，支持手动核对并修改：
- 药品名称
- 剂量
- 用药时间
- 餐时关系
- 处方有效期

确认后可直接同步到用药计划。

### 🩺 健康档案

- 建立新用药计划（支持病种：糖尿病/高血压/高血脂/其他慢病）
- 复诊提醒日历（模拟接口）
- 健康设备同步（模拟接口）
- 药物相互作用查询（AI / Mock 双模式）

### 📈 健康数据（设备 Mock）

模拟血糖、血压、心率数据，并提供折线图趋势展示，突出“设备数据联动 + 趋势观察”能力。

### 🔍 药物相互作用查询（AI）

输入两种药物，AI 检查相互作用并按高/中/低风险分级展示建议。  
Token 策略：提醒与展示优先本地逻辑；复杂查询再调用 AI（默认 `gpt-4o-mini`）。

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

## 项目结构（核心）

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
