export const swaggerDocument = {
    openapi: '3.0.1',
    info: {
        version: '1.0.0',
        title: 'APIs Document',
    },
    paths: {
        '/register': {
            post: {
                tags: ['User'],
                parameters: [
                    {
                        name: 'Email',
                        schema: {
                            type: 'string',
                        },
                        required: true,
                    },
                    {
                        name: 'Password',
                        schema: {
                            type: 'string',
                        },
                        required: true,
                    }
                ],
                produces: [
                    'application/json'
                ],
                responses: {
                    '200': {
                        description: 'Success',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/User'
                                }
                            }
                        }
                    },
                    '400': {
                        description: 'Missing parameters',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/HttpException'
                                },
                                example: {
                                    message: 'Invalid Email or Password',
                                    statusCode: '400'
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    components: {
        schemas: {},
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        },
        User: {
            required: [
                'email',
                'password'
            ],
            properties: {
                firstName: {
                    type: 'string',
                },
                lastName: {
                    type: 'string',
                },
                email: {
                    type: 'string',
                },
                company: {
                    type: 'string',
                },
                password: {
                    type: 'string',
                },
                phone: {
                    type: 'string'
                },
                role: {
                    type: 'object'
                }
            }
        },
        HttpException: {
            properties: {
                message: {
                    type: 'string'
                },
                statusCode: {
                    type: 'number'
                }
            }
        }
    }
};
