//menu
const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';

const leftMenu = document.querySelector('.left-menu'),
    hamburger = document.querySelector('.hamburger'),
    tvShowsList = document.querySelector('.tv-shows__list'),
    modal = document.querySelector('.modal'),
    tvCardImg = document.querySelector('.tv-card__img'),
    modalTitle = document.querySelector('.modal__title'),
    genresList = document.querySelector('.genres-list'),
    rating = document.querySelector('.rating'),
    description = document.querySelector('.description'),
    modalLink = document.querySelector('.modal__link'),
    searchForm = document.querySelector('.search__form'),
    searchFormInput = document.querySelector('.search__form-input'),
    tvShowsHead = document.querySelector('.tv-shows__head'),
    preloader = document.querySelector('.preloader'),
    dropdown = document.querySelectorAll('.dropdown'),
    titleWrapper = document.querySelector('.title-wrapper'),
    posterWrapper = document.querySelector('.poster__wrapper'),
    modalContent = document.querySelector('.modal__content'),
    pagination = document.querySelector('.pagination'),
    tvShows = document.querySelector('.tv-shows'),
    trailer = document.getElementById('trailer'),
    headerTrailer = document.querySelector('.header_trailer'),
    networksTitle = document.querySelector('.networks__title');

const loading = document.createElement('div');
loading.classList.add('loading');

class DBService {
    constructor() {
        this.API_KEY = '81c95d469f46ed667a73300bcb821603';
        this.SERVER = 'https://api.themoviedb.org/3';
        this.LANG = 'ru-RU';
    }

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

    getSearchResult = (query) => {
        this.temp = `${this.SERVER}/search/tv?api_key=${this.API_KEY}&language=${this.LENG}&query=${query}`
        return this.getData(this.temp);
    }

    getNextPage = (page) => {
        return this.getData(this.temp + '&page=' + page);
    }

    getTvShow = (id) => {
        return this.getData(`${this.SERVER}/tv/${id}}?api_key=${this.API_KEY}&language=${this.LANG}`)
    }

    getTopRated = (page) => {
        this.temp = `${this.SERVER}/tv/top_rated?api_key=${this.API_KEY}&language=${this.LANG}`
        return this.getData(this.temp + '&page=' + page)
    }

    getPopular = (page) => {
        this.temp = `${this.SERVER}/tv/popular?api_key=${this.API_KEY}&language=${this.LANG}`
        return this.getData(this.temp + '&page=' + page)
    }

    getWeek = (page) => {
        this.temp = `${this.SERVER}/tv/airing_today?api_key=${this.API_KEY}&language=${this.LANG}`
        return this.getData(this.temp + '&page=' + page)
    }

    getToday = (page) => {
        this.temp = `${this.SERVER}/tv/on_the_air?api_key=${this.API_KEY}&language=${this.LANG}`
        return this.getData(this.temp + '&page=' + page)
    }

    getVideo = (tv_id) => {
        this.temp = `${this.SERVER}/tv/${tv_id}/videos?api_key=${this.API_KEY}&language=${this.LANG}`
        return this.getData(this.temp)
    }

}

const dbService = new DBService();

window.addEventListener('load', () => {
    dbService.getTestData().then(renderCardTest)
});


startRenderCard = () => {
    tvShowsHead.textContent = '';
    dbService.getTestData().then(renderCardTest)
};

const renderCardTest = (response) => {
    tvShowsList.textContent = '';
    response.results.forEach(item => {
        const {
            backdrop_path: backdrop,
            name: title,
            poster_path: poster,
            vote_average: vote,
            id
        } = item;
        const posterIMG = poster ? IMG_URL + poster : 'img/no-poster.jpg';
        const backdropIMG = backdrop ? IMG_URL + backdrop : '';
        const voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : '';
        const card = document.createElement('li');
        card.idTV = id;
        card.className = 'tv-shows__item';
        card.innerHTML = `
            <a href="#" id="${id}" class="tv-card">
                ${voteElem}
                <img class="tv-card__img"
                    src="${posterIMG}"
                    data-backdrop="${backdropIMG}"
                    alt="${title}">
                <h4 class="tv-card__head">${title}</h4>
            </a>
        `;
        loading.remove();
        tvShowsList.insertAdjacentElement('beforeend', card);
    })
    searchFormInput.value = '';
}

const renderCard = (response, target) => {
    tvShowsList.textContent = '';
    console.log(response);

    if (!response.total_results) {
        tvShowsHead.textContent = `По вашему запросу "${searchFormInput.value}" ничего не найдено...`;
        searchFormInput.value = '';
        loading.remove();
        return;
    }

    response.results.forEach(item => {

        const {
            backdrop_path: backdrop,
            name: title,
            poster_path: poster,
            vote_average: vote,
            id
        } = item;

        const posterIMG = poster ? IMG_URL + poster : 'img/no-poster.jpg';
        const backdropIMG = backdrop ? IMG_URL + backdrop : '';
        const voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : '';

        const card = document.createElement('li');
        card.idTV = id;
        card.className = 'tv-shows__item';
        card.innerHTML = `
            <a href="#" id="${id}" class="tv-card">
                ${voteElem}
                <img class="tv-card__img"
                    src="${posterIMG}"
                    data-backdrop="${backdropIMG}"
                    alt="${title}">
                <h4 class="tv-card__head">${title}</h4>
            </a>
        `;
        tvShowsHead.textContent = target ? target.textContent : `Результат поиска: ${searchFormInput.value}`;
        loading.remove();
        tvShowsList.insertAdjacentElement('beforeend', card);
    })
    searchFormInput.value = '';
    pagination.textContent = '';
    if (response.total_pages > 1 && response.total_pages <= 5) {
        for (let i = 1; i <= response.total_pages; i++) {
            pagination.innerHTML += `<li><a href="#" class="pages">${i}</a></li>`
        }
    }

    if (response.total_pages > 5) {
        for (let i = 1; i <= 5; i++) {
            pagination.innerHTML += `<li><a href="#" class="pages">${i}</a></li>`
        }
    }
}

