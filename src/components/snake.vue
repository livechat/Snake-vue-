<template>
	<div class="snake-app">
		<div v-if="play">
			<table>
				<tr v-for="(row, index) in grid" :key="index">
					<td
						v-for="(cell, index) in row"
						:key="index"
						class="grid-cell"
						:class="{
							snake: cell.snake > 0,
							food: cell.food,
							head: cell.x === snakeCells[snakeCells.length - 1].x && cell.y === snakeCells[snakeCells.length - 1].y,
							letter: cell.letter,
						}"
					>
						{{ cell.letter }}
					</td>
				</tr>
			</table>

			<div class="text-center">
				<p>
					<b>Size:</b>
					{{ size }} x {{ size }}
				</p>
				<p>
					<b>Speed:</b>
					{{ Number((1000 / speed).toFixed(2)) }} cells/sec
				</p>
				<p>
					<b>Length snake:</b>
					{{ length }} cells
				</p>
			</div>
		</div>
		<div class="panel panel-default" v-else>
			<div class="panel-body text-center">
				<h1>{{ message }}</h1>
				<button class="btn btn-success" @click="start">Start</button>
			</div>
		</div>

		<div class="eaten-letters">
			<div class="letters">
				<span v-for="letter in currentWord" :key="letter" :class="{ eaten: lettersUsed.includes(letter) }">
					{{ letter }}
				</span>
			</div>
		</div>
	</div>
</template>

<script type="module">
import Grid from '../classes/Grid'

const UP = [-1, 0],
	DOWN = [1, 0],
	LEFT = [0, -1],
	RIGHT = [0, 1]

let keyMap = {
	37: LEFT,
	38: UP,
	39: RIGHT,
	40: DOWN,
}

const defValue = {
	length: 8,
	speed: 200,
	dead: false,
}

const words = ['EXAMPLE', 'SNAKE', 'VUEJS', 'GRID', 'FOOD', 'LETTERS']

export default {
	props: {
		size: {
			type: Number,
			default: 40,
			validator: value => {
				return value >= 10 && value <= 100
			},
		},
	},

	mounted() {
		window.addEventListener('keydown', event => {
			this.handleUserAction(event.which)
			event.preventDefault()
		})
	},

	data() {
		return {
			play: false,
			direction: RIGHT,
			dead: defValue.dead,
			grid: null,
			snakePos: {},
			snakeCells: {},
			length: defValue.length,
			ticking: null,
			userActions: [],
			speed: defValue.speed,
			currentWord: '',
			lettersUsed: [],
		}
	},

	computed: {
		message() {
			return this.dead ? "You'a dead" : 'Start game'
		},
	},

	methods: {
		handleUserAction(key) {
			let direction = keyMap[key]

			if (direction) {
				this.userActions.push(() => {
					if (direction[0] + this.direction[0] === 0 && direction[1] + this.direction[1] === 0) {
						return
					}
					this.direction = direction
				})
			}
		},

		start() {
			this.play = true
			this.dead = defValue.dead
			this.speed = defValue.speed
			this.length = defValue.length
			this.grid = new Grid(this.size, (x, y) => ({
				x,
				y,
				snake: 0,
				food: false,
				letter: null,
			}))
			this.userActions = []
			this.ticking = setInterval(this.tick, this.speed)
			this.snakePos = Grid.random(this.grid)
			this.snakePos.snake = this.length
			this.snakeCells = [this.snakePos]
			this.currentWord = this.randomWord()
			this.lettersUsed = []
			this.setLetter()
			this.currentWord = this.randomWord()
			this.setAllLetters()
		},

		tick() {
			if ((this.userAction = this.userActions.shift())) {
				this.userAction()
			}
			this.moveSnake()
			this.eatLetter()
		},

		moveSnake() {
			let { x, y } = this.snakePos
			let [xd, yd] = this.direction

			let X = x + xd > this.size - 1 ? 0 : x + xd < 0 ? this.size - 1 : x + xd
			let Y = y + yd > this.size - 1 ? 0 : y + yd < 0 ? this.size - 1 : y + yd

			this.snakePos = (this.grid[X] || [])[Y]

			if (this.snakePos.snake) {
				return this.gameOver()
			}

			this.snakeCells.forEach(cell => cell.snake--)
			this.snakeCells = this.snakeCells.filter(cell => cell.snake > 0)

			this.snakePos.snake = this.length
			this.snakeCells.push(this.snakePos)
		},

		eatFood() {
			if (this.snakePos && this.snakePos.letter) {
				this.length++
				this.speed -= 1
				this.snakeCells.forEach(cell => cell.snake++)
				// this.setFood();
			}
		},

		eatLetter() {
			if (this.snakePos && this.snakePos.letter) {
				// Increment snake's length and possibly modify other behaviors (like speed)
				this.length++
				this.speed -= 1
				this.snakeCells.forEach(cell => cell.snake++)

				// Remove the letter from the list of letters used
				let index = this.lettersUsed.indexOf(this.snakePos.letter)
				if (index > -1) {
					this.lettersUsed.splice(index, 1)
				}
				this.lettersUsed.push(this.snakePos.letter)

				// Clear the letter from the cell
				this.snakePos.letter = null
				this.snakePos.food = false
				this.setLetter()
			}

			if (this.lettersUsed.length === this.currentWord.length) {
				// Introduce a new word
				this.currentWord = this.randomWord()
				this.lettersUsed = []
				this.setAllLetters()
			}
		},

		setLetter(letter) {
			console.log('🚀 ~ file: snake.vue:227 ~ setLetter ~ letter:', letter)
			let tries = 0
			let cell = Grid.random(this.grid)

			while ((cell.letter || cell.snake > 0) && tries < this.size * this.size) {
				cell = Grid.random(this.grid)
				tries++
			}

			if (tries < this.size * this.size) {
				cell.letter = letter
			}
		},

		gameOver() {
			this.dead = true
			clearInterval(this.ticking)
			setTimeout((this.play = false), 500)
		},

		setAllLetters() {
			for (let letter of this.currentWord) {
				this.setLetter(letter) // Use our original setLetter function, but with an argument now
			}
		},

		randomWord() {
			return words[Math.floor(Math.random() * words.length)]
		},
	},
}
</script>

