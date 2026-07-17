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

# 只测试 1840 年出生的人生
npm run batch -- --count 100 --birth-year 1840 --seed QING-ERA --out reports/qing-era.csv

# 用中性 id 强制回放一部完全固定的逐年年谱；建议至少两个 seed
npm run batch -- --count 2 --historical-life chronicle_hunan_1893_a --seed CHRONICLE-QA --out reports/chronicle-qa.csv
```

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `--count` | `100` | 随机人生局数 |
| `--seed` | `BATCH` | 批次基础 seed；每局会派生为 `BATCH-0001`、`BATCH-0002` |
| `--batch-id` | `seed + 时间戳` | 本次批量测试 id，用于关联三张表 |
| `--max-age` | `100` | 单局最大推进年龄，未死亡则停止 |
| `--birth-year` | 随机 | 固定出生年份，用于定向检查某个年代；支持 `1840-2020` |
| `--historical-life` | 无 | 强制回放指定固定年谱；开局条件自动匹配作品触发器，CSV 只记录中性 `chronicle_id` |
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
- 过程统计：事件数、自动结果数、自然流变次数、首个事件、最后事件、关键事件、事件分类计数。
- 状态沉淀：最终特质、最终标签。
- `chronicle_id`：固定年谱的中性内部 id；普通人生为空，不导出研究对象姓名。

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
- 事件 id、标题、分类、优先级、自动结果 id。
- `final_text`：最终吐给玩家看到的事件文本，也就是条件化文本表达筛选后的结果。
- `final_result_text`：自动结果事件最终展示的结果文本。
- `effects_summary`：该事件造成的数值、特质和标签变化。

## 设计原则

- 复用正式引擎和正式数据，不维护另一套模拟逻辑。
- 随机开局遵守游戏内的时代、省份、户口、家庭阶层、家境范围和特质条件。
- 遇到多结果事件时复用正式引擎，根据条件、权重和 seed 自动决定结果。
- CSV 中复杂列表使用 `|` 连接，事件分类计数使用紧凑 JSON 字符串，便于表格软件读取。

## 分层开局矩阵

纯随机批测容易漏掉少数群体。`scripts/stratified_batch.js` 会用正式引擎生成可复现的开局矩阵，固定覆盖以下维度：

- 8 个代表性出生世代：1840、1870、1900、1925、1950、1970、1990、2010。
- 男女两种性别。
- 乡村与城市两种开局环境。
- 低、中、高三档家庭资源；脚本会从该年份、城乡和户口真正可选的家庭阶层中选取对应分位。
- 华北、东北、江南沿海、东南沿海、岭南、中部、西南、西北、边疆西部、台湾、香港 11 个代表地区。
- 低体质/低心态、均衡、高体质/高心态三种属性档位；属性仍严格遵守总点数 20。

推荐基线：

```bash
npm run batch:stratified -- \
  --matrix balanced \
  --seed STRATIFIED-BASELINE \
  --max-age 112 \
  --out reports/stratified-baseline.csv
```

`balanced` 会完整组合出生世代、性别、城乡、家庭资源与代表地区，并让三种属性档位在组合间均匀轮换，共 1056 局。其他模式：

- `--matrix smoke`：96 局快速检查，每个核心出生/性别/城乡/阶级单元轮换一个地区和属性档位。
- `--matrix full`：把属性档位也加入全笛卡尔积，共 3168 局。
- `--region-set all`：用全部省级地区替代 11 个代表地区。
- `--replicates N`：每个矩阵单元运行 N 个确定性副本。
- `--talents none`：禁用开局特质，用于隔离属性与事件条件；默认 `random`，但同一 seed 下选择稳定。

除了与普通批测兼容的 summary、`.years.csv`、`.events.csv`，脚本还会输出 `.manifest.json`。manifest 记录参数、所有维度、每局开局输入及输出行数；同一代码版本、参数和 seed 会得到相同开局与人生正文，便于修改前后逐行比较。

分层 years/events 表额外记录事件触发前后的所在地、婚姻、子女、教育、职业状态，以及教育轨道、当前/已完成学段、学习模式、职业段数、主要身份和最后一次人生状态转移，供跨年连续性审查使用。

## 分层自动审查

```bash
npm run review:stratified -- \
  --summary reports/stratified-baseline.csv \
  --report reports/stratified-baseline.review.md \
  --json reports/stratified-baseline.review.json
```

审查范围包括：

- 年龄语义、性别身体叙述、婚姻/子女/教育/职业状态矛盾。
- 全日制教育与就业互斥、首次就业、学段单调性、主要身份和状态转移来源。
- 事件明示的年代、出生阶层、性别、出生地和当前所在地条件。
- 现代词汇过早出现，以及窑洞、青稞、弄堂等强地点纹理风险。
- 同局重复事件、完全重复文案、单一文案支配率。
- 事件总占比与“人生渗透率”。后者回答的是一条事件进入了多少人的一生，比总触发次数更适合发现几乎人人都会遇到的万能事件。
- 头部事件集中度、平常年占比，以及出生世代/性别/城乡/阶层/地区/属性各分群的覆盖缺口。
- 终年 P10/P50/P90、婴幼儿/未成年/40 岁前结束率、死亡年龄尖峰和年龄上限截尾。

启发式风险进入人工审查队列；CSV 关联错误、明示条件冲突、明显性别生理冲突与高置信时代词穿越属于阻断项。用 `--strict` 开启自动门禁：

```bash
npm run review:stratified -- \
  --summary reports/stratified-baseline.csv \
  --strict
```

默认数值门槛为：重复可见文案不超过 3%、头部十事件不超过 45%、平常年不超过 35%、年龄上限截尾不超过 2%、事件定义覆盖不低于 45%。可分别用 `--max-repeat-copy-rate`、`--max-top10-share`、`--max-quiet-rate`、`--max-age-cap-rate`、`--min-event-coverage` 覆盖。阈值是回归护栏，不替代对完整人生的人工通读。
