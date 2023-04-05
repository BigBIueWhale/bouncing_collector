let player;
let objects = [];
let obstacles = [];
let powerUps = [];
let score = 0;
let powerUpTimer = 0;

function setup() {
  createCanvas(800, 600);
  player = new Player();
}

function draw() {
  background(0);

  player.update();
  player.display();

  if (frameCount % 60 === 0) {
    objects.push(new CollectableObject());
    obstacles.push(new Obstacle());
    if (random() < 0.1) {
      powerUps.push(new PowerUp());
    }
  }

  for (let i = objects.length - 1; i >= 0; i--) {
    objects[i].update();
    objects[i].display();

    if (objects[i].collidesWith(player)) {
      score++;
      objects.splice(i, 1);
    } else if (objects[i].isOffscreen()) {
      objects.splice(i, 1);
    }
  }

  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].update();
    obstacles[i].display();

    // Only trigger game over if the player doesn't have an active shield
    if (
      obstacles[i].collidesWith(player) &&
      player.powerUpState.type !== "shield"
    ) {
      gameOver();
    } else if (obstacles[i].isOffscreen()) {
      obstacles.splice(i, 1);
    }
  }

  for (let i = powerUps.length - 1; i >= 0; i--) {
    powerUps[i].update();
    powerUps[i].display();

    if (powerUps[i].collidesWith(player)) {
      player.activatePowerUp(powerUps[i].type);
      powerUps.splice(i, 1);
    } else if (powerUps[i].isOffscreen()) {
      powerUps.splice(i, 1);
    }
  }

  player.handlePowerUps();

  textSize(32);
  fill(255);
  text("Score: " + score, 10, 40);
}

function gameOver() {
  noLoop();
  textSize(64);
  textAlign(CENTER, CENTER);
  fill(255, 0, 0);
  text("GAME OVER", width / 2, height / 2);
}

class Player {
  constructor() {
    this.x = width / 2;
    this.y = height - 50;
    this.diameter = 50;
    this.velocityY = 0;
    this.gravity = 0.5;
    this.powerUpState = { type: null, timer: 0 };
  }

  update() {
    this.x = mouseX;

    this.velocityY += this.gravity;
    this.y += this.velocityY;
    if (this.y >= height - this.diameter / 2) {
      this.y = height - this.diameter / 2;
      this.velocityY = -15;
    }
  }

  display() {
    fill(255, 0, 0);
    ellipse(this.x, this.y, this.diameter, this.diameter);
  }

  activatePowerUp(type) {
    this.powerUpState.type = type;
    this.powerUpState.timer = 300;
  }

  handlePowerUps() {
    if (this.powerUpState.timer > 0) {
      this.powerUpState.timer--;

            if (this.powerUpState.type === "bigger") {
        this.diameter = 75;
      } else if (this.powerUpState.type === "faster") {
        this.gravity = 1;
      } else if (this.powerUpState.type === "shield") {
        fill(0, 255, 255, 100);
        ellipse(this.x, this.y, this.diameter + 20, this.diameter + 20);
      }
    } else {
      this.powerUpState.type = null;
      this.diameter = 50;
      this.gravity = 0.5;
    }
  }
}

class CollectableObject {
  constructor() {
    this.x = random(width);
    this.y = 0;
    this.size = random(15, 30);
    this.speed = random(1, 4);
  }

  update() {
    this.y += this.speed;
  }

  display() {
    fill(0, 255, 0);
    ellipse(this.x, this.y, this.size, this.size);
  }

  collidesWith(player) {
    let distance = dist(this.x, this.y, player.x, player.y);
    return distance < (this.size / 2) + (player.diameter / 2);
  }

  isOffscreen() {
    return this.y > height;
  }
}

class Obstacle {
  constructor() {
    this.x = random(width);
    this.y = 0;
    this.size = random(15, 30);
    this.speed = random(1, 4);
  }

  update() {
    this.y += this.speed;
  }

  display() {
    fill(0, 0, 255);
    rect(this.x, this.y, this.size, this.size);
  }

  collidesWith(player) {
    let distance = dist(this.x + this.size / 2, this.y + this.size / 2, player.x, player.y);
    return distance < (this.size / 2) + (player.diameter / 2);
  }

  isOffscreen() {
    return this.y > height;
  }
}

class PowerUp {
  constructor() {
    this.x = random(width);
    this.y = 0;
    this.size = 20;
    this.speed = random(1, 4);
    this.type = random(["bigger", "faster", "shield"]);
  }

  update() {
    this.y += this.speed;
  }

  display() {
    if (this.type === "bigger") {
      fill(255, 255, 0);
    } else if (this.type === "faster") {
      fill(255, 165, 0);
    } else if (this.type === "shield") {
      fill(0, 255, 255);
    }
    ellipse(this.x, this.y, this.size, this.size);
  }

  collidesWith(player) {
    let distance = dist(this.x, this.y, player.x, player.y);
    return distance < (this.size / 2) + (player.diameter / 2);
  }

  isOffscreen() {
    return this.y > height;
  }
}
