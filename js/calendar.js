// 获取当前日期和星期信息
async function updateDate() {
    return new Promise((resolve) => {
        const today = new Date();

        // 获取日期和年份
        const day = today.getDate(); // 当前天
        let month = today.getMonth() + 1; // 当前月（JavaScript中从0开始计数，所以需要加1）
        const year = today.getFullYear(); // 当前年

        // 格式化月份为两位数
        month = month < 10 ? "0" + month : month; // 如果月份小于10，前面加0

        // 获取星期
        const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayOfWeek = weekdays[today.getDay()]; // 当前星期几

        // 获取英文月份
        const months = ["January", "February", "March", "April", "May", "June", 
                        "July", "August", "September", "October", "November", "December"];
        const monthName = months[today.getMonth()]; // 当前月份名称（英文）

        // 填充 HTML 中的日期信息
        document.getElementById("day").innerText = day < 10 ? "0" + day : day; // 格式化日期为两位
        document.getElementById("month-year").innerText = `${month}/${year}`; // 显示数字月份和年份
        document.getElementById("day-of-week").innerHTML = `${dayOfWeek} <br>${monthName} <br>${year}`; // 星期、英文月份和年份

        // 调用函数更新进度环
        updateProgressRing();

        // 等待一小段时间，确保渲染完成
        setTimeout(resolve, 0); // 异步完成更新
    });
}

// 计算进度并更新进度环
async function updateProgressRing() {
    return new Promise((resolve) => {
        const today = new Date();
        const startOfYear = new Date(today.getFullYear(), 0, 1); // 今年的第一天
        const endOfYear = new Date(today.getFullYear() + 1, 0, 1); // 明年的第一天

        // 计算今年已过去的天数
        const daysPassed = Math.floor((today - startOfYear) / (1000 * 60 * 60 * 24));

        // 计算今年的总天数（考虑闰年）
        const totalDays = Math.floor((endOfYear - startOfYear) / (1000 * 60 * 60 * 24));

        // 计算进度百分比
        const percentage = (daysPassed / totalDays) * 100;

        // 绘制进度环
        const canvas = document.getElementById("progress-ring");
        const ctx = canvas.getContext("2d");
        const radius = canvas.width / 2;
        const lineWidth = 5; // 圆环粗细设置为5
        const startAngle = -0.5 * Math.PI; // 从顶部开始绘制

        ctx.clearRect(0, 0, canvas.width, canvas.height); // 清空画布

        // 绘制背景环
        ctx.beginPath();
        ctx.arc(radius, radius, radius - lineWidth, 0, 2 * Math.PI);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = "rgba(0, 0, 0, 0.30)"; // 背景环颜色
        ctx.stroke();

        // 绘制进度环
        ctx.beginPath();
        ctx.arc(radius, radius, radius - lineWidth, startAngle, startAngle + (2 * Math.PI * (percentage / 100)));
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = "#000"; // 进度的颜色
        ctx.stroke();

        // 等待一小段时间，确保渲染完成
        setTimeout(resolve, 0); // 通过异步完成渲染
    });
}


// 每日一句
async function getLocalTips() {
    try {
        const response = await fetch("data/tips.json");
        const tipsList = await response.json();
        const randomTip = tipsList[Math.floor(Math.random() * tipsList.length)];

        // 替换 `\n` 为 `<br>` 来显示换行
        document.getElementById("tips").innerHTML = randomTip.replace(/\n/g, "<br>");
    } catch (error) {
        console.error("Failed to load local tips:", error);
        document.getElementById("tips").innerHTML = "May your days be filled with joy, and your heart with peace.";
    }
}

// 获取 URL 中的 'name' 参数
function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search); // 获取URL参数
    return urlParams.get(name); // 返回对应参数的值
}

// 根据参数动态更新页面内容
function updatePageContent() {
    const name = getURLParameter("name"); // 获取 'name' 参数的值

    // 检查页面上是否有id为 'name' 的元素
    const nameElement = document.getElementById("name");

    if (name && nameElement) {
        nameElement.innerText = name + "'"; // 将获取到的 'name' 参数值插入到 id="name" 的标签中，并加上单引号
    } else if (nameElement) {
        nameElement.innerText = "Kailous'"; // 如果没有参数，显示默认值，并加上单引号
    }
}

// 你可以在需要的时候调用函数更新页面
document.addEventListener("DOMContentLoaded", function () {
    // 在页面加载时触发日期更新
    updateDate();
    // 在页面加载时触发每日一句刷新
    getLocalTips();
    // 自定义名称
    updatePageContent();
});