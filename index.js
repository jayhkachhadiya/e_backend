const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const path = require('path');
const bodyParser = require('body-parser')
const mongoSanitize = require('express-mongo-sanitize')
const { ip, ipv6, mac, default: address } = require('address')
dotenv.config()
const port = process.env.PORT
const DATABASE_URL = process.env.DATABASE_URL

const connectdb = require('./config/connectdb')
const productRoute = require('./routes/product')
const cartRoute = require('./routes/cart')
const reviewRoute = require('./routes/review')
const userRoute = require('./routes/user')

const app = express()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.json())
app.use(mongoSanitize())//$ vali value invelid batave
// app.use(xss()) //html ni under add kro etle db ma j value hoy e no saw thay
app.use(cors())

app.use("/product", productRoute)
app.use("/cart", cartRoute)
app.use("/review", reviewRoute)
app.use("/user", userRoute)

// app.use('/uploads', express.static('uploads'))
app.use('/uploads',express.static(path.join(__dirname,'/uploads')))

app.listen(port, () => {
    ip();
    ipv6();
    address(function (err, addr) {
        console.log(addr.mac);
        console.log(addr.ip);
        console.log(addr.ipv6);
    });
    connectdb(DATABASE_URL)

    console.log(`Example app listening on port ${port}!`)
})