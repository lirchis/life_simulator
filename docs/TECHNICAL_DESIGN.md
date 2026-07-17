# 人生模拟器技术方案

## 1. 设计目标

本项目采用“壳子”和“数据”分离的架构：

- 壳子：稳定的模拟引擎，负责状态推进、事件筛选、概率计算、效果应用、历史记录和结局判断。
- 数据：可持续扩展的内容包，包含开局特质、事件、结局、地区配置、时代配置等。

核心目标是让大量人生事件可以用声明式数据编写，而不是在事件里写业务代码。后续补内容、调概率、加结局时，应尽量不改引擎。

## 2. 核心运行循环

```text
玩家手选或随机生成初始状态
  -> 选择出生年份 / 省份 / 城市层级 / 户口 / 家庭阶层
  -> 选择开局特质 / 分配属性
  -> 每次点击“下一年”
  -> 年龄和当前年份推进
  -> 计算环境和年度自然变化
  -> 筛选候选事件
  -> 计算事件权重
  -> 加权随机抽取事件
  -> 自动抽取事件结果
  -> 若只剩平常年，以时代 / 城乡 / 年龄 / 当前状态组合微型年景
  -> 展示事件文本并应用效果
  -> 更新特质、标签、计数器、历史和后续事件
  -> 判断死亡或结局
```

注意：不建议永远透出“概率最高”的事件。更好的方式是计算最终权重后加权随机抽取。这样高概率事件更容易出现，但人生仍保留不确定性和重玩价值。

## 3. 状态总字段定义

`PlayerState` 是当前人生的唯一真相。所有事件条件、概率修正、结局判断都从这里读取。

```ts
type PlayerState = {
  meta: MetaState;
  birth: BirthState;
  location: LocationState;
  environment: EnvironmentState;
  attrs: AttrState;
  resources: ResourceState;
  relationships: RelationshipState;
  education: EducationState;
  career: CareerState;
  talents: string[]; // 开局选择记录
  traits: string[];
  tags: string[];
  counters: Record<string, number>;
  flags: Record<string, boolean | string | number>;
  cooldowns: Record<string, number>;
  occurredEvents: Record<string, OccurredEventState>;
  scheduledEvents: ScheduledEvent[];
  timedModifiers: TimedModifier[];
  yearlyChanges: YearlyChangeEntry[];
  snapshots: LifeSnapshot[];
  history: LifeLogEntry[];
};
```

### 3.1 元信息

```ts
type MetaState = {
  lifeId: string;
  seed: string;
  version: string;
  age: number;
  currentYear: number;
  stage: LifeStage;
  isAlive: boolean;
  deathReason?: string;
  endingId?: string;
};
```

规则：

- `currentYear = birth.year + age`。
- `stage` 由 `age` 推导，也允许特殊事件覆盖。
- `seed` 用于可复现随机。分享同一人生剧本时可以复用 seed。

### 3.2 出生信息

出生信息用于决定起点，也会影响事件概率。

```ts
type BirthState = {
  year: number;
  gender: GenderType;
  province: ProvinceCode;
  provinceHistoryCode?: string;
  provinceNameAtBirth?: string;
  region: RegionCode;
  cityTier: CityTier;
  hukou: HukouType;
  familyClass: FamilyClass;
};

type ProvinceCode =
  | "beijing"
  | "shanghai"
  | "guangdong"
  | "zhejiang"
  | "jiangsu"
  | "sichuan"
  | "hubei"
  | "henan"
  | "shandong"
  | "liaoning"
  | "heilongjiang"
  | "gansu"
  | "yunnan"
  | "xinjiang"
  | "tibet"
  | "other";

type RegionCode =
  | "north"
  | "east"
  | "south"
  | "central"
  | "southwest"
  | "northwest"
  | "northeast";

type CityTier = "village" | "town" | "county" | "city" | "tier2" | "tier1";
type HukouType = "urban" | "rural";
type FamilyClass = "poor" | "working" | "middle" | "rich" | "elite";
type GenderType = "female" | "male";
```

### 3.2.1 历史地区和时代口径

出生年份从 1840 开始后，省份、城市层级、家庭阶层都不能只用当代口径。设计上采用两层字段：

- `province` / `currentCode`：稳定计算 code，用于事件条件、地区聚合、概率计算和长期状态。
- `provinceHistoryCode`：当年展示 code，用于 UI 文案、出生报告和历史快照。

例如：

```ts
type HistoricalProvinceAlias = {
  code: string;
  name: string;
  currentCode: ProvinceCode;
  weightedCurrentCodes?: Array<{ code: ProvinceCode; weight: number }>;
  startYear: number;
  endYear: number;
  note?: string;
};
```

`西康 -> 四川`、`绥远 -> 内蒙古`、`松江 -> 黑龙江` 这类历史地区，玩家按出生年份看到当时名称，但引擎仍映射到当代标准省份 code。若地区被撤销，后续年份展示回当代省份名；若事件需要更细粒度，可再通过 `provinceHistoryCode` 或未来的 `subRegionCode` 判断。

对于拆分到多个当代省份的历史地区，不使用 55 开随机，而是配置 `weightedCurrentCodes`。开局创建状态时用本局 seed 随机一次，写入稳定的 `birth.province` 和 `location.currentProvince`。同一 seed 的落点可复现。

首版实现原则：

