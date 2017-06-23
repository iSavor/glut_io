var socket = io.connect('http://localhost:8080');

socket.on('update', function(data){
	consumer.enqueue(new msg('update', data));
	var item = consumer.dequeue();
	consumer_handlers[item.key](item.data);
});

socket.on('loadComplete', function(){
    consumer.enqueue(new msg('loadComplete'));
    var item = consumer.dequeue();
    consumer_handlers[item.key](item.data);
});