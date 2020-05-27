'use strict';

const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
const API_KEY = '1fb45803e9b900a151da1ff62f42a8d0';

const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');
const tvShowsList = document.querySelector('.tv-shows__list');
const modal = document.querySelector('.modal');
const cross = document.querySelector('.cross');

class DBService {
    getData = async (url) => {
        const res = await fetch(url);
        if (res.ok) {
            return res.json();
        } else {
            throw new Error(`Не удалось получить данные по адресу ${url}`);
        }
    }
    getTestData = () => {
        return this.getData('test.json');
    }
}

const renderCard = responce => {
    tvShowsList.textContent = '';
    responce.results.forEach(element => {
        const { backdrop_path: backdrop, name: title, poster_path: poster, vote_average: vote } = element;
        const posterIMG = poster ? IMG_URL + poster : 'img/no-poster.jpg';
        const backdropIMG = '';
        const voteIMG = '';
        const card = document.createElement('li');
        card.classList.add('tv-shows__item');
        card.innerHTML = `
            <a href="#" class="tv-card">
                <span class="tv-card__vote">${vote}</span>
                    <img class="tv-card__img"
                        src="${posterIMG}"
                        data-backdrop="${IMG_URL + backdrop}"
                        alt="${title}">
                    <h4 class="tv-card__head">${title}</h4>
            </a>
        `;

        tvShowsList.append(card);
    });
}

new DBService().getTestData().then(renderCard);

hamburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
});

document.addEventListener('click', event => {
    if (!event.target.closest('.left-menu')) {
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open');
    }
});

leftMenu.addEventListener('click', event => {
    const target = event.target;
    const dropdown = target.closest('.dropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
        leftMenu.classList.add('openMenu');
        hamburger.classList.add('open');
    }
});

tvShowsList.addEventListener('click', event => {
    event.preventDefault();
    const target = event.target;
    const tvCard = target.closest('.tv-card');
    if (tvCard) {
        document.body.style.overflow = 'hidden';
        modal.classList.remove('hide');
    }
});

modal.addEventListener('click', event => {
    if (event.target.classList.contains('modal') ||
        event.target.closest('.cross')) {
        document.body.style.overflow = '';
        modal.classList.add('hide');
    }
});

const changeImage = event => {
    const card = event.target.closest('.tv-shows__item');
    if (card) {
        const img = card.querySelector('.tv-card__img');
        const changeImg = img.dataset.backdrop;
        if (img.dataset.backdrop) {
            [img.dataset.backdrop, img.src] = [img.src, img.dataset.backdrop];
        }
    }
};

tvShowsList.addEventListener('mouseover', changeImage);

tvShowsList.addEventListener('mouseout', changeImage);