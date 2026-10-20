
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ObserveModule } from "./observe.js";
import { PrismaModule } from "./database/prisma.module.js";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ObserveModule.forRoot({
      appKey: process.env.OBSERVE_APP_KEY!,
      appSecret: process.env.OBSERVE_APP_SECRET!,
      serviceId: "pharmix",
    }),
    PrismaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
