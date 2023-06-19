var jsonData = {};
var forwards = [];
var map = new Map();
var randomUser = {};

async function uploadFile() {
    jsonData = {};
    forwards = [];
    map = new Map();
    randomUser = {};

    const input = document.getElementById('inputGroupFile');
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const fileContent = event.target.result;
            try {
                jsonData = JSON.parse(fileContent);
                // 处理jsonData
                getAllUsers();
            } catch (error) {
                console.error('无法解析为JSON:', error);
            }
        };
        reader.readAsText(file);
    } else {
        console.log('未选择文件');
    }
}

async function getAllUsers() {
    await parseHar();
    await parseForwards();
    await lottery();
    const users = Array.from(map.values());
    const data = { users, count: map.size, randomUser };

    const count = document.getElementById('count');
    count.textContent = "参与用户数量: " + data.count;

    // 获取列表容器
    const userList = document.getElementById('userList');
    userList.innerHTML = '';

    // 循环遍历用户数据并生成列表项
    data.users.forEach(user => {
        // 创建列表项元素
        const listItem = document.createElement('li');

        // 创建用户信息元素
        const userFace = document.createElement('img');
        userFace.src = user.face.replace(/^http:/, 'https:');
        userFace.alt = '【用户头像】';

        const userName = document.createElement('div');
        userName.textContent = user.name;

        const userMid = document.createElement('a');
        userMid.textContent = user.mid;
        userMid.href = 'https://space.bilibili.com/' + user.mid + '/dynamic';
        userMid.target = "_blank";

        const userOrigText = document.createElement('div');
        userOrigText.textContent = user.orig_text;

        const pubTime = document.createElement('div');
        pubTime.textContent = user.pub_time;

        // 将用户信息元素添加到列表项中
        listItem.appendChild(userFace);
        listItem.appendChild(userName);
        listItem.appendChild(userMid);
        listItem.appendChild(userOrigText);
        listItem.appendChild(pubTime);

        // 将列表项添加到列表容器中
        userList.appendChild(listItem);

    });

    const face = document.getElementById('face');
    face.src = data.randomUser.face;

    const mid = document.getElementById('mid');
    mid.textContent = data.randomUser.mid;

    const name = document.getElementById('name');
    name.textContent = data.randomUser.name;

    const orig_text = document.getElementById('orig_text');
    orig_text.textContent = data.randomUser.orig_text;

    const pub_time = document.getElementById('pub_time');
    pub_time.textContent = data.randomUser.pub_time;

    const message_url = document.getElementById('message_url');
    message_url.href = 'https://message.bilibili.com/?spm_id_from=333.999.0.0#/whisper/mid' + data.randomUser.mid;

    const space_url = document.getElementById('name');
    space_url.href = 'https://space.bilibili.com/' + data.randomUser.mid + '/dynamic'
}

async function getRandomUser() {
    randomUser = {};
    await lottery();
    const data = { randomUser };

    const face = document.getElementById('face');
    face.src = data.randomUser.face;

    const mid = document.getElementById('mid');
    mid.textContent = data.randomUser.mid;

    const name = document.getElementById('name');
    name.textContent = data.randomUser.name;

    const orig_text = document.getElementById('orig_text');
    orig_text.textContent = data.randomUser.orig_text;

    const pub_time = document.getElementById('pub_time');
    pub_time.textContent = data.randomUser.pub_time;

    const message_url = document.getElementById('message_url');
    message_url.href = 'https://message.bilibili.com/?spm_id_from=333.999.0.0#/whisper/mid' + data.randomUser.mid;

    const space_url = document.getElementById('name');
    space_url.href = 'https://space.bilibili.com/' + data.randomUser.mid + '/dynamic'
}

async function parseHar() {
    try {
        if (forwards.length !== 0) {
            return;
        }
        jsonData.log.entries.forEach(element => {
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
        // console.log(element);
        if (!element.data || !element.data.items || !Array.isArray(element.data.items)) {
            return;
        }
        element.data.items.forEach(element => {
            mid = element.user.mid;
            face = element.user.face;
            name = element.user.name;
            orig_text = element.desc.text;
            pub_time = element.pub_time;
            map.set(mid, { mid, name, face, orig_text, pub_time });
        });
    });
    console.log("有效转发量: ", map.size);
    // 遍历键值对
    // map.forEach((value, key) => {
    // console.log(key, value.name);
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

    // 获取对应的值 const
    for (let i = 0; i <= randomIndex; i++) {
        randomKey = keysIterator.next().value;
    }
    console.log("------[中奖概率🎲:" + 1 / map.size + "]------");
    console.log('uid: ', randomKey);

    randomUser = map.get(randomKey);
    // console.log(' 用户信息: ', randomUser);
}