const amqp = require('amqplib/callback_api')

const args = process.argv.slice(2)

if (args.length == 0) {
    console.log("Usage: receive_logs_topic.js <facility>.<severity>");
    process.exit(1);
}

amqp.connect('amqp://localhost', (error, connection) => {
    if(error){
        console.log(error)
    }

    connection.createChannel((error, channel) => {
        if(error){
            console.log(error)
        }

        let exchange = 'topic_logs'

        channel.assertExchange(exchange, 'topic', {
            durable: false
        })

        channel.assertQueue('', {
            exclusive: true
        }, (error, q) => {
            if(error){
                console.log(error)
            }

            console.log('> Waiting for logs. To exit press CTRL+C')
            
            args?.map((key) => {
                channel.bindQueue(q.queue, exchange, key)
            })

            channel.consume(q.queue, (data) => {
                console.log(" [x] %s:'%s'", data.fields.routingKey, data.content.toString())
            }, {
                noAck: true
            })
        })
    })
})