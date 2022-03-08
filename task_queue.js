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
        let content = process.argv.slice(2).join(' ') || "Send Queue"

        channel.assertQueue(queue, {
            durable: true
        })

        channel.sendToQueue(queue, Buffer.from(content), {
            persistent: true
        })

        console.log("> Sent '%s'", content)
    })

    setTimeout(() => {
        connection.close()
        process.exit(0)
    }, 1000)
})