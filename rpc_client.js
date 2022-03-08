const amqp = require('amqplib/callback_api')

let args = process.argv.slice(2)

if (args.length == 0) {
    console.log("Usage: rpc_client.js num")
    process.exit(1)
}

amqp.connect('amqp://localhost', (error, connection) => {
    if(error){
        console.log(error)
    }

    connection.createChannel((error, channel) => {
        if(error){
            console.log(error)
        }

        channel.assertQueue('', {
            exclusive: true
        }, (error, q) => {
            if(error){
                console.log(error)
            }

            let correlationId  = generateUuid()
            let num = parseInt(args[0])
            let queue = 'rpc_queue'

            console.log('> Requesting fib(%d)', num)

            channel.consume(q.queue, (data) => {
                if(data.properties.correlationId == correlationId){
                    console.log('> [.] Got %s', data.content.toString())

                    setTimeout(() => {
                        connection.close()
                        process.exit(0)
                    }, 1000);
                }
            }, {
                noAck: true
            })

            channel.sendToQueue(queue, Buffer.from(num.toString()), {
                correlationId: correlationId,
                replyTo: q.queue
            })
        })
    })
})

const generateUuid = () => {
    return Math.random().toString() +
         Math.random().toString() +
         Math.random().toString()
}