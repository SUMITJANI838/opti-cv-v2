import re
import math
import os
from typing import Dict, List, Any, Optional

try:
    from parser import ACTION_VERBS, SKILLS_TAXONOMY
except ImportError:
    from .parser import ACTION_VERBS, SKILLS_TAXONOMY

# Benchmark roles and their target keyword taxonomies
ROLE_BENCHMARKS = {
    "Full Stack Engineer": {
        "core_skills": ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "REST API", "Docker", "Git", "Tailwind CSS", "CI/CD"],
        "bonus_skills": ["GraphQL", "Redis", "AWS", "Kubernetes", "Microservices", "Jest", "State Management", "System Design"],
        "action_verbs": ["architected", "engineered", "developed", "deployed", "scaled", "integrated", "optimized"]
    },
    "Frontend Engineer": {
        "core_skills": ["React", "TypeScript", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "Next.js", "Redux", "Webpack", "Responsive Design"],
        "bonus_skills": ["Vue.js", "GraphQL", "Framer Motion", "Three.js", "Jest", "Accessibility", "Performance Optimization", "Web Vitals"],
        "action_verbs": ["designed", "developed", "crafted", "implemented", "optimized", "built", "accelerated"]
    },
    "Backend Engineer": {
        "core_skills": ["Python", "Java", "Go", "Node.js", "PostgreSQL", "MySQL", "Docker", "REST API", "Microservices", "Redis"],
        "bonus_skills": ["Kubernetes", "Kafka", "gRPC", "AWS", "GCP", "GraphQL", "Elasticsearch", "System Architecture", "CI/CD"],
        "action_verbs": ["architected", "engineered", "scaled", "optimized", "streamlined", "built", "orchestrated"]
    },
    "AI / Machine Learning Engineer": {
        "core_skills": ["Python", "PyTorch", "TensorFlow", "Machine Learning", "Deep Learning", "NLP", "Pandas", "NumPy", "Scikit-Learn", "LLM"],
        "bonus_skills": ["RAG", "LangChain", "Transformers", "Computer Vision", "MLOps", "Docker", "AWS", "Vector Databases", "HuggingFace"],
        "action_verbs": ["trained", "fine-tuned", "deployed", "engineered", "optimized", "researched", "architected"]
    },
    "DevOps & Cloud Architect": {
        "core_skills": ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD", "Linux", "GitHub Actions", "Python", "Bash", "Prometheus"],
        "bonus_skills": ["GCP", "Azure", "Ansible", "Helm", "Grafana", "Security", "Serverless", "Infrastructure as Code"],
        "action_verbs": ["automated", "orchestrated", "provisioned", "migrated", "scaled", "hardened", "monitored"]
    },
    "Data Scientist": {
        "core_skills": ["Python", "SQL", "Pandas", "NumPy", "Scikit-Learn", "Machine Learning", "Data Visualization", "Statistics", "Tableau", "R"],
        "bonus_skills": ["PyTorch", "BigQuery", "Spark", "A/B Testing", "Deep Learning", "Power BI", "Feature Engineering"],
        "action_verbs": ["analyzed", "modeled", "forecasted", "extracted", "visualized", "discovered", "optimized"]
    },
    "Product Manager": {
        "core_skills": ["Product Strategy", "Agile", "Scrum", "Roadmapping", "User Research", "Data Analysis", "Cross-Functional Leadership", "Wireframing", "A/B Testing", "KPI Tracking"],
        "bonus_skills": ["SQL", "Figma", "Jira", "Go-To-Market", "Customer Discovery", "PRD Writing", "Financial Modeling"],
        "action_verbs": ["spearheaded", "launched", "championed", "led", "strategized", "prioritized", "drove"]
    }
}

WEAK_VERBS_MAP = {
    "helped": "spearheaded",
    "worked on": "engineered",
    "assisted with": "co-developed",
    "responsible for": "orchestrated",
    "handled": "managed and executed",
    "did": "delivered",
    "made": "architected",
    "tried": "initiated",
    "changed": "transformed",
    "looked after": "supervised"
}