- 出生省份下拉由 `birthYear` 动态生成。
- 同一个历史地区必须有稳定 `currentCode`，否则事件聚合无法工作。
- 对跨多个当代省份的历史省，首版配置 `weightedCurrentCodes`，权重按人口规模、辖区规模或可查的历史分拆比例估算，并在 `note` 中记录假设。后续可用更精确数据替换权重。
- 城市层级保留稳定 code，如 `village/county/tier1`，但 label 随时代变化：1840 年显示“府城 / 商埠”，1950 年显示“地级市”，2000 年显示“普通城市”。
- 家庭阶层按时代维护不同 label 和 code：1840 年可出现“无地雇农 / 佃户 / 富农 / 买办 / 士绅”，1949 后可出现“贫下中农 / 国营厂矿职工 / 知识分子 / 海外关系 / 地主富农成分”，1978-1991 可出现“乡镇企业 / 个体户 / 干部子弟 / 先富家庭”，1992 后再加入“外出务工 / 下岗职工”等转轨语境，2000 后可出现“留守农村 / 进城务工 / 体制内 / 专业人士 / 新经济家庭”等。
- 家庭阶层通过 `familyClassMeta` 映射到统一资源分值和标签，避免经济起点计算散落在 UI 或事件里。
- 户口选项只在制度存在后展示。首版从 1958 年开始显示“农村 / 城镇户口”；1958 年前 UI 不展示户口下拉，而是根据城市层级推导内部城乡口径，供事件和家庭阶层过滤使用。

第一版已覆盖的关键历史地区包括：西康、察哈尔、绥远、热河、宁夏省、松江、辽东、辽西、平原、川东/川南/川西/川北行署区、广东、四川。其中广东在 1988 年前按权重随机落到广东/海南，四川在 1997 年前按权重随机落到四川/重庆。

### 3.3 当前位置

出生地和当前位置要分开。人生中可以升学、工作、迁移。

```ts
type LocationState = {
  currentProvince: ProvinceCode;
  currentProvinceHistoryCode?: string;
  currentRegion: RegionCode;
  currentCityTier: CityTier;
  migratedTimes: number;
};
```

出生年份范围：`1840` 到 `2020`。

首版省份支持：全量支持中国省级行政区，省份 code 采用拼音，并保留 `other` 作为兜底值。文档中的 `ProvinceCode` 示例不是最终全集，落地实现时应在 `data/regions/` 中维护完整 code 表和展示名。

初始状态允许玩家手选，包括出生年份、出生省份、城市层级、户口、家庭阶层、基础属性和开局特质。引擎也应提供一键随机生成能力，用同一套状态 schema 输出。

### 3.4 环境画像

`environment` 是由出生地、当前位置、年份、城市层级共同计算出的外部环境。事件可以依赖环境，而不是直接绑定省份，减少刻板化和硬编码。

```ts
type EnvironmentState = {
  educationPressure: number; // 教育竞争压力，0-10
  jobOpportunity: number;    // 就业机会，0-10
  businessClimate: number;   // 经商氛围，0-10
  housingPressure: number;   // 房价压力，0-10
  healthcareAccess: number;  // 医疗资源，0-10
  migrationPull: number;     // 人口流入吸引力，0-10
};
```

环境每年动态计算。每次推进年份后，根据出生信息、当前位置、城市层级、户口、当前年份和时代配置重新生成 `environment`。

### 3.5 基础属性

基础属性偏长期，变化应相对克制。

```ts
type AttrState = {
  physique: number;     // 体质，0-10
  intelligence: number; // 智力，0-10
  charm: number;        // 魅力，0-10
  family: number;       // 家境，0-10
  luck: number;         // 运气，0-10
  mental: number;       // 心态，0-10
};
```

### 3.6 派生资源

派生资源变化更频繁，是事件和结局的主要反馈层。

```ts
type ResourceState = {
  health: number;      // 健康，0-100
  wealth: number;      // 财富，0-100
  happiness: number;   // 幸福，0-100
  achievement: number; // 成就，0-100
  reputation: number;  // 名声，0-100
  freedom: number;     // 自由度，0-100
};
```

### 3.7 关系、教育、职业

```ts
type RelationshipState = {
  family: number;
  friendship: number;
  romance: number;
  partnerStatus: "none" | "dating" | "married" | "divorced" | "widowed";
  partnerQuality: number;
  children: number;
};

type EducationState = {
  level: "none" | "primary" | "middle" | "high_school" | "college" | "master" | "phd";
  score: number;
  major?: string;
};

type CareerState = {
  status: "none" | "student" | "employed" | "self_employed" | "entrepreneur" | "unemployed" | "retired";
  field?: string;
  level: number;
  income: number;
};
```

### 3.8 标签、计数器和历史

```ts
type OccurredEventState = {
  count: number;
  firstAge: number;
  lastAge: number;
  firstYear: number;
  lastYear: number;
};

type ScheduledEvent = {
  eventId: string;
  earliestYear: number;
  latestYear: number;
  weight?: number;
  weightMultiplier?: number;
  probability?: number;
  sourceEventId: string;
};

type TimedModifier = {
  id: string;
  sourceEventId: string;
  startYear: number;
  endYear: number;
  target: TimedModifierTarget;
  add?: number;
  multiply?: number;
};

type LifeSnapshot = {
  age: number;
  year: number;
  stage: LifeStage;
  birth: BirthState;
  location: LocationState;
  environment: EnvironmentState;
  attrs: AttrState;
  resources: ResourceState;
  relationships: RelationshipState;
  education: EducationState;
  career: CareerState;
  traits: string[];
  tags: string[];
};

type LifeLogEntry = {
  age: number;
  year: number;
  eventId: string;
  title: string;
  text: string;
  outcomeId?: string;
  resultText?: string;
  effectsSummary?: string[];
  snapshot?: Partial<PlayerState>;
};

type YearlyChangeEntry = {
  age: number;
  year: number;
  effectsSummary: string[];
};
```

用途：

