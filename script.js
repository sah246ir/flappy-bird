let collision = false;
let score = 0;
let pipeSpeed = 9; // Initial speed
let gravityStrength = 12; // Initial gravity
let pipeInterval = 5000; // Initial pipe generation interval
let gamestarted = false
function startGame (){ 
    function checkIntersection(pipe) {
        const bird = document.querySelector(".bird").getBoundingClientRect();
        const top = pipe.querySelector(".top").getBoundingClientRect();
        const bottom = pipe.querySelector(".bottom").getBoundingClientRect();
    
        const collidesWithTop = (
            bird.right > top.left &&
            bird.left < top.right &&
            bird.bottom > top.top &&
            bird.top < top.bottom
        );
    
        const collidesWithBottom = (
            bird.right > bottom.left &&
            bird.left < bottom.right &&
            bird.bottom > bottom.top &&
            bird.top < bottom.bottom
        );
    
        if (collidesWithTop || collidesWithBottom) {
            clearInterval(gravity);
            clearInterval(pipes);
            clearInterval(pipegenerator);
            window.removeEventListener("keydown", KeyHandler);
            showGameOver(score)
            return true;
        }
    
        if (top.right < bird.left && pipe.getAttribute("data-scored") != "1") {
            score += 1;
            document.querySelector(".score").innerHTML = score;
            pipe.setAttribute("data-scored", "1");
            increaseDifficulty();
        }
    }
    
    function createPipe() {
        const pipe = document.createElement("div");
        pipe.className = "pipe";
        pipe.innerHTML = `
        <div class="top"></div>
        <div class="bottom"></div>
        `;
        document.querySelector(".game").appendChild(pipe);
        pipe.querySelector(".top").style.height = `${Math.random() * 50}%`;
        pipe.querySelector(".bottom").style.height = `${Math.random() * 50}%`;
    }
    
    function increaseDifficulty() {
        if (score % 5 === 0) { // Increase difficulty every 5 points
            pipeSpeed += 1;
            gravityStrength += 2;
            if (pipeInterval > 2000) {
                pipeInterval -= 500;
                restartPipeGenerator();
            }
        }
    }
    
    
    function restartPipeGenerator() {
        clearInterval(pipegenerator);
        pipegenerator = setInterval(createPipe, pipeInterval);
    }
    
    
    let pipegenerator = setInterval(createPipe, pipeInterval);
    
    let gravity = setInterval(() => {
        const bird = document.querySelector(".bird");
        if (!bird) return;
        let currentBottom = parseInt(getComputedStyle(bird).bottom, 10) || 0;
        if (currentBottom < 0) return;
        bird.style.bottom = `${currentBottom - gravityStrength}px`;
    }, 100);
    
    let pipes = setInterval(() => {
        const pipeelements = document.querySelectorAll(".pipe");
        for (let pipe of pipeelements) {
            let currentLeft = parseInt(getComputedStyle(pipe).right, 10) || 0;
            pipe.style.right = `${currentLeft + pipeSpeed}px`;
            checkIntersection(pipe);
        }
    }, 100);
    
    function KeyHandler(e) {
        let bird;
        let currentBottom;
        if (e.keyCode == 38 || e.keyCode == 32) {
            bird = document.querySelector(".bird");
            currentBottom = parseInt(getComputedStyle(bird).bottom, 10) || 0;
            if (currentBottom > (window.innerHeight - bird.clientHeight)) return;
            bird.style.bottom = `${currentBottom + 65}px`;
        }
    }
    
    window.addEventListener("keydown", KeyHandler);
    
    
    function showGameOver(score) {
        document.getElementById("finalScore").innerText = score;
        document.getElementById("gameOverDialog").showModal();
    }
    
    function restartGame() {
        location.reload(); // Reload the page to restart the game
    }
    
    function closeDialog() {
        document.getElementById("gameOverDialog").close();
    }
}

function gamestarter(e) {
    if (!gamestarted && (e.keyCode == 38 || e.keyCode == 32)) {
        document.querySelector(".starter-msg").style.display="none"
        startGame()
        window.removeEventListener("keydown",gamestarter)
    }
}

window.addEventListener("keydown", gamestarter);