def calculate_ats_score(parsed_data: Dict[str, Any], target_role: str, custom_jd: Optional[str] = None) -> Dict[str, Any]:
    raw_text = parsed_data.get("raw_text", "")
    sections = parsed_data.get("sections", {})
    contact = parsed_data.get("contact", {})
    detected_skills_dict = parsed_data.get("skills", {})
    bullets = parsed_data.get("bullets", [])
    word_count = parsed_data.get("word_count", 0)

    # Flatten detected skills
    all_detected_skills = []
    for category_skills in detected_skills_dict.values():
        all_detected_skills.extend(category_skills)
    all_detected_skills_set = set(s.lower() for s in all_detected_skills)

    # 1. Section Completeness Score (0 to 25 pts)
    section_score = 0
    section_feedback = []
    if contact.get("email"):
        section_score += 4
    else:
        section_feedback.append("Missing contact email.")
    if contact.get("phone"):
        section_score += 3
    else:
        section_feedback.append("Missing phone number.")
    if contact.get("linkedin") or contact.get("github") or contact.get("portfolio"):
        section_score += 3
    else:
        section_feedback.append("Include links to LinkedIn, GitHub, or your portfolio.")
    
    if len(sections.get("experience", "")) > 50:
        section_score += 6
    else:
        section_feedback.append("Work experience section is missing or too brief.")
        
    if len(sections.get("skills", "")) > 20 or len(all_detected_skills) >= 5:
        section_score += 4
    else:
        section_feedback.append("Explicit technical skills section is missing or sparse.")
        
    if len(sections.get("education", "")) > 20:
        section_score += 3
    else:
        section_feedback.append("Education details not clearly identified.")
        
    if len(sections.get("summary", "")) > 20 or len(sections.get("projects", "")) > 30:
        section_score += 2

    # 2. Impact & Quantification Score (0 to 25 pts)
    # Detect numbers, percentages, multipliers, currency
    quant_matches = re.findall(r"(\b\d+[\.,]?\d*[%kKmMBb]?|\$\d+[\.,]?\d*|\b\d+x\b|\b\d+\+\b)", raw_text)
    metric_count = len(quant_matches)
    
    # Check bullet action verbs
    action_verb_count = 0
    raw_lower = raw_text.lower()
    for verb in ACTION_VERBS:
        if re.search(r"\b" + verb + r"\b", raw_lower):
            action_verb_count += 1
            
    impact_score = min(25, int((min(metric_count, 12) / 12.0) * 15 + (min(action_verb_count, 8) / 8.0) * 10))

    # 3. Brevity & Length Score (0 to 20 pts)
    # Ideal single/two-page resume is 450 to 950 words
    if 400 <= word_count <= 950:
        brevity_score = 20
    elif 300 <= word_count < 400 or 950 < word_count <= 1300:
        brevity_score = 15
    elif 150 <= word_count < 300 or 1300 < word_count <= 1800:
        brevity_score = 10
    else:
        brevity_score = 6

    # 4. Keyword Match & Relevance Score (0 to 30 pts)
    benchmark = ROLE_BENCHMARKS.get(target_role, ROLE_BENCHMARKS["Full Stack Engineer"])
    core_skills = benchmark["core_skills"]
    bonus_skills = benchmark["bonus_skills"]
    
    # If custom JD provided, extract keywords from JD
    if custom_jd and len(custom_jd.strip()) > 30:
        jd_lower = custom_jd.lower()
        extracted_jd_skills = []
        for cat, skl_list in SKILLS_TAXONOMY.items():
            for sk in skl_list:
                if re.search(r"(?<!\w)" + re.escape(sk) + r"(?!\w)", jd_lower):
                    extracted_jd_skills.append(sk.title() if len(sk) > 3 else sk.upper())
        if extracted_jd_skills:
            core_skills = list(set(extracted_jd_skills))[:12]
            bonus_skills = list(set(extracted_jd_skills))[12:20]

    matched_core = [s for s in core_skills if s.lower() in all_detected_skills_set or s.lower() in raw_lower]
    missing_core = [s for s in core_skills if s not in matched_core]
    matched_bonus = [s for s in bonus_skills if s.lower() in all_detected_skills_set or s.lower() in raw_lower]
    missing_bonus = [s for s in bonus_skills if s not in matched_bonus]

    core_ratio = len(matched_core) / max(len(core_skills), 1)
    bonus_ratio = len(matched_bonus) / max(len(bonus_skills), 1)
    keyword_score = min(30, int(core_ratio * 22 + bonus_ratio * 8))

    # Overall Total Score (0 to 100)
    total_ats_score = min(100, max(10, section_score + impact_score + brevity_score + keyword_score))

    # Determine Rating Tier
    if total_ats_score >= 88:
        tier = "Elite Candidate"
        tier_color = "#00FF9D" # Neon Mint
    elif total_ats_score >= 75:
        tier = "Strong Match"
        tier_color = "#00E5FF" # Luminous Cyan
    elif total_ats_score >= 60:
        tier = "Moderate Competitiveness"
        tier_color = "#F59E0B" # Amber
    else:
        tier = "Needs Optimization"
        tier_color = "#EF4444" # Coral Red

    # Generate Actionable Improvements
    improvements = []
    if missing_core:
        improvements.append({
            "type": "critical",
            "title": f"Missing Core {target_role} Keywords",
            "desc": f"Your resume lacks essential keywords: {', '.join(missing_core[:4])}. ATS filters heavily prioritize these."
        })
    if metric_count < 5:
        improvements.append({
            "type": "critical",
            "title": "Quantify Achievements with Data",
            "desc": f"Only detected {metric_count} numerical metrics. Use the X-Y-Z formula: 'Increased [X]% by doing [Y]' to stand out."
        })
    if action_verb_count < 4:
        improvements.append({
            "type": "recommended",
            "title": "Use Stronger Action Verbs",
            "desc": "Replace passive phrases like 'worked on' or 'helped' with high-impact verbs such as 'Architected', 'Spearheaded', 'Optimized'."
        })
    if word_count < 350:
        improvements.append({
            "type": "minor",
            "title": "Expand Resume Depth",
            "desc": f"Your resume has only {word_count} words. Provide more detail about project architecture and business outcomes."
        })
    elif word_count > 1000:
        improvements.append({
            "type": "minor",
            "title": "Condense for Readability",
            "desc": f"Your resume is {word_count} words. Aim for concise bullet points to keep recruiters engaged within 6 seconds."
        })

    # Generate Bullet Optimizations
    optimized_bullets = []
    sample_bullets = bullets[:6] if bullets else [
        "Worked on backend APIs and database queries for the web app.",
        "Responsible for frontend UI components and fixing bugs.",
        "Helped improve application performance and CI/CD pipelines."
    ]

    for bullet in sample_bullets:
        opt = optimize_bullet_text(bullet, target_role)
        optimized_bullets.append(opt)

    return {
        "overall_score": total_ats_score,
        "tier": tier,
        "tier_color": tier_color,
        "breakdown": {
            "section_score": section_score, # out of 25
            "impact_score": impact_score,   # out of 25
            "brevity_score": brevity_score, # out of 20
            "keyword_score": keyword_score  # out of 30
        },
        "metrics_found": {
            "metric_count": metric_count,
            "action_verb_count": action_verb_count,
            "total_words": word_count,
            "detected_skills_count": len(all_detected_skills)
        },
        "keyword_gap": {
            "matched_core": matched_core,
            "missing_core": missing_core,
            "matched_bonus": matched_bonus,
            "missing_bonus": missing_bonus,
            "core_match_percent": int(core_ratio * 100)
        },
        "improvements": improvements,
        "optimized_bullets": optimized_bullets
    }

