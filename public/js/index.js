"use strict";

document.addEventListener('DOMContentLoaded', () => {


    let titleimg = document.getElementById('tittle_img');
    let movieName = document.getElementById('moviename');
    let actorName = document.getElementById('actor');
    let genrebtn1 = document.getElementById('genrebtn1');
    let genrebtn2 = document.getElementById('genrebtn2');
    let genrebtn3 = document.getElementById('genrebtn3');
    let plot = document.getElementById('plot');
    let search = document.getElementById('search');
    let searchbtn = document.getElementById('imgbtn');
    let ratinstar = document.getElementById('ratingstar')
    let ytvideoId;
    let actors;
    let actordatas = [];
    let title = ' ';
    let player;






    searchbtn.addEventListener('click', async (e) => {
        document.getElementById('loader').classList.add('rotateloader');
        e.preventDefault();

        title = search.value.trim().toLowerCase();



        //this function for fetching all the details of the movie
        const fetchMovie = async () => {

            let url = `http://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=d01e1c2a`;


            let movieData = await fetch(url);
            if (!movieData.ok) {
                throw new Error('Find an Eror in the Fetch');
            }
            let reMoviedata = await movieData.json();
            return reMoviedata;

        }
        // this funciton for calling fetchmovie
        const callfetch = async () => {
            try {
                let fetchMdata = await fetchMovie();

                movieName.textContent = fetchMdata.Title;
                titleimg.src = fetchMdata.Poster;
                let g = fetchMdata.Genre.split(',');
                genrebtn1.textContent = g[0];
                genrebtn2.textContent = g[1];
                genrebtn3.textContent = g[2];
                plot.textContent = fetchMdata.Plot;
                ratinstar.textContent = `${fetchMdata.imdbRating}/10`;
                actors = fetchMdata.Actors.split(','); //dividing actors name by "," and taking as array.split retuns array






            } catch (error) {
                console.log('there i an error', error);

            }


        }


        // AIzaSyCpRHrlpggttMQBJ4jrBEX001mpOxmx1kw 
        //this function for fetching youtube video and its id
        const fetchYtdata = async () => {
            let apikeyvalue = 'AIzaSyCpRHrlpggttMQBJ4jrBEX001mpOxmx1kw';
            let fetchyt = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${apikeyvalue}&q=${encodeURIComponent(title + "trailer")}&type=video&maxResults=1&part=snippet`);
            if (!fetchyt.ok) {
                console.log(fetchyt.ok);
            }
            let fetchytjson = await fetchyt.json();
            return fetchytjson;


        }
        //this function for calling fetchYtdata
        const callfetchYtdata = async () => {
            try {
                let ytdata = await fetchYtdata();

                ytvideoId = ytdata.items[0].id.videoId; //getting youtube video id for using it letter to find trailers
                const video = ytdata.items[0]; // First video in the results

                const thumbnailUrl = video.snippet.thumbnails.high.url;
                // document.getElementById('img').src = thumbnailUrl;
                // console.log(thumbnailUrl);
                console.log(ytvideoId)



            } catch (error) {
                console.log(error);
            }
        }

        const thumbNails = async () => {



            await callfetchYtdata();


            function onYouTubeIframeAPIReady() {

                if(player) {
                    player.loadVideoById(ytvideoId);

                } else {
                    player = new YT.Player('player', {
                        height: '390',
                        width: '640',
                        videoId: `${ytvideoId}`, // Replace with your video ID
                        playerVars: {
                            'playsinline': 1
                        },


                    });
                }



            }


            return onYouTubeIframeAPIReady();


        }
        //this function for fetching actor image, actor name is gettin from callfetch;
        let actorimage = async () => {
            await callfetch();
            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json'
                }
            };
            let apikey = '1d73173c0c07c518173eb19bce223cb9';
            for (const key in actors) {
                let f = await fetch(`https://api.themoviedb.org/3/search/person?api_key=${apikey}&query=${encodeURIComponent(actors[key])}`, options);
                let b = await f.json();
                // console.log(b);
                actordatas.push(b);


            }
            return actordatas;
        }
        let callactorimage = async () => {






            let imageurl = await actorimage();
            // console.log(imageurl);

            document.getElementsByClassName('statuslist')[0].innerHTML = " ";
            for (const key in imageurl) {
                document.getElementsByClassName('statuslist')[0].innerHTML += `<span class ="flex gap-2"><img src= "https://image.tmdb.org/t/p/w500${imageurl[key].results[0].profile_path}" class=" h-[14rem] rounded-md" alt="">
            <p class = " inter font-bold">${imageurl[key].results[0].name}</P>
            </span>`;
            }
            actordatas = [];


        }

        await Promise.all([callactorimage(), thumbNails()]);


    })


 
})