/** load library express */
const express = require(`express`)
/** initiate object that instance of express */
const app = express()
let authorization = require(`../middlewares/authorization`)
/** allow to read 'request' with json type */
app.use(express.json())
/** load menu's controller */
const menuController = require(`../controllers/menu.controller`)
const upload = require(`../controllers/upload-image`)


/** create route to get data with method "GET" */
app.get("/",[authorization.authorization], menuController.getAllMenu)

app.get("/:id_menu",[authorization.authorization], menuController.getOneMenu)

/** create route to find menu
* using method "POST" and path "find" */
app.post("/find",[authorization.authorization], menuController.findMenu)

app.post("/add",[authorization.authorization], menuController.addMenu)

/** create route to update menu
* using method "PUT"
* and define parameter for "id" */
app.put("/:id_menu",[authorization.authorization], menuController.updateMenu)

/** create route to delete menu
* using method "DELETE" and define parameter for "id" */
app.delete("/:id_menu",[authorization.authorization], menuController.deleteMenu)

/** export app in order to load in another file */
module.exports = app




