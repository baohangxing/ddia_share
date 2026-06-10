// DDIA 知识内容数据 - 所有章节的技术讲解内容
// 以卡片形式在网页中展示

export interface DDIACard {
  title: string;
  concept: string;
  description: string;
  items?: DDIAItem[];
  diagram?: "comparison" | "structure" | "flow" | "animation";
}

export interface DDIAItem {
  label: string;
  content: string;
  highlight?: boolean;
}

export interface ChapterContent {
  chapter: number;
  chapterTitle: string;
  summary: string;
  cards: DDIACard[];
}

export const ddiaChapters: ChapterContent[] = [
  {
    chapter: 3,
    chapterTitle: "Storage & Retrieval  存储与查询",
    summary: "索引不是优化，索引是生存条件。",
    cards: [
      {
        title: "数据库存储引擎基础",
        concept: "存储引擎",
        description:
          "数据库底层如何组织数据在磁盘上的存储。最简单的做法是堆文件（Heap File）：数据按照插入顺序追加写入，查询时需要全表扫描。",
        items: [
          {
            label: "堆文件",
            content: "追加写入，O(1) 写入，O(n) 查询。简单但不可扩展。",
          },
          {
            label: "页（Page）",
            content:
              "数据读写的最小单位，通常 4KB-16KB。数据库以页为单位与磁盘交互。",
          },
          {
            label: "数据文件",
            content: "持久化存储，包含数据页、索引页、元数据页等。",
          },
        ],
      },
      {
        title: "哈希索引 vs B-Tree vs LSM-Tree",
        concept: "三种存储引擎",
        description:
          "不同的存储引擎在读写性能、范围查询、磁盘空间占用方面各有取舍。",
        items: [
          {
            label: "哈希索引",
            content: "O(1) 点查极快，但不支持范围查询。",
            highlight: false,
          },
          {
            label: "B-Tree",
            content:
              "平衡多路搜索树，O(log n) 读写。支持范围扫描。最广泛使用的索引结构，MySQL InnoDB 默认。",
            highlight: true,
          },
          {
            label: "LSM-Tree",
            content:
              "Log-Structured Merge-Tree。写入先到内存 MemTable，达到阈值后刷盘为 SSTable。写入极快，读可能需合并多个文件。LevelDB/RocksDB 使用。",
            highlight: false,
          },
        ],
      },
      {
        title: "B+Tree 内部结构",
        concept: "B+Tree 详解",
        description:
          "B+Tree 是所有叶子节点在同一层的平衡树，非叶子节点只存 key 和指针，叶子节点存完整数据并用链表相连。",
        items: [
          {
            label: "根节点",
            content: "树的入口，可能也是叶子节点。随着数据增长，根节点分裂。",
          },
          {
            label: "内部节点",
            content:
              "存储 key 范围 + 子节点指针。分支因子（fanout）通常为几百。",
          },
          {
            label: "叶子节点",
            content:
              "存储 key + 完整数据行（或指针）。通过双向链表连接，支持高效范围扫描。",
          },
          {
            label: "分支因子",
            content:
              "决定了树的高度。假设每页 16KB，key 24B + 指针 8B = 32B，分支因子约 500。四层可存储 500⁴ ≈ 62 亿行，实际高度通常是 2-4 层。",
          },
        ],
      },
      {
        title: "全表扫描 vs 索引查找",
        concept: "复杂度对比",
        description:
          "没有索引时，数据库必须扫描所有行（全表扫描）。有索引时，可以利用 B+Tree 结构快速定位。",
        items: [
          {
            label: "全表扫描",
            content:
              "O(n)。100 万行需要扫描 100 万次。CPU 和磁盘 I/O 都承受巨大压力。",
          },
          {
            label: "索引查找",
            content:
              "O(log n)。B+Tree 4 层结构只需 4 次磁盘读取即可定位任意行。",
          },
          {
            label: "实际差距",
            content:
              "100 万行：全表扫描 ~3000ms vs 索引查找 ~5ms，差距 600 倍。数据量越大差距越悬殊。",
          },
        ],
      },
      {
        title: "聚集索引 vs 非聚集索引",
        concept: "两种索引类型",
        description: "理解两种索引的区别，对于查询性能优化至关重要。",
        items: [
          {
            label: "聚集索引（Clustered）",
            content:
              "数据行本身按照索引顺序物理存储。一张表只能有一个聚集索引。InnoDB 的主键即聚集索引，叶子节点存完整行数据。",
          },
          {
            label: "非聚集索引（Non-Clustered）",
            content:
              "叶子节点存储指向数据行的指针（主键值）。回表查询：从非聚集索引找到主键，再用主键到聚集索引取完整数据。",
          },
          {
            label: "覆盖索引",
            content:
              "查询所需的所有列都在索引中，无需回表，性能最佳。通过 CREATE INDEX idx ON tweets(create_time, content) 实现。",
          },
        ],
      },
      {
        title: "索引的代价",
        concept: "写入放大",
        description: "索引不是免费的。每多一个索引，写入操作就多一份开销。",
        items: [
          {
            label: "写入放大",
            content:
              "每次 INSERT 需要同时更新所有索引的 B+Tree 结构，可能触发页分裂和树再平衡。",
          },
          {
            label: "存储开销",
            content: "索引本身占用磁盘空间。非聚集索引约为数据大小的 20%-50%。",
          },
          {
            label: "选型原则",
            content:
              "仅为高频查询条件建索引。定期用 EXPLAIN 分析慢查询，避免无用索引。OLTP 建议每表 3-5 个索引。",
          },
        ],
      },
    ],
  },
  {
    chapter: 5,
    chapterTitle: "Replication 冗余",
    summary: "复制让你睡得着觉，但复制滞后让你半夜惊醒。",
    cards: [
      {
        title: "三种复制模型",
        concept: "复制架构对比",
        description:
          "复制是把同一份数据保存在多台机器上，以提高可用性、扩展读吞吐量、降低延迟。",
        items: [
          {
            label: "单主复制",
            content:
              "所有写入到 Leader，复制到 Followers。读从 Followers。最简单，最常用（MySQL、PostgreSQL、MongoDB）。✅ 无冲突，❌ 单点瓶颈。",
            highlight: true,
          },
          {
            label: "多主复制",
            content:
              "多个节点都可接受写入，互相复制。适用于多数据中心，但冲突处理复杂。MySQL Tungsten Replicator、CouchDB。",
            highlight: false,
          },
          {
            label: "无主复制",
            content:
              "客户端直接写入多个副本，或通过协调者。Dynamo 风格。Cassandra、Riak。读写可配置法定人数。",
            highlight: false,
          },
        ],
      },
      {
        title: "同步复制 vs 异步复制",
        concept: "复制模式",
        description:
          "同步复制保证数据不丢失但慢，异步复制快但可能丢数据。大多数系统使用半同步：一个同步 + 多个异步。",
        items: [
          {
            label: "同步复制",
            content:
              "Leader 等待所有（或某个）Follower 确认后才返回成功。强一致性，但写入延迟高。一个 Follower 故障会阻塞整个系统。",
          },
          {
            label: "异步复制",
            content:
              "Leader 不等待 Follower 确认。写入极快，但 Leader 故障时已提交但未复制的数据可能丢失。",
          },
          {
            label: "半同步复制",
            content:
              "一个 Follower 同步，其余异步。兼顾安全性和性能。至少两个节点有最新数据，是实际中最常用的方案。",
          },
        ],
      },
      {
        title: "复制滞后三大异常",
        concept: "Read-After-Write / Monotonic Reads / Consistent Prefix",
        description: "异步复制带来的不一致问题，需要应用层或数据库层解决。",
        items: [
          {
            label: "Read-After-Write Consistency",
            content:
              "用户写入后立即读取，可能读到旧数据（因为读了异步 Follower）。解决：从 Leader 读用户自己的数据，或用时间戳判断 Follower 是否追上。",
          },
          {
            label: "Monotonic Reads",
            content:
              "用户先后两次读取读到不同数据版本（先读追上进度的 Follower，后读滞后的 Follower），出现「时光倒流」。解决：基于用户 ID 哈希绑定到同一 Follower。",
          },
          {
            label: "Consistent Prefix Reads",
            content:
              "因果相关的写入以错误顺序出现（回复先于原帖）。分区数据库中的常见问题。解决：确保因果相关的写入进入同一分区。",
          },
        ],
      },
      {
        title: "多主复制冲突解决",
        concept: "Conflict Resolution",
        description: "当两个 Leader 同时修改同一数据，必须解决冲突。",
        items: [
          {
            label: "LWW (Last Write Wins)",
            content:
              "以时间戳最新的值为准，丢弃其他。简单但可能丢失数据。Cassandra 默认策略。",
          },
          {
            label: "版本向量",
            content:
              "跟踪每个副本的版本号，检测并发写入冲突。允许应用层自定义合并逻辑。DynamoDB 使用。",
          },
          {
            label: "CRDTs",
            content:
              "Conflict-free Replicated Data Types。数据结构本身保证合并结果收敛。计数器、集合、映射等。Redis CRDB 使用。",
          },
        ],
      },
      {
        title: "法定人数读写",
        concept: "Quorum Reads & Writes",
        description: "无主复制系统中，通过调节读写副本数来平衡一致性和可用性。",
        items: [
          {
            label: "法定条件",
            content:
              "R + W > N，其中 R=读副本数，W=写副本数，N=总副本数。保证至少有一个副本包含最新数据。",
          },
          {
            label: "Read Repair",
            content:
              "读取时发现过期数据，自动将最新值写回该副本。被动修复机制。",
          },
          {
            label: "Hinted Handoff",
            content: "写入目标节点不可达时，暂存到其他节点，待目标恢复后传回。",
          },
          {
            label: "Anti-Entropy",
            content:
              "后台进程比较副本的 Merkle Tree，发现差异后同步。主动修复机制。",
          },
        ],
      },
    ],
  },
  {
    chapter: 6,
    chapterTitle: "Partitioning 分区",
    summary: "分片不难，难的是热点。",
    cards: [
      {
        title: "Key Range vs Hash Partitioning",
        concept: "两种分区方式",
        description: "把数据拆分到不同节点的两种基本策略。",
        items: [
          {
            label: "Key Range Partitioning",
            content:
              "按主键范围分区（A-C 到分片1，D-F 到分片2...）。支持高效范围扫描，但容易产生热点（新数据集中在最后一个分区）。",
            highlight: false,
          },
          {
            label: "Hash Partitioning",
            content:
              "对主键做哈希后分配分区。数据均匀分布，但范围查询需要扫描所有分区。实际中最常用。",
            highlight: true,
          },
          {
            label: "一致性哈希",
            content:
              "将节点映射到哈希环上，最小化增减节点时的数据迁移量。peer-to-peer 系统中的常用技术。Cassandra/Dynamo 使用。",
            highlight: false,
          },
        ],
      },
      {
        title: "二级索引与分区",
        concept: "Local Index vs Global Index",
        description: "在分区数据库中实现二级索引的两种方式。",
        items: [
          {
            label: "本地索引（Document-Partitioned）",
            content:
              "每个分区独立维护自己的二级索引。写快（单分区），读慢（需查所有分区，scatter/gather）。Cassandra 默认方式。",
          },
          {
            label: "全局索引（Term-Partitioned）",
            content:
              "二级索引本身也按 key 分区存储。读快（单/少分区），写慢（需要分布式事务）。MongoDB 和 Elasticsearch 的支持。",
          },
        ],
      },
      {
        title: "再平衡策略",
        concept: "Rebalancing",
        description: "集群节点增减时，如何最小化数据迁移。",
        items: [
          {
            label: "固定分区数",
            content:
              "创建远多于节点数的分区（如 1000 个），增减节点时只需移动整个分区。简单，但分区大小固定。",
          },
          {
            label: "动态分区",
            content:
              "分区大小超出阈值自动分裂，太小则合并。类似 B+Tree。HBase、MongoDB 使用。",
          },
          {
            label: "节点比例分区",
            content:
              "每个节点固定数量的分区。节点增加时分区再平衡，保持每个节点分区数相等。Cassandra 使用。",
          },
        ],
      },
      {
        title: "热点缓解",
        concept: "Hot Spot Mitigation",
        description: "分片无法完全消除热点，需要应用层参与解决。",
        items: [
          {
            label: "请求路由",
            content:
              "三种方案：1) 客户端感知所有分区；2) 路由层（如 ZooKeeper）转发；3) 客户端连任意节点，节点内部转发。",
          },
          {
            label: "热点应对",
            content:
              "对于超级热点 key，为 key 添加随机后缀（key#1, key#2...），读写时聚合。增加复杂度但有效分散负载。",
          },
          {
            label: "并行查询",
            content:
              "MPP（Massively Parallel Processing）数据库如 Presto/ClickHouse 可将单个大查询拆分为多个子查询并行在不同分区上执行。",
          },
        ],
      },
    ],
  },
  {
    chapter: 11,
    chapterTitle: "Stream Processing 流处理",
    summary: "消息队列不是银弹，但它是你唯一的选择。",
    cards: [
      {
        title: "消息代理对比",
        concept: "AMQP/JMS vs Log-Based",
        description: "两大类消息系统的根本设计哲学差异。",
        items: [
          {
            label: "AMQP/JMS（传统）",
            content:
              "消息被消费后即删除。支持复杂的路由、优先级、TTL。RabbitMQ、ActiveMQ。适合 RPC/任务分发。",
          },
          {
            label: "日志式（Log-Based）",
            content:
              "消息持久化追加到日志中，消费者按 offset 读取。消息不删除（或按时间/大小保留）。Kafka、Pulsar。适合事件流处理。",
          },
          {
            label: "关键区别",
            content:
              "传统：消息即任务，处理完删除。日志式：消息即事实，永久记录可重放。日志式天然支持多消费者独立消费同一流。",
          },
        ],
      },
      {
        title: "Kafka 核心架构",
        concept: "Topic / Partition / Offset / Consumer Group",
        description: "理解 Kafka 的核心抽象是使用流处理的基础。",
        items: [
          {
            label: "Topic",
            content:
              "消息的逻辑分类，类似数据库的表。一个 Topic 可以有多个消费者订阅。",
          },
          {
            label: "Partition",
            content:
              "Topic 的物理分片。数据按分区键 hash 分配到特定分区。分区内部消息严格有序。分区是并行消费的基本单位。",
          },
          {
            label: "Offset",
            content:
              "每条消息在分区内的唯一递增序号。消费者记录自己消费到的 offset，实现断点续传。",
          },
          {
            label: "Consumer Group",
            content:
              "消费者组内每个消费者负责不同分区。组内消费者数 ≤ 分区数。实现负载均衡和高可用。",
          },
          {
            label: "Log Compaction",
            content:
              "对于相同 key 的消息，仅保留最新值。适合 CDC（Change Data Capture）场景，用于状态恢复。",
          },
        ],
      },
      {
        title: "CDC 与事件溯源",
        concept: "Change Data Capture & Event Sourcing",
        description: "用变化事件流驱动下游系统的两种模式。",
        items: [
          {
            label: "CDC",
            content:
              "捕获数据库的变更（INSERT/UPDATE/DELETE），以事件形式发送到 Kafka。下游系统（搜索索引、缓存、数据仓库）订阅并更新。Debezium 是最流行的 CDC 工具。",
          },
          {
            label: "事件溯源",
            content:
              "不存储当前状态，只存储所有状态变更事件。当前状态 = 重放所有事件的结果。天然审计日志，支持时间旅行。EventStoreDB 是专用数据库。",
          },
        ],
      },
      {
        title: "流处理 vs 批处理",
        concept: "Stream vs Batch",
        description: "数据处理的两大范式。",
        items: [
          {
            label: "批处理",
            content:
              "定期处理大量静止数据（T+1）。延迟高但吞吐高。MapReduce、Spark。适合报表、ETL。",
          },
          {
            label: "流处理",
            content:
              "持续处理实时到达的数据。延迟低（毫秒~秒级）。Kafka Streams、Flink。适合实时监控、风控、推荐。",
          },
          {
            label: "Lambda 架构",
            content:
              "同时运行批处理和流处理两层，批处理定期修正流处理的结果。复杂度高。Kappa 架构主张只用流处理。",
          },
        ],
      },
      {
        title: "高级流处理概念",
        concept: "Exactly-Once & Windowing",
        description: "流处理中的两个核心挑战。",
        items: [
          {
            label: "Exactly-Once 语义",
            content:
              "消息恰好被处理一次。实现方式：幂等写入 + 事务 + 去重。Kafka 通过事务 API 和幂等 Producer 支持。需注意：只是「效果」恰好一次，内部可能重试。",
          },
          {
            label: "滚动窗口（Tumbling）",
            content: "固定大小，无重叠。如每 5 分钟的统计。适合定期聚合。",
          },
          {
            label: "跳跃窗口（Hopping）",
            content:
              "固定大小，有重叠。如每 1 分钟统计过去 5 分钟。适合滑动平均。",
          },
          {
            label: "会话窗口（Session）",
            content:
              "动态大小，基于活动间隔。适合用户行为分析。需要 session_id 追踪。",
          },
          {
            label: "流式 Join",
            content:
              "Stream-Stream Join：窗口内匹配两条流。Stream-Table Join：流事件与静态表关联。Table-Table Join：物化视图维护。",
          },
        ],
      },
    ],
  },
  {
    chapter: 7,
    chapterTitle: "Transactions 事务",
    summary: "没有事务的数据库不是数据库，是记事本。",
    cards: [
      {
        title: "ACID 深度拆解",
        concept: "Atomicity / Consistency / Isolation / Durability",
        description: "ACID 是事务的四个理想属性，但每个字母的含义常被误解。",
        items: [
          {
            label: "Atomicity（原子性）",
            content:
              "并非并发概念！指的是如果事务在执行过程中出错，所有已执行的操作被撤销（回滚）。关键字：「可中止性」。不是「同时发生」。",
            highlight: true,
          },
          {
            label: "Consistency（一致性）",
            content:
              "这是应用层的责任，不是数据库的保证。数据库只保证不违反约束（外键、唯一性）。业务一致性需要开发者通过事务逻辑保证。",
            highlight: false,
          },
          {
            label: "Isolation（隔离性）",
            content:
              "并发执行的事务之间互不干扰。这是最常被妥协的属性，因为严格的隔离损害性能。不同的隔离级别提供不同程度的保护。",
            highlight: true,
          },
          {
            label: "Durability（持久性）",
            content:
              "事务提交后，即使系统崩溃数据也不会丢失。实现方式：WAL（Write-Ahead Log）+ fsync。持久性是概率性的——磁盘也会坏。",
            highlight: false,
          },
        ],
      },
      {
        title: "隔离级别详解",
        concept: "Isolation Levels",
        description: "SQL 标准定义的四种隔离级别，从弱到强性能逐步降低。",
        items: [
          {
            label: "Read Uncommitted",
            content:
              "最低隔离级别。允许脏读（读到未提交的数据）。几乎没人用，性能优势有限。",
          },
          {
            label: "Read Committed",
            content:
              "禁止脏读。但允许不可重复读（同一事务两次查询结果不同）。最流行的默认级别（PostgreSQL、Oracle、SQL Server）。",
          },
          {
            label: "Snapshot Isolation (Repeatable Read)",
            content:
              "每个事务看到数据库在开始时的快照。MVCC 实现。禁止不可重复读，但允许写偏斜（Write Skew）。MySQL InnoDB 默认。",
          },
          {
            label: "Serializable",
            content:
              "最高隔离级别。并发执行结果等同于某个串行执行顺序。完全消除竞争条件，但性能和并发度最低。",
          },
        ],
      },
      {
        title: "五种弱隔离异常",
        concept: "并发竞争条件",
        description: "低于 Serializable 级别时可能遇到的并发问题。",
        items: [
          {
            label: "脏读（Dirty Read）",
            content: "读到另一个事务未提交的修改。Read Committed 及以上防止。",
          },
          {
            label: "不可重复读（Non-Repeatable Read）",
            content:
              "同一事务两次读取相同行得到不同值（中途被别的事务修改并提交）。Snapshot Isolation 防止。",
          },
          {
            label: "幻读（Phantom Read）",
            content:
              "同一事务两次范围查询返回不同的行集合（别的事务插入/删除了符合条件的行）。谓词锁或索引范围锁防止。",
          },
          {
            label: "丢失更新（Lost Update）",
            content:
              "两个事务同时读-改-写，后写入的覆盖了先写入的。原子操作、显式锁或 Compare-and-Set 防止。",
          },
          {
            label: "写偏斜（Write Skew）",
            content:
              "两个事务读取相同数据，基于读取结果做不同决策并写入。Snapshot Isolation 无法防止。典型场景：医生值班（至少一人值班）、预订冲突。需要 Serializable。",
          },
        ],
      },
      {
        title: "隔离实现方式",
        concept: "2PL vs SSI",
        description: "实现可序列化隔离的两种主流方式。",
        items: [
          {
            label: "两阶段锁（2PL）",
            content:
              "事务持有读锁和写锁直到结束。强一致性但吞吐量低、死锁频繁。MySQL 的 SERIALIZABLE 使用。共享锁（读）和排他锁（写）互斥。",
          },
          {
            label: "可序列化快照隔离（SSI）",
            content:
              "基于 Snapshot Isolation，增加冲突检测。事务提交时检查是否有写偏斜冲突。无锁，乐观并发控制。PostgreSQL 9.1+ 的 SERIALIZABLE 使用。",
          },
          {
            label: "WAL（预写日志）",
            content:
              "所有修改先写入日志再写入数据文件。崩溃恢复时重放日志。支持原子性和持久性。每个事务提交时强制 fsync WAL。组提交（Group Commit）优化写入吞吐。",
          },
        ],
      },
      {
        title: "分布式事务",
        concept: "2PC vs Saga",
        description: "跨多个节点的事务保证。",
        items: [
          {
            label: "两阶段提交（2PC）",
            content:
              "协调者询问所有参与者是否可以提交（Prepare），全部同意后发送 Commit。任一节点故障则全部回滚。重量级、同步阻塞、协调者单点。XA 协议实现。",
          },
          {
            label: "Saga 模式",
            content:
              "将大事务拆分为多个本地事务序列，每个步骤有对应的补偿操作。失败时逆序执行补偿。异步、松耦合、最终一致性。适合长时间运行的业务流程。",
          },
        ],
      },
    ],
  },
  {
    chapter: 9,
    chapterTitle: "Consistency & Consensus 一致性和共识协议",
    summary: "一致性是分布式系统最贵的奢侈品。",
    cards: [
      {
        title: "线性一致性",
        concept: "Linearizability",
        description: "最强的单对象一致性模型：让多副本表现得像只有一个副本。",
        items: [
          {
            label: "正式定义",
            content:
              "如果操作 A 在操作 B 开始之前完成，那么所有节点都必须看到 A 发生在 B 之前。所有操作有一个全局的、实时的顺序。也称为：原子一致性、强一致性、立即一致性。",
          },
          {
            label: "反例",
            content:
              "不具备线性一致性的系统：多主复制、无主复制的 quorum（除非 R+W>N 且配置严格）、DNS。这解释了为什么写入后立即读取可能看到旧数据。",
          },
          {
            label: "实现代价",
            content:
              "网络延迟直接影响响应时间（无法用异步复制提速）。网络分区时系统不可用（CAP）。需要共识算法。",
          },
        ],
      },
      {
        title: "线性一致性 vs 可序列化",
        concept: "最容易混淆的两个概念",
        description: "它们是完全不同维度的保证，但常被混为一谈。",
        items: [
          {
            label: "线性一致性",
            content:
              "作用于单对象操作（读/写）。保证：一旦写入成功，所有后续读都能看到该值。实时顺序保证。",
          },
          {
            label: "可序列化",
            content:
              "作用于多对象事务。保证：并发事务的效果等同于某串行执行顺序。不保证实时顺序。",
          },
          {
            label: "两者独立",
            content:
              "一个系统可以：可序列化但不线性一致（如可重复读的快照隔离）；线性一致但不可序列化（如实现线性一致但隔离弱的系统）；两者都具备（严格可序列化=线性一致+可序列化）。",
          },
        ],
      },
      {
        title: "CAP 定理",
        concept: "Consistency / Availability / Partition Tolerance",
        description: "分布式系统最著名的定理，但常被简化误解。",
        items: [
          {
            label: "定理陈述",
            content:
              "当网络分区发生时，必须在一致性和可用性之间二选一。注意：CAP 不是「三选二」，而是「故障时只能保一」。无分区时 CAP 不适用。",
          },
          {
            label: "CP 系统",
            content:
              "分区时牺牲可用性，保持一致性。HBase、ZooKeeper、etcd。客户端请求可能被拒绝（系统不可用）。",
          },
          {
            label: "AP 系统",
            content:
              "分区时牺牲一致性，保持可用性。Cassandra、DynamoDB、CouchDB。返回可能过期的数据。",
          },
          {
            label: "PACELC",
            content:
              "CAP 的扩展：分区时在 A 和 C 之间选，无分区时在延迟和一致性之间选。更贴近实际系统设计。",
          },
        ],
      },
      {
        title: "顺序保证",
        concept: "Ordering Guarantees",
        description: "因果关系和全局顺序是分布式一致性的基础。",
        items: [
          {
            label: "因果关系",
            content:
              "如果事件 A 发生在 B 之前（A 因果影响 B），那么所有节点处理顺序必须 A 先于 B。比全序（Total Order）弱但更实用。",
          },
          {
            label: "Lamport 时间戳",
            content:
              "每个节点维护递增计数器。(计数器, 节点ID) 对提供偏序关系。如果 A 影响 B，则 A 的时间戳 < B 的时间戳。逆向不成立。占空间小，仅 12 字节。",
          },
          {
            label: "全序广播（Total Order Broadcast）",
            content:
              "保证：可靠交付（消息送达所有节点）和全序交付（所有节点以相同顺序接收）。等价于共识问题。ZooKeeper 的 Zab 和 Raft 都实现了全序广播。",
          },
        ],
      },
      {
        title: "Raft 共识算法深度解析",
        concept: "Leader Election & Log Replication",
        description:
          "Raft 将共识分解为三个子问题：领导者选举、日志复制、安全性。",
        items: [
          {
            label: "Leader 选举",
            content:
              "每个节点随机超时（150-300ms）后变 Candidate，发起 RequestVote。获得多数票即成为 Leader。Term（任期）单调递增，防止脑裂。",
          },
          {
            label: "日志复制",
            content:
              "Leader 通过 AppendEntries RPC 将日志条目复制到 Followers。多数确认后提交（Committed）。已提交的条目保证最终被所有节点执行。",
          },
          {
            label: "安全性",
            content:
              "选举限制：Candidate 的日志必须至少和多数节点一样新（比较最后日志的 term + index）。提交前条目规则：Leader 不能提交旧 term 的条目（Figure 8 问题）。",
          },
          {
            label: "成员变更",
            content:
              "使用 Joint Consensus：新旧配置共存过渡期，需要两个多数派（旧+新）都同意。保证集群配置变更期间不出现双 Leader。",
          },
          {
            label: "日志压缩",
            content:
              "状态机生成快照（Snapshot），截断快照之前的日志。InstallSnapshot RPC 传输到落后节点。",
          },
        ],
      },
      {
        title: "共识算法对比",
        concept: "Paxos vs Raft vs Zab",
        description: "三大共识算法的设计哲学。",
        items: [
          {
            label: "Paxos",
            content:
              "学术界经典，难理解难实现。Multi-Paxos 优化后性能好。Google Chubby 使用。理论完备但工程落地困难。",
          },
          {
            label: "Raft",
            content:
              "为可理解性设计。分解为 Leader 选举 + 日志复制。所有操作通过 Leader，日志只从 Leader 流向 Follower。etcd、TiKV、Consul 使用。",
          },
          {
            label: "Zab",
            content:
              "ZooKeeper Atomic Broadcast。为 ZooKeeper 定制。与 Raft 相似但 Leader 选举细节不同。支持 FIFO 客户端顺序保证。",
          },
          {
            label: "FLP 不可能性",
            content:
              "异步网络模型中，即使只有一个节点可能故障，也不存在总是终止的确定性共识算法。但实际系统中通过超时（随机化）绕过此限制。",
          },
        ],
      },
    ],
  },
];
