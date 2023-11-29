# NodeJs Express Application
## Descriptions:
1. Be a single Nodejs express application.
2. Hardcoded to submit a file named "example.pdf" from a local directory called "Outgoing" to MinIO Server and retrieve the URL of it.
3. Submit the URL to a RabbitMQ on local host as a producer.
4. Receive the URL from RabbitMQ as a consumer.
5. Download the URL from MiniIO and save the file in a local directory called "Incoming"
6. Set a clear Println statements in the code to display what is going on at the console while the application is running and to emphasize these steps mentioned.
   
## Installation:
1. MINIO SERVER : https://min.io/download#/windows <br />
after installation run the following command in window PowerShell

    PS> Invoke-WebRequest -Uri "https://dl.min.io/server/minio/release/windows-amd64/minio.exe" -OutFile "C:\minio.exe" <br/>
    PS> setx MINIO_ROOT_USER admin <br/>
    PS> setx MINIO_ROOT_PASSWORD password <br />
    PS> C:\minio.exe server C:\Data --console-address ":9001"

    Open MinIo Console :

    http://127.0.0.1:9001 <br />

    user: admin <br />
    password:password

* create Bucket "node-express-application"
* generate access key and copy paste the access and secret key to "config.js" file
  
2. Erlang/OTP -> windows installer https://www.erlang.org/downloads
3. RabbitMQ installer https://rabbitmq.com/install-windows.html
   
## API URL 

   POST http://localhost:3000/upload ,<br/>

   Response:
   {
    "statusCode": 200,
    "message": "file uploaded",
    "fileUrl": "http://127.0.0.1:9000/node-express-application/example.pdf"
}


   