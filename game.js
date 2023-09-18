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
	var hasRunAnimation = 0;
	var hasRunFade = 0;
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
		console.log("has run animation:", hasRunAnimation++);
		clickedColor.addClass("pressedUser");
		clickedColor.addClass("glowUser");
		await fade(clickedColor);
		console.log("fade has run:", hasRunFade++);
		await setTimeout(() => {
			clickedColor.removeClass("glowUser");
		}, 200);
		await setTimeout(() => {
			clickedColor.removeClass("pressedUser");
		}, 200);
	}

	async function nextSequence() {
		if (firstRun === false) {
			level++;
		}
		var levelTitle = $("#level-title");
		var levelText = $("#level-text");
		var body = $("body");
		var cpuText = " CPUs Turn:";
		var playerText = "Players Turn:";
		levelText.css("visibility", "visible");
		levelText.text("Level " + level);
		levelTitle.css("color", "rgba(29, 29, 29, 0.856)");
		levelTitle.text(cpuText);
		await setTimeout(() => {
			cpuAnimatePress();
			setTimeout(() => {
				levelTitle.css("color", "#e4e4e4");
				levelTitle.text(playerText);
			}, 500);
		}, 1500);
		reset();
		firstRun = false;
	}

	function reset() {
		userClickedPattern = [];
		randomNumber = Math.floor(Math.random() * 3) + 1;
		randomChosenColor = buttonColors[randomNumber];
		randomColor = $("." + randomChosenColor);
		cpuPattern.push(randomChosenColor);
	}

	function gameOver() {
		$("#level-title").text("GAME OVER 😭");
		$("#level-text").text("Double click restart the game.");
		document.body.classList.add("game-over");
		document.body.style.pointerEvents = "none";
		firstRun = true;
		level = 0;
		cpuPattern = [];
		userClickedPattern = [];
		gameStarted = false;
	}

	function checkAnswer() {
		var clickedIndex = userClickedPattern.length - 1;
		var cpuIndex = cpuPattern.length - 1;
		if (clickedIndex === cpuIndex) {
			if (compareArrays(userClickedPattern, cpuPattern)) {
				setTimeout(() => {
					nextSequence();
				}, 500);
			} else {
				gameOver();
			}
		}
	}

	$(document).on("dblclick", (e) => {
		if (!gameStarted) {
			document.body.style.pointerEvents = "auto";
			document.body.classList.remove("game-over");
			nextSequence();
			gameStarted = true;
		}
	});

	$(".btn").click(function (e) {
		if (gameStarted === true) {
			document.body.style.pointerEvents = "auto";
			var userChosenColor = this.id;
			userClickedPattern.push(userChosenColor);
			var buttonJustClicked = $(`.${userChosenColor}`);
			clickAnimatePress(buttonJustClicked);
			playSound(this.id);
			checkAnswer();
		} else {
			document.body.style.pointerEvents = "none";
		}
	});
});
