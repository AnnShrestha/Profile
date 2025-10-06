// Backend Server for Annan Shrestha Portfolio
// Node.js + Express.js server with GIS data processing capabilities

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://fonts.googleapis.com"],
            scriptSrc: ["'self'", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "https:", "http:"],
            connectSrc: ["'self'", "https://api.github.com"]
        }
    }
}));

app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://annan-shrestha.github.io', 'https://your-domain.com']
        : ['http://localhost:3000', 'http://127.0.0.1:5500'],
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later.'
    }
});

const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // limit each IP to 5 contact form submissions per hour
    message: {
        error: 'Too many contact form submissions, please try again later.'
    }
});

app.use(limiter);

// File upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|shp|kml|geojson/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only images, documents, and GIS files are allowed.'));
        }
    }
});

// Email configuration
const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: '1.0.0'
    });
});

// Get portfolio data
app.get('/api/portfolio', async (req, res) => {
    try {
        const portfolioData = {
            name: 'Annan Shrestha',
            title: 'GIS Specialist & Web Developer',
            location: 'Worcester, MA',
            email: 'annanshrestha1@gmail.com',
            phone: '+1-781-750-9053',
            education: {
                current: 'MS in Geographic Information Science - Clark University (2024-2026)',
                previous: 'MS in Environmental Science - Tribhuvan University, Nepal'
            },
            skills: {
                frontend: [
                    { name: 'HTML5 & CSS3', level: 90 },
                    { name: 'JavaScript & ES6+', level: 85 },
                    { name: 'React.js', level: 80 },
                    { name: 'Web Mapping (Leaflet, MapboxGL)', level: 88 },
                    { name: 'Data Visualization (D3.js, Chart.js)', level: 85 },
                    { name: 'Bootstrap & Responsive Design', level: 90 }
                ],
                backend: [
                    { name: 'Python Programming', level: 92 },
                    { name: 'Node.js & Express', level: 78 },
                    { name: 'GIS Software (ArcGIS Pro/Desktop, QGIS)', level: 95 },
                    { name: 'Spatial Databases (PostGIS, SpatiaLite)', level: 82 },
                    { name: 'Remote Sensing & Image Analysis', level: 88 },
                    { name: 'Statistical Analysis (R, SPSS)', level: 85 }
                ]
            },
            experience: [
                {
                    position: 'Research Assistant',
                    company: "Clark's Center for Geospatial Analytics",
                    period: '2025 - Present',
                    responsibilities: [
                        'Updated land use for mapping the conversion of coastal habitats to shrimp aquaculture',
                        'Developed comprehensive maps reflecting land changes from 1999 to 2024 due to shrimp farming across Indonesia, Thailand, Vietnam, Myanmar, and Ecuador'
                    ]
                },
                {
                    position: 'GIS and Remote Sensing Analyst',
                    company: 'Environment and Engineering Research Center Pvt. Ltd',
                    period: '2019 - 2024',
                    responsibilities: [
                        'Gathered geospatial data from various sources and maintained geodatabase integrity',
                        'Provided technical support and training to users of GIS and remote sensing software',
                        'Led GIS and remote sensing projects from planning to execution',
                        'Created high-quality maps and visual representations of geospatial data'
                    ]
                }
            ],
            projects: [
                {
                    name: 'Soil Erosion Mapping',
                    description: 'Analyzed soil erosion rate of districts in Bagmati Province using RUSLE Method',
                    technologies: ['GIS Analysis', 'RUSLE', 'Environmental'],
                    github: 'https://github.com/AnnShrestha/Soil_erosion_Bagmati-Province'
                },
                {
                    name: 'African Elephant Habitat Modeling',
                    description: 'Modeled habitat preferences in Tarangire National Park using GPS collar data',
                    technologies: ['Spatial Analysis', 'Wildlife', 'GPS Data'],
                    github: 'https://github.com/AnnShrestha/Habitat_Suitability'
                },
                {
                    name: 'Flood/Overland Flow Modeling',
                    description: 'Created flood hazard maps for West Rapti Basin and identified vulnerable communities',
                    technologies: ['Hydrology', 'Risk Assessment', 'Modeling'],
                    github: 'https://github.com/AnnShrestha/Flood_overland_FLow_Modelling'
                }
            ]
        };

        res.json(portfolioData);
    } catch (error) {
        console.error('Error fetching portfolio data:', error);
        res.status(500).json({ error: 'Failed to fetch portfolio data' });
    }
});