- `traits`：描述主角相对稳定的个人特质，如 `frail_body`、`chronic_weakness`。特质可以由事件获得，也可以由年度自然变化推导获得。
- `tags`：描述人生状态、经历和社会身份，如 `college`、`married`、`land_reform_beneficiary`。
- `counters`：记录次数，如 `startup_attempts`、`failed_exam_count`。
- `flags`：少量特殊状态，避免过早建字段。
- `cooldowns`：防止同类事件连续刷屏。
- `occurredEvents`：快速判断某事件是否发生过，不必扫描历史。
- `scheduledEvents`：支持后续事件和剧情链。
- `timedModifiers`：支持跨时间概率影响，例如未来 5 年内创业事件概率提升。
- `yearlyChanges`：记录年度自然变化摘要，例如健康自然恢复 `+1`、年龄导致健康下降 `-1`、自然获得或失去特质。它不占事件位，只用于同一年时间线的轻量提示。
- `snapshots`：记录每年结束后的关键状态，用于判断“过去某个年龄段 / 年份段是否满足过某条件”。

年度推进中允许存在自然变化层。自然变化不需要表现为单独事件，例如生病导致健康大幅下降后，后续年份可以根据体质、年龄、医疗资源自动恢复一部分；年龄增长后健康也可能自然下滑。自然变化发生在当年事件抽取前，因此会影响当年的事件概率。若自然变化产生可见差异，引擎写入 `yearlyChanges`，前端在该年份标题下展示“自然流变”摘要，但不把它放进事件池，也不减少当年事件数量。

前端展示层应基于 `history` 渲染同一个连续时间轴。年度推进时追加新的 `LifeLogEntry`，不要替换整页内容或只保留当前年份事件。玩家可以一直向上回看过往年份，底部继续推进新年份。

前端渲染要保持轻量和高信息密度：

- 不为每一年创建大面积封面。
- 年份分隔符只展示年龄和公历年份。
- 每条事件优先展示标题、正文、变化摘要。
- 年度自然变化以更轻的提示条展示，例如“自然流变：健康 +1”，不能做成完整事件卡。
- 状态变化摘要由 `effectsSummary` 生成紧凑标签。
- 列表中不默认展开完整属性快照。
- 同屏应尽量容纳多个年份或多条事件，尤其是手机端。

### 3.9 历史快照策略

有些事件依赖过去状态，而不是当前状态。例如“当前人在上海，但 0-3 岁时出生并生活在西部省份”。因此引擎需要保存可查询的年度快照。

推荐规则：

- 每年事件结算后写入一条 `LifeSnapshot`。
- 快照只保存事件条件可能查询的状态，不保存完整 UI 临时数据。
- 查询频繁字段可以额外建立索引，但 MVP 先直接扫描 `snapshots`。
- `history` 记录发生了什么，`snapshots` 记录当时是什么状态，两者不要混用。

示例条件：

```json
{
  "all": [
    { "path": "location.currentProvince", "inGroup": "province.east.shanghai_area" },
    {
      "past": {
        "ageRange": [0, 3],
        "where": {
          "all": [
            { "path": "location.currentProvince", "inGroup": "province.region.west" }
          ]
        }
      }
    }
  ]
}
```

## 4. 事件字段定义

事件应是纯数据，使用 JSON 或 YAML 存储。

```ts
type LifeEvent = {
  id: string;
  title: string;
  description?: string;
  category: EventCategory;
  stage?: LifeStage[];
  ageRange?: [number, number];
  yearRange?: [number, number];
  birthYearRange?: [number, number];
  genders?: GenderType[];
  birthRegions?: RegionFilter;
  currentRegions?: RegionFilter;
  tags?: string[];
  birthFamilyClasses?: string[];
  familyTags?: string[];
  blockFamilyTags?: string[];
  conditions?: ConditionGroup;
  requiresEvents?: string[];
  blocksEvents?: string[];
  requiresAnyEvent?: string[];
  blocksAnyEvent?: string[];
  baseWeight: number;
  lifetimeProbability?: number;
  triggerProbability?: number;
  weightModifiers?: WeightModifier[];
  priority?: number;
  cooldown?: number;
  maxOccurrences?: number;
  mutuallyExclusiveWith?: string[];
  text: string | TextVariant[];
  effects?: Effect[];
  outcomes?: EventOutcome[];
  followUps?: FollowUp[];
  ending?: EndingConfig;
};

type TextVariant = {
  text: string;
  conditions?: ConditionGroup;
  weight?: number;
};
```

事件字段应尽量引用稳定的状态 path 和聚合 id。比如事件想表达“西部省份”，不应该在事件里直接写一长串省份 code，而应该引用 `province.region.west` 这类聚合。

事件的触发限制字段全部是可选的。未配置某个限制，表示该维度不参与过滤，而不是不匹配。例如一个事件没有 `currentRegions`，就代表它不限制当前地区；没有 `yearRange`，就代表它不限制当前公历年份。

事件的效果字段也是可选的。未配置 `effects` 或 `effects: []`，表示该事件只展示文本并写入历史，不改变状态。这类事件可用于氛围、铺垫、无事发生、人生切片等内容。

事件文本支持同事件多表达。若一个事件的核心语义、效果和后续依赖相同，只是因为时代、省份、城市层级、家庭阶层、户口、性别或特质不同而需要不同措辞，应优先使用 `text: TextVariant[]`，每个 variant 通过 `conditions` 匹配状态，并可用 `weight` 控制同条件下的随机表达。引擎会先筛选满足条件的条件文本，再按权重随机选一条；若没有任何条件文本命中，才回退到无条件文本。无条件文本应被视为默认兜底，而不是与条件文本竞争。

是否拆事件的规则：

