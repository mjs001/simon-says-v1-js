$(document).ready(function () {
	// GOT TO FINISH MAKING GAMEOVER, WIN, REROLL VAR FOR RANDOM CHOICE
	var buttonColors = ["red", "blue", "green", "yellow"];
	var cpuPattern = [];
	var userClickedPattern = [];
	var randomNumber = Math.floor(Math.random() * 3) + 1;
	var randomChosenColor = buttonColors[randomNumber];
	var randomColor = $("." + randomChosenColor);
	var gameStarted = false;
	var level = 0;
	var firstRun = true;

	const options = {
		attributes: true,
	};

	function timeout(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	function compareArrays(firstArr, secondArr) {
		return firstArr.every((value, index) => value === secondArr[index]);
	}

	function playSound(name) {
		var colorSound = new Audio(`./sounds/${name}.mp3`);
		colorSound.play();
	}

	function fade(button) {
		button.fadeOut(200);
		button.fadeIn(200);
	}

	async function cpuAnimatePress() {
		var cpuColor = randomColor;
		cpuColor.addClass("pressedCpu");
		cpuColor.addClass("glow");
		await fade(cpuColor);
		await setTimeout(() => {
			cpuColor.removeClass("glow");
		}, 200);

		await setTimeout(() => {
			cpuColor.removeClass("pressedCpu");
		}, 200);
	}

	async function clickAnimatePress(clickedColor) {
		var buttonJustClicked = $(`.${clickedColor}`);
		buttonJustClicked.addClass("pressedUser");
		buttonJustClicked.addClass("glowUser");
		await fade(buttonJustClicked);
		await setTimeout(() => {
			buttonJustClicked.removeClass("glowUser");
		}, 200);
		await setTimeout(() => {
			buttonJustClicked.removeClass("pressedUser");
		}, 200);
	}

	function nextSequence() {
		if (firstRun === false) {
			level++;
		}
		var levelTitle = $("#level-title");
		var levelText = $("#level-text");
		var cpuText = " CPUs Turn:";
		levelText.text("Level " + level);
		levelTitle.text(cpuText);
		cpuPattern.push(randomChosenColor);
		cpuAnimatePress();
		firstRun = false;
	}

	function reset() {
		userClickedPattern = [];
		randomNumber = Math.floor(Math.random() * 3) + 1;
		randomChosenColor = buttonColors[randomNumber];
		randomColor = $("." + randomChosenColor);
	}

	function checkAnswer() {
		var clickedIndex = userClickedPattern.length - 1;
		var cpuIndex = cpuPattern.length - 1;
		if (clickedIndex === cpuIndex) {
			if (compareArrays(userClickedPattern, cpuPattern)) {
				setTimeout(() => {
					nextSequence();
					reset();
				}, 1000);
			} else {
				console.log("fail");
			}
		}
	}

	$(document).on("keydown", (e) => {
		if (gameStarted === false) {
			nextSequence();
			gameStarted = true;
			$(".btn").click(function () {
				var userChosenColor = this.id;
				userClickedPattern.push(userChosenColor);
				var buttonJustClicked = $(`.${userChosenColor}`);
				clickAnimatePress(userChosenColor);
				playSound(this.id);
				checkAnswer();
			});
		}
	});
});
