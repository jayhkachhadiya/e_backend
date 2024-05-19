const mongoose = require('mongoose')
const connectdb = async (DATABASE_URL) => {
    try {
        const dbName = {
            DBNAME: "e_commarce"
        }
        await mongoose.connect(DATABASE_URL, dbName)
        console.log("connected")
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectdb