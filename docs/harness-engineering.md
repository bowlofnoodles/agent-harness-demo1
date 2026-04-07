# Harness Engineering：AI 编程时代的工程范式

## 一、从 Prompt Engineering 到 Harness Engineering

AI 工程经历了三个阶段的演进：

**Prompt Engineering（2022-2024）**：精心编写单条指令，让模型给出最优的一次性输出。核心技巧是 few-shot、chain-of-thought 等。

**Context Engineering（2025）**：意识到单条 prompt 不够，开始动态构建上下文窗口——把文档、对话历史、工具定义、RAG 检索结果塞进去，让模型做出更有依据的决策。

**Harness Engineering（2026）**：核心洞察是——两个团队用同一个模型，任务完成率可以是 60% vs 98%，差距完全来自模型周围的工程基础设施。于是焦点从"怎么跟模型说话"转向"怎么搭建模型的运行环境"。

## 二、什么是 Harness

一个公式：

```
Agent = Model + Harness
```

Model 是大语言模型本身。Harness 是包裹模型的**一切**：工具注册、权限控制、上下文管理、状态持久化、错误处理、验证系统、生命周期钩子、护栏约束。

一个类比：模型是 CPU，上下文窗口是 RAM，Harness 是操作系统，Agent 是跑在上面的应用。

Harness 不提供智能——它提供**结构**。它不告诉模型怎么思考，而是确保模型在正确的约束和反馈中工作。

## 三、Harness 的四大功能

这是业界（Anthropic、Google、OpenAI、Martin Fowler）趋于共识的框架：

### 1. Constrain（约束）——定义 agent 能做什么

限制 agent 的行为边界，让某些错误在结构上不可能发生。

- TypeScript strict mode 让类型错误在编译期被拦截
- ESLint 规则禁止危险模式
- 架构边界规则（组件不能反向导入）
- 权限系统（哪些工具可用、哪些操作需要确认）

**关键原则**：最好的约束是让错误不可能发生，而不是发生后再纠正。

### 2. Inform（告知）——定义 agent 应该做什么

在 agent 行动**之前**提供充分的上下文和指引，这是前馈控制（feedforward control）。

- `CLAUDE.md` 文件：项目架构规则、编码约定、操作流程
- 清晰的目录结构：让 agent 通过结构本身理解代码组织方式
- 类型定义：通过 TypeScript 接口告诉 agent 数据长什么样
- 模式文档：添加组件/页面的标准步骤

**关键原则**：不要假设 agent "应该知道"。把所有非显而易见的约定写成机器可读的文档。

### 3. Verify（验证）——确认 agent 做对了

在 agent 行动**之后**检查输出质量，这是反馈控制（feedback control）。分两类：

**计算性验证（Computational）**——确定性的、快速的、廉价的：
- TypeScript 类型检查
- ESLint 规则
- 单元测试 / 集成测试
- 构建是否成功

**推断性验证（Inferential）**——AI 驱动的、更贵但语义更丰富的：
- LLM-as-judge（让另一个模型评审代码）
- 语义分析

**关键原则**：优先用计算性验证。它们快、可靠、无歧义。推断性验证作为补充。

### 4. Correct（纠正）——agent 做错时怎么办

当验证失败时，反馈要能流回 agent 形成闭环。

- 测试失败的错误信息要清晰到 agent 能理解并修复
- Pre-commit hook 在提交前拦截问题
- Generator-Evaluator 循环：做的 agent 和评的 agent 分开，反复迭代直到质量达标

**关键原则**：模型不能可靠地评估自己的输出。外部评估不可或缺。

## 四、业界实践

### Anthropic

提出了**三代理架构**用于长时间运行的开发任务：

```
Planner → Generator → Evaluator
            ↑____________↓  (循环直到达标)
```

- **Planner**：把模糊的需求扩展成具体的规格说明
- **Generator**：按规格实现功能
- **Evaluator**：用测试和结构化标准评分，提供反馈

这是一个类 GAN（生成对抗网络）的结构——Generator 天然会"夸奖"自己的输出，所以需要独立的 Evaluator 来提供诚实的评估。

Anthropic 还发现了一个重要现象：**上下文焦虑（context anxiety）**。当上下文窗口变长时，模型会不自觉地草草收工。解法是定期做上下文重置——清空窗口，用结构化的工件（artifact）重新开始。

### OpenAI

Codex 团队用 3-7 个工程师构建了一个 **100 万行代码、零人类手写行** 的代码库。工程师的角色完全变成了"让 agent 更高效"——设计脚手架、反馈循环、文档、架构约束。核心理念：

> "The lack of hands-on human coding introduced a focus on systems, scaffolding, and leverage."
> "不亲手写代码，反而让我们聚焦于系统、脚手架和杠杆效应。"

### Google DeepMind

Aletheia（AI 研究代理）使用类似的三段式结构：Generator → Verifier → Reviser，和 Anthropic 的三代理架构异曲同工。显式地把验证抽离出来，因为"这能帮助模型识别出生成阶段忽略的缺陷"。

### 共识原则

- **为替换而构建（Build to Delete）**：新模型能力会定期淘汰复杂的手写管线。今天需要多 agent 编排的任务，明天可能一个上下文窗口就能搞定。
- **简单优于复杂**：不要构建庞大的控制流。提供健壮的原子工具，让模型自己规划。
- **Harness 提供基础设施，不提供智能**。

## 五、为什么这个项目践行了 Harness Engineering

