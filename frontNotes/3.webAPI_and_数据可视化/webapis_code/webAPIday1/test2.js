let intervaler = setInterval(function s() {

    let param = location.pathname
    console.log(param);
    console.log(param === '/user/center/signin');
    if (param === '/user/center/signin') {
        console.log(11111111111);

    }
}, 3000)