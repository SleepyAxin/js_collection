/**
 * 解析一个歌词字符串，得到一个包含歌词和对应时间的数组
 * @param {string} lyric 歌词字符串
 * @returns {Array} 对象数组{time: 开始时间, sentence: 对应歌词}
 */
function parseLyric(lyric)
{
    const lines = lyric.split('\n');
    const result = [];
    
    for (let i = 0; i < lines.length; i++)
    {
        const line = lines[i];
        const time_str = line.substring(1, 9);
        const sentence = line.substring(10);
        const obj = {time: parseTime(time_str), sentence: sentence};
        
        result.push(obj);
    }

    return result;
}

/**
 * 将时间字符串转换为秒数
 * @param {string} time_str 时间字符串
 * @returns {number} 时间
 */
function parseTime(time_str)
{
    const minutes = parseInt(time_str.substring(0, 2));
    const seconds = parseFloat(time_str.substring(3));
    const time = minutes * 60 + seconds;
    return time;
}

// 处理完成的歌词数组
const lyric_arr = parseLyric(lyric);

// 获取需要的 dom
const doms = 
{
    audio: document.querySelector('audio'),
    container: document.querySelector('.container'),
    ul: document.querySelector('.container ul')
};

/**
 * 计算出在当前情况下应该高亮的歌词下标
 * 如果没有歌词可以显示，则返回 -1
 * @returns {number} 高亮的歌词下标
 */
function findIndex() 
{
    const curr_time = doms.audio.currentTime;

    for (let i = 0; i < lyric_arr.length; i++)
    {
        if (curr_time < lyric_arr[i].time) { return i - 1; }
    }

    // 播放到最后一句歌词
    return lyric_arr.length - 1;
}

/**
 * 创建歌词元素
 */
function createLyricElements()
{
    // 创建文档片段
    // 一次性添加所有元素，减少重绘次数
    const frag = document.createDocumentFragment();

    for (let i = 0; i < lyric_arr.length; i++)
    {
        const li = document.createElement('li');
        li.textContent = lyric_arr[i].sentence;
        frag.appendChild(li);
    }

    doms.ul.appendChild(frag);
}

createLyricElements();

// 歌词容器高度
const container_height = doms.container.clientHeight;
// 单行歌词高度
const li_height = doms.ul.children[0].clientHeight;
// 歌词列表最大偏移量
const max_offset = doms.ul.clientHeight - container_height;

/**
 * 设置歌词列表的偏移量
 */
function setOffset()
{
    // 计算偏移量
    const index = findIndex();
    let offset = li_height * index + li_height / 2 - container_height / 2;

    // 限制偏移量范围
    if (offset < 0) { offset = 0; }
    if (offset > max_offset) { offset = max_offset; }
    
    // 移除之前的激活效果
    const li_before = doms.ul.querySelector('.active');
    if (li_before) { li_before.classList.remove('active'); }

    // 设置偏移量
    doms.ul.style.transform = `translateY(-${offset}px)`;

    // 添加激活效果
    const li = doms.ul.children[index];
    if (li) { li.classList.add('active'); }
}

// 监听音频时间更新事件
doms.audio.addEventListener('timeupdate', setOffset);