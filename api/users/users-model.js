const db = require('../../data/dbConfig');

function findById(id){
    return db('users').where('users.id', id).first()
}

function findByUsername(username) {
    return db('users').where('username', username).first()
}

async function add(user) {
    const [id] = await db('users').insert(user)
    return findById(id)
}

module.exports = {
    add,
    findByUsername
}