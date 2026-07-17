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
- 死亡和人生报告

隐藏人物库的结构、写作规范与后续选题见 [`docs/HISTORICAL_LIFE_LIBRARY.md`](docs/HISTORICAL_LIFE_LIBRARY.md)。

批量内容评测使用 `npm run evaluate`；完整的生成、检查、评测、优化闭环见 [`docs/CONTENT_EVALUATION.md`](docs/CONTENT_EVALUATION.md)。
