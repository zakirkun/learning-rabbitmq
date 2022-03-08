const amqp = require('amqplib/callback_api')

const args = process.argv.slice(2)

if (args.length == 0) {
    console.log("Usage: receive_logs_direct.js [info] [warning] [error]");
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

        let exchange = 'direct_logs'

        channel.assertExchange(exchange, 'direct', {
            durable: false
        })

        channel.assertQueue('', {
            exclusive: true
        }, (error, q) => {
            if(error){
                console.log(error)
            }

            console.log('> Waiting for logs. To exit press CTRL+C')

            args?.map((severity) => {
                channel.bindQueue(q.queue, exchange, severity)
            })

            channel.consume(q.queue, (data) => {
                console.log("> %s: '%s'", data.fields.routingKey, data.content.toString())
            }, {
                noAck: true
            })
        })
    })
})