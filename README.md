# 人生模拟器

纯前端人生模拟器原型。

## 启动

```bash
npm run start
```

然后打开：

```text
http://localhost:4175
```

也可以使用任意静态服务器打开仓库根目录。由于前端使用 ES Modules，不建议直接用 `file://` 打开 `index.html`。

## 当前实现

- 壳子 / 数据分离
- 固定 seed 随机
- 初始状态手选和一键随机
- 年度推进
- 连续时间轴展示
- 条件系统
- 权重系统
- 效果系统
- 过去状态快照
- 事件依赖
- 跨时间 modifier
- 地区聚合
- 无中途选择的连续推进
- Seed 驱动的自动事件结果
- 条件概率命中的隐藏人物年谱（命中后逐年完全固定）
- 按时代、城乡、年龄与人物状态组合书写的平常年景
- 转折、历史压力、跨年后果与日常纹理分层的叙事选择器
- 债务、照护、职业、迁居、关系、疾病与高龄阶段的跨年人生主线
- 2036—2120 年虚构未来史：以制度、冲突和集体记忆串联时代，而非只罗列未来日用品
- 死亡和人生报告

隐藏人物库的结构、写作规范与后续选题见 [`docs/HISTORICAL_LIFE_LIBRARY.md`](docs/HISTORICAL_LIFE_LIBRARY.md)。

批量内容评测使用 `npm run evaluate`；完整的生成、检查、评测、优化闭环见 [`docs/CONTENT_EVALUATION.md`](docs/CONTENT_EVALUATION.md)。

覆盖出生世代、性别、城乡、家庭资源、地区与属性的 1188 局分层矩阵，以及年龄/身份/地点/频率/未来年代覆盖自动审查，见 [`docs/BATCH_TESTING.md`](docs/BATCH_TESTING.md) 与 [`docs/STRATIFIED_CONTENT_REVIEW.md`](docs/STRATIFIED_CONTENT_REVIEW.md)。

虚构未来史的年代结构、写作边界与事件链见 [`docs/SPECULATIVE_FUTURE_HISTORY.md`](docs/SPECULATIVE_FUTURE_HISTORY.md)。

教育与职业采用可回放的人生状态轨迹：入学、毕业、辍学、首次就业、离职和退休均记录来源事件；无桥接的全日制/在职冲突会阻断内容发布。

面向 50,000 条正式事件和 200 部以上固定年谱的分阶段生产、统计口径与准入门禁见 [`docs/CONTENT_SCALE_ROADMAP.md`](docs/CONTENT_SCALE_ROADMAP.md)。

近代至当代早年死亡风险的资料依据、保守模拟概率和评测口径见 [`docs/MORTALITY_CALIBRATION.md`](docs/MORTALITY_CALIBRATION.md)。
