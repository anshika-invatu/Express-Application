const express = require('express');
const amqp = require('amqplib');
const fs = require('fs');

const {rabbitMQConfig,minioClient} = require('./config/config')
const app = express();
const port = 3000;

// Middleware to parse JSON and handle file uploads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route to upload "example.pdf" to MinIO
app.post('/upload', async (req, res) => {
    try {
      const filePath = 'Outgoing/example.pdf'; // Hardcoded file path
  
      // Upload file to MinIO
      await minioClient.fPutObject('node-express-application', 'example.pdf', filePath, {}, (err, etag) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error uploading file to MinIO.');
        }
  
        // Generate URL for the uploaded file
        const fileUrl = minioClient.protocol + '//' + minioClient.host + ':' + minioClient.port + '/' + 'node-express-application' + '/' + 'example.pdf';
        console.log("Document Uploaded");
        publishToRabbitMQ(fileUrl);
        //consumeFromRabbitMQ();

        res.status(200).json({ statusCode:200,message:"file uploaded", fileUrl });
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });


  // RabbitMQ Publisher function
async function publishToRabbitMQ(fileUrl) {
    try {
      const connection = await amqp.connect(rabbitMQConfig);
      const channel = await connection.createChannel();
      const queueName = 'file_url_queue';
  
      // Ensure the queue exists
      await channel.assertQueue(queueName, { durable: false });
  
      // Publish the file URL to the queue
      channel.sendToQueue(queueName, Buffer.from(fileUrl));
      console.log(`[RabbitMQ] Sent file URL: ${fileUrl}`);
  
      // Close the connection and channel
      await channel.close();
      await connection.close();
    } catch (error) {
      console.error('[RabbitMQ] Error:', error.message);
    }
  }

  // RabbitMQ Consumer function
async function consumeFromRabbitMQ() {
    try {
      const connection = await amqp.connect(rabbitMQConfig);
      const channel = await connection.createChannel();
      const queueName = 'file_url_queue';
  
      // Ensure the queue exists
      await channel.assertQueue(queueName, { durable: false });
  
      console.log('[RabbitMQ] Waiting for messages. To exit press CTRL+C');
  
      // Consume messages from the queue
      channel.consume(queueName, async (msg) => {
        if (msg.content) {
          const fileUrl = msg.content.toString();
          console.log(`[RabbitMQ] Received file URL: ${fileUrl}`);
            try{
                // Download file from MinIO
                const downloadPath = 'Incoming/example_downloaded.pdf';
                //const stream = await minioClient.fGetObject('node-express-application', 'example.pdf', downloadPath);
                await minioClient.fGetObject('node-express-application', 'example.pdf', downloadPath,(err,stream)=>{
                  if(err){
                    console.log("error",err)
                  }
                  else {
                    console.log('File Downloaded');
                   }
                });
          
            }catch(error){
                console.error('[MinIO] Error:', error.message);
                console.error('[MinIO] Detailed Error:', error);
            }
          
        }
      }, { noAck: true });
    } catch (error) {
      console.error('[RabbitMQ] Error:', error.message);
    }
  }

// Start the RabbitMQ consumer
consumeFromRabbitMQ();

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
