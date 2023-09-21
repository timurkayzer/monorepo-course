import { ConfigService } from "@nestjs/config";
import { IRMQServiceOptions } from "nestjs-rmq";

export const getRmqConfig = (): any => ({
  inject: [ConfigService],
  useFactory: (configService: ConfigService): IRMQServiceOptions => {
    return {
      exchangeName: <string>configService.get('AMQP_EXCHANGE'),
      connections: [
        {
          host: <string>configService.get('AMQP_HOST'),
          login: <string>configService.get('AMQP_LOGIN'),
          password: <string>configService.get('AMQP_PASSWORD'),
        }
      ],
      queueName: <string>configService.get('AMQP_QUEUE'),
      prefetchCount: 33,
      serviceName: 'accounts'
    };
  }

});
