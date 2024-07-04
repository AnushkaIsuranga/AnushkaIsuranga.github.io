const navigationHeight = document.querySelector('#nav_bar').offsetHeight;

// console.log(document.documentElement);

document.documentElement.style.setProperty('--scroll-padding', navigationHeight + 20 + "px");

function scrollToTop() {
    document.documentElement.scrollTop = 0; // For modern browsers
    document.body.scrollTop = 0; // For older browsers (like Safari)
}

window.onscroll = function() {
    const scrollThreshold = 100; // Adjust this value as needed
    const myButton = document.getElementById("myBtn");
    if (window.scrollY > scrollThreshold) {
        myButton.style.display = "block";
        myButton.style.opacity = 1; // Fade in
    } else {
        myButton.style.opacity = 0; // Fade out
        setTimeout(() => {
            myButton.style.display = "none";
        }, 500); // Hide after fade-out animation
    }
};


