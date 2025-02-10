let teams = [
    "Australia", "India", "England", "Pakistan", "South Africa", "New Zealand",
    "Sri Lanka", "West Indies", "Bangladesh", "Afghanistan", "Ireland", "Zimbabwe",
    "Scotland", "Netherlands", "UAE"
];

let playerTeam, opponentTeam, tossWinner, battingTeam, bowlingTeam;
let score = 0, wickets = 0, balls = 0, target = null, innings = 1;
let totalBalls = 6, maxWickets = 2;

// ** Team Selection **
window.onload = function () {
    let teamButtons = teams.map(team => `<button onclick="selectTeam('${team}')">${team}</button>`).join('');
    document.getElementById("teams").innerHTML = teamButtons;
};

function selectTeam(team) {
    playerTeam = team;
    document.getElementById("team-selection").classList.add("hidden");

    let opponentButtons = teams.filter(t => t !== team)
        .map(t => `<button onclick="selectOpponent('${t}')">${t}</button>`)
        .join('');
    document.getElementById("opponents").innerHTML = opponentButtons;
    document.getElementById("opponent-selection").classList.remove("hidden");
}

function selectOpponent(team) {
    opponentTeam = team;
    document.getElementById("opponent-selection").classList.add("hidden");
    document.getElementById("selected-teams").innerText = `${playerTeam} vs ${opponentTeam}`;
    document.getElementById("match-info").classList.remove("hidden");
    document.getElementById("toss-section").classList.remove("hidden");
}

// ** Toss Logic **
function toss(choice) {
    let tossResult = Math.random() < 0.5 ? "Heads" : "Tails";
    tossWinner = Math.random() < 0.5 ? playerTeam : opponentTeam;

    document.getElementById("toss-result").innerText = `${tossWinner} won the toss!`;
    document.getElementById("toss-section").classList.add("hidden");

    if (tossWinner === playerTeam) {
        document.getElementById("bat-ball-choice").classList.remove("hidden");
    } else {
        let opponentChoice = Math.random() < 0.5 ? "Bat" : "Ball";
        chooseBatBall(opponentChoice);
    }
}

function chooseBatBall(choice) {
    document.getElementById("bat-ball-choice").classList.add("hidden");

    if (choice === "Bat") {
        battingTeam = tossWinner;
        bowlingTeam = tossWinner === playerTeam ? opponentTeam : playerTeam;
    } else {
        battingTeam = tossWinner === playerTeam ? opponentTeam : playerTeam;
        bowlingTeam = tossWinner;
    }

    document.getElementById("overs-section").classList.remove("hidden");
}

// ** Overs Selection **
function selectOvers(overs) {
    totalBalls = overs * 6;
    maxWickets = overs === 1 ? 2 : overs === 3 ? 5 : 10;

    document.getElementById("overs-section").classList.add("hidden");
    document.getElementById("gameplay-section").classList.remove("hidden");

    document.getElementById("batting-team").innerText = `${battingTeam} Batting`;
    document.getElementById("balls-left").innerText = totalBalls;
}

// ** Shot Selection & Run Rate Calculation**
function playShot(run) {
    if (balls >= totalBalls || wickets >= maxWickets) return;

    let probabilities = [90, 85, 80, 70, 30, 25];
    let randomChance = Math.random() * 100;

    if (randomChance < probabilities[run - 1]) {
        score += run;
    } else {
        wickets++;
        alert("OUT!");
    }

    balls++;
    let runRate = balls > 0 ? ((score / balls) * 6).toFixed(2) : 0; // Calculate Run Rate

    document.getElementById("score").innerText = score;
    document.getElementById("wickets").innerText = wickets;
    document.getElementById("balls-left").innerText = Math.max(0, totalBalls - balls);
    document.getElementById("run-rate").innerText = runRate; // Update Run Rate

    if (innings === 1 && (balls === totalBalls || wickets === maxWickets)) {
        target = score + 1;
        alert(`Innings Over! ${battingTeam} Scored: ${score}. Target: ${target}`);
        switchInnings();
    } else if (innings === 2) {
        if (score >= target) {
            alert(`${battingTeam} wins!`);
            endGame();
        } else if (balls === totalBalls || wickets === maxWickets) {
            alert(`${bowlingTeam} wins!`);
            endGame();
        }
    }
}

// ** Switch Innings **
function switchInnings() {
    innings = 2;
    balls = 0;
    score = 0;
    wickets = 0;
    [battingTeam, bowlingTeam] = [bowlingTeam, battingTeam];

    document.getElementById("batting-team").innerText = `${battingTeam} Batting`;
    document.getElementById("score").innerText = 0;
    document.getElementById("wickets").innerText = 0;
    document.getElementById("balls-left").innerText = totalBalls;
    document.getElementById("run-rate").innerText = "0.00"; // Reset Run Rate
}

// ** End Game **
function endGame() {
    document.getElementById("gameplay-section").classList.add("hidden");
    document.getElementById("restart-section").classList.remove("hidden");
}

function endGame() {
    let winnerText = "";

    if (score >= target) {
        winnerText = `${battingTeam} Wins! 🏆`;
    } else {
        winnerText = `${bowlingTeam} Wins! 🏆`;
    }

    document.getElementById("winner-text").innerText = winnerText;
    document.getElementById("winner-section").classList.remove("hidden"); // Show winner text

    document.getElementById("gameplay-section").classList.add("hidden");
    document.getElementById("restart-section").classList.remove("hidden");
}


// ** Restart Game **
function restartGame() {
    location.reload();
}
