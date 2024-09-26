let date = new Date();
let year = date.getFullYear();
let month = date.getMonth(); // 注意：getMonth() 返回的月份是从0开始的，0表示一月，1表示二月，以此类推
let day = date.getDate(); // 正确获取日期的方法
let current = year + "" + month + "" + day

let juetuKey = "juetuxijinKey"
let juetuValue = localStorage.getItem(juetuKey) ? localStorage.getItem(juetuKey) : "no";

console.log(juetuValue);

if (juetuValue !== current) {
    // 重定向到目标页面
    location.href = 'https://juejin.cn/user/center/signin';

    // 等待页面加载完成后执行
    document.addEventListener("DOMContentLoaded", function() {
        // 定义一个定时器，间隔检查按钮
        let intervaler = setInterval(function() {
            console.log("检查页面内容...");

            // 检查当前路径是否为目标路径
            let param = location.pathname;
            if (param === '/user/center/signin') {
                // 查询签到按钮
                let qd = document.querySelector("#juejin > div.view-container > main > div.right-wrap > div > div:nth-child(1) > div.signin > div.content-body > div.content-right > div.code-calender > button");

                // 如果找到签到按钮
                if (qd) {
                    // 获取按钮的文本内容
                    let buttonText = qd.textContent || qd.innerText;
                    console.log(buttonText);

                    // 检查按钮文本是否包含 "今日已签到"
                    if (buttonText.includes("今日已签到")) {
                        console.log("今日已签到");
                        // 停止定时器
                        clearInterval(intervaler);
                    } else {
                        // 给按钮添加点击事件监听器
                        qd.addEventListener("click", function() {
                            console.log("按钮被点击了！");
                            // 假设 juetuKey 和 current 已被定义
                            localStorage.setItem('juetuKey', 'current');
                        });

                        // 模拟点击按钮
                        qd.click();
                    }
                } else {
                    console.log("按钮元素未找到");
                }
            }
        }, 1000); // 每秒检查一次
    });

}