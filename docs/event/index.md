---
comment: false
---
# 事件

---

## 事件概述

> 事件是一段上报，上报也可以由插件主动触发  
> 例如插件向适配器发送请求，适配器返回结果时触发上报  
> 在大多数协议端中，事件上报基本上是通过 `HTTP`、`WebSocket`通信实现的  
> 而在karin，使用了`kritor`标准，新增了一种`gRPC`协议进行通信

## 消息事件

- [消息事件](./message.md)

## 通知事件

- [通知事件](./notice.md)

## 请求事件

- [请求事件](./request.md)
