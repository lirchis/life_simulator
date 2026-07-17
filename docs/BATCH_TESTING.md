# 批量内容测试工具

`scripts/batch_simulate.js` 用于批量随机执行人生局，并导出 CSV。它不属于游戏本体 UI，只是内容测试和数据审阅工具。

## 用法

```bash
npm run batch
```

默认执行 100 局，并输出三份 CSV：

```text
reports/batch-simulations-YYYYMMDD-HHMMSS.csv
reports/batch-simulations-YYYYMMDD-HHMMSS.years.csv
reports/batch-simulations-YYYYMMDD-HHMMSS.events.csv
```

可选参数：

```bash
npm run batch -- --count 300 --seed REVIEW --batch-id REVIEW-001 --max-age 100 --out reports/review.csv
```

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `--count` | `100` | 随机人生局数 |
| `--seed` | `BATCH` | 批次基础 seed；每局会派生为 `BATCH-0001`、`BATCH-0002` |
| `--batch-id` | `seed + 时间戳` | 本次批量测试 id，用于关联三张表 |
| `--max-age` | `100` | 单局最大推进年龄，未死亡则停止 |
| `--out` | 自动时间戳文件 | CSV 输出路径 |

三张表的关联键：

- `batch_id`：同一次批量测试共享。
- `run_id`：单局人生 id，存在于 summary、years、events 三张表。
- `year_id`：单局某一年 id，存在于 years、events；events 可通过它关联到该年状态。
- `event_row_id`：单条事件明细 id，只存在于 events。

## CSV 文件

### Summary

`batch-simulations-*.csv` 每行代表一局人生，包含：

- `batch_id`、`run_id`、`run_index`。
- 开局参数：seed、出生年份、性别、省份、城市层级、户口、家庭阶层、初始属性、开局特质。
- 终局状态：最终年龄、最终年份、是否存活、死因、结局 id。
- 终局资源：健康、财富、幸福、成就、名声、自由。
- 过程统计：事件数、选择数、自然流变次数、首个事件、最后事件、关键事件、事件分类计数。
- 状态沉淀：最终特质、最终标签。

### Years

`batch-simulations-*.years.csv` 每行代表一局人生中的一年，包含：

- `batch_id`、`run_id`、`year_id`。
- 该年结束后的资源、属性、教育、职业、特质、标签。
- 该年触发的事件 id、标题、分类和最终展示文本 `event_texts`。
- 该年的事件效果摘要和自然流变摘要。

### Events

`batch-simulations-*.events.csv` 每行代表一条实际触发事件，包含：

- `batch_id`、`run_id`、`year_id`、`event_row_id`。
- 局数、seed、年龄、年份、出生信息。
- 事件 id、标题、分类、优先级、选择 id。
- `final_text`：最终吐给玩家看到的事件文本，也就是条件化文本表达筛选后的结果。
- `final_result_text`：选择事件的结果文本。
- `effects_summary`：该事件造成的数值、特质和标签变化。

## 设计原则

- 复用正式引擎和正式数据，不维护另一套模拟逻辑。
- 随机开局遵守游戏内的时代、省份、户口、家庭阶层、家境范围和特质条件。
- 遇到选择事件时自动随机选择一个满足条件的选项。
- CSV 中复杂列表使用 `|` 连接，事件分类计数使用紧凑 JSON 字符串，便于表格软件读取。
