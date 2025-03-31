module.exports = {
    apps: [
        {
            name: 'dfs',
            script: './app.js',
            instances: 1,
            autorestart: true,
            watch: process.env.NODE_ENV === 'production' ? false : true,
            log_date_format: 'YYYY-MM-DD HH:mm:ss',
            exec_mode: 'cluster',
            max_memory_restart: '1G',
        }
    ]
}
