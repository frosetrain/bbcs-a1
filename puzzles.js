answerNum = null;
explanation = null;
answered = false;

async function getPuzzle() {
    document.getElementById("verdict").innerHTML = "";
    document.getElementById("explanation").innerHTML = "";
    document.getElementById("question-label").innerHTML = "Loading...";
    answered = false;
    response = await fetch("http://127.0.0.1:8000", {
        mode: "cors",
        referrerPolicy: "origin",
    });
    response.json().then((data) => {
        console.log(data);
        document.getElementById("question-label").innerHTML = data.question;
        for (let option of data.options) {
            document.getElementById(`o${option[0]}`).innerHTML = option[1];
        }
        answerNum = data.answer[0];
        explanation = data.explanation;
    });
}

function selectAnswer(optionNum) {
    if (answered) return;
    console.log(optionNum, answerNum);
    document.getElementById("verdict").innerHTML =
        optionNum === answerNum ? "Correct!" : "Wrong";
    document.getElementById("explanation").innerHTML = explanation;
    answered = true;
}
