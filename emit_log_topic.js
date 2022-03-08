const amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', (error, connection) => {
    if(error){
        console.log(error)
    }

    connection.createChannel((error, channel) => {
        if(error){
            console.log(error)
        }

        let exchange = 'topic_logs'
        let args = process.argv.slice(2)
        let key = (args.length > 0) ? args[0] : 'global.info'
        const content = args.splice(1).join(' ') || 'Send Data'

        channel.assertExchange(exchange, 'topic', {
            durable: false
        })

        channel.publish(exchange, key, Buffer.from(content))
        console.log(" [x] Sent %s:'%s'", key, content)
    })

    setTimeout(() => {
        connection.close()
        process.exit(0)
    }, 500)
})