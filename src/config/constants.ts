// Centralized Configuration & Trust Statistics
// Note: In hackathon mode, these demonstrate benchmark metrics and can be replaced with live backend counters.

export const VERIFIED_USER_COUNT = "79,999+";
export const SKILLS_VERIFIED_COUNT = "150,000+";
export const PROJECTS_EVIDENCE_COUNT = "50,000+";
export const OPPORTUNITIES_COUNT = "10,000+";

export interface CollegeOption {
  id: string;
  name: string;
  shortName: string;
  location: string;
  nirfRank?: number;
  popularCompanies?: string[];
}

export const POPULAR_COLLEGES: CollegeOption[] = [
  {
    id: 'thapar',
    name: 'Thapar Institute of Engineering & Technology',
    shortName: 'TIET Patiala',
    location: 'Patiala, Punjab',
    nirfRank: 20,
    popularCompanies: ['Tata Motors', 'Larsen & Toubro', 'Maruti Suzuki', 'Bosch', 'Microsoft', 'Schneider Electric']
  },
  {
    id: 'iit-bombay',
    name: 'Indian Institute of Technology Bombay',
    shortName: 'IIT Bombay',
    location: 'Mumbai, Maharashtra',
    nirfRank: 3,
    popularCompanies: ['Google', 'Microsoft', 'Qualcomm', 'Apple', 'Goldman Sachs', 'Uber']
  },
  {
    id: 'iit-delhi',
    name: 'Indian Institute of Technology Delhi',
    shortName: 'IIT Delhi',
    location: 'New Delhi, Delhi',
    nirfRank: 2,
    popularCompanies: ['Google', 'Microsoft', 'Amazon', 'Atlassian', 'Bain & Co', 'Tower Research']
  },
  {
    id: 'iit-madras',
    name: 'Indian Institute of Technology Madras',
    shortName: 'IIT Madras',
    location: 'Chennai, Tamil Nadu',
    nirfRank: 1,
    popularCompanies: ['Google', 'Texas Instruments', 'Cisco', 'Amazon', 'Honeywell']
  },
  {
    id: 'bits-pilani',
    name: 'Birla Institute of Technology and Science, Pilani',
    shortName: 'BITS Pilani',
    location: 'Pilani, Rajasthan',
    nirfRank: 25,
    popularCompanies: ['Microsoft', 'Amazon', 'Adobe', 'Nutanix', 'DE Shaw', 'Flipkart']
  },
  {
    id: 'iiit-hyderabad',
    name: 'International Institute of Information Technology, Hyderabad',
    shortName: 'IIIT Hyderabad',
    location: 'Hyderabad, Telangana',
    nirfRank: 50,
    popularCompanies: ['Meta', 'Google', 'Apple', 'NVIDIA', 'Bloomberg', 'Directi']
  },
  {
    id: 'nit-trichy',
    name: 'National Institute of Technology, Tiruchirappalli',
    shortName: 'NIT Trichy',
    location: 'Tiruchirappalli, Tamil Nadu',
    nirfRank: 9,
    popularCompanies: ['Cisco', 'Samsung', 'Amazon', 'Morgan Stanley', 'L&T', 'Qualcomm']
  },
  {
    id: 'dtu',
    name: 'Delhi Technological University',
    shortName: 'DTU',
    location: 'Delhi',
    nirfRank: 29,
    popularCompanies: ['Google', 'Amazon', 'Adobe', 'Goldman Sachs', 'Uber', 'Zomato']
  },
  {
    id: 'vit',
    name: 'Vellore Institute of Technology',
    shortName: 'VIT Vellore',
    location: 'Vellore, Tamil Nadu',
    nirfRank: 11,
    popularCompanies: ['Microsoft', 'PayPal', 'Amazon', 'Bosch', 'Infosys', 'Wipro']
  },
  {
    id: 'nsut',
    name: 'Netaji Subhas University of Technology',
    shortName: 'NSUT',
    location: 'Delhi',
    nirfRank: 60,
    popularCompanies: ['Microsoft', 'Google', 'Amazon', 'Adobe', 'Sprinklr']
  },
  {
    id: 'rvce',
    name: 'RV College of Engineering',
    shortName: 'RVCE',
    location: 'Bengaluru, Karnataka',
    nirfRank: 89,
    popularCompanies: ['Cisco', 'Intel', 'Amazon', 'Goldman Sachs', 'Texas Instruments']
  },
  {
    id: 'mit-manipal',
    name: 'Manipal Institute of Technology',
    shortName: 'MIT Manipal',
    location: 'Manipal, Karnataka',
    nirfRank: 61,
    popularCompanies: ['Microsoft', 'Amazon', 'Philips', 'Dell', 'Bosch']
  }
];

export const ENGINEERING_BRANCHES = [
  'Computer Science & Engineering',
  'Information Technology',
  'Artificial Intelligence & Data Science',
  'Electronics & Communication Engineering',
  'Electrical & Electronics Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Biotechnology',
  'Aerospace Engineering'
];

export const GRADUATION_YEARS = ['2025', '2026', '2027', '2028', '2029'];

export const POPULAR_STUDENT_SKILLS = [
  { name: 'Python', category: 'Backend' },
  { name: 'React', category: 'Frontend' },
  { name: 'C++', category: 'Systems' },
  { name: 'JavaScript', category: 'Frontend' },
  { name: 'SQL', category: 'Backend' },
  { name: 'Git', category: 'Cloud & DevOps' },
  { name: 'HTML/CSS', category: 'Frontend' },
  { name: 'CAD / SolidWorks', category: 'Systems' },
  { name: 'Machine Learning', category: 'AI & ML' },
  { name: 'Embedded Systems', category: 'Systems' }
];
