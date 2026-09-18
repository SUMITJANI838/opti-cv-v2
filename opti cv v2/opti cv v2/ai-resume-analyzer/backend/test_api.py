import sys
from parser import parse_resume_file
from analyzer import calculate_ats_score

sample_resume = """
ALEXANDER WRIGHT
San Francisco, CA | alex.wright@email.com | (555) 019-2834 | linkedin.com/in/alexwright | github.com/alexwright

PROFESSIONAL SUMMARY
Results-driven Full Stack Software Engineer with 5+ years of experience architecting high-scale web applications, distributed systems, and modern cloud infrastructure.

TECHNICAL SKILLS
- Languages: TypeScript, JavaScript, Python, Go, SQL, HTML5, CSS3
- Frontend: React, Next.js, Tailwind CSS, Redux, Framer Motion
- Backend & DB: Node.js, FastAPI, PostgreSQL, Redis, MongoDB, GraphQL
- Cloud & DevOps: AWS, Docker, Kubernetes, CI/CD, GitHub Actions, Terraform

WORK EXPERIENCE
Senior Full Stack Engineer | CloudScale Tech | 2022 – Present
• Architected and deployed microservices architecture handling 15M+ daily requests with 99.99% uptime.
• Engineered real-time data ingestion pipeline using Next.js and WebSockets, reducing page load latency by 45%.
• Spearheaded migration from legacy monolithic DB to PostgreSQL & Redis caching, cutting query response times from 420ms to 48ms.
• Mentored a team of 6 junior engineers and implemented strict CI/CD linting & testing suites.

Software Engineer | Apex Solutions | 2020 – 2022
• Developed responsive client dashboard using React and Tailwind CSS for 40,000+ enterprise users.
• Automated payment processing integration with Stripe API, reducing checkout failure rate by 32%.
• Built automated testing workflows with Jest, increasing code test coverage from 52% to 88%.

EDUCATION
Bachelor of Science in Computer Science | University of California, Berkeley | 2016 – 2020
"""

def test_resume_pipeline():
    print("Testing parser with text resume...")
    parsed = parse_resume_file("sample_resume.txt", sample_resume.encode("utf-8"))
    
    print(f"Candidate name detected: {parsed['contact']['name']}")
    print(f"Email: {parsed['contact']['email']}")
    print(f"Phone: {parsed['contact']['phone']}")
    print(f"Total words: {parsed['word_count']}")
    print(f"Detected skills categories: {list(parsed['skills'].keys())}")
    print(f"Extracted bullets count: {len(parsed['bullets'])}")
    
    print("\nTesting ATS analyzer...")
    analysis = calculate_ats_score(parsed, "Full Stack Engineer")
    print(f"Overall ATS Score: {analysis['overall_score']}/100")
    print(f"Candidate Tier: {analysis['tier']}")
    print(f"Breakdown: {analysis['breakdown']}")
    print(f"Core Match %: {analysis['keyword_gap']['core_match_percent']}%")
    print(f"Improvements suggested: {len(analysis['improvements'])}")
    print(f"Optimized bullets: {len(analysis['optimized_bullets'])}")
    
    assert parsed['contact']['email'] == "alex.wright@email.com"
    assert analysis['overall_score'] > 70
    print("\nALL BACKEND TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_resume_pipeline()
