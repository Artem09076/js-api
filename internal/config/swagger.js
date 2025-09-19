const YAML = require("yamljs")
const path = require("path")

const swaggerDocument = YAML.load('./docs/swagger.yaml')

module.exports = swaggerDocument