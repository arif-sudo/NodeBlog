const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const adminRoutes = require('./routes/adminRoutes')
const blogRoutes = require('./routes/blogRoutes')
const authRoutes = require('./routes/authRoutes')
const { requireAuth, checkUser } = require('./middlewares/authMiddleware')

require('dotenv').config()
const app = express();


mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => app.listen(3300))
    .catch((err) => console.error('Error connecting to MongoDB:', err))

app.set('view engine', 'ejs')


app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(cookieParser())

app.get('*', checkUser)

app.get('/', (req, res) => {
    res.redirect('/blog')
})

app.use('/', authRoutes)
app.use('/blog', blogRoutes)
app.use('/admin', requireAuth, adminRoutes)

app.get('/about', (req, res) => {
    res.status(200).render('about', { title: 'Hakkimizda' })
})

app.get('/login', (req, res) => {
    res.render('login', { title: "Login" })
})

app.get('*', (req, res) => {
    res.status(404).render('404', { title: 'Bulunamdi' })
})


app.use((req, res) => {
    res.status(404).render('./views/404.html', { root: __dirname })
})