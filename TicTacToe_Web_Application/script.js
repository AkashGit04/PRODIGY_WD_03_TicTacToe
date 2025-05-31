const bgMusic = new Audio("bg-music.mp3");
const winSound = new Audio("win.wav");
const loseSound = new Audio("loss.wav");
const clickSound = new Audio("click.wav");

// Background music settings
bgMusic.loop = true;
bgMusic.volume = 0.4;

// Play background music on first user click (to satisfy autoplay restrictions)
document.addEventListener("click", () => {
    bgMusic.play().catch(() => {
        console.log("Autoplay blocked until user interacts");
    });
}, { once: true });

// Initial game state
let turn = "X";
let gameActive = true;

// Function to toggle turn
const changeTurn = () => (turn === "X" ? "O" : "X");

// Function to check for a win or draw
const checkWin = () => {
    const boxtext = document.getElementsByClassName('boxtext');
    const wins = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],  // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8],  // columns
        [0, 4, 8], [2, 4, 6]              // diagonals
    ];

    for (const [a, b, c] of wins) {
        if (
            boxtext[a].innerText &&
            boxtext[a].innerText === boxtext[b].innerText &&
            boxtext[a].innerText === boxtext[c].innerText
        ) {
            document.querySelector(".info").innerText = boxtext[a].innerText + " Wins!";
            winSound.play();
            gameActive = false;
            document.querySelector(".imgbox img").style.display = "block";
            return;
        }
    }

    // Check for draw if all boxes are filled and no winner yet
    if ([...boxtext].every(box => box.innerText !== "") && gameActive) {
        document.querySelector(".info").innerText = "It's a Draw!";
        loseSound.play();
        gameActive = false;
    }
};

// Add click event listeners to boxes
const boxes = document.getElementsByClassName("box");
Array.from(boxes).forEach(element => {
    const boxtext = element.querySelector('.boxtext');
    element.addEventListener('click', () => {
        if (boxtext.innerText === "" && gameActive) {
            boxtext.innerText = turn;
            clickSound.play();
            checkWin();
            if (gameActive) {
                turn = changeTurn();
                document.querySelector(".info").innerText = "Turn for " + turn;
            }
        }
    });
});

// Reset the game on reset button click
document.getElementById("reset").addEventListener("click", () => {
    const boxtext = document.getElementsByClassName("boxtext");
    Array.from(boxtext).forEach(box => box.innerText = "");
    turn = "X";
    gameActive = true;
    document.querySelector(".info").innerText = "Turn for " + turn;
    document.querySelector(".imgbox img").style.display = "none";
});
