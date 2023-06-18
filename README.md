# BiliForwardLottery

## 使用说明
- 仅支持离线使用
- 用户多次转发只统计一次
- 点击头像跳转私信界面
- 点击用户名跳转个人主页 *(看看是否关注自己，根据用户动态行为自行判断是否为抽奖号)*
- 点击`rua!`重抽

## 使用方式
1. 安装<a href="https://nodejs.org" target="_blank">Node.js</a>

2. 使用Chrome打开抽奖动态界面，例如<a href="https://www.bilibili.com/opus/807738213110120470" target="_blank">这个动态</a>，按下F12，选择`网络`，`Fetxh/XHR`，`清除`，点击转发，不断下拉(或按住PageDown)，直到网页无法下拉后点击`导出HAR文件`。若直接导出到此项目目录下，则无需执行第4步操作

3. 双击`抽奖？启动！`或控制台中输入`.\run.bat`

4. 点击选择文件，选择导出后的`www.bilibili.com.har`文件，点击上传

## 注意
1. ***使用过程中请不要关闭后台命令行！！！***

2. 由于b站对转发内容查看有数量限制，因此超过500转发量的动态只能获取到最近的500条转发记录(网页滚动条无法继续下拉)

3. 由于b站对转发内容查看有ip限制，一次性查看了大量的转发内容后可能会导致一段时间内(大概几小时)无法查看所有动态的转发详情，可以考虑使用全局代理更换ip

## 处理数据的过程
1. 判断是否为转发数据包
- if log.entries[0.-end].response.content.mimeType == "application/json"

2. 获取导出的转发数据包
- Data data = log.entries[0-end].response.content.text

3. 需要的数据
- data.items[0-9].user.mid
- data.items[0-9].user.name
- data.items[0-9].user.face
- data.items[0-9].desc.text