<style scoped lang="scss">
$gray-primary: #3e3e3e;
$white-primary: #ffffff;
$white-secondary: #f4f4f4;
$blue-primary: #006aff;
$blue-secondary: #56b0bb;
$orange-primary: #ff7f2e;
$red-primary: #ff0000;

// Define vaporwave colors
$pink: #ff71ce;
$purple: #01cdfe;
$blue: #05ffa1;
$lightpurple: #b967ff;
$darkpurple: #6b3b8e;

.letter {
	font-family: 'YourVaporwaveFont', sans-serif; // Replace 'YourVaporwaveFont' with the actual font name
	font-size: 18px;
	background: linear-gradient(45deg, $pink, $purple, $blue, $lightpurple);
	-webkit-background-clip: text;
	color: $darkpurple; // Dark color for the letter
	border: 2px solid $lightpurple;
	padding: 5px 10px;
	border-radius: 5px;
	box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.2);
	transition: all 0.3s ease;

	&:hover {
		background-position: 100%;
		box-shadow: -3px -3px 5px rgba(0, 0, 0, 0.2);
	}
}

.eaten-letters {
	text-align: center;
	margin-top: 30px;

	.letters {
		font-size: 24px;
		span {
			margin: 0 5px;
			transition: 0.3s;

			&.eaten {
				color: green;
			}
		}
	}
}

a {
	cursor: pointer;
	color: $blue-primary;
}

table {
	border-collapse: collapse;
	overflow: hidden;
	margin: 20px auto;
}

.grid-cell {
	margin: 0;
	padding: 0;
	height: 20px;
	width: 20px;
	background-color: $white-secondary;
	border: 1px solid $white-primary;
	transition: 0.5s;
}

.food {
	background-color: $blue-secondary;
	position: relative;

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		right: -100%;
		bottom: 0;
		width: 100%;
		height: 100%;
		background: $blue-secondary;
		opacity: 0.5;
		padding: 13px;
		margin: auto;
		z-index: 2;
	}
}

.snake-app {
	padding: 10px 0;
}

.snake {
	background-color: $gray-primary;
	position: relative;
}

.head {
	background-color: $orange-primary;
	position: relative;

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		right: -100%;
		bottom: 0;
		width: 100%;
		height: 100%;
		background: $red-primary;
		opacity: 0.5;
		padding: 13px;
		margin: auto;
		z-index: 2;
	}
}
</style>
