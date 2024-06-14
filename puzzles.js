answerNum = null;
explanation = null;
answered = false;

async function getPuzzle() {
    document.getElementById("verdict").innerHTML = "";
    document.getElementById("explanation").innerHTML = "";
    document.getElementById("question-label").innerHTML = "Loading...";
    document.getElementById("o1").innerHTML = "";
    document.getElementById("o2").innerHTML = "";
    document.getElementById("o3").innerHTML = "";
    document.getElementById("o4").innerHTML = "";
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
    correct = optionNum === answerNum;
    verdict = document.getElementById("verdict");
    verdict.innerHTML = correct ? "Correct!" : "Wrong";
    verdict.style.color = correct ? "green" : "red";
    document.getElementById(
        "correctAns"
    ).innerHTML = `Correct answer: ${answerNum}`;
    document.getElementById("explanation").innerHTML = explanation;
    answered = true;
}