- 保持同一个事件：人生语义相同、效果相同或近似、后续依赖相同，只需要不同叙述。例如“平常一年”“夜里发烧”“入学”“考试不错”。
- 拆成不同事件：触发概率模型不同、效果不同、优先级不同、后续依赖不同，或它在历史语境中已经是另一类事件。例如“高考”“恢复高考”“被拉壮丁”“分到土地”。
- 不从历史文本里推断状态。表达差异只负责展示，状态差异必须通过 `conditions`、`effects`、`tags`、`traits` 等结构化字段体现。

历史阶层事件可以直接通过 `birthFamilyClasses` 和 `familyTags` 触发。例如“贫农家庭在 1950-1953 年更容易触发分到土地”，事件可以写：

```ts
{
  yearRange: [1950, 1953],
  birthFamilyClasses: ["poor_peasant", "tenant"],
  familyTags: ["poor_peasant_family", "tenant_family"]
}
```

这里 `birthFamilyClasses` 判断开局选择的历史阶层 code，`familyTags` 判断初始状态写入的阶层标签。两者可以一起用，也可以只用其中一个。

## 5. 开局特质字段定义

开局特质同样是纯数据。UI 可以继续称为“天赋”，但进入人生状态后统一写入 `traits`。首版采用预算机制平衡开局选择，避免玩家只选择强正面特质。

```ts
type Talent = {
  id: string;
  name: string;
  rarity: "common" | "rare" | "epic";
  cost: number;
  availableYearRange?: [number, number];
  unavailableYearRanges?: Array<[number, number]>;
  eraCosts?: Array<{ yearRange: [number, number]; cost: number }>;
  requirements?: {
    attrs?: Partial<Record<AttrKey, number>>;
    genders?: GenderType[];
    cityTiers?: CityTier[];
    familyClasses?: FamilyClass[];
    hukou?: HukouType[];
    provinces?: ProvinceCode[];
    provinceAggregates?: string[];
  };
  description: string;
  effects?: Effect[];
  traits?: string[];
};
```

- `cost > 0`：消耗特质点，越强越贵。
- `cost = 0`：免费，通常是弱正面或轻微双刃剑。
- `cost < 0`：返还特质点，通常带有明确负面影响。
- 特质预算由出生年份决定。当前为：1840-1948 预算 2、1949-1977 预算 2、1978-1999 预算 3、2000-2020 预算 4。
- `availableYearRange` 控制特质出现年代，例如“考试机器”只在高考恢复后出现，“卷王”只在改革开放后出现。
- 所有带明显时代媒介、制度或技术语境的特质都必须配置 `availableYearRange`。例如“游戏高手”只能在电子游戏普及后的年代出现，不能出现在 1840 年开局；“旧学根底”只出现在传统教育语境仍强的早期年代。
- `eraCosts` 控制同一特质在不同时代的成本。例如强运、家境类特质在乱世或集体年代成本更高。
- `requirements.attrs` 控制特质和初始加点的联动。例如“考试机器”要求智力达到一定值，“敏感艺术家”要求魅力达到一定值。家境本身由省份、城市层级和家庭阶层限定可调范围，因此 `attrs.family` 也可以作为出身资源要求。
- `requirements.genders/cityTiers/familyClasses/hukou/provinces/provinceAggregates` 控制特质和性别、出身环境的可选联动。例如“新式学堂”可以要求县城以上，“留守韧性”可以要求乡土/农村口径，“算法嗅觉”可以要求互联网机会地区。所有这些条件都是可选字段，未配置时不限制。
- `talents` 只记录开局选过哪些特质，真正进入事件系统后统一写入 `traits`。
- 跨时代特质要拆成“时代外显名”和“底层特质”。例如 1840 年的“科举苗子”、民国/旧式教育语境下的“旧学根底”、1977 年后的“考试机器”都会让主角拥有 `exam_aptitude`，后续升学、考试、选拔类事件优先读取 `hasTrait: "exam_aptitude"`，而不是只绑定某个时代词。
- 特质库按时代和性别维护：1840-1948 偏传统社会、乱世、女校/旧学、学徒、商埠、宗族与身体规训；1949-1977 偏集体年代、成分、单位/工厂、公社、兵役、妇女动员和教育断档；1978-1999 偏市场化、下海、流动人口、下岗、电视、电脑房、独生子女和沿海工厂；2000-2020 偏互联网、补习、平台劳动、房价压力、留守、小镇教育路径和网络边界意识。
- 每个开局特质可以同时写入多个底层特质。例如“电脑房孩子”写入 `digital_native`，“敢下海”写入 `market_sense` 和 `risk_taker`。事件优先判断底层特质，避免把内容绑定到某个年代的具体措辞。
- 必须选满 3 个特质且总成本不超过当年预算才能开始。
- `traits` 和 `tags` 都使用稳定内部 id，UI 层通过 `tagLabels` 映射成中文展示；玩家界面不直接展示英文 id。

### 4.1 时间字段

| 字段 | 含义 | 示例 |
| --- | --- | --- |
| `ageRange` | 当前年龄范围 | 18 岁高考 |
| `yearRange` | 当前公历年份范围 | 2010-2018 移动互联网浪潮 |
| `birthYearRange` | 出生年份范围 | 80 后、90 后、00 后事件 |
| `stage` | 人生阶段 | 学生、青年、中年 |

时间字段默认语义：

- 未配置 `ageRange`：不限制年龄。
- 未配置 `yearRange`：不限制当前公历年份。
- 未配置 `birthYearRange`：不限制出生年份。
- 未配置 `genders`：不限制性别。
- 未配置 `stage`：不限制人生阶段。

### 4.2 地区字段

地区字段用于表达事件和出生地、当前位置、城市层级、户口、性别之间的关系。性别也可以直接使用事件顶层 `genders` 字段表达；放在 `RegionFilter` 里主要是为了复合过滤结构保持一致。

