import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

class SwaggerMiddleware {
    constructor() {
        this.swaggerDocument = YAML.load('./openapi.yaml');
    }

    middleware() {
        return [swaggerUi.serve, swaggerUi.setup(this.swaggerDocument)];
    }
}

export default SwaggerMiddleware;