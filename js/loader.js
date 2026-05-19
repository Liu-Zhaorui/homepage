const loader = document.querySelector('.loader-body');

window.addEventListener('load', () => {
    // 加载器显示三秒后自动消失
    setTimeout(() => {
        loader.classList.add('fadeout');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 300); // 缩短淡出动画时间
    }, 3000); // 显示三秒
});
