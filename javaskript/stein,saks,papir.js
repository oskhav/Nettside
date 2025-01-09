const choices = document.querySelectorAll(".choice");
const resultDiv = document.getElementById("result");

const getComputerChoice = () => {
    const choices = ["stein", "saks", "papir"];
    return choices[Math.floor(Math.random() * choices.length)];
};

const determineWinner = (player, computer) => {
    if (player === computer) return "Uavgjort!";
    if (
        (player === "stein" && computer === "saks") ||
        (player === "saks" && computer === "papir") ||
        (player === "papir" && computer === "stein")
    ) {
        return "Du vant! 🎉";
    }
    return "Du tapte... 😢";
};

choices.forEach(choice => {
    choice.addEventListener("click", () => {
        const playerChoice = choice.getAttribute("data-choice");
        const computerChoice = getComputerChoice();

        const winnerMessage = determineWinner(playerChoice, computerChoice);
        resultDiv.innerHTML = `
            Du valgte <strong>${playerChoice}</strong>. <br>
            Maskinen valgte <strong>${computerChoice}</strong>. <br>
            ${winnerMessage}
        `;
    });
});
