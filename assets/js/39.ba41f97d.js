(window.webpackJsonp=window.webpackJsonp||[]).push([[39],{638:function(a,t,n){"use strict";n.r(t);var s=n(21),v=Object(s.a)({},(function(){var a=this,t=a.$createElement,n=a._self._c||t;return n("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[n("h1",{attrs:{id:"错误示范"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#错误示范"}},[a._v("#")]),a._v(" 错误示范")]),a._v(" "),n("h2",{attrs:{id:"❌-脱离概念-只关注过程"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#❌-脱离概念-只关注过程"}},[a._v("#")]),a._v(" ❌  脱离概念 只关注过程")]),a._v(" "),n("blockquote",[n("p",[a._v("事务的话是一个对数据修改的过程。开启一个事务之后对某一个资源做一些增删改查\n然后成功就提交 失败就回滚")])]),a._v(" "),n("p",[a._v("这种回答很low\ncrud搬砖仔，api调用师的水平")]),a._v(" "),n("blockquote",[n("p",[a._v("有一个很明面的区分指标\n会使用了很多口头禅（比如然后、就是、对吧）来使自己的表达听起来连贯。\n并且会导致整个面试过程主要是你在说。\n其实面试是一个双向的过程，说的越多反而会越被动。")])]),a._v(" "),n("h2",{attrs:{id:"❌-只背概念但不落地"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#❌-只背概念但不落地"}},[a._v("#")]),a._v(" ❌  只背概念但不落地")]),a._v(" "),n("p",[a._v("事务就是用来隔离不同session的操作的概念\n保证事务操作的ACID特性\nA是原子性 要么全部成功 要么全部失败balabala\nC是一致性 balabala\nI是隔离性 balabala\nD是持久性 balabala")]),a._v(" "),n("h1",{attrs:{id:"回答思路"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#回答思路"}},[a._v("#")]),a._v(" 回答思路")]),a._v(" "),n("blockquote",[n("p",[a._v("回答技术问题的思路是通用的")]),a._v(" "),n("p",[a._v("首先要get到面试官想问什么，他想听到什么。\n比如关于事务，大部分面试官想听到的关键字就是ACID特性和事务的隔离级别\n能把这两个说清楚，这个问题就合格了\n如果想做到加分就要向实现原理发散，然后谈到设计思想，并且能举一反三\n这里有一个心机就是你自己发散的肯定是你熟的，在面试中掌握主动。")])]),a._v(" "),n("h2",{attrs:{id:"整体出发【理论设计】"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#整体出发【理论设计】"}},[a._v("#")]),a._v(" 整体出发【理论设计】")]),a._v(" "),n("ul",[n("li",[a._v("事务的广义概念\n对"),n("strong",[a._v("一组")]),a._v("数据操作的集合，是一组程序的执行单元")]),a._v(" "),n("li",[a._v("引入事务概念的作用\n为了保证多个并行的执行过程（数据库session或微服务实例）并发操作公共的数据模的"),n("strong",[a._v("业务一致性")])])]),a._v(" "),n("h2",{attrs:{id:"言之有物【关键字】"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#言之有物【关键字】"}},[a._v("#")]),a._v(" 言之有物【关键字】")]),a._v(" "),n("ul",[n("li",[a._v("事务的ACID特性\n谈谈innodb中对ACID特性的实现")]),a._v(" "),n("li",[a._v("数据库的事务隔离级别\n执行效率和一致性的权衡\n说是有4种隔离级别，最严格【串行化】和最不严格【读未提交】的隔离级别没有什么说头\n读已提交和可重复读利用MVCC来为事务提供独立的read view\n读已提交：\n事务中可以查到其他事务提交的变更（解决了脏读 实现最基本的事务隔离）\n可重复读：\n事务中不可以查到其他事务提交的update变更（解决不可重复读）\n但无法解决幻读，可以查询到其他事务提交的insert变更")])]),a._v(" "),n("h2",{attrs:{id:"扩展关联-【发散-引导话题】"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#扩展关联-【发散-引导话题】"}},[a._v("#")]),a._v(" 扩展关联 【发散 引导话题】")]),a._v(" "),n("p",[a._v("根据主干问题引导到相关问题，最好是选那种自己精心准备的话题")]),a._v(" "),n("ul",[n("li",[n("p",[a._v("mysql innodb的缓存+日志优先策略\n缓存数据页和磁盘的顺序读写\n可以聊到顺序写入的应用场景")])]),a._v(" "),n("li",[n("p",[a._v("innodb如何在可重复读级别下部分解决幻读问题\n"),a._v("\n快照读和当前读\n没有更新操作的事务，使用快照读可以避免幻读。")])]),a._v(" "),n("li",[n("p",[a._v("mysql innodb的隔离为什么默认为可重复读\n历史原因 binlog实现")])]),a._v(" "),n("li",[n("p",[a._v("分布式事务\n分布式协调")])])])])}),[],!1,null,null,null);t.default=v.exports}}]);