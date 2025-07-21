module.exports = {
    apps: [
        {
            name: 'dfs',
            script: './app.js',
            instances: process.env.NODE_ENV !== 'production' ? 1 : 'max', // 根据CPU核心数自动扩展
            exec_mode: 'cluster',
            autorestart: true,
            watch: process.env.NODE_ENV !== 'production', // 非生产环境启用watch
            ignore_watch: ['node_modules', 'logs', 'public'], // 忽略不需要监听的目录
            max_memory_restart: '2G', // 更保守的内存限制
            min_uptime: '10s', // 最小正常运行时间
            max_restarts: 10, // 最大重启次数
            restart_delay: 5000, // 重启延迟
            
            // 日志配置
            log_date_format: 'YYYY-MM-DD HH:mm:ss',
            out_file: './logs/out.log',
            error_file: './logs/error.log',
            combine_logs: false, // 分离日志
            
            // 环境变量
            env: {
                NODE_ENV: 'development',
                PORT: 3000
            },
            env_production: {
                NODE_ENV: 'production',
                PORT: 3000
            },
            
            // 健康检查
            listen_timeout: 8000,
            kill_timeout: 5000,
            wait_ready: true,
        }
    ]
}