```ts
type RegionFilter = {
  genders?: GenderType[];
  provinces?: ProvinceCode[];
  provinceGroups?: AggregateId[];
  regions?: RegionCode[];
  cityTiers?: CityTier[];
  cityTierGroups?: AggregateId[];
  hukou?: HukouType[];
};
```

推荐规则：

- `birthRegions`：用于依赖出生地的事件，例如出生资源、早年教育、户籍相关经历。
- `currentRegions`：用于依赖当前位置的事件，例如就业机会、房价、迁移、医疗资源。
- 未配置 `birthRegions`：不限制出生地区。
- 未配置 `currentRegions`：不限制当前地区。
- 如果事件只关心“教育压力”“就业机会”“房价压力”等抽象因素，优先使用 `environment` 条件或权重修正，不直接绑定省份。
- 如果事件强依赖地域文化、政策或产业结构，再使用 `birthRegions` / `currentRegions` 精确约束。
- 地区列表较长时，优先使用 `provinceGroups`、`cityTierGroups` 等聚合引用。

示例：

```json
{
  "id": "coastal_manufacturing_job",
  "title": "沿海制造业机会",
  "category": "career",
  "stage": ["young_adult"],
  "ageRange": [18, 35],
  "currentRegions": {
    "provinceGroups": ["province.coastal_manufacturing"],
    "cityTiers": ["city", "tier2", "tier1"]
  },
  "baseWeight": 25,
  "weightModifiers": [
    { "path": "environment.jobOpportunity", "gte": 7, "multiply": 1.4 },
    { "path": "attrs.physique", "gte": 6, "multiply": 1.1 }
  ],
  "text": "沿海城市的制造业岗位很多，你获得了一次进入工厂或供应链公司的机会。"
}
```

### 4.3 事件分类

```ts
type EventCategory =
  | "birth"
  | "family"
  | "school"
  | "career"
  | "health"
  | "relationship"
  | "wealth"
  | "migration"
  | "random"
  | "ending";
```

## 5. 条件系统

条件用于判断事件能否进入候选池。条件不通过，则事件不会出现。

`conditions` 也是可选的。未配置 `conditions` 时，默认条件通过。

```ts
type ConditionGroup = {
  all?: Condition[];
  any?: Condition[];
  none?: Condition[];
};

type Condition =
  | PathCondition
  | TagCondition
  | EventCondition
  | PastCondition
  | CounterCondition;

type PathCondition = {
  path: string;
  eq?: unknown;
  neq?: unknown;
  in?: unknown[];
  notIn?: unknown[];
  inGroup?: AggregateId;
  notInGroup?: AggregateId;
  gt?: number;
  gte?: number;
  lt?: number;
  lte?: number;
};

type TagCondition =
  | { hasTag: string }
  | { missingTag: string }
  | { tagIn: string[] }
  | { tagNotIn: string[] };

type TraitCondition =
  | { hasTrait: string }
  | { missingTrait: string }
  | { traitIn: string[] }
  | { traitNotIn: string[] };

type EventCondition =
  | { eventOccurred: string }
  | { eventNotOccurred: string }
  | { eventOccurredWithin: { eventId: string; years: number } };

type PastCondition = {
  past: {
    ageRange?: [number, number];
    yearRange?: [number, number];
    atAge?: number;
    atYear?: number;
    where: ConditionGroup;
    mode?: "any" | "all" | "none";
  };
};

type CounterCondition = {
  counter: string;
  eq?: number;
  gt?: number;
  gte?: number;
  lt?: number;
  lte?: number;
};
```

示例：

```json
{
  "all": [
    { "path": "attrs.intelligence", "gte": 7 },
    { "path": "resources.health", "gte": 40 },
    { "missingTag": "dropped_out" }
  ]
}
```

### 5.1 过去状态条件

`past` 条件用于查询 `state.snapshots`。

语义：

- `mode: "any"`：时间范围内任意一条快照满足条件即可，默认值。
- `mode: "all"`：时间范围内所有快照都必须满足条件。
- `mode: "none"`：时间范围内没有快照满足条件。

示例：当前人在上海，且 0 到 3 岁时曾经生活在西部省份。

```json
{
  "all": [
    { "path": "location.currentProvince", "eq": "shanghai" },
    {
      "past": {
        "ageRange": [0, 3],
        "mode": "any",
        "where": {
          "all": [
            { "path": "location.currentProvince", "inGroup": "province.region.west" }
          ]
        }
      }
    }
  ]
}
```

注意：

- `past.where` 内仍然使用同一套 `ConditionGroup`，方便复用条件解析器。
- `past` 条件默认查询年度快照，不查询事件日志。
- 如果要判断“发生过某事件”，继续使用 `eventOccurred` 或 `requiresEvents`，不要从 `history` 文本里推断。

## 6. 聚合系统

很多事件条件需要引用一组值，例如“西部省份”“沿海制造业省份”“一线城市”“高教育压力地区”“互联网行业”。这些不应该散落在事件数据里，而应该独立定义为聚合。

```ts
type AggregateId = string;

type AggregateDefinition = {
  id: AggregateId;
  name: string;
  domain: AggregateDomain;
  values: string[];
  description?: string;
};

type AggregateDomain =
  | "province"
  | "region"
  | "cityTier"
  | "hukou"
  | "careerField"
  | "educationLevel"
  | "tag"
  | "event";
```

示例：

