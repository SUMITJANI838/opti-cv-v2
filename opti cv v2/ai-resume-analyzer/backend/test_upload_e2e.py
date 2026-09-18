import urllib.request
import urllib.parse
import json
import uuid

# Simulate a user-uploaded resume
candidate_resume = """
SARAH CHEN
Seattle, WA | sarah.chen@clouddev.io | (206) 555-0149 | github.com/sarahchen | linkedin.com/in/sarahchen

SUMMARY
Accomplished DevOps & Cloud Platform Engineer with 7+ years of experience designing and managing multi-region Kubernetes clusters, automated GitOps CI/CD pipelines, and resilient AWS infrastructure.

SKILLS
- Cloud Platforms: AWS, Google Cloud (GCP), Azure
- Containers & Orchestration: Docker, Kubernetes, Helm, Terraform, Ansible
- CI/CD & Automation: GitHub Actions, GitLab CI, ArgoCD, Prometheus, Grafana, Linux, Bash, Python

EXPERIENCE
Lead DevOps Engineer | Vertex Cloud Systems | 2021 – Present
• Architected and provisioned multi-cluster Kubernetes platform on AWS EKS across 3 availability zones, achieving 99.995% uptime.
• Automated infrastructure deployment using Terraform and GitOps with ArgoCD, accelerating release frequency from bi-weekly to 18 deployments per day.
• Engineered Prometheus and Grafana monitoring stacks with automated alert routing, reducing Mean Time to Detection (MTTD) by 60%.
• Reduced AWS monthly cloud compute spend by $45,000 via intelligent auto-scaling policies and spot instance orchestration.

DevOps Engineer | DataStream Corp | 2018 – 2021
• Spearheaded containerization of 30+ legacy microservices with Docker, reducing developer onboarding time from 3 days to 2 hours.
• Implemented automated vulnerability scanning in GitHub Actions pipeline, catching 95% of security regressions pre-production.

EDUCATION
Bachelor of Science in Information Technology | University of Washington | 2014 – 2018
"""

def test_api_upload():
    boundary = "----WebKitFormBoundary" + uuid.uuid4().hex
    
    body = []
    # File part
    body.append(f"--{boundary}".encode())
    body.append(b'Content-Disposition: form-data; name="file"; filename="Sarah_Chen_DevOps_Resume.txt"')
    body.append(b"Content-Type: text/plain")
    body.append(b"")
    body.append(candidate_resume.strip().encode("utf-8"))
    
    # Target role part
    body.append(f"--{boundary}".encode())
    body.append(b'Content-Disposition: form-data; name="target_role"')
    body.append(b"")
    body.append(b"DevOps & Cloud Architect")
    
    body.append(f"--{boundary}--".encode())
    body.append(b"")
    
    payload = b"\r\n".join(body)
    
    req = urllib.request.Request("http://127.0.0.1:8000/api/analyze", data=payload)
    req.add_header("Content-Type", f"multipart/form-data; boundary={boundary}")
    
    print("Sending live resume upload to FastAPI backend...")
    with urllib.request.urlopen(req) as response:
        status = response.status
        res_data = json.loads(response.read().decode("utf-8"))
        
        print(f"\nResponse Status: {status}")
        print(f"Success: {res_data['success']}")
        print(f"Candidate: {res_data['parsed']['contact']['name']}")
        print(f"Email: {res_data['parsed']['contact']['email']}")
        print(f"Target Role: {res_data['target_role']}")
        print(f"ATS Score: {res_data['analysis']['overall_score']}/100")
        print(f"Tier: {res_data['analysis']['tier']}")
        print(f"Core Match %: {res_data['analysis']['keyword_gap']['core_match_percent']}%")
        print(f"Matched Skills: {res_data['analysis']['keyword_gap']['matched_core']}")
        print(f"Metrics count: {res_data['analysis']['metrics_found']['metric_count']}")
        print(f"Optimized Bullets: {len(res_data['analysis']['optimized_bullets'])}")
        
        assert res_data['success'] == True
        assert res_data['analysis']['overall_score'] >= 80
        print("\n[PASSED] END-TO-END RESUME UPLOAD TEST SUCCEEDED 100%!")

if __name__ == "__main__":
    test_api_upload()
