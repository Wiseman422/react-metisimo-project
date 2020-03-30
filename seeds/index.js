
require("babel-register");

var config = require('../config');
require('met-data').config(config);

// All the below seeds will be applied in the specified order
require('./20170307_add_subscription_plans')
.then(() => console.log("All seeds applied."))
.catch((err) => console.log("Error while applying the seeds"));

