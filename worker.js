const amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', (error, connection) => {
    if(error){
        console.log(error)
    }

    connection.createChannel((error, channel) => {
        if(error){
            console.log(error)
        }

        let queue = 'task_queue'

        channel.assertQueue(queue, {
            durable: true
        })

        channel.prefetch(1)
        console.log("> Waiting for messages in %s. To exit press CTRL+C", queue)

        channel.consume(queue, (data) => {
            let count = data.content.toString().split('.').length - 1
            console.log("> Received %s", data.content.toString())

            setTimeout(() => {
                console.log("> Done")
                channel.ack(data)
            }, count * 100)
        }, {
            noAck: false
        })
    })
})