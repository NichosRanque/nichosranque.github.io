// Portfolio Data Structure
let portfolioData = {
    "profile": {
        "name": "Nichos Ranque",
        "title": "4th Year Information Technology Student",
        "location": "Philippines, General Santos City",
        "experience": "4 years of study",
        "email": "nichos.ranque@student.edu",
        "linkedin": "linkedin.com/in/nichosranque",
        "github": "https://github.com/nichosranque",
        "summary": "I am highly experienced in networking, with a strong background in configuring and managing routers, switches, and firewalls, setting up VLANs, optimizing traffic, and ensuring secure and stable connectivity. Over time, I have developed expertise in both troubleshooting and designing efficient network infrastructures. While networking is my core strength, I also enjoy programming and creating functional, visually appealing web interfaces, which allows me to integrate reliable infrastructure with user-friendly digital experiences.",
        "bio": "Dedicated 4th year Information Technology student with a passion for software development, data structures, and problem-solving. Currently maintaining a 1.0 GPA while actively working on personal projects and seeking internship opportunities to gain professional experience.",
        "phone": "+506 1234 5678",
        "workType": "Student seeking internships",
        "languages": "English, Tagalog"
    },
    "achievements": [
        {
            "icon": "fas fa-graduation-cap",
            "title": "Academic Excellence",
            "description": "Maintaining a strong 1.0 GPA throughout my Networking program while actively participating in coding competitions and hackathons.",
            "metric": "1.0 GPA",
            "order": 1
        },
        {
            "icon": "fas fa-code",
            "title": "Project Portfolio",
            "description": "Successfully completed 15+ programming projects ranging from web applications to data structures implementations and algorithms.",
            "metric": "15+ Projects",
            "order": 2
        },
        {
            "icon": "fas fa-users",
            "title": "Team Leadership",
            "description": "Led multiple group projects and study sessions, helping fellow students understand complex programming concepts and collaborative development.",
            "metric": "5+ Team Projects",
            "order": 3
        },
        {
            "icon": "fas fa-trophy",
            "title": "Programming Competitions",
            "description": "Participated in university coding competitions and online programming challenges, consistently ranking in top 25% of participants.",
            "metric": "Top 25% Performer",
            "order": 4
        },
        {
            "icon": "fas fa-shield-alt",
            "title": "Networking & Cybersecurity Competition",
            "description": "Competed in the regional Networking and Cybersecurity Competition representing Mindanao State University - General Santos City. Demonstrated expertise in network security protocols, vulnerability assessment, and incident response procedures.",
            "metric": "Regional Finalist",
            "order": 5
        }
    ],
    "skills": [
        {
            "category": "Networking",
            "icon": "fas fa-network-wired",
            "items": [
                {
                    "name": "Network Administration",
                    "level": 85
                },
                {
                    "name": "Cisco CCNA",
                    "level": 80
                },
                {
                    "name": "TCP/IP Protocols",
                    "level": 90
                },
                {
                    "name": "VPN Setup",
                    "level": 70
                },
                {
                    "name": "Wireshark",
                    "level": 80
                },
                {
                    "name": "Network Troubleshooting",
                    "level": 85
                }
            ]
        },
        {
            "category": "Cybersecurity",
            "icon": "fas fa-shield-alt",
            "items": [
                {
                    "name": "Network Security",
                    "level": 85
                },
                {
                    "name": "Firewall Configuration",
                    "level": 75
                },
                {
                    "name": "Vulnerability Assessment",
                    "level": 75
                },
                {
                    "name": "Penetration Testing",
                    "level": 70
                },
                {
                    "name": "Security Protocols",
                    "level": 80
                },
                {
                    "name": "Incident Response",
                    "level": 75
                }
            ]
        },
        {
            "category": "Programming Languages",
            "icon": "fas fa-code",
            "items": [
                {
                    "name": "Java",
                    "level": 90
                },
                {
                    "name": "Python",
                    "level": 85
                },
                {
                    "name": "JavaScript",
                    "level": 80
                },
                {
                    "name": "C++",
                    "level": 75
                }
            ]
        },
        {
            "category": "Web Development",
            "icon": "fas fa-globe",
            "items": [
                {
                    "name": "HTML/CSS",
                    "level": 90
                },
                {
                    "name": "React",
                    "level": 75
                },
                {
                    "name": "Node.js",
                    "level": 70
                },
                {
                    "name": "Bootstrap",
                    "level": 85
                }
            ]
        },
        {
            "category": "Database & Tools",
            "icon": "fas fa-database",
            "items": [
                {
                    "name": "SQL",
                    "level": 80
                },
                {
                    "name": "MongoDB",
                    "level": 70
                },
                {
                    "name": "Git/GitHub",
                    "level": 85
                },
                {
                    "name": "VS Code",
                    "level": 90
                }
            ]
        }
    ],
    "projects": [
        {
            "id": 1,
            "title": "Campus Network Security Assessment",
            "description": "Comprehensive security assessment of Mindanao State University's network infrastructure. Conducted vulnerability scanning, penetration testing, and network traffic analysis to identify security gaps. Developed detailed security recommendations and implemented firewall configurations to enhance network protection.",
            "image": "fas fa-shield-alt",
            "technologies": [
                "Wireshark",
                "Nmap",
                "Metasploit",
                "pfSense",
                "Cisco Packet Tracer",
                "Kali Linux"
            ],
            "category": "networking",
            "status": "completed",
            "impact": "Identified 15+ security vulnerabilities and improved network security by 40%",
            "links": [
                {
                    "type": "demo",
                    "url": "#",
                    "label": "Security Report"
                },
                {
                    "type": "github",
                    "url": "#",
                    "label": "Documentation"
                }
            ],
            "order": 1
        },
        {
            "id": 2,
            "title": "Enterprise Network Design & Implementation",
            "description": "Designed and implemented a scalable enterprise network for a local business with 50+ employees. Configured VLANs, routing protocols (OSPF), and implemented network segmentation for security. Set up redundant connections and network monitoring systems for optimal performance and reliability.",
            "image": "fas fa-network-wired",
            "technologies": [
                "Cisco IOS",
                "VLAN Configuration",
                "OSPF Protocol",
                "Network Monitoring",
                "Firewall Setup",
                "Cable Management"
            ],
            "category": "networking",
            "status": "completed",
            "impact": "Reduced network downtime by 85% and improved data transfer speeds by 60%",
            "links": [
                {
                    "type": "demo",
                    "url": "#",
                    "label": "Network Diagram"
                },
                {
                    "type": "github",
                    "url": "#",
                    "label": "Configuration Files"
                }
            ],
            "order": 2
        },
        {
            "id": 3,
            "title": "Data Structures Visualization Tool",
            "description": "Interactive web application that visualizes common data structures (arrays, linked lists, trees, graphs) and algorithms. Built to help students understand complex CS concepts through visual representation.",
            "image": "fas fa-project-diagram",
            "technologies": [
                "JavaScript",
                "HTML5 Canvas",
                "CSS3",
                "D3.js"
            ],
            "category": "academic",
            "status": "completed",
            "impact": "Enhanced understanding of algorithms and data structures",
            "links": [
                {
                    "type": "demo",
                    "url": "#",
                    "label": "Try It Out"
                },
                {
                    "type": "github",
                    "url": "#",
                    "label": "Source Code"
                }
            ],
            "order": 3
        },
        {
            "id": 4,
            "title": "Python Data Analysis Project",
            "description": "Comprehensive data analysis of university enrollment trends using Python. Utilized pandas for data manipulation, matplotlib for visualization, and machine learning algorithms for predictive modeling.",
            "image": "fab fa-python",
            "technologies": [
                "Python",
                "Pandas",
                "Matplotlib",
                "Scikit-learn",
                "Jupyter Notebook"
            ],
            "category": "programming",
            "status": "completed",
            "impact": "Gained experience in data science and statistical analysis",
            "links": [
                {
                    "type": "github",
                    "url": "#",
                    "label": "View Analysis"
                },
                {
                    "type": "notebook",
                    "url": "#",
                    "label": "Jupyter Notebook"
                }
            ],
            "order": 4
        },
        {
            "id": 5,
            "title": "Mobile Task Manager App",
            "description": "Cross-platform mobile application for task management built with React Native. Features include task creation, categorization, deadlines, and synchronization across devices.",
            "image": "fas fa-mobile-alt",
            "technologies": [
                "React Native",
                "Firebase",
                "JavaScript",
                "AsyncStorage"
            ],
            "category": "web",
            "status": "ongoing",
            "impact": "Learning mobile development and cloud services",
            "links": [
                {
                    "type": "github",
                    "url": "#",
                    "label": "Source Code"
                }
            ],
            "order": 5
        },
        {
            "id": 6,
            "title": "University Course Scheduler",
            "description": "Algorithm-based course scheduling system that optimizes class timetables while avoiding conflicts. Implemented using graph theory and constraint satisfaction algorithms.",
            "image": "fas fa-calendar-alt",
            "technologies": [
                "Java",
                "Graph Algorithms",
                "Constraint Programming",
                "SQLite"
            ],
            "category": "academic",
            "status": "completed",
            "impact": "Applied advanced algorithms to solve real-world problems",
            "links": [
                {
                    "type": "demo",
                    "url": "#",
                    "label": "View Demo"
                },
                {
                    "type": "github",
                    "url": "#",
                    "label": "Source Code"
                }
            ],
            "order": 6
        }
    ],
    "experience": [
        {
            "company": "Mindanao State University - General Santos City",
            "position": "Information Technology Student",
            "period": "2022 - Present (4th Year)",
            "location": "Philippines, General Santos City",
            "description": [
                "Pursuing Bachelor of Science in Information Technology degree with current GPA of 1.0/1.0",
                "Relevant coursework: Data Structures & Algorithms, Software Engineering, Database Systems, Web Development",
                "Active participant in programming competitions and coding challenges",
                "Member of the Information Technology Student Association",
                "Completed advanced courses in Systems Analysis and Design, Network Administration, and Software Development",
                "Collaborated on multiple team projects using Agile development methodologies"
            ],
            "technologies": [
                "Java",
                "Python",
                "JavaScript",
                "SQL",
                "React",
                "Node.js",
                "Git",
                "Agile Methodologies"
            ],
            "order": 1
        },
        {
            "company": "TechStart Costa Rica",
            "position": "Programming Intern",
            "period": "Jun 2024 - Aug 2024",
            "location": "San José, Costa Rica",
            "description": [
                "Completed 10-week summer internship focusing on web development and software testing",
                "Developed and maintained features for company's main web application using React and Node.js",
                "Participated in daily standup meetings and sprint planning sessions",
                "Wrote unit tests and performed code reviews to ensure code quality",
                "Collaborated with senior developers to implement new features and fix bugs"
            ],
            "technologies": [
                "React",
                "Node.js",
                "MongoDB",
                "Jest",
                "Git"
            ],
            "order": 2
        },
        {
            "company": "Freelance Projects",
            "position": "Junior Web Developer",
            "period": "Jan 2024 - Present",
            "location": "Remote",
            "description": [
                "Developed responsive websites for small businesses and local organizations",
                "Created custom solutions using modern web technologies and frameworks",
                "Managed project timelines and communicated with clients to gather requirements",
                "Implemented responsive design principles and ensured cross-browser compatibility"
            ],
            "technologies": [
                "HTML5",
                "CSS3",
                "JavaScript",
                "Bootstrap",
                "WordPress"
            ],
            "order": 3
        },
        {
            "company": "University Programming Lab",
            "position": "Teaching Assistant",
            "period": "Sep 2023 - Dec 2023",
            "location": "University of Costa Rica",
            "description": [
                "Assisted in teaching introductory programming courses to first and second-year students",
                "Conducted lab sessions and helped students debug their code",
                "Graded assignments and provided constructive feedback on programming projects",
                "Mentored struggling students during office hours to improve their understanding"
            ],
            "technologies": [
                "Java",
                "Python",
                "Teaching",
                "Mentoring"
            ],
            "order": 4
        }
    ],
    "certifications": [
        {
            "name": "Oracle Certified Associate - Java SE 8 Programmer",
            "provider": "Oracle",
            "status": "Completed",
            "order": 1
        },
        {
            "name": "CS50: Introduction to Computer Science",
            "provider": "Harvard University (edX)",
            "status": "Completed",
            "order": 2
        },
        {
            "name": "JavaScript Algorithms and Data Structures",
            "provider": "freeCodeCamp",
            "status": "Completed",
            "url": "https://www.freecodecamp.org/certification/nichosranque/javascript-algorithms-and-data-structures",
            "order": 3
        },
        {
            "name": "Responsive Web Design",
            "provider": "freeCodeCamp",
            "status": "Completed",
            "url": "https://www.freecodecamp.org/certification/nichosranque/responsive-web-design",
            "order": 4
        },
        {
            "name": "Python for Everybody Specialization",
            "provider": "University of Michigan (Coursera)",
            "status": "Completed",
            "order": 5
        },
        {
            "name": "Git and GitHub Essentials",
            "status": "Completed",
            "provider": "LinkedIn Learning",
            "order": 6
        },
        {
            "name": "Introduction to Databases and SQL",
            "status": "Completed",
            "provider": "University of California, Davis (Coursera)",
            "order": 7
        },
        {
            "name": "React - The Complete Guide",
            "status": "In Progress",
            "provider": "Udemy",
            "order": 8
        },
        {
            "name": "Dean's List",
            "status": "Achieved",
            "provider": "University of Costa Rica",
            "order": 9
        },
        {
            "name": "Outstanding Student in Data Structures Course",
            "provider": "Mindanao State University - General Santos City",
            "status": "Achieved",
            "order": 10
        }
    ]
};