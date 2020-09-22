require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const dataSet = require('./movies.data.json')
const cors = require('cors')
const helmet = require('helmet')

const app = express();

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.headers.authorization
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
      return res.status(401).json({ error: 'Unauthorized request' })
    }
    next()
  })

// app.use(morgan('dev'))
const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting))
app.use(cors())
app.use(helmet())

app.get('/movie', (req, res) => {
    const { genre, country, avg_vote } = req.query
    // console.log(genre, country, avg_vote);
    let filteredMovies = dataSet
    if(genre) {
        filteredMovies = filteredMovies.filter(movie => {
            return movie.genre.toLowerCase().includes(genre.toLowerCase())
        })
    }
    if(country) {
        filteredMovies = filteredMovies.filter(movie => {
            return movie.country.toLowerCase().includes(country.toLowerCase())
        })
    }
    if(avg_vote) {
        filteredMovies = filteredMovies.filter(movie => {
            return movie.avg_vote >= avg_vote;
        })
    }



    res.json(filteredMovies);
})

// 4 parameters in middleware, express knows to treat this as error handler
app.use((error, req, res, next) => {
    let response
    if (process.env.NODE_ENV === 'production') {
      response = { error: { message: 'server error' }}
    } else {
      response = { error }
    }
    res.status(500).json(response)
  })



const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log("Listening to port " + PORT);
})