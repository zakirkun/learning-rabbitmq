const amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', (error, connection) => {
    if(error){
        console.log(error)
    }

    connection.createChannel((error, channel) => {
        if(error){
            console.log(error)
        }

        let exchange = 'logs_event'

        channel.assertExchange(exchange, 'fanout', {
            durable: false
        })

        channel.assertQueue('', {
            exclusive: true, 
        }, (error, q) => {
            if(error){
                console.log(error)
            }

            console.log("> Waiting for messages in %s. To exit press CTRL+C", q.queue)
            channel.bindQueue(q.queue, exchange, '')

            channel.consume(q.queue, (data) => {
                console.log("> %s", data.content.toString())
            }, {
                noAck: true
            })
        })
    })
})