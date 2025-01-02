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
const popularMovieList = document.querySelector('#movieDiv');
const popularMovieText = document.querySelector('#popularMovieText');
const ratedMovieList = document.querySelector('#movieDiv');
const ratedMovieText = document.querySelector('#ratedMovieText');
const personList = document.querySelector('#peopleDiv');

const popularUrl = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=1`;
const topRatedUrl = `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1`;
const personUrl = `https://api.themoviedb.org/3/search/person?include_adult=false&language=en-US&page=1`;
const movieUrl = `https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1`;

fetch(popularUrl, options)
    .then(response => response.json())
    .then(json => {
        const popularUrl = json.results.slice(0, 10);
        console.log("Populära:", popularUrl);
    })
    .catch(error => console.error('error:' + error));

fetch(topRatedUrl, options)
    .then(response => response.json())
    .then(json => {
        const topRatedUrl = json.results.slice(0, 10);
        console.log("Högst betyg:", topRatedUrl);
    })
    .catch(error => console.error('error:' + error));

topTenPopularBtn.addEventListener('click', () => {

    fetch(popularUrl, options)
        .then(response => {
            if (response.status >= 200 && response.status < 300) {
                return response.json()
            }
            else if (response.status == 404) {
                throw 404;
            }
            else {
                throw "Something whent wrong. Please try again later."
            }
        })
        .then(displayPopular)
        .catch(error => console.error('Error: ' + error));
});

function displayPopular(popularMovies) {
    console.log(popularMovies);
    const popularMovieList = document.querySelector('#movieDiv');

    topTenPopularBtn.classList.add('popularBtnActive');
    topTenRatedBtn.classList.remove('ratedBtnActive');

    popularMovieList.innerHTML = '';
    personList.innerHTML = '';

    const top10popular = popularMovies.results.slice(0, 10);

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
        .then(response => {
            if (response.status >= 200 && response.status < 300) {
                return response.json()
            }
            else if (response.status == 404) {
                throw 404;
            }
            else {
                throw "Something whent wrong. Please try again later."
            }
        })
        .then(displayRated)
        .catch(error => console.error('Error: ' + error));
});

function displayRated(ratedMovies) {
    console.log(ratedMovies);
    const ratedMovieList = document.querySelector('#movieDiv');
    
    topTenRatedBtn.classList.add('ratedBtnActive');
    topTenPopularBtn.classList.remove('popularBtnActive');

    ratedMovieList.innerHTML = '';
    personList.innerHTML = '';
    
    const top10rated = ratedMovies.results.slice(0, 10);

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

    const userInput = searchbarForm.querySelector('input').value.trim();

    const errorP = document.getElementById('errorMessage');

    topTenPopularBtn.classList.remove('popularBtnActive');
    topTenRatedBtn.classList.remove('ratedBtnActive');

    popularMovieList.innerHTML = '';
    popularMovieText.innerHTML = '';
    ratedMovieList.innerHTML = '';
    ratedMovieText.innerHTML = '';

    const personUrl = `https://api.themoviedb.org/3/search/person?query=${userInput}&include_adult=false&language=en-US&page=1`;
    const movieUrl = `https://api.themoviedb.org/3/search/movie?query=${userInput}&include_adult=false&language=en-US&page=1`;

    let movieFound = false;
    let personFound = false;

    fetch(movieUrl, options)
        .then(response => {
            if (!response.ok){
                throw new Error('An error occured');
            }
            return response.json();
        })
        .then(json => {
            const movieResults = json.results;
            if (movieResults.length === 0) {
                console.log('No movies found.');
                alert('No movies found, if you looked for a movie, try again!')
            }
            else {
                movieFound = true;
                displayMovie(movieResults);
            }
        })
        .catch(error => console.error('error:' + error));

    fetch(personUrl, options)
        .then(response => {
            if (!response.ok){
                throw new Error('An error occured');
            }
            return response.json();
        })
        .then(json => {
            const personResults = json.results;
            if (personResults.length === 0) {
                console.log('No people found.');
                alert('No people found, if you looked for a person, try again!')
            }
            else {
                personFound = true;
                displayPeople(personResults);
            }
        })
        .catch(error => console.error('error:' + error));

    searchbarForm.reset();
}

function displayPeople(people) {
    const personList = document.querySelector('#peopleDiv');

    personList.innerHTML = '';

    console.log("Person:", people);

    people.forEach(person => {
        const profilePath = person.profile_path ? `https://image.tmdb.org/t/p/w200${person.profile_path}` : './images/istockphoto-1409329028-612x612.jpg';

        const actorItem = document.createElement('div');
        const known_for = person.known_for.map(known_for => {
            return `<li>${known_for.media_type.toUpperCase()}: ${known_for.original_title || known_for.name}</li>`
        })
        console.log(known_for);
        actorItem.innerHTML = `
                <h2>People:</h2>
                <h3>${person.name}</h3>
                <img src="${profilePath}" alt="${person.name}"/>
                <p>Profession: ${person.known_for_department}</p>
                <h2>Known for:</h2> ${known_for.join('')}`;

        personList.appendChild(actorItem);
    })
}

function displayMovie(movies) {

    const movieList = document.querySelector('#movieDiv');

    movieList.innerHTML = '';

    console.log('Movies:', movies)

    movies.forEach(movie => {
        const posterPath = movie.backdrop_path ? `https://image.tmdb.org/t/p/w200${movie.backdrop_path}` : './images/istockphoto-1409329028-612x612.jpg';

        const movieItem = document.createElement('div');

        movieItem.innerHTML = `<h2>Title:</h2>
                <h3>${movie.title}</h3>
                <img src="${posterPath}" alt="${movie.title}"/>
                <p>Release date: ${movie.release_date}</p>
                <h5>Description: ${movie.overview}</h5>`;

        movieList.appendChild(movieItem);
    });
}