const amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', (error, connection) => {
    if(error){
        console.log(error)
    }

    connection.createChannel((error, channel) => {
        if(error){
            console.log(error)
        }

        let queue = 'sendmail'
        channel.assertQueue(queue, {
            durable: false
        })

        console.log("> Waiting for messages in %s. To exit press CTRL+C", queue)

        channel.consume(queue, (data) => {
            console.log("> Received %s", data.content.toString())
        }, {
            noAck: true
        })
    })
})