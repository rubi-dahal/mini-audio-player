document.addEventListener("DOMContentLoaded", function () {

    /**
     * Function to get the duration of an audio file.
     * @param {string} src - The source path of the audio file.
     * @param {function} cb - Callback function to return the duration in seconds.
     */
    function getDuration(src, cb) {
        const audio = new Audio();
        audio.addEventListener("loadedmetadata", function() {
            console.log(audio.duration);
            cb(audio.duration);
        });
        audio.src = src;
    }


    // DOM Elements
    let songIndex = 0;
    let masterPlay = document.getElementById('masterPlay');
    let myProgressBar = document.getElementById('myProgressBar');
    let gif = document.getElementById('gif');
    let MasterSongName = document.getElementById('MasterSongName');
    let songItems = Array.from(document.getElementsByClassName('songItems'));
    let currentTime = document.getElementById('currentTime');
    let totalTime = document.getElementById('totalTime');

    // Array of song details
    let songs = [
        {songName: "Yeh Aaina - Kabir Singh", filePath: "./songs/1.mp3", coverPath: "covers/1.jpg"},
        {songName: "Christina Perri - A Thousand Years", filePath: "./songs/2.mp3", coverPath: "covers/2.jpg"},
        {songName: "Achha ji main hari chalo maan jao na", filePath: "./songs/3.mp3", coverPath: "covers/3.jpg"},
        {songName: "Kasoor -Prateek Kuhad", filePath: "./songs/4.mp3", coverPath: "covers/4.jpg"},
        {songName: "Meri maya fula jasti Sparsha Sangeet", filePath: "./songs/5.mp3", coverPath: "covers/5.jpg"},
        {songName: "One Direction - Night Changes", filePath: "./songs/6.mp3", coverPath: "covers/6.jpg"},
        {songName: "Kabhi Kabhi Aditi", filePath: "./songs/7.mp3", coverPath: "covers/7.jpg"},
        {songName: "Cold/mess -Prateek Kuhad", filePath: "./songs/8.mp3", coverPath: "covers/8.jpg"},
        {songName: "Tum hi Dekho na", filePath: "./songs/9.mp3", coverPath: "covers/9.jpg"},
        {songName: "Yoon Sabnami", filePath: "./songs/10.mp3", coverPath: "covers/10.jpg"},
    ];

    // Initialize song items in the UI
    songItems.forEach((element, i) => {
        element.getElementsByTagName("img")[0].src = songs[i].coverPath;
        element.getElementsByClassName("songName")[0].innerText = songs[i].songName;
        getDuration(songs[i].filePath, (length) => {
            let min = Math.floor(length / 60);
            let sec = Math.floor(length % 60).toString().padStart(2, '0');
            element.getElementsByClassName("duration")[0].innerText = `${min}:${sec}`;
        });
    });

    let audioElement = new Audio(songs[0].filePath);

    // Play/Pause functionality for master play button
    masterPlay.addEventListener('click', () => {
        if (audioElement.paused || audioElement.currentTime <= 0) {
            audioElement.play();
            masterPlay.classList.replace("fa-circle-play", "fa-circle-pause");
            gif.style.opacity = 1;
            makeAllPlays();
            document.getElementById(songIndex).classList.replace("fa-circle-play", "fa-circle-pause");
        } else {
            audioElement.pause();
            masterPlay.classList.replace("fa-circle-pause", "fa-circle-play");
            gif.style.opacity = 0;
            makeAllPlays();
        }
    });

    // Update the progress bar and current time display
    audioElement.addEventListener('timeupdate', () => {
        if (audioElement.duration) {
            let progress = parseInt((audioElement.currentTime / audioElement.duration) * 100);
            myProgressBar.value = progress;

            let currentMin = Math.floor(audioElement.currentTime / 60).toString().padStart(2, '0');
            let currentSec = Math.floor(audioElement.currentTime % 60).toString().padStart(2, '0');
            currentTime.innerText = `${currentMin}:${currentSec}`;

            let totalMin = Math.floor(audioElement.duration / 60).toString().padStart(2, '0');
            let totalSec = Math.floor(audioElement.duration % 60).toString().padStart(2, '0');
            totalTime.innerText = `${totalMin}:${totalSec}`;
        }
    });

    // Change event for progress bar to seek within the song
    myProgressBar.addEventListener('change', () => {
        audioElement.currentTime = (myProgressBar.value * audioElement.duration) / 100;
    });

    // Function to reset all song play buttons to play icon
    const makeAllPlays = () => {
        Array.from(document.getElementsByClassName('songItemPlay')).forEach((element) => {
            element.classList.replace("fa-circle-pause", "fa-circle-play");
        });
    };

    // Click event for each song's play button
    Array.from(document.getElementsByClassName('songItemPlay')).forEach((element) => {
        element.addEventListener('click', (e) => {
            const clickedIndex = parseInt(e.target.id);

            if (songIndex === clickedIndex && !audioElement.paused) {
                audioElement.pause();
                e.target.classList.replace("fa-circle-pause", "fa-circle-play");
                gif.style.opacity = 0;
                masterPlay.classList.replace("fa-circle-pause", "fa-circle-play");
            } else {
                makeAllPlays();
                songIndex = clickedIndex;
                e.target.classList.replace("fa-circle-play", "fa-circle-pause");
                audioElement.src = `songs/${songIndex + 1}.mp3`;
                audioElement.currentTime = 0;
                MasterSongName.innerText = songs[songIndex].songName;
                audioElement.play();
                gif.style.opacity = 1;
                masterPlay.classList.replace("fa-circle-play", "fa-circle-pause");
            }
        });
    });

    // Next song functionality
    document.getElementById('next').addEventListener('click', () => {
        songIndex = (songIndex >= 9) ? 0 : songIndex + 1;
        playSelectedSong();
    });

    // Previous song functionality
    document.getElementById('previous').addEventListener('click', () => {
        songIndex = (songIndex <= 0) ? 0 : songIndex - 1;
        playSelectedSong();
    });

    // Helper function to play the selected song and update UI
    function playSelectedSong() {
        makeAllPlays();
        document.getElementById(songIndex).classList.replace("fa-circle-play", "fa-circle-pause");
        audioElement.src = `songs/${songIndex + 1}.mp3`;
        audioElement.currentTime = 0;
        MasterSongName.innerText = songs[songIndex].songName;
        audioElement.play();
        gif.style.opacity = 1;
        masterPlay.classList.replace("fa-circle-play", "fa-circle-pause");
    }
});
