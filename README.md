# Vega Application Security Audit (SAST & DAST)

## 📌 Project Overview
This repository contains a comprehensive application security audit and vulnerability remediation lifecycle for the Vega web application. The project demonstrates a systematic approach to identifying, classifying, and mitigating security threats using industry-standard static and dynamic analysis tools[cite: 7].

## 🛠️ Tools & Technologies
*   **Static Application Security Testing (SAST):** SonarQube (Dockerized)[cite: 7]
*   **Dynamic Application Security Testing (DAST) / Penetration Testing:** OWASP Zed Attack Proxy (ZAP)[cite: 7]
*   **Version Control & CI/CD:** Git, GitHub Flow[cite: 7]
*   **Environment:** Docker, Linux[cite: 7]

## 🚀 Key Methodologies & Deliverables

### 1. Threat & Vulnerability Matrix
*   Constructed a comprehensive matrix mapping high-level application features to potential threats[cite: 7].
*   Defined explicit mitigation solutions and verification cases for each identified threat[cite: 7].

### 2. Static Code Analysis (SonarQube)
*   Deployed a containerized SonarQube server and PostgreSQL database to conduct deep static code analysis[cite: 7].
*   Reviewed generated reports, specifically isolating security hotspots and vulnerabilities while filtering out non-security-related code smells[cite: 7].
*   Evaluated issues against the Impact/Likelihood matrix to identify false positives and ensure accurate risk classification[cite: 7].

### 3. Penetration Testing (OWASP ZAP)
*   Configured ZAP as an interception proxy to capture and analyze HTTP traffic[cite: 7].
*   Executed automated active scanning and spidering to map application endpoints[cite: 7].
*   Conducted manual exploration and targeted attacks (e.g., fuzzing, forced authentication bypassing) to uncover deeper, logical vulnerabilities[cite: 7].

### 4. Vulnerability Remediation & Validation
*   Successfully patched **[Insert Number/Type, e.g., 2 High-Severity]** vulnerabilities identified during the penetration testing phase[cite: 7].
*   Utilized feature branching and pull requests to integrate security patches into the main codebase[cite: 7].
*   Executed a complete post-fix re-scan utilizing both SonarQube and ZAP to validate that the vulnerabilities were successfully mitigated and no new regressions were introduced[cite: 7].

## 📂 Repository Structure
*   `/zap-reports/`: Contains the generated HTML/PDF reports from OWASP ZAP (pre-fix and post-fix scans). *(Note: Raw `.session.data` files are ignored via `.gitignore` to preserve repository performance).*
*   `/sonarqube-reports/`: Exported findings and hotspot classifications from the SonarQube static analysis.
*   `Threat_Vulnerability_Matrix.pdf`: The detailed matrix classifying application threats, impacts, and mitigation strategies.
*   `Security_Audit_Report.pdf`: A comprehensive breakdown of the identified vulnerabilities, the rationale behind false-positive classifications, and the technical steps taken to remediate the high-severity flaws[cite: 7].

## ⚙️ How to Review
To view the security findings, download and open the respective HTML reports in the `/zap-reports/` directory or review the `Security_Audit_Report.pdf` for a high-level executive summary of the remediation efforts.