```json
[
  {
    "id": "province.region.west",
    "name": "西部省份",
    "domain": "province",
    "values": ["sichuan", "yunnan", "gansu", "xinjiang", "tibet"],
    "description": "用于表达西部地区相关事件，不等同于严格行政或统计口径。"
  },
  {
    "id": "province.coastal_manufacturing",
    "name": "沿海制造业省份",
    "domain": "province",
    "values": ["guangdong", "zhejiang", "jiangsu", "shandong"]
  },
  {
    "id": "cityTier.large_city",
    "name": "大城市",
    "domain": "cityTier",
    "values": ["tier1", "tier2"]
  }
]
```

设计规则：

- 聚合是数据包的一部分，建议放在 `data/aggregates/`。
- 事件只引用聚合 id，不复制聚合成员列表。
- 聚合 id 必须稳定，改名不改 id。
- 聚合可以有业务口径说明，避免“西部省份”等词产生歧义。
- MVP 暂不支持聚合嵌套；如果需要，第二版再支持 `includesGroups`。
- 引擎启动时加载聚合定义，构建 `aggregateRegistry`，条件判断和权重计算都通过 registry 解析。

聚合引用位置：

- `Condition.path.inGroup`
- `Condition.path.notInGroup`
- `RegionFilter.provinceGroups`
- `RegionFilter.cityTierGroups`
- 后续也可以用于职业、教育、标签等字段。

## 7. 权重系统

候选事件先经过“终身资格”和“当年触发”两层概率，再通过 `baseWeight` 和 `weightModifiers` 计算最终权重：

- `lifetimeProbability`：用 `seed + event.id` 做稳定抽样，决定这一生是否可能写到该事件。同一人生逐年推进时结果不会反复摇摆。适合“并非人人都会遇见”的日常切片；未显式配置的 `daily_` 事件默认使用较保守的终身资格率。
- `triggerProbability`：资格与其他条件都满足后，决定该事件在这一年是否进入候选池；它是逐年抽样。
- `baseWeight` / `weightModifiers`：多个已进入候选池的事件之间，决定谁更容易成为当年的主叙事。

三者不能互相替代。只降低权重不能防止一个事件覆盖绝大多数人生；只使用逐年概率又会让长寿人生凭借重复试验几乎必然命中。需要普遍发生的生命周期节点不应配置低终身资格率。

```text
finalWeight = baseWeight
  * 属性修正
  * 标签修正
  * 历史修正
  * 地区修正
  * 时代修正
  * 冷却修正
```

### 7.1 权重修正字段

```ts
type WeightModifier =
  | PathWeightModifier
  | TagWeightModifier
  | TraitWeightModifier
  | EventWeightModifier
  | CounterWeightModifier;

type PathWeightModifier = {
  path: string;
  eq?: unknown;
  neq?: unknown;
  gt?: number;
  gte?: number;
  lt?: number;
  lte?: number;
  add?: number;
  multiply?: number;
};

type TagWeightModifier =
  | { hasTag: string; add?: number; multiply?: number }
  | { missingTag: string; add?: number; multiply?: number };

type TraitWeightModifier =
  | { hasTrait: string; add?: number; multiply?: number }
  | { missingTrait: string; add?: number; multiply?: number };

type EventWeightModifier =
  | { eventOccurred: string; add?: number; multiply?: number }
  | { eventOccurredWithin: { eventId: string; years: number }; add?: number; multiply?: number };

type CounterWeightModifier = {
  counter: string;
  gt?: number;
  gte?: number;
  lt?: number;
  lte?: number;
  add?: number;
  multiply?: number;
};
```

### 7.2 抽取策略

推荐策略：

1. 过滤所有不满足条件的事件。
2. 计算每个候选事件的 `finalWeight`。
3. 按 `priority` 先处理关键节点事件。
4. 从候选事件中加权随机抽取。
5. 每年只抽取 1 个主叙事事件。

`priority` 用来保证关键节点事件出现，比如出生、入学、高考、毕业、第一份工作、退休、重大疾病、死亡等。普通事件不应该滥用 `priority`。

如果同一年存在多个高 `priority` 关键事件冲突，只取最高优先级事件；同优先级再根据最终权重加权随机抽取一个。关键事件一旦入选，就构成该年的主叙事，不再混入另一张随机卡片稀释它。

年度事件数量建议：

所有阶段每年均为 1 个主事件。自然健康流变可以作为轻量摘要附在同一年，但不占用第二个事件位。这样“一年”在阅读上始终是一段明确的叙事单位，也能避免同一句日常文案在一生里反复抽中。

## 8. 效果系统

事件效果用于修改状态。

`effects` 是可选字段。事件没有效果时，仍然会正常展示、写入 `history`，并更新 `occurredEvents`。这保证纯文本事件、氛围事件和铺垫事件也能参与后续依赖判断。

```ts
type Effect =
  | { path: string; set: unknown }
  | { path: string; add: number }
  | { path: string; multiply: number }
  | { addTag: string }
  | { removeTag: string }
  | { addTrait: string }
  | { removeTrait: string }
  | { counter: string; add: number }
  | { setFlag: string; value: boolean | string | number }
  | { cooldown: string; years: number }
  | { scheduleEvent: ScheduledEventInput }
  | { addTimedModifier: TimedModifierInput }
  | { die: string }
  | { triggerEnding: string };

type ScheduledEventInput = {
  eventId: string;
  delayYears: [number, number];
  weight?: number;
  weightMultiplier?: number;
  probability?: number;
};

type TimedModifierInput = {
  id: string;
  durationYears: number;
  target: TimedModifierTarget;
  add?: number;
  multiply?: number;
};

type TimedModifierTarget =
  | { eventId: string }
  | { eventTag: string }
  | { category: EventCategory };
```

引擎应用效果时必须做边界保护：

- 基础属性限制在 0 到 10。
- 派生资源限制在 0 到 100。
- 非法 path 应报错或在开发模式提示。
- 当年主事件先应用事件效果，再应用其自动结果效果。