// Contact form submission
app.post('/api/contact', contactLimiter, async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                error: 'All fields are required'
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                error: 'Please provide a valid email address'
            });
        }

        // Prepare email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'annanshrestha1@gmail.com',
            subject: `Portfolio Contact: ${subject}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <h3>Message:</h3>
                <p>${message.replace(/\n/g, '<br>')}</p>
                
                <hr>
                <p><small>This message was sent from your portfolio contact form.</small></p>
            `,
            replyTo: email
        };

        // Send email
        await transporter.sendMail(mailOptions);

        // Log the contact attempt
        console.log(`Contact form submitted by ${name} (${email}) at ${new Date().toISOString()}`);

        res.json({
            success: true,
            message: 'Message sent successfully! I will get back to you soon.'
        });

    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            error: 'Failed to send message. Please try again later.'
        });
    }
});

// GitHub integration - fetch latest repositories
app.get('/api/github/repos', async (req, res) => {
    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch('https://api.github.com/users/AnnShrestha/repos?sort=updated&per_page=10');
        const repos = await response.json();
        
        const formattedRepos = repos.map(repo => ({
            name: repo.name,
            description: repo.description,
            html_url: repo.html_url,
            updated_at: repo.updated_at,
            language: repo.language,
            stargazers_count: repo.stargazers_count,
            forks_count: repo.forks_count
        }));

        res.json(formattedRepos);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch GitHub repositories' });
    }
});

// File upload endpoint for GIS data
app.post('/api/upload/gis', upload.single('gisFile'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const fileInfo = {
            filename: req.file.filename,
            originalName: req.file.originalname,
            size: req.file.size,
            mimetype: req.file.mimetype,
            uploadDate: new Date().toISOString(),
            path: req.file.path
        };

        console.log('GIS file uploaded:', fileInfo);

        res.json({
            success: true,
            message: 'File uploaded successfully',
            file: fileInfo
        });

    } catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({ error: 'File upload failed' });
    }
});

// GIS data processing endpoints
app.post('/api/gis/analyze', (req, res) => {
    try {
        const { dataType, analysisType, parameters } = req.body;

        // Simulate GIS analysis processing
        const analysisResult = {
            id: Date.now().toString(),
            dataType,
            analysisType,
            parameters,
            status: 'completed',
            results: {
                area: 1234.56,
                perimeter: 789.12,
                centroid: { x: -71.8023, y: 42.2619 }, // Worcester, MA coordinates
                metadata: {
                    crs: 'EPSG:4326',
                    units: 'degrees',
                    processedAt: new Date().toISOString()
                }
            }
        };

        res.json(analysisResult);

    } catch (error) {
        console.error('GIS analysis error:', error);
        res.status(500).json({ error: 'GIS analysis failed' });
    }
});

// Get spatial data in GeoJSON format
app.get('/api/gis/data/:type', (req, res) => {
    try {
        const { type } = req.params;
        
        // Sample GeoJSON data for different types
        const sampleData = {
            points: {
                type: "FeatureCollection",
                features: [
                    {
                        type: "Feature",
                        properties: {
                            name: "Clark University",
                            type: "Educational Institution"
                        },
                        geometry: {
                            type: "Point",
                            coordinates: [-71.825, 42.251]
                        }
                    }
                ]
            },
            polygons: {
                type: "FeatureCollection",
                features: [
                    {
                        type: "Feature",
                        properties: {
                            name: "Worcester County",
                            population: 830000
                        },
                        geometry: {
                            type: "Polygon",
                            coordinates: [[
                                [-71.9, 42.1],
                                [-71.7, 42.1],
                                [-71.7, 42.4],
                                [-71.9, 42.4],
                                [-71.9, 42.1]
                            ]]
                        }
                    }
                ]
            }
        };

        const data = sampleData[type] || sampleData.points;
        res.json(data);

    } catch (error) {
        console.error('Spatial data error:', error);
        res.status(500).json({ error: 'Failed to fetch spatial data' });
    }
});

