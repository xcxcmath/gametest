var game = new Phaser.Game(800, 600, Phaser.CANVAS, null, {
    preload: preload,
    create: create,
    update: update,
    render: render
});

function preload() {
    game.load.image('fl', 'assets/Earth.jpg');
    game.load.spritesheet('ship', 'assets/spaceship.png', 512, 512);
    game.load.spritesheet('asteroid', 'assets/asteroid.png', 256, 256);
    game.load.audio('bgm', 'assets/bgm.mp3');
}

var background;
var ship;
var asteroids;
var asteroids_alive;
var asteroids_array = [];
var keymove;

var bgm;
var sounds;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    background = game.add.group();
    background.create(0, 300, 'fl');

    ship = game.add.sprite(400, 400, 'ship');
    ship.scale.setTo(0.1, 0.1);
    game.physics.arcade.enable(ship);
    game.physics.arcade.gravity.y = 500;
    ship.body.allowGravity = 0;

    asteroids = game.add.group();
    asteroids.enableBody = true;
    asteroids.physicsBodyType = Phaser.Physics.ARCADE;
    asteroids.createMultiple(100, 'asteroid');
    asteroids.scale.setTo(0.2, 0.2);
    asteroids.setAll("outOfBoundsKill", true);
    asteroids.setAll("checkWorldBounds", true);
    game.time.events.loop(150, fire, this);

    bgm = game.add.audio('bgm');
    sounds = [bgm];
    game.sound.setDecodedCallback(sounds, start, this);

    keymove = game.input.keyboard.createCursorKeys();
}

function fire() {
    var ball = asteroids.getFirstExists(false);

    if (ball){
        ball.frame = 0;
        ball.exists = true;
        ball.reset(game.world.randomX * 5, -15);
        ball.body.bounce.y = 1;
    }
}

function start(){
    sounds.shift();
    bgm.loopFull(1);
    bgm.onLoop.add(hasLooped, this);
}

function hasLooped(sound){

}

function update(){
    game.physics.arcade.collide(ship, asteroids, null, reflect, this);

    ship.body.velocity.setTo(0, 0);

    if(keymove.left.isDown){
        ship.body.velocity.x = -300;
    } else if(keymove.right.isDown){
        ship.body.velocity.x = 300;
    }

    if(keymove.up.isDown){
        ship.body.velocity.y = -300;
    } else if(keymove.down.isDown){
        ship.body.velocity.y = 300;
    }

    asteroids.forEachAlive(checkBounds, this);

}

function reflect(a, ball){
    //if (ball.y > (ship.y - 25)) return true;
    //else{
    //    ball.body.velocity.y *= -(ball.body.bounce.y);
    //    return false;
    //}
    return false;
}

function checkBounds(ball){
    if(ball.y > 1200 * 5){
        ball.kill();
    }
}

function render() {
}