### 8.1 跨时间效果

事件效果可以影响未来年份。首版支持两种方式：

1. `scheduleEvent`：把某个具体事件加入未来候选池，并在指定年份窗口内提高其出现机会。
2. `addTimedModifier`：在一段时间内提高某类事件、某个事件或某个事件标签的权重。

示例：18 岁事件 A 触发后，未来 3 到 6 年内事件 B 更容易出现。

```json
{
  "id": "event_a",
  "title": "埋下一颗种子",
  "ageRange": [18, 18],
  "baseWeight": 10,
  "text": "这一年，你做了一个看似不起眼的选择。",
  "effects": [
    {
      "scheduleEvent": {
        "eventId": "event_b",
        "delayYears": [3, 6],
        "weightMultiplier": 2
      }
    }
  ]
}
```

示例：未来 5 年内，所有创业相关事件概率增加。

```json
{
  "effects": [
    {
      "addTimedModifier": {
        "id": "startup_interest_boost",
        "durationYears": 5,
        "target": { "eventTag": "startup" },
        "multiply": 1.5
      }
    }
  ]
}
```

`scheduleEvent` 适合明确的剧情后续，`addTimedModifier` 适合长期倾向变化。

## 9. 事件依赖

事件依赖用于制造因果感。

### 9.1 标签依赖

最基础也最推荐的依赖方式。

```json
{
  "conditions": {
    "all": [
      { "hasTag": "college" },
      { "path": "meta.age", "gte": 18 },
      { "path": "meta.age", "lte": 24 }
    ]
  }
}
```

### 9.2 事件历史依赖

明确依赖某个事件发生过。

```json
{
  "requiresEvents": ["first_love"],
  "blocksEvents": ["lifelong_single_ending"]
}
```

### 9.3 软依赖

某事件发生过，只提高后续事件概率。

```json
{
  "weightModifiers": [
    { "eventOccurred": "startup_failed", "multiply": 2 },
    { "eventOccurredWithin": { "eventId": "breakup", "years": 5 }, "multiply": 1.5 }
  ]
}
```

### 9.4 后续事件

某事件发生后，安排未来几年内可能触发的事件。

```json
{
  "followUps": [
    {
      "eventId": "startup_first_funding",
      "delayYears": [1, 3],
      "weight": 30
    },
    {
      "eventId": "startup_failed",
      "delayYears": [1, 5],
      "weight": 20
    }
  ]
}
```

引擎会将其写入 `state.scheduledEvents`。

### 9.5 互斥依赖

通过 `blocksEvents`、`mutuallyExclusiveWith` 或互斥标签实现。

```json
{
  "id": "first_marriage",
  "conditions": {
    "none": [
      { "hasTag": "married" },
      { "hasTag": "divorced" }
    ]
  },
  "effects": [
    { "addTag": "married" },
    { "removeTag": "single" }
  ]
}
```

### 9.6 早死和死亡事件

首版允许早死，不设置最低死亡年龄。0 岁死亡、幼年意外、重大疾病等都可以作为事件出现，以保留黑色幽默和随机命运感。

设计规则：

- 死亡事件使用 `category: "ending"` 或 `category: "health"` + `effects: [{ "die": "原因" }]`。
- 特别离奇或冲击强的死亡事件应使用较低 `baseWeight`，但可以通过出生条件、地区、年份、家庭状态等提高权重。
- 如果死亡事件被抽中，本年后续普通事件不再继续结算，直接进入结局报告。
- 死亡事件也可以使用 `priority`，例如高龄自然死亡、重大疾病恶化、关键事故。

示例：

```json
{
  "id": "birth_accident_extreme",
  "title": "出生意外",
  "category": "ending",
  "ageRange": [0, 0],
  "baseWeight": 1,
  "priority": 100,
  "text": "你出生在一个极端糟糕的环境里，生命刚开始就戛然而止。",
  "effects": [
    { "die": "出生意外" },
    { "triggerEnding": "newborn_death" }
  ]
}
```

## 10. 自动结果事件

自动结果事件是普通事件的扩展。事件可以配置多个可能结果，但不会向玩家展示选项。引擎在事件发生时，根据结果条件、权重和本局 seed 自动抽取一个结果并立即应用效果。

```ts
type EventOutcome = {
  id: string;
  resultText: string;
  conditions?: ConditionGroup;
  baseWeight?: number;
  weightModifiers?: WeightModifier[];
  effects: Effect[];
};
```

核心交互约束：完成开局后，`advanceYear` 必须在一次调用中完成事件选择、结果选择、效果应用和快照写入。引擎不得返回等待玩家处理的 pending choice 状态，UI 也不得渲染选择弹窗。

示例：

```json
{
  "id": "first_job_outcome",
  "title": "第一份工作",
  "category": "career",
  "stage": ["young_adult"],
  "ageRange": [21, 25],
  "conditions": {
    "all": [{ "hasTag": "college" }]
  },
  "baseWeight": 80,
  "priority": 10,
  "text": "毕业后，你走到了第一份工作的门口。",
  "outcomes": [
    {
      "id": "stable_company",
      "resultText": "你进入大公司，先换来了一份稳定。",
      "effects": [
        { "path": "career.status", "set": "employed" },
        { "path": "career.field", "set": "corporate" },
        { "path": "resources.wealth", "add": 8 },
        { "addTag": "corporate_worker" }
      ]
    },
    {
      "id": "startup",
      "resultText": "你进入创业公司，机会和加班一起到来。",
      "effects": [
        { "path": "career.status", "set": "employed" },
        { "path": "career.field", "set": "startup" },
        { "path": "resources.wealth", "add": -5 },
        { "path": "resources.achievement", "add": 12 },
        { "addTag": "startup_path" }
      ]
    }
  ]
}
```

