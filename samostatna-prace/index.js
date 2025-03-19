import http from 'http'
import fs from "fs/promises";

const port = 3000

const server = http.createServer(async (req, res) => {
    const data = await fs.readFile('index.html');//first task

    try {
        const fileName = req.url === '/' ? 'index.html' : 'public' + req.url
        const data = await fs.readFile(fileName, 'utf8')

        res.statusCode = 200 // OK
        res.setHeader('Content-Type', 'text/html')
        res.write(data)
    } catch (error) {
        res.statusCode = 404
        res.write('Not Found')
    }
    finally {
        res.end()
    }


})

server.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})