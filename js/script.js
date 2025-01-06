// Bearer key för att hämta API
const BEARER_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2Mjc4NmNmOTdiODU0NmFhZWNkZDY2YjczZTc4ZGU1ZiIsIm5iZiI6MTczNDUyNDU1OC4wNjIsInN1YiI6IjY3NjJiZThlOGQxY2ZkYzUyMjRhMmU5YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.o06tGNhd-rYAscNUk_zYrtFkDdDKOhrFm9294UBlEj4';
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${BEARER_KEY}`
    }
};
// Animation för knapparna
const btnAnimation = anime({
    targets: '#popularBtn, #ratedBtn',  
    backgroundColor: 'rgb(116, 147, 170)', 
    borderRadius: '50%', 
    
    duration: 4000, 
    translateX: [0, 250, -250, 0],
    direction: 'alternate', 
    easing: 'cubicBezier(.5, .05, .1, .3)',
    loop: false,
    // Använde AI här för att hitta ett välfungerande sätt att återgå till originella stadiet
    // på knapparna efter en loop
    complete: () => {
        const buttons = document.querySelectorAll('#popularBtn, #ratedBtn');
        buttons.forEach((button) => {
            button.style = '';
        });
    }
})

anime(btnAnimation); //Sätter igång animationen

// Alla variabler som behövde hämtas
const searchbarForm = document.querySelector('#searchbarForm');
const topTenPopularBtn = document.querySelector('#popularBtn')
const topTenRatedBtn = document.querySelector('#ratedBtn');
const popularMovieList = document.querySelector('#movieDiv');
const popularMovieText = document.querySelector('#popularMovieText');
const ratedMovieList = document.querySelector('#movieDiv');
const ratedMovieText = document.querySelector('#ratedMovieText');
const personList = document.querySelector('#peopleDiv');
const noPeopleMessage = document.querySelector('#noPeopleMessage')
const noMovieMessage = document.querySelector('#noMovieMessage')

// Alla URL:er som används
const popularUrl = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=1`;
const topRatedUrl = `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1`;
const personUrl = `https://api.themoviedb.org/3/search/person?include_adult=false&language=en-US&page=1`;
const movieUrl = `https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1`;

// Event listener för click på knappen för #popularBtn
topTenPopularBtn.addEventListener('click', () => {
    // Om allt fungerar som det ska körs funktionen displayPopular
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
// Funktion som visar de top 10 populära filmerna
function displayPopular(popularMovies) {
    console.log(popularMovies);
    const popularMovieList = document.querySelector('#movieDiv');

    topTenPopularBtn.classList.add('popularBtnActive');
    topTenRatedBtn.classList.remove('ratedBtnActive');
    noMovieMessage.classList.add('hidden');
    noPeopleMessage.classList.add('hidden');

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
// Event listener för click på knappen #ratedBtn
topTenRatedBtn.addEventListener('click', () => {
    // Om allt fungerar körs funktionen displayRated
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
// Funktion som visar de 10 filmer med högst betyg
function displayRated(ratedMovies) {
    console.log(ratedMovies);
    const ratedMovieList = document.querySelector('#movieDiv');
    
    topTenRatedBtn.classList.add('ratedBtnActive');
    topTenPopularBtn.classList.remove('popularBtnActive');
    noMovieMessage.classList.add('hidden');
    noPeopleMessage.classList.add('hidden');

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
// Event listener för submit på formet
searchbarForm.addEventListener('submit', handleSearchbarInput)
// Funktion som hanterar användarens input, och hämtar filmer/personer enligt användarens sökning.
function handleSearchbarInput(event) {
    event.preventDefault();

    const userInput = searchbarForm.querySelector('input').value.trim();

    topTenPopularBtn.classList.remove('popularBtnActive');
    topTenRatedBtn.classList.remove('ratedBtnActive');

    popularMovieList.innerHTML = '';
    popularMovieText.innerHTML = '';
    ratedMovieList.innerHTML = '';
    ratedMovieText.innerHTML = '';
    personList.innerHTML = '';

    const personUrl = `https://api.themoviedb.org/3/search/person?query=${userInput}&include_adult=false&language=en-US&page=1`;
    const movieUrl = `https://api.themoviedb.org/3/search/movie?query=${userInput}&include_adult=false&language=en-US&page=1`;
    // Använde mig av AI här för att finna ett sätt att kombinera vad jag tidigare lärt mig och hur
    // det skulle kunna användas i detta projekt.
    fetch(movieUrl, options)
        .then(response => {
            if (!response.ok){
                throw new Error('An error occured!');
            }
            return response.json();
        })
        .then(json => {
            const movieResults = json.results;
            if (movieResults.length === 0) {
                console.log('No movies found.');
                noMovieMessage.classList.remove('hidden');
            }
            else {
                noMovieMessage.classList.add('hidden');
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
                noPeopleMessage.classList.remove('hidden');
            }
            else {
                noPeopleMessage.classList.add('hidden');
                displayPeople(personResults);
            }
        })
        .catch(error => console.error('error:' + error));

    searchbarForm.reset();
}
// Funktion som visar personen/personerna som användaren sökt efter.
function displayPeople(people) {

    personList.innerHTML = '';

    console.log("People:", people);

    people.forEach(person => {
        const profilePath = person.profile_path ? `https://image.tmdb.org/t/p/w200${person.profile_path}` : './images/istockphoto-1409329028-612x612.jpg';

        const actorItem = document.createElement('div');
        const known_for = person.known_for.map(known_for => {
            return `<li>${known_for.media_type.toUpperCase()}: ${known_for.original_title || known_for.name}</li>`
        })
        console.log(known_for);
        actorItem.innerHTML = `
                <h2>Person:</h2>
                <h3>${person.name}</h3>
                <img src="${profilePath}" alt="${person.name}"/>
                <p>Profession: ${person.known_for_department}</p>
                <h2>Known for:</h2> ${known_for.join('')}`;

        personList.appendChild(actorItem);
    })
}
// Funktion som visar filmen/filmerna som användaren sökt efter.
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