## 11. 示例事件

```json
{
  "id": "mobile_internet_wave",
  "title": "移动互联网浪潮",
  "category": "career",
  "stage": ["young_adult"],
  "ageRange": [20, 35],
  "yearRange": [2010, 2018],
  "conditions": {
    "all": [
      { "path": "attrs.intelligence", "gte": 6 },
      { "path": "career.status", "neq": "retired" }
    ]
  },
  "baseWeight": 20,
  "weightModifiers": [
    { "path": "environment.jobOpportunity", "gte": 7, "multiply": 1.5 },
    { "path": "birth.province", "eq": "guangdong", "multiply": 1.2 },
    { "hasTag": "internet_industry", "multiply": 2 }
  ],
  "cooldown": 5,
  "maxOccurrences": 1,
  "text": "移动互联网浪潮袭来，你所在的城市出现了大量新机会。",
  "effects": [
    { "path": "resources.achievement", "add": 8 },
    { "path": "resources.wealth", "add": 6 },
    { "addTag": "internet_wave_participant" }
  ]
}
```

## 12. 引擎模块拆分

建议模块：

```text
engine/
  createInitialState.ts
  advanceYear.ts
  stage.ts
  environment.ts
  aggregateRegistry.ts
  conditions.ts
  weights.ts
  random.ts
  effects.ts
  scheduler.ts
  endings.ts
  validation.ts

data/
  talents/
  events/
  endings/
  regions/
  aggregates/
```

模块职责：

- `createInitialState`：根据 seed、出生年份、省份、开局特质和属性生成初始状态。
- `advanceYear`：年度推进入口。
- `stage`：年龄和人生阶段的互相映射。
- `environment`：根据出生地、当前位置、年份计算外部环境。
- `naturalChanges`：处理年度自然变化，例如病后恢复、随年龄健康下滑、长期低健康获得体弱特质。
- `yearlyChanges`：记录自然变化产生的展示摘要，不参与事件筛选和权重计算。
- `aggregateRegistry`：加载和解析聚合定义，支持 `inGroup`、地区 group、标签 group 等引用。
- `conditions`：条件判断。
- `weights`：事件权重计算。
- `random`：可复现随机数。
- `effects`：应用事件效果。
- `scheduler`：处理后续事件。
- `endings`：死亡与结局判断。
- `validation`：校验事件数据合法性。

## 13. 年度推进伪代码

```ts
function advanceYear(state: PlayerState, eventPool: LifeEvent[]): YearResult {
  state.meta.age += 1;
  state.meta.currentYear = state.birth.year + state.meta.age;
  state.meta.stage = getLifeStage(state.meta.age);
  state.environment = calculateEnvironment(state);
  tickCooldowns(state);
  removeExpiredTimedModifiers(state);
  const beforeNatural = clone(state);
  applyNaturalChanges(state);
  recordYearlyChange(beforeNatural, state);

  const candidates = eventPool
    .filter(event => matchTime(event, state))
    .filter(event => matchRegionFilters(event, state))
    .filter(event => matchDependencies(event, state))
    .filter(event => matchConditions(event.conditions, state))
    .filter(event => matchOccurrenceRules(event, state));

  const scheduledCandidates = getScheduledCandidates(state, eventPool);
  const weighted = calculateWeights([...candidates, ...scheduledCandidates], state, {
    timedModifiers: state.timedModifiers
  });
  const selectedEvents = weightedRandomPick(weighted, { count: getEventCount(state) });

  for (const event of selectedEvents) {
    applyEvent(event, state);
    recordOccurredEvent(event, state);
    createFollowUps(event, state);
    writeHistory(event, state);
  }

  const ending = evaluateEnding(state);
  if (ending) applyEnding(ending, state);
  writeSnapshot(state);

  return {
    state,
    events: selectedEvents,
    yearlyChanges: state.yearlyChanges,
    ending
  };
}
```

## 14. MVP 实现优先级

第一版必须实现：

- `PlayerState` 基础结构。
- 出生年份、省份、城市层级、户口。
- 当前年份推导。
- 基础属性、派生资源、标签、计数器。
- `LifeEvent` 基础字段。
- `conditions`。
- `baseWeight` 和 `weightModifiers`。
- 加权随机抽取。
- `effects`。
- `requiresEvents`、`blocksEvents`。
- `cooldown`、`maxOccurrences`。
- `history`、`snapshots` 和 `occurredEvents`。
- `aggregateRegistry` 和基础聚合数据。
- 全量省份 code 表。
- `priority` 关键节点事件机制。
- 允许 0 岁死亡的死亡事件机制。

第二版再实现：

- `followUps`。
- `scheduledEvents`。
- `eventOccurredWithin`。
- 地区和时代配置更精细化。
- 事件数据校验 CLI。

暂时不做：

- 任意复杂剧情图编辑器。
- 循环依赖自动解析。
- 多分支剧情树可视化。
- AI 生成主线事件。

## 15. 已确认决策

1. 出生年份范围为 `1840` 到 `2020`。
2. 省份第一版全量支持，并保留 `other` 兜底。
3. `environment` 每年动态计算。
4. 每年恰好 1 条主叙事事件；自然流变只作为附属摘要。
5. 关键节点事件使用 `priority` 保证出现。
6. 第一版允许早死，不设置最小死亡年龄。
7. 初始状态允许玩家手选，同时提供一键随机。
8. 一局人生需要固定随机种子分享入口，复用 seed 可复现同一套随机序列。
9. 0 岁死亡等极端事件不提供“跳过极端内容”开关。
10. 省份 code 采用拼音。
11. `priority` 关键事件同一年冲突时，只取最高优先级事件；同优先级按最终权重加权随机。
