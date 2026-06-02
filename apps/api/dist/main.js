"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const logger = new common_1.Logger("Bootstrap");
    app.setGlobalPrefix("api");
    app.enableCors({
        origin: ["http://localhost:3000", "http://localhost:3009"],
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
    });
    const port = process.env.PORT || 3010;
    await app.listen(port);
    logger.log(`Perception Mapper AI NestJS Core API running on: http://localhost:${port}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map