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
        const content = process.argv.slice(2).join(' ') || 'Send Data' 

        channel.assertExchange(exchange, 'fanout', {
            durable: false
        })

        channel.publish(exchange, '', Buffer.from(content))

        console.log("> Sent %s", content)
    })

    setTimeout(() => {
        connection.close()
        process.exit(0)
    }, 1000)
})