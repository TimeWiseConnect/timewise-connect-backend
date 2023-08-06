import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import * as fs from 'fs'

const start = async () => {
    try {
        const PORT = process.env.PORT || 5000
        const httpsOptions = {
            key: fs.readFileSync('./secrets/private-key.pem'),
            cert: fs.readFileSync('./secrets/public-certificate.pem'),
        }
        const app = await NestFactory.create(AppModule, {
            httpsOptions,
        })
        app.enableCors()
        const config = new DocumentBuilder()
            .setTitle('TimeWise Connect')
            .setDescription('REST API documentation')
            .setVersion('1.0.0')
            .addTag('awqsomee')
            .build()
        const document = SwaggerModule.createDocument(app, config)
        SwaggerModule.setup('/api/docs', app, document)

        await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()
