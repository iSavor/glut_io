var socket = io.connect('http://localhost:8080');

socket.on('update', function(data){
	consumer.enqueue(new msg('update', data));
	var msg = consumer.dequeue();
	consumer_handlers[msg.key](msg.data);
});