回顾本项目的工程配置，对应 Harness 四大功能：

### Constrain：约束层

| 机制 | 作用 |
|------|------|
| TypeScript strict + `noUncheckedIndexedAccess` | 数组/对象索引访问必须处理 `undefined`，杜绝运行时空指针 |
| ESLint + react-hooks + react-refresh 规则 | 禁止 hooks 违规调用、禁止非组件导出等危险模式 |
| 组件层级规则（pages → components → ui） | 架构边界明确，防止循环依赖和混乱引用 |
| shadcn/ui 组件不可手动编辑 | UI 原语只通过 CLI 生成，agent 不会意外破坏基础组件 |
| `noUnusedLocals` / `noUnusedParameters` | 编译器自动阻止死代码积累 |

### Inform：告知层

| 机制 | 作用 |
|------|------|
| `CLAUDE.md` | agent 在每次对话开始时自动加载，包含所有架构规则、操作流程、禁止事项 |
| 清晰的目录结构 | `pages/`、`components/`、`hooks/`、`types/` 各司其职，agent 通过结构就能推断代码放哪 |
| TypeScript 接口（`types/task.ts`） | 数据结构即文档，agent 不需要猜字段名和类型 |
| 标准操作模式 | "添加组件"、"添加页面"、"添加 shadcn 组件" 都有 step-by-step 指南 |

### Verify：验证层

| 机制 | 作用 |
|------|------|
| `npm run verify` | 一条命令跑完 typecheck → lint → test 三重验证 |
| Vitest + React Testing Library | 测试覆盖关键用户交互（渲染、添加、删除） |
| `npm run build` | 生产构建作为最终验证——能不能打包成功 |
| 验证清单（CLAUDE.md 中） | 明确列出 agent 在"认为完成"之前必须通过的检查项 |

### Correct：纠正层

| 机制 | 作用 |
|------|------|
| Husky pre-commit hook | 提交前自动执行 lint-staged，拦截不合规代码 |
| 反馈循环文档 | CLAUDE.md 中明确写了"verify 失败后怎么做"——读错误、修根因、重新 verify，不准用 `@ts-ignore` 压制 |
| 测试优先修代码 | "如果测试失败，先理解为什么失败，再决定改测试还是改代码" |

### 这不只是"配置好了工具"

关键区别在于：普通项目也有 ESLint 和测试，但 Harness Engineering 的思维方式是**把这些工具组织成一个有机的系统**，明确地服务于"让 AI agent 高效工作"这个目标。每一层都有明确的设计意图，而不是"业界最佳实践所以我也配一个"。

## 六、往后怎么迭代

### 第一阶段：强化验证层

当前测试只覆盖了基础交互。随着功能增长：

```bash
# 添加测试覆盖率报告
npm install -D @vitest/coverage-v8

# 在 verify 脚本中加入覆盖率门槛
"verify": "npm run typecheck && npm run lint && vitest run --coverage --coverage.thresholds.lines=80"
```

覆盖率门槛是一个强力的计算性验证器——agent 新增代码但不写测试时，verify 直接失败。

### 第二阶段：引入 Storybook 作为视觉验证

```bash
npx storybook@latest init
```

为每个组件写 story。这提供了**视觉维度的验证**——agent 改了样式后，人类可以通过 Storybook 快速审查渲染结果，而不需要启动完整应用。

### 第三阶段：CI/CD 作为远程验证器

```yaml
# .github/workflows/verify.yml
name: Verify
on: [push, pull_request]
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run verify
```

把 verify 管线搬到 CI。这是最终的"不可绕过的验证"——即使本地跳过了 pre-commit hook，CI 也会拦截。

### 第四阶段：结构化 ADR（Architecture Decision Records）

当架构决策越来越多时，CLAUDE.md 会变得臃肿。引入 ADR：

```
docs/
├── adr/
│   ├── 001-use-react-context-for-state.md
│   ├── 002-no-css-modules.md
│   └── ...
```

每个 ADR 记录一个决策的 **Context → Decision → Consequences**。agent 遇到相关场景时可以查阅，理解"为什么这样做"而不仅是"要这样做"。

### 第五阶段：Generator-Evaluator 分离

当任务复杂到需要多轮迭代时，可以在 AI 编程工作流中显式引入 Evaluator 角色：

1. 让 agent A（Generator）实现功能
2. 让 agent B（Evaluator）用另一个上下文审查，给出结构化反馈
3. Generator 根据反馈修改，循环直到 Evaluator 通过

在 Claude Code 中，这可以通过 sub-agent 或 code-reviewer 实现。

### 第六阶段：持续优化 CLAUDE.md

这是 Harness Engineering 最核心的长期实践：

- 每次 agent 犯了重复错误 → 在 CLAUDE.md 中加入对应的约束或指引
- 每次 agent 做了正确但非显而易见的选择 → 记录为模式
- 每次模型能力提升使某个约束变得多余 → 删除它（Build to Delete）

CLAUDE.md 不是一次性写好的文档，而是**活的 harness 配置文件**，随着项目和模型一起演进。

## 七、核心心智模型

```
你不是在"使用 AI 工具"。
你是在"搭建一个让 AI agent 高效运作的运行环境"。

你的代码质量上限 = 模型能力 × Harness 质量。

模型能力你无法控制，Harness 质量你完全掌控。
```

这就是 Harness Engineering 的本质：把工程师的杠杆从"写更多代码"转向"构建更好的系统让 AI 写更好的代码"。
