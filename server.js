let express = require('express')

const app = express()

app.get('/a', (req, res) => {
  console.log('test1')
  res.status(200).json({path:'/a', msg: 12345, errorCode1: false})
})
app.get('/b', (req, res) => {
  res.status(401).json({path:'/b', msg: 12345, errorCode1: false})
})
app.get('/c', (req, res) => {
  res.status(200).json({path:'/c', msg: 12345, errorCode1: 1})
})

app.listen(3000, () => {
  console.log('server on: 3000')
})