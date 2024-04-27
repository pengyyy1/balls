var balls = [];
var ballBeingDragged = null;
var mouseOffset;
var speedScale = 1.1;
var maxSpeed = 10;

function Ball(x, y, radius) {
  this.position = createVector(x, y);
  this.velocity = createVector(0, 0);
  this.radius = radius;
  this.dragging = false;
  this.color = color(random(255), random(255), random(255));

  this.update = function() {
    if (!this.dragging) {
      this.position.add(this.velocity);

      if (this.position.x + this.radius > width) {
        this.position.x = width - this.radius;
        this.velocity.x *= -speedScale;
        this.color = color(random(255), random(255), random(255));
      } else if (this.position.x - this.radius < 0) {
        this.position.x = this.radius;
        this.velocity.x *= -speedScale;
        this.color = color(random(255), random(255), random(255));
      }

      if (this.position.y + this.radius > height) {
        this.position.y = height - this.radius;
        this.velocity.y *= -speedScale;
        this.color = color(random(255), random(255), random(255));
      } else if (this.position.y - this.radius < 0) {
        this.position.y = this.radius;
        this.velocity.y *= -speedScale;
        this.color = color(random(255), random(255), random(255));
      }

      this.velocity.limit(maxSpeed);
    }
  };

  this.display = function() {
    fill(this.color);
    ellipse(this.position.x, this.position.y, this.radius * 2, this.radius * 2);
  };

  this.collide = function(other) {
    var distance = this.position.dist(other.position);
    if (distance <= this.radius + other.radius) {
      var normal = p5.Vector.sub(other.position, this.position);
      normal.normalize();

      var relativeVelocity = p5.Vector.sub(other.velocity, this.velocity);
      var speedAlongNormal = p5.Vector.dot(relativeVelocity, normal);

      if (speedAlongNormal < 0) {
        var impulse = -2 * speedAlongNormal;
        impulse /= (1 / this.radius + 1 / other.radius);

        var impulseVector = p5.Vector.mult(normal, impulse);

        this.velocity.sub(p5.Vector.div(impulseVector, this.radius));
        other.velocity.add(p5.Vector.div(impulseVector, other.radius));

        this.color = color(random(255), random(255), random(255));
        other.color = color(random(255), random(255), random(255));
      }
    }
  };
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  for (var i = 0; i < 10; i++) {
    var x = random(width);
    var y = random(height);
    var radius = 50;
    var vx = random(-maxSpeed, maxSpeed);
    var vy = random(-maxSpeed, maxSpeed);
    var ball = new Ball(x, y, radius);
    ball.velocity = createVector(vx, vy);
    balls.push(ball);
  }
}

function draw() {
  background(51);

  for (var i = 0; i < balls.length; i++) {
    var ball = balls[i];

    if (!ball.dragging) {
      for (var j = 0; j < balls.length; j++) {
        if (i !== j) {
          ball.collide(balls[j]);
        }
      }

      if (ball.position.x + ball.radius > width || ball.position.x - ball.radius < 0) {
        ball.color = color(random(255), random(255), random(255));
      }

      if (ball.position.y + ball.radius > height || ball.position.y - ball.radius < 0) {
        ball.color = color(random(255), random(255), random(255));
      }
    }

    ball.update();
    ball.display();
  }

  if (ballBeingDragged) {
    var mouseVelocity = createVector(mouseX - pmouseX, mouseY - pmouseY);
    ballBeingDragged.position.x = mouseX + mouseOffset.x;
    ballBeingDragged.position.y = mouseY + mouseOffset.y;
    ballBeingDragged.velocity = mouseVelocity;
  }
}

function mousePressed() {
  if (mouseButton === LEFT) {
    for (var i = balls.length - 1; i >= 0; i--) {
      var ball = balls[i];
      var distance = dist(mouseX, mouseY, ball.position.x, ball.position.y);
      if (distance <= ball.radius) {
        ballBeingDragged = ball;
        ball.dragging = true;
        mouseOffset = createVector(ball.position.x - mouseX, ball.position.y - mouseY);
        break;
      }
    }
  }
  if (!ballBeingDragged) {
    var ball = new Ball(mouseX, mouseY, 50);
    var randomVelocity = createVector(random(-maxSpeed, maxSpeed), random(-maxSpeed, maxSpeed));
    ball.velocity = randomVelocity;
    balls.push(ball);
  }
}

function mouseReleased() {
if (ballBeingDragged) {
  ballBeingDragged.dragging = false;
  ballBeingDragged = null;
 }
}

function windowResized() {
resizeCanvas(windowWidth, windowHeight);
}
