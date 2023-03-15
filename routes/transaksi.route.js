/** load library express */
const express = require(`express`)
/** initiate object that instance of express */
const app = express()
let authorization = require(`../middlewares/authorization`)
/** allow to read 'request' with json type */
app.use(express.json())

/** load transaksi's controller */
const transaksiController =
require(`../controllers/transaksi.controller.js`)

/** create route to add new transaksi book */
app.post("/",[authorization.authorization], transaksiController.addTransaksi)
/** create route to update transaksi book based on ID */
app.put("/update/:id",[authorization.authorization], transaksiController.updateTransaksi)
/** create toute to delete transaksi book based on ID */
app.delete("/:id",[authorization.authorization], transaksiController.deleteTransaksi)
/** create route to get all transaksi book */
app.get("/",[authorization.authorization], transaksiController.getTransaksi)
/** export app in order to load in another file */
app.post("/date", [authorization.authorization],transaksiController.filterTransaksi)
// filter by date

module.exports = app
