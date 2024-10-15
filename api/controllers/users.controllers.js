const { selectUsers } = require("../models/users.models")

function getUsers(req, res, next){
  return selectUsers()
  .then((users) =>{
    res.status(200).send({users})
  })
}

module.exports = {getUsers}