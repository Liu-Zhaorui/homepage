const loader = document.querySelector('.loader-body');

window.addEventListener('load', () => {

    setTimeout(() => {

        loader.classList.add('fadeout');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);

    }, 1000);

});