//open/close menu

const closeDropdown = () => {
    dropdown.forEach(item => {
        item.classList.remove('active');
    })
}

hamburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
    closeDropdown();
});

document.addEventListener('click', (event) => {
    const target = event.target;
    if (!target.closest('.left-menu')) {
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open');
        closeDropdown();
    }
});

leftMenu.addEventListener('click', (event) => {
    event.preventDefault();
    const target = event.target;
    console.log(target);
    const dropdown = target.closest('.dropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
        leftMenu.classList.add('openMenu');
        hamburger.classList.add('open');
    }

    if (target.closest('#top-rated')) {
        tvShows.append(loading);
        dbService.getTopRated().then((response) => renderCard(response, target));
    }

    if (target.closest('#popular')) {
        tvShows.append(loading);
        dbService.getPopular().then((response) => renderCard(response, target));
    }

    if (target.closest('#week')) {
        tvShows.append(loading);
        dbService.getWeek().then((response) => renderCard(response, target));
    }

    if (target.closest('#today')) {
        tvShows.append(loading);
        dbService.getToday().then((response) => renderCard(response, target));
    }

    if (target.closest('#search')) {
        pagination.innerHTML = '';
        tvShowsList.textContent = '';
        tvShowsHead.textContent = '';
    }

});

// open modal
tvShowsList.addEventListener('click', (event) => {
    event.preventDefault();

    const target = event.target;
    const card = target.closest('.tv-card');
    if (card) {

        preloader.style.display = 'block';

        dbService.getTvShow(card.id)
            .then((data)=> console.log(data))

        dbService.getTvShow(card.id)
            .then(({
                poster_path: posterPath,
                name: title,
                genres,
                vote_average: vote,
                overview,
                networks,
                homepage
            }) => {
                if (posterPath) {
                    tvCardImg.src = IMG_URL + posterPath;
                    tvCardImg.alt = `Постер "${title}"`;
                    posterWrapper.style.display = '';
                    modalContent.style.paddingLeft = '';
                } else {
                    posterWrapper.style.display = 'none';
                    modalContent.style.paddingLeft = '25px';
                }
                modalTitle.textContent = title;
                // genresList.innerHTML = data.genres.reduce((acc, item) => {
                //     return `${acc} <li>${item.name}<li>`
                // }, '');

                genresList.textContent = '';
                // for (const item of data.genres) {
                //     genresList.innerHTML += `<li>${item.name}<li>`
                // }

                genres.forEach(item => {
                    genresList.innerHTML += `<li>${item.name}<li>`
                })
                rating.textContent = vote ? vote : 0;
                description.textContent = overview;
                modalLink.href = homepage;
                networks.forEach(item => {
                    networksTitle.textContent = item.name;
                })

            })
            .then(() => {
                document.body.style.overflow = 'hidden';
                modal.classList.remove('hide');
            })
            .finally(() => {
                preloader.style.display = '';
            });

            dbService.getVideo(card.id)
            .then((data) => {
                headerTrailer.classList.add('hide');
                trailer.textContent = '';
                if (data.results.length) {
                    headerTrailer.classList.remove('hide');
                    data.results.forEach(item => {
                        const trailerItem = document.createElement('li');

                        trailerItem.innerHTML = `
                        <iframe
                            width="100%"
                            height="300vh"
                            src="https://www.youtube.com/embed/${item.key}"
                            frameborder="0"
                            allowfullscreen>
                        </iframe>
                        <h4>${item.name}</h4>
                    `;
                        trailer.append(trailerItem);
                    })
                }
            });
    }
});

//close modal

modal.addEventListener('click', (event) => {
    const target = event.target;
    const cross = target.closest('.cross');
    const modals = target.classList.contains('modal');
    if (modals || cross) {
        modal.classList.add('hide');
        document.body.style.overflow = '';
    }
});

// card replacement
const chacgeImage = event => {
    const card = event.target.closest('.tv-shows__item');
    if (card) {
        const img = card.querySelector('.tv-card__img');
        if (img.dataset.backdrop) {
            [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src];
        }
    }
};

searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = searchFormInput.value.trim();
    if (value) {
        searchFormInput.classList.remove('placeholder_errore');
        searchFormInput.setAttribute('placeholder', 'Введите название...');
        tvShows.append(loading);
        dbService.getSearchResult(value)
            .then(renderCard);
    } else {
        searchFormInput.classList.add('placeholder_errore');
        searchFormInput.setAttribute('placeholder', 'Вы не ввели название');
    }
});

titleWrapper.addEventListener('click', startRenderCard)

tvShowsList.addEventListener('mouseover', chacgeImage);

tvShowsList.addEventListener('mouseout', chacgeImage);

pagination.addEventListener('click', (event) => {
    event.preventDefault();
    const target = event.target;

    if (target.classList.contains('pages')) {
        tvShows.append(loading);
        dbService.getNextPage(target.textContent).then(renderCard);
    }
});