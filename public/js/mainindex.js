"use strict";

document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const elements = {
        titleImg: document.getElementById("tittle_img"),
        movieName: document.getElementById("moviename"),
        genreBtns: [
            document.getElementById("genrebtn1"),
            document.getElementById("genrebtn2"),
            document.getElementById("genrebtn3"),
        ],
        plot: document.getElementById("plot"),
        search: document.getElementById("search"),
        searchBtn: document.getElementById("imgbtn"),
        ratingStar: document.getElementById("ratingstar"),
        loader: document.getElementById("loader"),
        statusList: document.getElementsByClassName("statuslist")[0],
        savebtn: document.getElementsByClassName('savewatch')[0],
        watchlist: document.getElementById('addwatchlist')[0],
        bookmarkimg: document.getElementById('bookmarkimg'),
    };

    //Initialy loder is display hidden
    elements.loader.style.display = 'none';

    // API Keys
    const apiKeys = {
        omdb: "d01e1c2a",
        youtube: "AIzaSyCpRHrlpggttMQBJ4jrBEX001mpOxmx1kw",
        tmdb: "1d73173c0c07c518173eb19bce223cb9",
    };

    let youtubePlayer; // Reference to the YT player instance
    //deafult video id
    let ytVideoId = 'BmllggGO4pM';
    // Update or create the YouTube player
    function updateYouTubePlayer(ytVideoId) {

        if (youtubePlayer) {
            youtubePlayer.loadVideoById(ytVideoId); // Load the new video into the existing player
        } else {
            window.YT.ready(function () {
                youtubePlayer = new window.YT.Player("player", {
                    height: "390",
                    width: "640",
                    videoId: `${ytVideoId}`,
                    playerVars: { playsinline: 1 },
                })
            });
        }

    }



    //all fetch funtion under single function
    const allFetchFunction = async (e) => {
        const title = elements.search.value.trim().toLowerCase();
        if (!title === ' ') {

            elements.loader.style.display = 'inline-block';
        }


        // Fetch movie details
        const fetchMovie = async () => {
            const url = `http://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKeys.omdb}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error("Error fetching movie data");
            return response.json();
        };

        // Fetch YouTube video data
        const fetchYtdata = async () => {
            const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKeys.youtube}&q=${encodeURIComponent(
                title + " trailer"
            )}&type=video&maxResults=1&part=snippet`;
            const response = await fetch(url);
            if (!response.ok) throw new Error("Error fetching YouTube data");
            return response.json();
        };

        // Fetch actor images in parallel
        const fetchActorImages = async (actors) => {
            const requests = actors.map((actor) =>
                fetch(
                    `https://api.themoviedb.org/3/search/person?api_key=${apiKeys.tmdb}&query=${encodeURIComponent(actor)}`
                ).then((res) => res.json())
            );
            return Promise.all(requests);
        };

        // Update UI with movie details
        const updateMovieUI = (movieData) => {
            elements.movieName.textContent = movieData.Title || "N/A";
            elements.titleImg.src = movieData.Poster || "default-poster.jpg";
            const genres = movieData.Genre ? movieData.Genre.split(",") : [];
            elements.genreBtns.forEach((btn, index) => {
                btn.textContent = genres[index] || "";
            });
            elements.plot.textContent = movieData.Plot || "Plot not available";
            elements.ratingStar.textContent = `${movieData.imdbRating || "N/A"}/10`;
            return [movieData.Actors ? movieData.Actors.split(",") : [], movieData.Title, movieData.Poster]
        };

        // Update UI with actor images
        const updateActorsUI = (actorImages) => {
            elements.statusList.innerHTML = "";
            actorImages.forEach((actorData) => {
                const actor = actorData.results?.[0];
                if (actor) {
                    elements.statusList.innerHTML += `<span class="  flex flex-col gap-2 h-[27vh]  ">
                        <img src="https://image.tmdb.org/t/p/w500${actor.profile_path}" alt="title_picture"
                            class=" h-[11rem] rounded-lg  shadow-md">

                        <span class="inter font-semibold ml-3 tracking-wider "> ${actor.name}</span></span>`
                }
            });
        };

        const updateMovieCollection = (name, poster) => {
            elements.savebtn.addEventListener('click', () => {

                localStorage.setItem(`${name}`, `${poster}`);

                elements.bookmarkimg.src = './resources/icons8-bookmark.gif';

                setTimeout(() => {
                    elements.bookmarkimg.src = './resources/img/bookmark-white.png'
                }, 600);



            })

        }

        // Main Execution
        try {
            const movieData = await fetchMovie();
            const [actors, title, poster] = updateMovieUI(movieData);
            updateMovieCollection(title, poster);

            const [ytData, actorImages] = await Promise.all([
                fetchYtdata(),
                fetchActorImages(actors),
            ]);
            console.log(actorImages)
            // Update UI with YouTube trailer
            ytVideoId = ytData.items?.[0]?.id?.videoId;
            if (ytVideoId) {
                updateYouTubePlayer(ytVideoId);
            }

            updateActorsUI(actorImages);
        } catch (error) {
            console.error("An error occurred:", error);
        } finally {
            elements.loader.style.display = 'none';

        }
    }
    // Event Listener


    elements.searchBtn.addEventListener('click', (e) => {
        if (elements.search.value !== '') {
            e.preventDefault();
            allFetchFunction();

        }
        else {
            alert('Input is Empty')
        }
    });

    // calling youtube id
    updateYouTubePlayer(ytVideoId);





});
