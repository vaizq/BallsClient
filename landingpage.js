const themesong = new Audio('terminator_theme.mp3');


document.addEventListener("DOMContentLoaded", function() {
    themesong.autoplay = true;
    // Check if the audio is loaded before playing
    themesong.addEventListener('canplaythrough', function() {
        themesong.play();
    });
    
    // If you're having issues with autoplay, you might want to trigger audio playback based on user interaction
    document.addEventListener('click', function() {
        themesong.play();
    });

    themesong.load();
});