def optimize_bullet_text(bullet: str, target_role: str) -> Dict[str, Any]:
    cleaned = bullet.strip()
    words = cleaned.split()
    first_word = words[0].lower() if words else ""
    
    # Check if weak verb is present
    weak_found = None
    for weak, strong in WEAK_VERBS_MAP.items():
        if cleaned.lower().startswith(weak):
            weak_found = (weak, strong)
            break
            
    has_metric = bool(re.search(r"(\b\d+[\.,]?\d*[%kKmMBb]?|\$\d+|\b\d+x\b)", cleaned))
    
    # Construct an elevated rewrite
    rewrite = cleaned
    reasons = []

    if weak_found:
        weak, strong = weak_found
        rewrite = strong.capitalize() + " " + cleaned[len(weak):].strip()
        reasons.append(f"Upgraded weak verb '{weak}' to impactful '{strong}'")
    elif not any(cleaned.lower().startswith(v) for v in ACTION_VERBS):
        lead_verbs = ["Architected and delivered", "Spearheaded development of", "Engineered and optimized", "Orchestrated"]
        chosen_lead = lead_verbs[hash(cleaned) % len(lead_verbs)]
        # lower the first letter of original if needed
        first_letter_lower = cleaned[0].lower() + cleaned[1:] if len(cleaned) > 1 else cleaned
        rewrite = f"{chosen_lead} {first_letter_lower}"
        reasons.append("Prepended high-impact action verb")

    if not has_metric:
        # Add realistic benchmark metric framing
        metric_additions = [
            ", reducing latency by 35% and accelerating deployment cycles",
            ", resulting in a 40% boost in system throughput and reliability",
            ", enhancing user engagement by 28% across 50,000+ active users",
            ", cutting infrastructure overhead by 22% while scaling to high concurrency"
        ]
        chosen_metric = metric_additions[hash(cleaned) % len(metric_additions)]
        # Trim trailing period
        if rewrite.endswith("."):
            rewrite = rewrite[:-1]
        rewrite += chosen_metric + "."
        reasons.append("Infused quantifiable metric via the Google X-Y-Z outcome formula")

    score_before = 55 if not has_metric else 72
    score_after = 94

    return {
        "original": cleaned,
        "rewritten": rewrite,
        "reasons": reasons,
        "score_before": score_before,
        "score_after": score_after
    }
