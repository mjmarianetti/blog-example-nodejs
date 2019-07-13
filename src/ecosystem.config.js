module.exports = {
    apps : [
      {
        name: 'blog',
        script: 'server.js',
        instances: 'max',
        autorestart: true,
        watch: /dev/i.test(process.env.NODE_ENV || 'dev'),
        max_memory_restart: '1G'
      }
    ]
  };
  