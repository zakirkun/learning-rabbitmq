const amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', (error, connection) => {
    if(error){
        console.log(error)
    }

    connection.createChannel((error, channel) => {
        if(error){
            console.log(error)
        }

        let exchange = 'direct_logs'
        let args = process.argv.slice(2)
        let content = args.slice(1).join(' ') || 'Send Data'
        let severity = (args.length > 0) ? args[0] : 'info'
        
        channel.assertExchange(exchange, 'direct', {
            durable: false
        })

        channel.publish(exchange, severity, Buffer.from(content))
        console.log("> Sent %s: '%s'", severity, content)
    })

    setTimeout(() => {
        connection.close()
        process.exit(0)
    }, 500)
})