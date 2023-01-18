const cluster = require('cluster')
const os = require('os')
const http = require('http')
const numCPUs = os.cpus().length

if(cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`)

    // Fork workers
    for(let i = 0; i < numCPUs -1; i++) {
        cluster.fork()
        // const workers = Array.from({ ...cluster.workers, length: i })
        // console.log(workers.length)
    }

    for (const id in cluster.workers) {
        cluster.workers[id].on("message", (message) => {
            console.log(`process id ${id} said : ${message}`)
        })
    }
} else {
    console.log(`Worker ${process.pid} started`)

    http.createServer((req, res) => {
        process.send("I'll process.")
        
        res.writeHead(200);
        res.end("Hello world!\n" + process.pid.toString())
        // res.end(process.pid.toString())
    }).listen(3000)
}
