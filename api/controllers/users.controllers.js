const { selectUsers } = require("../models/users.models")

function getUsers(req, res, next){
  return selectUsers()
  .then((users) =>{
    res.status(200).send({users})
  })
}

function getUserById(req, res, next){
  const {username} = req.params

  console.log(username)
  return selectUsers(username)
  .then((user) => {
    res.status(200).send({user: user[0]})
  })
  .catch((err) => next(err))
}

module.exports = {getUsers, getUserById}