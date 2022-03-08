const amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', (error, connection) => {
    if(error){
        console.log(error)
    }

    connection.createChannel((error, channel) => {
        if(error){
            console.log(error)
        }

        let queue = 'rpc_queue'
        channel.assertQueue(queue, {
            durable: false
        })

        channel.prefetch(1)
        console.log('> Awaiting RPC requests')

        channel.consume(queue, (data) => {
            let n = parseInt(data.content.toString())
            console.log("> [.] fib(%d)", n)

            let r = fibonacci(n)

            channel.sendToQueue(data.properties.replyTo, Buffer.from(r.toString()), {
                correlationId: data.properties.correlationId
            })

            channel.ack(data)
        })
    })
})

const fibonacci = (n) => {
    if (n == 0 || n == 1)
        return n
    else
        return fibonacci(n - 1) + fibonacci(n - 2)
}