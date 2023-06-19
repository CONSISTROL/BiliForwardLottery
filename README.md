# [BiliForwardLottery](https://github.com/CONSISTROL/BiliForwardLottery)
- 项目地址: https://github.com/CONSISTROL/BiliForwardLottery

## 使用说明
- 用户多次转发只统计一次
- 上传文件后自动抽奖，不满意可以点击`rua!`重抽
- 点击头像跳转私信界面
- 点击用户uid跳转个人主页 *(看看是否关注自己，根据用户动态行为自行判断是否为抽奖号)*

## 使用方式
1. 使用Chrome打开抽奖动态界面，例如<a href="https://www.bilibili.com/opus/807738213110120470" target="_blank">这个动态</a>，按下F12，选择`网络`，`Fetxh/XHR`，`清除`，点击转发，不断下拉(或按住PageDown)，直到网页无法下拉后点击`导出HAR文件`。

2. 打开[抽奖界面](https://github.com/CONSISTROL/BiliForwardLottery/releases/download/bilibili/bili_forward_lottery.html)(若有显示问题，请下载[项目](https://github.com/CONSISTROL/BiliForwardLottery/archive/refs/heads/master.zip)解压后使用)

3. 点击选择文件，选择导出后的`www.bilibili.com.har`文件，点击上传

## 注意
1. 由于b站对转发内容查看有数量限制，因此超过500转发量的动态只能获取到最近的500条转发记录(网页滚动条无法继续下拉)

2. 由于b站对转发内容查看有ip限制，一次性查看了大量的转发内容后可能会导致一段时间内(大概几小时)无法查看所有动态的转发详情(会显示Request failed with status code 412,这种情况就是请求被拦截了)，可以考虑使用滑慢点或使用全局代理更换ip

## 处理数据的过程
1. 判断是否为转发数据包
- if log.entries[0.-end].response.content.mimeType == "application/json"

2. 获取导出的转发数据包
- Data data = log.entries[0-end].response.content.text

3. 需要的数据
- data.items[0-9].user.mid
- data.items[0-9].user.name
- data.items[0-9].user.face.replace(/^http:/, 'https:') (GitHub Pages无法加载http请求资源，但不知为什么还是无法显示图片😥)
- data.items[0-9].desc.text
