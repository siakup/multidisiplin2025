import { NextResponse } from 'next/server';
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Electricity Bills API',
      version: '1.0.0',
      description: 'API Documentation untuk sistem manajemen tagihan listrik',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Masukkan JWT token yang didapat dari endpoint login',
        },
      },
    },
  },
  apis: ['./src/app/api/**/*.ts'], // Path ke API routes
};

export async function GET() {
  try {
    const swaggerSpec = swaggerJsdoc(options);
    return NextResponse.json(swaggerSpec);
  } catch (error) {
    console.error('Error generating Swagger spec:', error);
    return NextResponse.json(
      { error: 'Failed to generate API documentation' },
      { status: 500 }
    );
  }
}
