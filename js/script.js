

const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
const API_KEY = '1fb45803e9b900a151da1ff62f42a8d0';
const SERVER = 'https://api.themoviedb.org/3';

const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');
const tvShowsList = document.querySelector('.tv-shows__list');
const modal = document.querySelector('.modal');
const cross = document.querySelector('.cross');
const tvShows = document.querySelector('.tv-shows');
const tvCardImg = document.querySelector('.modal__img');
const modalTitle = document.querySelector('.modal__title');
const genresList = document.querySelector('.genres-list');
const rating = document.querySelector('.rating');
const description = document.querySelector('.description');
const modalLink = document.querySelector('.modal__link');
const searchForm = document.querySelector('.search__form');
const searchFormInput = document.querySelector('.search__form-input');

const loading = document.createElement('div');
loading.className = 'loading';


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
        return this.getData('test.json')
    }

    getTestCard = () => {
        return this.getData('card.json')
    }

    getSeartResult = query => {
        return this.getData(`${SERVER}/search/tv?api_key=${API_KEY}&query=${query}&language=ru-RU`);
    }

    getTvShow = id => {
        return this.getData(`${SERVER}/tv/${id}?api_key=${API_KEY}&language=ru-RU`);
    }
}

console.log(new DBService().getSeartResult('друзья'));

const renderCard = responce => {
    tvShowsList.textContent = '';
    responce.results.forEach(element => {
        const {
            backdrop_path: backdrop,
            name: title,
            poster_path: poster,
            vote_average: vote,
            id
        } = element;
        const posterIMG = poster ? IMG_URL + poster : 'img/no-poster.jpg';
        const backdropIMG = backdrop ? IMG_URL + backdrop : '';
        const voteIMG = vote ? `<span class="tv-card__vote">${vote}</span>` : '';
        const card = document.createElement('li');
        card.classList.add('tv-shows__item');
        card.innerHTML = `
            <a href="#" id="${id}" class="tv-card">
                ${voteIMG}
                    <img class="tv-card__img"
                        src="${posterIMG}"
                        data-backdrop="${backdropIMG}"
                        alt="${title}">
                    <h4 class="tv-card__head">${title}</h4>
            </a>
        `;

        loading.remove();
        tvShowsList.append(card);
    });
}

searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const value = searchFormInput.value.trim();
    if (value) {
        searchFormInput.value = '';
        tvShows.append(loading);
        new DBService().getSeartResult(value).then(renderCard);
    }
});

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
    event.preventDefault();
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
    const card = target.closest('.tv-card');
    if (card) {

        new DBService().getTvShow(card.id)
            .then(data => {
                console.log(data);
                tvCardImg.src = IMG_URL + data.poster_path;
                modalTitle.textContent = data.name;
                // genresList.innerHTML = data.genres.reduce((acc, item) => {
                //     return `${acc}<li>${item.name}</li>`
                // }, '');
                genresList.textContent = '';
                for (const item of data.genres) {
                    genresList.innerHTML += `<li>${item.name}</li>`;
                }
                rating.textContent = data.voit_average;
                description.textContent = data.overview;
                modalLink.href = data.homepage;
            })
            .then(() => {
                document.body.style.overflow = 'hidden';
                modal.classList.remove('hide');
            })
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