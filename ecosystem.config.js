module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // First application
    {
      name      : 'Bhamashah',
      script    : './bin/www',
      watch: true,
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_stagging: {
        NODE_ENV: 'staggingDB'
      },
      env_production: {
        NODE_ENV: 'productionDB'
      },
      env_local: {
        NODE_ENV: 'default'
      }
    },
  ],

 
};
