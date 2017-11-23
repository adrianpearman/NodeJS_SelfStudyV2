let env = process.env.NODE_ENV || 'development';
//--- SETS UP DEVELOPMENT VS TEST DATABASES ---///

if (env === 'development' || env === 'test') {
  let config = require('./config.json')
  let envConfig = config[env]

  // console.log(envConfig);
  // console.log(Object.keys(envConfig));

  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key]
  })
}
