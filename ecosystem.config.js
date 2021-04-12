module.exports = {
  apps: [{
    name: 'backend-api',
    script: './src/server.js',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
}
