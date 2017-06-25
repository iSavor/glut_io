var socket = io.connect('http://localhost:8080');

socket.on('update', function(data){
	consumer.enqueue(new msg('update', data));
});

socket.on('loadComplete', function(){
    consumer.enqueue(new msg('loadComplete'));
});

socket.on('gameOver', function(){
    consumer.enqueue(new msg('gameOver'));
});

socket.on('leave', function(data){
    consumer.enqueue(new msg('leave', data));
})