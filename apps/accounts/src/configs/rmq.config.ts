import { ConfigService } from "@nestjs/config";
import { IRMQServiceAsyncOptions } from "nestjs-rmq";

export const getRmqConfig = (): IRMQServiceAsyncOptions => ({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    return {
      exchangeName: configService.get('AMQP_EXCHANGE'),
      connections: [
        {
          host: configService.get('AMQP_HOST'),
          login: configService.get('AMQP_LOGIN'),
          password: configService.get('AMQP_PASSWORD'),
        }
      ],
      queueName: configService.get('AMQP_QUEUE'),
      prefetchCount: 33,
      serviceName: 'accounts'
    };
  }

});
