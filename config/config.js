const Minio = require('minio');


// MinIO configuration
const minioClient = new Minio.Client({
    endPoint: '127.0.0.1', 
    port: 9000,
    useSSL: false,
    accessKey: 'EXB1YH3N5ImKTFXqRTnQ', 
    secretKey: 'PJDNke6JYv5VtFQqvTHYdo9pbzKt6i15LgWhmUQV',
  });

// RabbitMQ configuration
const rabbitMQConfigs = {
    protocol: 'amqp',
    hostname: 'localhost',
    port: 5672,
    username: 'guest',
    password: 'guest',
    vhost: '/',
  };

module.exports ={
    rabbitMQConfigs,
    minioClient,
}