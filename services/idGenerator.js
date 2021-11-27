const { v4 } = require('uuid')

class IdGenerator {
    generate() {
        return v4()
    }
}

module.exports = IdGenerator