// Publications endpoint
app.get('/api/publications', (req, res) => {
    try {
        const publications = [
            {
                id: 1,
                title: "Spatial Analysis of Land Use Change and Its Impact on Soil Erosion in Bagmati Province, Nepal",
                authors: ["A. Shrestha", "B. Sharma", "C. Poudel"],
                journal: "Journal of Environmental Geography",
                status: "Under Review",
                year: 2024,
                abstract: "This study examines the relationship between land use changes and soil erosion rates using RUSLE methodology and remote sensing data across multiple districts in Bagmati Province.",
                keywords: ["land use change", "soil erosion", "RUSLE", "remote sensing", "Nepal"]
            },
            {
                id: 2,
                title: "Multi-hazard Risk Assessment Using GIS: A Case Study of Sindhupalchowk District",
                authors: ["A. Shrestha", "D. Maharjan"],
                journal: "International Journal of Disaster Risk Reduction",
                status: "In Preparation",
                year: 2024,
                abstract: "Comprehensive analysis of multiple natural hazards including landslides, floods, and earthquakes using spatial modeling techniques.",
                keywords: ["multi-hazard", "risk assessment", "GIS", "spatial modeling", "disaster management"]
            },
            {
                id: 3,
                title: "Habitat Suitability Modeling for African Elephants Using Remote Sensing and GPS Collar Data",
                authors: ["A. Shrestha", "J. Smith", "M. Johnson"],
                journal: "Remote Sensing in Ecology and Conservation",
                status: "Draft",
                year: 2024,
                abstract: "Application of MaxEnt modeling and satellite imagery to predict suitable habitat areas for African elephants in Tarangire National Park.",
                keywords: ["habitat modeling", "MaxEnt", "wildlife conservation", "remote sensing", "GPS tracking"]
            }
        ];

        res.json(publications);

    } catch (error) {
        console.error('Publications error:', error);
        res.status(500).json({ error: 'Failed to fetch publications' });
    }
});

// Analytics endpoint
app.get('/api/analytics', (req, res) => {
    try {
        const analytics = {
            totalVisitors: 1250,
            monthlyVisitors: 340,
            projectViews: 890,
            contactForms: 45,
            topPages: [
                { page: '/projects', views: 450 },
                { page: '/about', views: 320 },
                { page: '/skills', views: 280 },
                { page: '/contact', views: 200 }
            ],
            referrers: [
                { source: 'GitHub', visits: 380 },
                { source: 'LinkedIn', visits: 290 },
                { source: 'Google', visits: 250 },
                { source: 'Direct', visits: 330 }
            ],
            lastUpdated: new Date().toISOString()
        };

        res.json(analytics);

    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ error: 'Failed to fetch analytics data' });
    }
});

// Blog posts endpoint (future feature)
app.get('/api/blog', (req, res) => {
    try {
        const blogPosts = [
            {
                id: 1,
                title: "Getting Started with Web GIS Development",
                slug: "getting-started-web-gis-development",
                excerpt: "Learn the fundamentals of building interactive web-based GIS applications using modern web technologies.",
                content: "",
                author: "Annan Shrestha",
                publishedAt: "2024-03-15T10:00:00Z",
                tags: ["web-gis", "javascript", "leaflet", "tutorial"],
                readTime: 8
            },
            {
                id: 2,
                title: "Python for GIS: Advanced Spatial Analysis Techniques",
                slug: "python-gis-advanced-spatial-analysis",
                excerpt: "Explore advanced spatial analysis techniques using Python libraries like GeoPandas, Shapely, and Rasterio.",
                content: "",
                author: "Annan Shrestha",
                publishedAt: "2024-03-10T14:30:00Z",
                tags: ["python", "gis", "spatial-analysis", "geopandas"],
                readTime: 12
            }
        ];

        res.json(blogPosts);

    } catch (error) {
        console.error('Blog error:', error);
        res.status(500).json({ error: 'Failed to fetch blog posts' });
    }
});

// Resume/CV download tracking
app.get('/api/resume/download', (req, res) => {
    try {
        // Log download
        console.log(`Resume downloaded at ${new Date().toISOString()} from IP: ${req.ip}`);
        
        // Redirect to actual resume URL
        res.redirect('https://drive.google.com/file/d/17hXSAKD9pRQDGgVzb8D2wCkKYHPOMQlb/view?usp=drive_link');
        
    } catch (error) {
        console.error('Resume download error:', error);
        res.status(500).json({ error: 'Failed to process resume download' });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
        }
    }
    
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'production' ? 'Something went wrong!' : error.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        message: `The requested endpoint ${req.method} ${req.path} was not found.`
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📧 Contact API: http://localhost:${PORT}/api/contact`);
    console.log(`🗺️  GIS API: http://localhost:${PORT}/api/gis/*`);
});

module.exports = app;