var socket = io.connect('http://localhost:8080');

socket.on('update', function(data){
    players = data.player;
    food = data.food;
    //console.log(food);
	//consumer.enqueue(new msg('update', data));
});

socket.on('loadComplete', function(data){
    signals.loadComplete = true;
    my_id = data;
    //consumer.enqueue(new msg('loadComplete', data));
});

socket.on('gameOver', function(){
    signals.over = true;
    //consumer.enqueue(new msg('gameOver'));
});

socket.on('leave', function(data){
    sprites[data].destroy();
    delete sprites[data];
    //consumer.enqueue(new msg('leave', data));
})