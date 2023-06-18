# BiliForwardLottery

## 使用方式
1. 安装[Node.js](https://nodejs.org/en)

2. 使用Chrome打开抽奖动态界面，例如(https://www.bilibili.com/opus/804350497270005792)，按下F12，选择`网络`，`Fetxh/XHR`，`清除`，点击转发，不断下拉(或按住PageDown)，直到网页无法下拉后点击`导出HAR文件`。若直接导出到此项目目录下，则无需执行第4步操作

3. 双击`抽奖？启动！.bat`或控制台中输出`.\run.bat`

4. 上传导出后的`www.bilibili.com.har`文件

## 注意
由于b站对转发数据包的获取有ip限制，这么做了之后会导致一段时间内无法查看所有动态的转发详情，可以使用全局代理更换ip

## 处理数据的过程
1. 判断是否为转发数据包
- if log.entries[0.-end].response.content.mimeType == "application/json"

2. 获取导出的转发数据包
- Data data = log.entries[0-end].response.content.text

3. 需要的数据
- data.items[0-9].user.mid
- data.items[0-9].user.name
- data.items[0-9].user.face
- data.items[0-9].desc.rich_text_nodes[0].orig_text
