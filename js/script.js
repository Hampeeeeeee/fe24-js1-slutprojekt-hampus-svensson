const BEARER_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2Mjc4NmNmOTdiODU0NmFhZWNkZDY2YjczZTc4ZGU1ZiIsIm5iZiI6MTczNDUyNDU1OC4wNjIsInN1YiI6IjY3NjJiZThlOGQxY2ZkYzUyMjRhMmU5YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.o06tGNhd-rYAscNUk_zYrtFkDdDKOhrFm9294UBlEj4';
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${BEARER_KEY}`
    }
};

const searchbarForm = document.querySelector('#searchbarForm');
const topTenPopularBtn = document.querySelector('#popularBtn')
const topTenRatedBtn = document.querySelector('#ratedBtn');
const popularMovieText = document.querySelector('#popularMovieText');
const ratedMovieText = document.querySelector('#ratedMovieText');

const popularUrl = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=1`;
const topRatedUrl = `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1`;

fetch(popularUrl, options)
    .then(res => res.json())
    .then(json => {
        const popularUrl = json.results.slice(0, 10);
        console.log("Populära:", popularUrl);
    })
    .catch(err => console.error('error:' + err));

fetch(topRatedUrl, options)
    .then(res => res.json())
    .then(json => {
        const topRatedUrl = json.results.slice(0, 10);
        console.log("Högst betyg:", topRatedUrl);
    })
    .catch(err => console.error('error:' + err));


topTenPopularBtn.addEventListener('click', () => {

    fetch(popularUrl, options)
        .then(res => {
            if (res.status >= 200 && res.status < 300) {
                return res.json()
            }
            else if (res.status == 404) {
                throw "The languge does not exist."
            }
            else {
                throw "Something whent wrong. Please try again later."
            }
        })
        .then(displayPopular)
        .catch(err => console.error('Error: ' + err));
});

function displayPopular(popularMovies) {
    console.log(popularMovies);
    const popularMovieList = document.querySelector('#movieDiv');
    const popularMovieText = document.querySelector('#popularMovieText');

    popularMovieList.innerHTML = '';

    const top10popular = popularMovies.results.slice(0, 10);
    popularMovieText.classList.add('visible');
    ratedMovieText.classList.remove('visible');

    top10popular.forEach(movie => {
        const popularMovieItem = document.createElement('div');
        popularMovieItem.innerHTML =
            `<h3>${movie.title}</h3>
                <p>Release Date: ${movie.release_date}</p>
                <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}"/>`;

        popularMovieList.appendChild(popularMovieItem);
    });
}

topTenRatedBtn.addEventListener('click', () => {
    fetch(topRatedUrl, options)
        .then(res => {
            if (res.status >= 200 && res.status < 300) {
                return res.json()
            }
            else if (res.status == 404) {
                throw "The languge does not exist."
            }
            else {
                throw "Something whent wrong. Please try again later."
            }
        })
        .then(displayRated)
        .catch(err => console.error('Error: ' + err));
});

function displayRated(ratedMovies) {
    console.log(ratedMovies);
    const ratedMovieList = document.querySelector('#movieDiv');
    const ratedMovieText = document.querySelector('#ratedMovieText')

    ratedMovieList.innerHTML = '';

    const top10rated = ratedMovies.results.slice(0, 10);
    ratedMovieText.classList.add('visible');
    popularMovieText.classList.remove('visible');

    top10rated.forEach(movie => {
        const ratedMovieItem = document.createElement('div');
        ratedMovieItem.innerHTML =
            `<h3>${movie.title}</h3>
                <p>Release Date: ${movie.release_date}</p>
                <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}"/>`;

        ratedMovieList.appendChild(ratedMovieItem);
    })
}

searchbarForm.addEventListener('submit', handleSearchbarInput)

function handleSearchbarInput(event) {
    event.preventDefault();


}