import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModuleAsyncOptions } from "@nestjs/mongoose";

export function getMongoConfig(): MongooseModuleAsyncOptions {
  return {
    useFactory: (configService: ConfigService) => {
      return {
        uri: configService.get("MONGO_URI")
      };
    },
    inject: [ConfigService],
    imports: [ConfigModule]
  };
}
