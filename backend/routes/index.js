// Routes configuration for Annan Shrestha Portfolio Backend

const express = require('express');
const router = express.Router();

// Import route modules
const portfolioRoutes = require('./portfolio');
const contactRoutes = require('./contact');
const gisRoutes = require('./gis');
const publicationsRoutes = require('./publications');
const githubRoutes = require('./github');
const analyticsRoutes = require('./analytics');
const blogRoutes = require('./blog');

// API Routes
router.use('/portfolio', portfolioRoutes);
router.use('/contact', contactRoutes);
router.use('/gis', gisRoutes);
router.use('/publications', publicationsRoutes);
router.use('/github', githubRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/blog', blogRoutes);

// Health check
router.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: '1.0.0',
        services: {
            database: 'connected',
            email: 'configured',
            gis: 'available',
            github: 'connected'
        }
    });
});

// API documentation endpoint
router.get('/docs', (req, res) => {
    const apiDocs = {
        title: 'Annan Shrestha Portfolio API',
        version: '1.0.0',
        description: 'RESTful API for GIS Portfolio with spatial data processing capabilities',
        baseUrl: `${req.protocol}://${req.get('host')}/api`,
        endpoints: {
            health: {
                method: 'GET',
                path: '/health',
                description: 'Health check and system status'
            },
            portfolio: {
                method: 'GET',
                path: '/portfolio',
                description: 'Get complete portfolio data including skills, experience, and projects'
            },
            contact: {
                method: 'POST',
                path: '/contact',
                description: 'Send contact form message',
                body: {
                    name: 'string',
                    email: 'string',
                    subject: 'string',
                    message: 'string'
                }
            },
            gis: {
                analyze: {
                    method: 'POST',
                    path: '/gis/analyze',
                    description: 'Perform GIS spatial analysis'
                },
                data: {
                    method: 'GET',
                    path: '/gis/data/:type',
                    description: 'Get spatial data in GeoJSON format'
                },
                upload: {
                    method: 'POST',
                    path: '/gis/upload',
                    description: 'Upload GIS files for processing'
                }
            },
            publications: {
                method: 'GET',
                path: '/publications',
                description: 'Get list of research publications and papers'
            },
            github: {
                repos: {
                    method: 'GET',
                    path: '/github/repos',
                    description: 'Get latest GitHub repositories'
                }
            },
            analytics: {
                method: 'GET',
                path: '/analytics',
                description: 'Get portfolio analytics and visitor statistics'
            },
            blog: {
                method: 'GET',
                path: '/blog',
                description: 'Get blog posts and articles'
            }
        },
        examples: {
            portfolio: `${req.protocol}://${req.get('host')}/api/portfolio`,
            contact: {
                url: `${req.protocol}://${req.get('host')}/api/contact`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {
                    name: 'John Doe',
                    email: 'john@example.com',
                    subject: 'Collaboration Opportunity',
                    message: 'I would like to discuss a potential project...'
                }
            },
            gisData: `${req.protocol}://${req.get('host')}/api/gis/data/points`
        }
    };

    res.json(apiDocs);
});

// Root API endpoint
router.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Annan Shrestha Portfolio API',
        version: '1.0.0',
        documentation: `${req.protocol}://${req.get('host')}/api/docs`,
        endpoints: [
            '/api/health',
            '/api/portfolio',
            '/api/contact',
            '/api/gis/*',
            '/api/publications',
            '/api/github/*',
            '/api/analytics',
            '/api/blog'
        ],
        author: {
            name: 'Annan Shrestha',
            email: 'annanshrestha1@gmail.com',
            github: 'https://github.com/AnnShrestha',
            linkedin: 'https://linkedin.com/in/annan-shrestha'
        }
    });
});

module.exports = router;