const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');

let forwards = [];
let map = new Map();
let randomUser = {};

const cors = require('cors');

app.use(cors());

init();
async function init() {
    await showBanner();
    run();
}

async function showBanner() {
    const banner = await fs.promises.readFile('banner.txt', 'utf8');
    console.log(banner);
}

function run() {
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
}

async function parseHar() {
    try {
        if (forwards.length !== 0) {
            return;
        }
        const data = await fs.promises.readFile('www.bilibili.com.har', 'utf8');
        const json = JSON.parse(data);
        // 处理读取到的JSON数据
        json.log.entries.forEach(element => {
            mimeType = element.response.content.mimeType;
            encoding = element.response.content.encoding;
            if (mimeType !== 'application/json' &&
                mimeType !== 'application/json; charset=utf-8' ||
                encoding === 'base64') {
                return;
            }
            text = element.response.content.text
            forwards.push(JSON.parse(text));
        });
        console.log("数据包数量: ", forwards.length);
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.error('文件错误,请上传😡', error);
        } else {
            console.error('发生异常😕', error);
        }
        return;
    }
}

async function parseForwards() {
    if (map.size !== 0) {
        return;
    }
    forwards.forEach(element => {
        element.data.items.forEach(element => {
            mid = element.user.mid;
            face = element.user.face;
            name = element.user.name;
            orig_text = element.desc.rich_text_nodes[0].orig_text;
            map.set(mid, { mid, name, face, orig_text });
        });
    });
    console.log("存留转发量: ", map.size);
    // // 遍历键值对
    // map.forEach((value, key) => {
    //     console.log(key, value.name);
    // });
}

async function lottery() {
    if (Object.keys(randomUser).length !== 0) {
        return;
    }
    // 获取键的迭代器
    const keysIterator = map.keys();

    // 随机选择一个键
    let randomIndex = Math.floor(Math.random() * map.size);
    let randomKey;

    for (let i = 0; i <= randomIndex; i++) {
        randomKey = keysIterator.next().value;
    }

    // 获取对应的值
    const randomValue = map.get(randomKey);

    console.log("------[中奖概率🎲:" + 1 / map.size + "]------");
    console.log('uid: ', randomKey);
    // console.log('用户信息: ', randomValue);

    randomUser = randomValue;
}

const multer = require('multer');
const { log } = require('console');
const storage = multer.diskStorage({
    destination: './', // 指定上传文件的存储目录
    filename: (req, file, cb) => {
        cb(null, file.fieldname);
    }
});
const upload = multer({ storage });
app.post('/upload', upload.single('file'), (req, res) => {
    forwards = [];
    map.clear();
    randomUser = {};
    const file = req.file; // 通过 req.file 获取上传的文件信息
    if (!file) {
        res.status(400).send('没有选择文件');
    } else {
        // 将文件从临时位置移动到指定位置
        // const targetPath = file.originalname;
        const targetPath = 'www.bilibili.com.har';
        fs.rename(file.path, targetPath, (err) => {
            if (err) {
                res.status(500).send('文件保存失败');
            } else {
                console.log(file);
                res.send('文件上传成功');
            }
        });
    }
});

app.get('/', async (req, res) => {
    await parseHar();
    await parseForwards();
    await lottery();
    const users = Array.from(map.values());
    const data = { users, count: map.size, randomUser };
    res.json(data);
});

app.get('/lottery', async (req, res) => {
    randomUser = {};
    await lottery();
    const data = { randomUser };
    res.json(data);
});
