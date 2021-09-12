(window.webpackJsonp=window.webpackJsonp||[]).push([[24],{532:function(t,a,v){t.exports=v.p+"assets/img/70-20210721123202301.06fa13a3.png"},533:function(t,a,v){t.exports=v.p+"assets/img/70.12b8466c.png"},637:function(t,a,v){"use strict";v.r(a);var _=v(21),s=Object(_.a)({},(function(){var t=this,a=t.$createElement,_=t._self._c||a;return _("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[_("h1",{attrs:{id:"错误示范"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#错误示范"}},[t._v("#")]),t._v(" 错误示范")]),t._v(" "),_("p",[t._v("尝试描述三次握手和四次挥手服务端-客户端之间交互的时序图\n比如")]),t._v(" "),_("blockquote",[_("p",[t._v("建立连接的三次握手 第一次握手是客户端发送syn，第二次握手是服务端返回一个syn-ack，第三次握手是客户端返回一个ack\n断开连接的四次挥手 第一次发起端巴拉巴拉。。。")])]),t._v(" "),_("h1",{attrs:{id:"回答思路"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#回答思路"}},[t._v("#")]),t._v(" 回答思路")]),t._v(" "),_("p",[t._v("通用的回答步骤，前提是这个问题cover的住")]),t._v(" "),_("h2",{attrs:{id:"整体出发【理论设计】"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#整体出发【理论设计】"}},[t._v("#")]),t._v(" 整体出发【理论设计】")]),t._v(" "),_("p",[t._v("TCP协议的特点：面向连接的、可靠的、全双工")]),t._v(" "),_("h2",{attrs:{id:"言之有物【关键字】"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#言之有物【关键字】"}},[t._v("#")]),t._v(" 言之有物【关键字】")]),t._v(" "),_("p",[t._v("然后谈到三次握手和四次挥手是为了满足TCP协议的设计特点")]),t._v(" "),_("h2",{attrs:{id:"扩展关联-【发散引导】"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#扩展关联-【发散引导】"}},[t._v("#")]),t._v(" 扩展关联 【发散引导】")]),t._v(" "),_("p",[t._v("可能是面试官的下一个问题【实践问题、横向扩展（理论设计在其他地方的应用）】\n比如")]),t._v(" "),_("ul",[_("li",[t._v("半连接队列")]),t._v(" "),_("li",[t._v("滑动窗口")])]),t._v(" "),_("h1",{attrs:{id:"标准答案"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#标准答案"}},[t._v("#")]),t._v(" 标准答案")]),t._v(" "),_("h2",{attrs:{id:"理论设计"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#理论设计"}},[t._v("#")]),t._v(" 理论设计")]),t._v(" "),_("p",[t._v("tcp协议是面向可靠连接的双工协议。为了保证可靠性，每发出一个tcp数据包"),_("strong",[t._v("必须有一个ack响应包")]),t._v("来表示对方已经收到了数据，否则就认为tcp包没有收到，重新发送。")]),t._v(" "),_("p",[t._v("在建立连接时，需要确保连接双方")]),t._v(" "),_("h2",{attrs:{id:"问题本身"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#问题本身"}},[t._v("#")]),t._v(" 问题本身")]),t._v(" "),_("h3",{attrs:{id:"三次握手"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#三次握手"}},[t._v("#")]),t._v(" 三次握手")]),t._v(" "),_("p",[_("img",{attrs:{src:v(532),alt:"img"}})]),t._v(" "),_("p",[t._v("创建连接时，需要确认两点")]),t._v(" "),_("ol",[_("li",[t._v("客户端和服务端的具备数据收发能力")]),t._v(" "),_("li",[t._v("客户端和服务端告知对方自己的seq序列号\nseq序列号用于传输过程中校验数据，保证数据不丢失，即传输的可靠性")])]),t._v(" "),_("p",[t._v("一 客户端发送syn包用来通知服务端自己的序列号")]),t._v(" "),_("p",[t._v("二 服务端收到之后根据客户端序列号+1返回一个ack")]),t._v(" "),_("p",[t._v("二 同时服务端也发送syn包也通知客户端自己的序列号")]),t._v(" "),_("p",[t._v("三 客户端收到之后根据服务端序列号+1返回一个ack")]),t._v(" "),_("p",[t._v("服务端把ack和syn合并成一个包，作为第二次握手")]),t._v(" "),_("p",[t._v("这就是所谓的三次握手")]),t._v(" "),_("h3",{attrs:{id:"四次挥手"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#四次挥手"}},[t._v("#")]),t._v(" 四次挥手")]),t._v(" "),_("p",[_("img",{attrs:{src:v(533),alt:"img"}})]),t._v(" "),_("p",[t._v("当一端需要断开连接时，部分客户端和服务端，而是发起方和接受方")]),t._v(" "),_("p",[t._v("需要通知对方断开连接，保证数据不会丢失")]),t._v(" "),_("p",[t._v("一 发起方发送一个"),_("code",[t._v("FIN")]),t._v("包通知接收方要断开连接，发起端不会在传输数据")]),t._v(" "),_("p",[t._v("二 接受方发送一个"),_("code",[t._v("ACK")]),t._v("包吗，只表示已经收到"),_("code",[t._v("FIN")]),t._v("包 并"),_("strong",[t._v("开始进行关闭连接的准备")]),t._v("（将还没有来得及发送给发起端的数据发完）")]),t._v(" "),_("p",[t._v("三 接收方准备完毕后，向发起方返回"),_("code",[t._v("FIN-ACK")]),t._v("包 表示已经做好关闭连接的准备")]),t._v(" "),_("p",[t._v("四 发起端回复ACK包，确认连接关闭")]),t._v(" "),_("h2",{attrs:{id:"问题扩展"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#问题扩展"}},[t._v("#")]),t._v(" 问题扩展")]),t._v(" "),_("h3",{attrs:{id:"为什么连接的时候是三次握手-关闭的时候却是四次握手"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#为什么连接的时候是三次握手-关闭的时候却是四次握手"}},[t._v("#")]),t._v(" 为什么连接的时候是三次握手，关闭的时候却是四次握手")]),t._v(" "),_("p",[t._v("三次握手ack和syn可以合并为一个包，ack和syn之间不需要发送额外的包")]),t._v(" "),_("p",[t._v("四次挥手，接受端发送了ack之后，还需要将buff中未来得及发出去的数据通过tcp包发送出去，这个过程seq还会改变，所以FIN和ACK不能合并")])])}),[],!1,null,null,null);a.default=s.exports}}]);