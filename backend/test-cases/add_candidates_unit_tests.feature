Feature: Add Candidate to ATS System
  As a recruiter,
  I want to add candidates to the ATS system,
  So that I can manage their data and selection processes efficiently.

  Background:
    Given the recruiter is authenticated with valid credentials
    And the recruiter has the "add_candidate" permission
    And the system is connected to the database
    And the add candidate endpoint is available at POST /api/candidates

  # ==================== HAPPY PATH SCENARIOS ====================
  # AC1: Dashboard accessibility - Button/link visible for adding candidate
  # AC2: Form fields - Name, surname, email, phone, address, education, work experience

  Scenario: Successfully add candidate with all fields complete
    Given the recruiter is on the dashboard
    When the recruiter clicks the "Add Candidate" button
    And the recruiter fills in the form with:
      | field          | value                           |
      | first_name     | Juan                            |
      | last_name      | Pérez                           |
      | email          | juan.perez@example.com          |
      | phone          | +34912345678                    |
      | address        | Calle Principal 123, Madrid     |
      | education      | Bachelor's in Computer Science  |
      | experience     | Senior Software Engineer, 5yrs  |
    And the recruiter submits the form
    Then the system should return HTTP 201 Created
    And the success message should display "Candidato añadido exitosamente"
    And the candidate record should be created in the database
    And the recruiter should be redirected to the candidate details page

  Scenario: Successfully add candidate with only mandatory fields
    Given the recruiter is on the add candidate form
    When the recruiter fills in the mandatory fields:
      | field      | value                  |
      | first_name | María                  |
      | last_name  | García                 |
      | email      | maria.garcia@test.com  |
    And the recruiter submits the form
    Then the system should return HTTP 201 Created
    And the candidate record should be created with optional fields as null
    And the success message should display "Candidato añadido exitosamente"

  Scenario: Successfully add candidate with only required fields and CV attachment
    Given the recruiter is on the add candidate form
    When the recruiter fills in the mandatory fields:
      | field      | value                    |
      | first_name | Carlos                   |
      | last_name  | López                    |
      | email      | carlos.lopez@company.com |
    And the recruiter uploads a valid CV file "CV_Carlos_Lopez.pdf"
    And the recruiter submits the form
    Then the system should return HTTP 201 Created
    And the candidate record should be created with attached CV
    And the CV file should be stored securely

  # ==================== MANDATORY FIELD VALIDATION SCENARIOS ====================
  # AC3: Data validation - mandatory fields not empty

  Scenario: Reject submission when first_name is empty
    Given the recruiter is on the add candidate form
    When the recruiter leaves the first_name field empty
    And fills in other mandatory fields with valid values:
      | field      | value                   |
      | last_name  | Sánchez                 |
      | email      | test@example.com        |
    And the recruiter submits the form
    Then the system should return HTTP 400 Bad Request
    And the error message should contain "first_name is required"
    And the form should highlight the first_name field with an error

  Scenario: Reject submission when last_name is empty
    Given the recruiter is on the add candidate form
    When the recruiter leaves the last_name field empty
    And fills in other mandatory fields with valid values:
      | field      | value                  |
      | first_name | Ana                    |
      | email      | ana@example.com        |
    And the recruiter submits the form
    Then the system should return HTTP 400 Bad Request
    And the error message should contain "last_name is required"

  Scenario: Reject submission when email is empty
    Given the recruiter is on the add candidate form
    When the recruiter leaves the email field empty
    And fills in other mandatory fields with valid values:
      | field      | value      |
      | first_name | Roberto    |
      | last_name  | Martínez   |
    And the recruiter submits the form
    Then the system should return HTTP 400 Bad Request
    And the error message should contain "email is required"

  Scenario: Reject submission when all mandatory fields are empty
    Given the recruiter is on the add candidate form
    When the recruiter submits the form without entering any data
    Then the system should return HTTP 400 Bad Request
    And the error message should contain "first_name is required"
    And the error message should contain "last_name is required"
    And the error message should contain "email is required"

  Scenario: Reject submission with whitespace-only first_name
    Given the recruiter is on the add candidate form
    When the recruiter enters first_name as "   " (only spaces)
    And fills in other mandatory fields with valid values:
      | field      | value              |
      | last_name  | Fernández          |
      | email      | test@example.com   |
    And the recruiter submits the form
    Then the system should return HTTP 400 Bad Request
    And the error message should contain "first_name cannot be empty or whitespace-only"

  Scenario: Reject submission with whitespace-only email
    Given the recruiter is on the add candidate form
    When the recruiter enters email as "   " (only spaces)
    And fills in other mandatory fields with valid values:
      | field      | value    |
      | first_name | Sandra   |
      | last_name  | Ruiz     |
    And the recruiter submits the form
    Then the system should return HTTP 400 Bad Request
    And the error message should contain "email cannot be empty or whitespace-only"

  # ==================== EMAIL VALIDATION SCENARIOS ====================
  # AC3: Data validation - email format must be valid

  Scenario: Accept valid email with standard domain
    Given the recruiter is on the add candidate form
    When the recruiter enters the email "candidate@example.com"
    And fills in other mandatory fields with valid values:
      | field      | value      |
      | first_name | Felipe     |
      | last_name  | Gómez      |
    And the recruiter submits the form
    Then the system should return HTTP 201 Created
    And the candidate should be created with email "candidate@example.com"

  Scenario: Accept valid email with subdomain
    Given the recruiter is on the add candidate form
    When the recruiter enters the email "user@mail.example.com"
    And fills in other mandatory fields with valid values:
      | field      | value      |
      | first_name | Beatriz    |
      | last_name  | Moreno     |
    And the recruiter submits the form
    Then the system should return HTTP 201 Created
    And the candidate should be created with email "user@mail.example.com"

  Scenario: Accept valid email with plus addressing
    Given the recruiter is on the add candidate form
    When the recruiter enters the email "user+tag@example.com"
    And fills in other mandatory fields with valid values:
      | field      | value      |
      | first_name | Teresa     |
      | last_name  | Valdés     |
    And the recruiter submits the form
    Then the system should return HTTP 201 Created
    And the candidate should be created with email "user+tag@example.com"

  Scenario: Accept valid email with numbers
    Given the recruiter is on the add candidate form
    When the recruiter enters the email "candidate123@example.com"
    And fills in other mandatory fields with valid values:
      | field      | value      |
      | first_name | Óscar      |
      | last_name  | Blanco     |
    And the recruiter submits the form
    Then the system should return HTTP 201 Created

  Scenario: Accept valid email at maximum length (254 characters)
    Given the recruiter is on the add candidate form
    When the recruiter enters an email address at 254 characters length
    And the email format is valid "a" * 243 + "@example.com"
    And fills in other mandatory fields with valid values:
      | field      | value      |
      | first_name | Javier     |
      | last_name  | Iglesias   |
    And the recruiter submits the form
    Then the system should return HTTP 201 Created
    And the candidate should be created with the email address

  Scenario: Reject email without @ symbol
    Given the recruiter is on the add candidate form
    When the recruiter enters the email "candidateexample.com"
    And fills in other mandatory fields with valid values:
      | field      | value      |
      | first_name | Paula      |
      | last_name  | Herrera    |
    And the recruiter submits the form
    Then the system should return HTTP 400 Bad Request
    And the error message should contain "Invalid email format"

  Scenario: Reject email with multiple @ symbols
    Given the recruiter is on the add candidate form
    When the recruiter enters the email "candidate@@example.com"
    And fills in other mandatory fields with valid values:
      | field      | value      |
      | first_name | Esperanza  |
      | last_name  | Rojas      |
    And the recruiter submits the form
    Then the system should return HTTP 400 Bad Request
    And the error message should contain "Invalid email format"

  Scenario: Reject email without domain
    Given the recruiter is on the add candidate form
    When the recruiter enters the email "candidate@"
    And fills in other mandatory fields with valid values:
      | field      | value      |
      | first_name | Violeta    |
      | last_name  | Flores     |
    And the recruiter submits the form
    Then the system should return HTTP 400 Bad Request
    And the error message should contain "Invalid email format"

  Scenario: Reject email without local part
    Given the recruiter is on the add candidate form
    When the recruiter enters the email "@example.com"
    And fills in other mandatory fields with valid values:
      | field      | value      |
      | first_name | Raquel     |
      | last_name  | Díaz       |
    And the recruiter submits the form
    Then the system should return HTTP 400 Bad Request
    And the error message should contain "Invalid email format"

  Scenario: Reject email with spaces
    Given the recruiter is on the add candidate form
    When the recruiter enters the email "candidate @example.com"
    And fills in other mandatory fields with valid values:
      | field      | value      |
      | first_name | Monserrat  |
      | last_name  | Cabrera    |
    And the recruiter submits the form
    Then the system should return HTTP 400 Bad Request
    And the error message should contain "Invalid email format"

  Scenario: Reject email exceeding maximum length (255+ characters)
    Given the recruiter is on the add candidate form
    When the recruiter enters an email address exceeding 254 characters
    And the email format is "a" * 244 + "@example.com"
    And fills in other mandatory fields with valid values:
      | field      | value      |
      | first_name | Consuelo   |
      | last_name  | Medina     |
    And the recruiter submits the form
    Then the system should return HTTP 400 Bad Request
    And the error message should contain "email must not exceed 254 characters"

  Scenario: Handle email with international characters in local part
    Given the recruiter is on the add candidate form
    When the recruiter enters the email "candidatö@example.com"
    And fills in other mandatory fields with valid values:
      | field      | value      |
      | first_name | Dolores    |
      | last_name  | Ruiz       |
    And the recruiter submits the form
    Then the system should return HTTP 400 Bad Request
    Or the system should return HTTP 201 Created (depending on RFC validation)
    And the behavior should be documented

  # ==================== PHONE VALIDATION SCENARIOS ====================
  # AC2: Capture phone field with proper validation

  Scenario: Accept valid international phone format
    Given the recruiter is on the add candidate form
    When the recruiter enters the phone "+34912345678"
    And fills in other mandatory fields with valid values:
      | field      | value                  |
      | first_name | Enrique                |
      | last_name  | Navarro                |
      | email      | enrique@example.com    |
    And the recruiter submits the form
    Then the system should return HTTP 201 Created
    And the candidate should be created with phone "+34912345678"

  Scenario: Accept valid phone with parentheses format
    Given the recruiter is on the add candidate form
    When the recruiter enters the phone "(912) 345-678"
    And fills in other mandatory fields with valid values:
      | field      | value                  |
      | first_name | Alfredo                |
      | last_name  | Santana                |
      | email      | alfredo@example.com    |
    And the recruiter submits the form
    Then the system should return HTTP 201 Created

  Scenario: Accept valid phone with dashes format
    Given the recruiter is on the add candidate form
    When the recruiter enters the phone "912-345-678"
    And fills in other mandatory fields with valid values:
      | field      | value                  |
      | first_name | Rodolfo                |
      | last_name  | García                 |
      | email      | rodolfo@example.com    |
    And the recruiter submits the form
    Then the system should return HTTP 201 Created

  Scenario: Accept phone field when left empty (optional field)
    Given the recruiter is on the add candidate form
    When the recruiter leaves the phone field empty
    And fills in mandatory fields with valid values:
      | field      | value                 |
      | first_name | Gregorio              |
      | last_name  | López                 |
      | email      | gregorio@example.com  |
    And the recruiter submits the form
    Then the system should return HTTP 201 Created
    And the candidate should be created with phone as null

  Scenario: Reject phone with invalid characters
    Given the recruiter is on the add candidate form
    When the recruiter enters the phone "912#345@678"
    And fills in other mandatory fields with valid values:
      | field      | value                  |
      | first_name | Aurelio                |
      | last_name  | Campos                 |
      | email      | aurelio@example.com    |
    And the recruiter submits the form
    Then the system should return HTTP 400 Bad Request
    And the error message should contain "Invalid phone format"

  Scenario: Reject phone with only spaces
    Given the recruiter is on the add candidate form
    When the recruiter enters the phone as "   " (only spaces)
    And the recruiter has phone as a mandatory field
    And fills in other mandatory fields with valid values:
      | field      | value                  |
      | first_name | Marcelino              |
      | last_name  | Ruiz                   |
      | email      | marcelino@example.com  |
    And the recruiter submits the form
    Then the system should return HTTP 400 Bad Request
    And the error message should contain "phone cannot be only whitespace"

  # ==================== NAME FIELD VALIDATION SCENARIOS ====================

  Scenario: Accept first_name with accented characters
    Given the recruiter is on the add candidate form
    When the recruiter enters first_name as "José"
    And fills in other mandatory fields with valid values:
      | field      | value                 |
      | last_name  | Martín                |
      | email      | jose.martin@test.com  |
    And the recruiter submits the form
    Then the system should return HTTP 201 Created
    And the candidate should be created with first_name "José"

  Scenario: Accept last_name with hyphens (compound surname)
    Given the recruiter is on the add candidate form
    When the recruiter enters last_name as "García-López"
    And fills in other mandatory fields with valid values:
      | field      | value                    |
      | first_name | Isabel                   |
      | email      | isabel.garcia@test.com   |
    And the recruiter submits the form
    Then the system should return HTTP 201 Created
    And the candidate should be created with last_name "García-López"

  Scenario: Accept last_name with apostrophes
    Given the recruiter is on the add candidate form
    When the recruiter enters last_name as "O'Neill"
    And fills in other mandatory fields with valid values:
      | field      | value                   |
      | first_name | Patrick                 |
      | email      | patrick.oneill@test.com |
    And the recruiter submits the form
    Then the system should return HTTP 201 Created
    And the candidate should be created with last_name "O'Neill"

  Scenario: Reject first_name exceeding maximum length (100 characters)
    Given the recruiter is on the add candidate form
    When the recruiter enters first_name exceeding 100 characters
    And the first_name is "a" * 101
    And fills in other mandatory fields with valid values:
      | field      | value                 |
      | last_name  | Test                  |
      | email      | longname@test.com     |
    And the recruiter submits the form
    Then the system should return HTTP 400 Bad Request
    And the error message should contain "first_name must not exceed 100 characters"

  Scenario: Reject last_name exceeding maximum length (100 characters)
    Given the recruiter is on the add candidate form
    When the recruiter enters last_name exceeding 100 characters
    And the last_name is "a" * 101
    And fills in other mandatory fields with valid values:
      | field      | value                |
      | first_name | Test                 |
      | email      | longlastname@test.com|
    And the recruiter submits the form
    Then the system should return HTTP 400 Bad Request
    And the error message should contain "last_name must not exceed 100 characters"

  Scenario: Accept first_name at minimum length (1 character)
    Given the recruiter is on the add candidate form
    When the recruiter enters first_name as "A"
    And fills in other mandatory fields with valid values:
      | field      | value               |
      | last_name  | Test                |
      | email      | a@test.com          |
    And the recruiter submits the form
    Then the system should return HTTP 201 Created
    And the candidate should be created with first_name "A"

  Scenario: Accept last_name at minimum length (1 character)
    Given the recruiter is on the add candidate form
    When the recruiter enters last_name as "B"
    And fills in other mandatory fields with valid values:
      | field      | value               |
      | first_name | Test                |
      | email      | b@test.com          |
    And the recruiter submits the form
    Then the system should return HTTP 201 Created

  # ==================== ADDRESS FIELD VALIDATION SCENARIOS ====================

  Scenario: Accept address with special characters (commas, periods, hyphens)
    Given the recruiter is on the add candidate form
    When the recruiter enters address as "Calle Principal, nº 123 - 2º B, 28001 Madrid"
    And fills in other mandatory fields with valid values:
      | field      | value                   |
      | first_name | David                   |
      | last_name  | Jiménez                 |
      | email      | david.jimenez@test.com  |
    And the recruiter submits the form
    Then the system should return HTTP 201 Created
    And the candidate should be created with the complete address

  Scenario: Accept address field when left empty (optional field)
    Given the recruiter is on the add candidate form
    When the recruiter leaves the address field empty
    And fills in mandatory fields with valid values:
      | field      | value                    |
      | first_name | Francisco                |
      | last_name  | Domínguez                |
      | email      | francisco.dom@test.com   |
    And the recruiter submits the form
    Then the system should return HTTP 201 Created
    And the candidate should be created with address as null

  Scenario: Accept address exceeding typical length (up to 500 characters)
    Given the recruiter is on the add candidate form
    When the recruiter enters a long address of 500 characters
    And fills in other mandatory fields with valid values:
      | field      | value                    |
      | first_name | Germán                   |
      | last_name  | Castillo                 |
      | email      | german.castillo@test.com |
    And the recruiter submits the form
    Then the system should return HTTP 201 Created

  Scenario: Reject address exceeding maximum length (500+ characters)
    Given the recruiter is on the add candidate form
    When the recruiter enters an address exceeding 500 characters
    And fills in other mandatory fields with valid values:
      | field      | value                    |
      | first_name | Hernán                   |
      | last_name  | Vázquez                  |
      | email      | hernan.vazquez@test.com  |
    And the recruiter submits the form
    Then the system should return HTTP 400 Bad Request
    And the error message should contain "address must not exceed 500 characters"

  # ==================== EDUCATION FIELD VALIDATION SCENARIOS ====================

  Scenario: Accept education field with degree name
    Given the recruiter is on the add candidate form
    When the recruiter enters education as "Bachelor's in Computer Science"
    And fills in other mandatory fields with valid values:
      | field      | value                    |
      | first_name | Ignacio                  |
      | last_name  | Huerta                   |
      | email      | ignacio.huerta@test.com  |
    And the recruiter submits the form
    Then the system should return HTTP 201 Created
    And the candidate should be created with education "Bachelor's in Computer Science"

  Scenario: Accept education field when left empty (optional field)
    Given the recruiter is on the add candidate form
    When the recruiter leaves the education field empty
    And fills in mandatory fields with valid values:
      | field      | value                    |
      | first_name | Juan                     |
      | last_name  | Lozano                   |
      | email      | juan.lozano@test.com     |
    And the recruiter submits the form
    Then the system should return HTTP 201 Created
    And the candidate should be created with education as null

  Scenario: Accept education with multiple degrees
    Given the recruiter is on the add candidate form
    When the recruiter enters education as "Bachelor's in Engineering, Master's in Business Administration"
    And fills in other mandatory fields with valid values:
      | field      | value                   |
      | first_name | Leonor                  |
      | last_name  | Montero                 |
      | email      | leonor.montero@test.com |
    And the recruiter submits the form
    Then the system should return HTTP 201 Created

  # ==================== EXPERIENCE FIELD VALIDATION SCENARIOS ====================

  Scenario: Accept experience field with job title and years
    Given the recruiter is on the add candidate form
    When the recruiter enters experience as "Senior Software Engineer, 5 years"
    And fills in other mandatory fields with valid values:
      | field      | value                    |
      | first_name | Manuela                  |
      | last_name  | Navarro                  |
      | email      | manuela.navarro@test.com |
    And the recruiter submits the form
    Then the system should return HTTP 201 Created
    And the candidate should be created with experience "Senior Software Engineer, 5 years"

  Scenario: Accept experience field when left empty (optional field)
    Given the recruiter is on the add candidate form
    When the recruiter leaves the experience field empty
    And fills in mandatory fields with valid values:
      | field      | value                    |
      | first_name | Norberto                 |
      | last_name  | Parra                    |
      | email      | norberto.parra@test.com  |
    And the recruiter submits the form
    Then the system should return HTTP 201 Created
    And the candidate should be created with experience as null

  Scenario: Accept experience with multiple job entries
    Given the recruiter is on the add candidate form
    When the recruiter enters experience as "Manager at Company A (3 years), Developer at Company B (2 years)"
    And fills in other mandatory fields with valid values:
      | field      | value                    |
      | first_name | Olga                     |
      | last_name  | Peña                     |
      | email      | olga.pena@test.com       |
    And the recruiter submits the form
    Then the system should return HTTP 201 Created

  # ==================== FILE UPLOAD VALIDATION SCENARIOS ====================
  # AC4: Support CV upload in PDF or DOCX format

  Scenario: Successfully upload valid PDF CV
    Given the recruiter is on the add candidate form
    When the recruiter fills in mandatory fields with valid values:
      | field      | value                     |
      | first_name | Petra                     |
      | last_name  | Quintana                  |
      | email      | petra.quintana@test.com   |
    And the recruiter uploads a valid PDF file "CV_Petra_Quintana.pdf"
    And the file size is within limits (5MB)
    And the recruiter submits the form
    Then the system should return HTTP 201 Created
    And the CV file should be stored in secure storage
    And the candidate record should have a reference to the uploaded file
    And the file should not be accessible via direct URL (secure access only)

  Scenario: Successfully upload valid DOCX CV
    Given the recruiter is on the add candidate form
    When the recruiter fills in mandatory fields with valid values:
      | field      | value                    |
      | first_name | Ramón                    |
      | last_name  | Reyes                    |
      | email      | ramon.reyes@test.com     |
    And the recruiter uploads a valid DOCX file "CV_Ramon_Reyes.docx"
    And the file size is within limits (5MB)
    And the recruiter submits the form
    Then the system should return HTTP 201 Created
    And the CV file should be stored securely

  Scenario: Reject upload of unsupported file format (DOC)
    Given the recruiter is on the add candidate form
    When the recruiter fills in mandatory fields with valid values:
      | field      | value                   |
      | first_name | Sandra                  |
      | last_name  | Soria                   |
      | email      | sandra.soria@test.com   |
    And the recruiter uploads a DOC file "CV_Sandra_Soria.doc"
    And the recruiter submits the form
    Then the system should return HTTP 400 Bad Request
    And the error message should contain "Only PDF and DOCX files are supported"
    And the candidate should not be created

  Scenario: Reject upload of unsupported file format (TXT)
    Given the recruiter is on the add candidate form
    When the recruiter uploads a TXT file "CV_candidate.txt"
    And the recruiter submits the form
    Then the system should return HTTP 400 Bad Request
    And the error message should contain "Only PDF and DOCX files are supported"

  Scenario: Reject upload of image file instead of document
    Given the recruiter is on the add candidate form
    When the recruiter uploads an image file "cv_image.png"
    And the recruiter submits the form
    Then the system should return HTTP 400 Bad Request
    And the error message should contain "Only PDF and DOCX files are supported"

  Scenario: Reject file upload exceeding size limit (>5MB)
    Given the recruiter is on the add candidate form
    When the recruiter fills in mandatory fields with valid values:
      | field      | value                    |
      | first_name | Tomás                    |
      | last_name  | Toledo                   |
      | email      | tomas.toledo@test.com    |
    And the recruiter uploads a PDF file larger than 5MB
    And the recruiter submits the form
    Then the system should return HTTP 413 Payload Too Large
    And the error message should contain "File size must not exceed 5MB"
    And the candidate should not be created

  Scenario: Accept submission without CV attachment (optional)
    Given the recruiter is on the add candidate form
    When the recruiter fills in mandatory fields with valid values:
      | field      | value                    |
      | first_name | Úrsula                   |
      | last_name  | Urbano                   |
      | email      | ursula.urbano@test.com   |
    And the recruiter does not upload any CV file
    And the recruiter submits the form
    Then the system should return HTTP 201 Created
    And the candidate should be created without a CV attachment

  Scenario: Reject upload of executable file disguised as PDF
    Given the recruiter is on the add candidate form
    When the recruiter uploads a malicious file "CV.pdf.exe"
    And the recruiter submits the form
    Then the system should return HTTP 400 Bad Request
    And the error message should contain "Invalid file type"

  Scenario: Handle upload of corrupted PDF file
    Given the recruiter is on the add candidate form
    When the recruiter uploads a corrupted PDF file "corrupted.pdf"
    And the recruiter submits the form
    Then the system should return HTTP 400 Bad Request
    And the error message should contain "File is corrupted or invalid"

  Scenario: Handle upload of password-protected PDF
    Given the recruiter is on the add candidate form
    When the recruiter uploads a password-protected PDF file
    And the recruiter submits the form
    Then the system should return HTTP 400 Bad Request
    And the error message should contain "PDF file is password-protected"

  # ==================== SECURITY SCENARIOS ====================
  # SQL Injection attempts in various fields

  Scenario: Safely handle SQL injection attempt in first_name field
    Given the recruiter is on the add candidate form
    When the recruiter enters first_name as "Juan'; DROP TABLE candidates; --"
    And fills in other mandatory fields with valid values:
      | field      | value                  |
      | last_name  | Pérez                  |
      | email      | juan.perez@test.com    |
    And the recruiter submits the form
    Then the system should return HTTP 201 Created (OR HTTP 400 Bad Request with sanitization)
    And the candidate should be created with sanitized first_name
    And the database table should remain intact
    And no SQL code execution should occur

  Scenario: Safely handle SQL injection attempt in email field
    Given the recruiter is on the add candidate form
    When the recruiter enters email as "test' OR '1'='1@example.com"
    And fills in other mandatory fields with valid values:
      | field      | value     |
      | first_name | Valentina |
      | last_name  | Vargas    |
    And the recruiter submits the form
    Then the system should sanitize or reject the email
    And no SQL code execution should occur

  Scenario: Safely handle SQL injection in address field
    Given the recruiter is on the add candidate form
    When the recruiter enters address as "123 Main St'; UPDATE candidates SET name='hacked' WHERE '1'='1"
    And fills in other mandatory fields with valid values:
      | field      | value                   |
      | first_name | Walter                  |
      | last_name  | Watkins                 |
      | email      | walter.watkins@test.com |
    And the recruiter submits the form
    Then the system should sanitize the address
    And no unauthorized database updates should occur

  # XSS Attack scenarios

  Scenario: Safely handle XSS attack in first_name field
    Given the recruiter is on the add candidate form
    When the recruiter enters first_name as "<script>alert('XSS')</script>"
    And fills in other mandatory fields with valid values:
      | field      | value                 |
      | last_name  | Xavier                |
      | email      | xavier.x@test.com     |
    And the recruiter submits the form
    Then the system should return HTTP 201 Created or HTTP 400 Bad Request
    And the script should be escaped or removed
    And no script execution should occur when displaying the candidate name

  Scenario: Safely handle XSS attack with event handler in education field
    Given the recruiter is on the add candidate form
    When the recruiter enters education as "<img src=x onerror='alert(\"XSS\")'>"
    And fills in other mandatory fields with valid values:
      | field      | value                   |
      | first_name | Yasmin                  |
      | last_name  | Yilmaz                  |
      | email      | yasmin.yilmaz@test.com  |
    And the recruiter submits the form
    Then the system should sanitize the input
    And no event handlers should be executed

  Scenario: Safely handle XSS attack in experience field
    Given the recruiter is on the add candidate form
    When the recruiter enters experience as "javascript:alert('XSS')"
    And fills in other mandatory fields with valid values:
      | field      | value                    |
      | first_name | Zachary                  |
      | last_name  | Zimmerman                |
      | email      | zachary.zimmerman@test.c |
    And the recruiter submits the form
    Then the system should return HTTP 201 Created or sanitize the input
    And no JavaScript execution should occur

  # Authentication and Authorization scenarios

  Scenario: Reject request from unauthenticated user
    Given the recruiter is not authenticated
    When the recruiter attempts to POST to /api/candidates with valid data
    Then the system should return HTTP 401 Unauthorized
    And the candidate should not be created
    And an audit log entry should record the unauthorized attempt

  Scenario: Reject request with invalid authentication token
    Given the recruiter has an expired or invalid token
    When the recruiter submits the form with invalid credentials
    Then the system should return HTTP 401 Unauthorized
    And the candidate should not be created

  Scenario: Reject request from user without add_candidate permission
    Given the recruiter is authenticated
    But the recruiter does not have the "add_candidate" permission
    When the recruiter submits a valid candidate form
    Then the system should return HTTP 403 Forbidden
    And the error message should contain "Insufficient permissions"
    And the candidate should not be created

  Scenario: Reject request with manipulated authorization header
    Given the recruiter attempts to modify the authorization header
    When the recruiter submits a candidate form with tampered token
    Then the system should return HTTP 401 Unauthorized
    And the candidate should not be created

  # ==================== EDGE CASES & SPECIAL CHARACTERS ====================

  Scenario: Accept first_name with numbers (part of a name)
    Given the recruiter is on the add candidate form
    When the recruiter enters first_name as "Juan2" (unusual but valid)
    And fills in other mandatory fields with valid values:
      | field      | value                   |
      | last_name  | Valle                   |
      | email      | juan2.valle@test.com    |
    And the recruiter submits the form
    Then the system should return HTTP 201 Created

  Scenario: Safely handle first_name with emoji characters
    Given the recruiter is on the add candidate form
    When the recruiter enters first_name as "Juan 😊"
    And fills in other mandatory fields with valid values:
      | field      | value                  |
      | last_name  | Valdez                 |
      | email      | juan.valdez@test.com   |
    And the recruiter submits the form
    Then the system should handle emoji appropriately (store or reject)
    And proper UTF-8 encoding should be maintained

  Scenario: Accept address with apartment/unit numbers and special formatting
    Given the recruiter is on the add candidate form
    When the recruiter enters address as "Apt. 4B, 123 Oak Avenue, Suite 200"
    And fills in other mandatory fields with valid values:
      | field      | value                   |
      | first_name | Emma                    |
      | last_name  | Edwards                 |
      | email      | emma.edwards@test.com   |
    And the recruiter submits the form
    Then the system should return HTTP 201 Created

  Scenario: Accept email with consecutive dots (if RFC allows)
    Given the recruiter is on the add candidate form
    When the recruiter enters email as "first.last@example.com"
    And fills in other mandatory fields with valid values:
      | field      | value                   |
      | first_name | Franklin                |
      | last_name  | Foster                  |
      | email      | franklin.foster@test.com|
    And the recruiter submits the form
    Then the system should return HTTP 201 Created

  Scenario: Handle form with trailing and leading whitespace in fields
    Given the recruiter is on the add candidate form
    When the recruiter enters fields with leading/trailing spaces:
      | field      | value                    |
      | first_name |  "  Gabriela  "          |
      | last_name  |  "  García  "            |
      | email      |  "  gabriela@test.com  " |
    And the recruiter submits the form
    Then the system should trim whitespace
    And the system should return HTTP 201 Created
    And the candidate should be stored with trimmed values

  Scenario: Handle case sensitivity in email normalization
    Given the recruiter is on the add candidate form
    When the recruiter enters email as "HELENA.HERNANDEZ@EXAMPLE.COM"
    And fills in other mandatory fields with valid values:
      | field      | value                    |
      | first_name | Helena                   |
      | last_name  | Hernández                |
    And the recruiter submits the form
    Then the system should normalize the email to lowercase
    And the system should return HTTP 201 Created
    And the candidate should be stored with email "helena.hernandez@example.com"

  Scenario: Prevent duplicate candidate with same email
    Given the candidate "Ivan Iglesias" with email "ivan.iglesias@test.com" already exists
    When another recruiter attempts to add a candidate with email "ivan.iglesias@test.com"
    And fills in the form with:
      | field      | value                   |
      | first_name | Ivan                    |
      | last_name  | Iglesias                |
      | email      | ivan.iglesias@test.com  |
    And the recruiter submits the form
    Then the system should return HTTP 409 Conflict
    And the error message should contain "Email already exists"
    And no duplicate candidate should be created

  # ==================== ERROR HANDLING SCENARIOS ====================
  # AC6: Proper error handling for server failures

  Scenario: Handle database connection timeout
    Given the database connection is timing out
    When the recruiter submits a valid candidate form
    Then the system should return HTTP 504 Gateway Timeout
    And the error message should contain "Database connection timeout. Please try again."
    And no partial candidate record should be created

  Scenario: Handle database unavailability
    Given the database server is unavailable
    When the recruiter submits a valid candidate form
    Then the system should return HTTP 503 Service Unavailable
    And the error message should contain "Service temporarily unavailable. Please try again later."
    And the recruiter should be able to retry without issues

  Scenario: Handle file storage service unavailability during CV upload
    Given the file storage service is unavailable
    When the recruiter fills in mandatory fields and uploads a CV
    And the recruiter submits the form
    Then the system should return HTTP 503 Service Unavailable
    And the error message should contain "File storage service unavailable"
    And the candidate should not be created

  Scenario: Handle partial failure during candidate creation
    Given the candidate data is valid
    But the database insert for candidate details partially fails
    When the recruiter submits the form
    Then the system should rollback the transaction
    And the system should return HTTP 500 Internal Server Error
    And the candidate record should not be created
    And an error log should be generated for debugging

  Scenario: Handle email service unavailability (if confirmation email needed)
    Given the email service is unavailable
    When the recruiter submits a valid candidate form
    Then the system should return HTTP 201 Created (candidate created successfully)
    Or queue the email for retry
    And the candidate record should be created regardless
    And an async task should be scheduled to send the confirmation email

  Scenario: Handle network timeout during file upload
    Given the recruiter is uploading a CV file
    When the network connection is lost midway through upload
    And the file upload is interrupted
    Then the system should handle the incomplete upload gracefully
    And the system should return HTTP 408 Request Timeout
    And the candidate should not be created with an incomplete file

  Scenario: Handle extremely large payload request
    Given the recruiter submits a form with a payload exceeding server limits
    When the payload size is greater than configured maximum (e.g., 10MB)
    Then the system should return HTTP 413 Payload Too Large
    And the request should be rejected before processing

  Scenario: Handle malformed JSON in API request
    Given a recruiter sends a direct API request with malformed JSON
    When the Content-Type is "application/json" but the body is invalid JSON
    Then the system should return HTTP 400 Bad Request
    And the error message should contain "Invalid JSON format"

  # ==================== CONCURRENCY & IDEMPOTENCY SCENARIOS ====================

  Scenario: Handle duplicate submission - form submitted twice rapidly
    Given the recruiter submits a valid candidate form
    When the recruiter immediately clicks submit again before receiving response
    Then the system should handle duplicate request gracefully
    And exactly one candidate record should be created
    And the second request should return HTTP 409 Conflict or HTTP 201 with same ID
    And an idempotency key should be generated or required

  Scenario: Handle concurrent candidate creation with same email
    Given two recruiters simultaneously submit forms with the same email "jack@example.com"
    When both form submissions arrive at the server within milliseconds
    And both requests pass initial validation
    Then the system should allow one to succeed with HTTP 201 Created
    And the other should fail with HTTP 409 Conflict
    And exactly one candidate record should be created
    And a unique constraint on email should be enforced

  Scenario: Handle race condition in file upload and candidate creation
    Given the recruiter is uploading a CV and submitting candidate data simultaneously
    When the file upload completes before the database insert
    Then the system should maintain consistency
    And if the candidate creation fails, the uploaded file should be cleaned up
    Or the file reference should remain for retry

  # ==================== INTEGRATION SCENARIOS ====================

  Scenario: End-to-end candidate creation with all optional fields
    Given the recruiter is authenticated and on the add candidate page
    When the recruiter fills in all fields with complete information:
      | field      | value                               |
      | first_name | Karen                               |
      | last_name  | King                                |
      | email      | karen.king@example.com              |
      | phone      | +34 912 345 678                     |
      | address    | Paseo de la Castellana 123, Madrid  |
      | education  | Master's in Data Science            |
      | experience | Data Analyst, 3 years               |
    And the recruiter uploads a CV file "Karen_King_CV.pdf"
    And the recruiter submits the form
    Then the system should return HTTP 201 Created
    And the candidate record should be created with all fields
    And the CV file should be stored securely
    And a success message should be displayed
    And the recruiter should be redirected to candidate details page
    And an audit log entry should record the creation

  Scenario: Verify audit trail for candidate creation
    Given a candidate has been successfully created
    When the audit log is checked
    Then the log should contain:
      | field          | value                      |
      | action         | candidate_created          |
      | recruiter_id   | (authenticated user)       |
      | timestamp      | (current timestamp)        |
      | candidate_id   | (newly created ID)         |
      | candidate_email| (created candidate email)  |

  Scenario: Verify candidate is accessible after creation
    Given a candidate has been successfully created
    When the recruiter retrieves the candidate details via GET /api/candidates/{id}
    Then the system should return HTTP 200 OK
    And the response should contain all submitted data
    And the CV file should be downloadable with proper access control

  Scenario: End-to-end workflow with form validation feedback
    Given the recruiter is on the add candidate form
    When the recruiter enters invalid data in multiple fields:
      | field      | value       |
      | email      | invalid     |
      | phone      | abc123@#    |
    And the recruiter submits the form
    Then the system should return HTTP 400 Bad Request
    And the error response should specify all validation errors
    And the form should highlight all invalid fields
    And the recruiter should be able to correct and resubmit

  Scenario: Dashboard integration - verify "Add Candidate" button accessibility
    Given the recruiter is logged in to the dashboard
    When the recruiter views the recruiter dashboard
    Then the "Add Candidate" button should be visible
    And the button should be properly positioned and styled
    And the button should be clickable and responsive
    And clicking the button should navigate to the add candidate form

  Scenario: Verify success confirmation message display
    Given a candidate has been successfully created
    When the success page is displayed
    Then the confirmation message should contain:
      | element        | expected content          |
      | message text   | "Candidato añadido exitosamente" |
      | candidate name | (created candidate name)  |
      | next action    | Link to view details OR   |
      |                | Link to add another       |

  # ==================== ACCESSIBILITY & COMPATIBILITY SCENARIOS ====================
  # AC7: Accessibility and cross-browser/device compatibility

  Scenario: Verify form accessibility for screen readers
    Given the recruiter is using a screen reader
    When the recruiter navigates the add candidate form
    Then all form fields should have proper labels
    And all labels should be associated with input fields using <label> tags
    And required fields should be marked as required
    And error messages should be announced by the screen reader
    And form instructions should be available to screen readers

  Scenario: Verify form keyboard navigation
    Given the recruiter is using only keyboard (no mouse)
    When the recruiter navigates the add candidate form
    Then all form fields should be accessible via Tab key
    And the Tab order should be logical and match visual order
    And the submit button should be reachable via keyboard
    And all interactive elements should have visible focus indicators

  Scenario: Verify form works on mobile devices
    Given the recruiter is using a mobile device (iPhone/Android)
    When the recruiter opens the add candidate form
    Then the form should be responsive and display correctly
    And all input fields should be touch-friendly (minimum 44x44 pixels)
    And the file upload should work on mobile
    And the submit button should be easily tappable
    And form fields should not require horizontal scrolling

  Scenario: Verify form works on tablet devices
    Given the recruiter is using a tablet device (iPad)
    When the recruiter opens the add candidate form
    Then the form should be responsive and optimized for tablet
    And form layout should adapt to landscape and portrait orientations
    And all fields should be easily accessible

  Scenario: Verify form works on different browsers
    Given the recruiter is using different browsers:
      | browser        | version |
      | Chrome         | latest  |
      | Firefox        | latest  |
      | Safari         | latest  |
      | Edge           | latest  |
    When the recruiter opens the add candidate form in each browser
    Then the form should render correctly in all browsers
    And all validations should work consistently
    And file upload should work across all browsers
    And no console errors should appear

  Scenario: Verify form respects user color preferences (light/dark mode)
    Given the operating system is set to dark mode
    When the recruiter views the add candidate form
    Then the form should adapt to dark mode
    And text should be readable with sufficient contrast
    And input fields should be visible and usable

  Scenario: Verify form works with browser extensions and tools
    Given the recruiter is using password managers or form fillers
    When the recruiter opens the add candidate form
    Then browser extensions should not break form functionality
    And the form should work properly with autofill features
    And form submission should work after autofill

  Scenario: Verify form works with different language/locale settings
    Given the recruiter's browser is set to different locales
    When the recruiter opens the add candidate form
    Then the form should display properly
    And date/time formats should respect locale settings (if applicable)
    And number formats should respect locale settings (if applicable)
    And text input for international names should work correctly

  # ==================== DATA INTEGRITY SCENARIOS ====================

  Scenario: Verify UTF-8 encoding is maintained for international characters
    Given the recruiter enters a candidate with special characters
    When the recruiter enters first_name "François" and last_name "Müller"
    And fills in other mandatory fields with valid values:
      | field      | value                      |
      | email      | francois.muller@test.com   |
    And the recruiter submits the form
    Then the system should return HTTP 201 Created
    And the database should store the characters with proper UTF-8 encoding
    And when retrieved, the data should display correctly with accents

  Scenario: Verify special emoji characters are handled properly
    Given the recruiter enters a candidate with emoji
    When the recruiter enters first_name "José 🇪🇸"
    And fills in other mandatory fields with valid values:
      | field      | value                 |
      | last_name  | García                |
      | email      | jose.garcia@test.com  |
    And the recruiter submits the form
    Then the system should handle emoji (store, sanitize, or reject appropriately)
    And database encoding should support emoji if stored
    And the behavior should be documented and consistent

  Scenario: Verify data type consistency - email stored as string
    Given a candidate has been created
    When the candidate data is retrieved from the API
    Then the email field should be returned as a string type
    And numeric fields should be numeric types
    And boolean fields should be boolean types
    And null/empty fields should be null, not empty strings

  Scenario: Verify candidate ID format consistency
    Given a candidate has been successfully created
    When the creation response is returned
    Then the candidate ID should be in the expected format (UUID, integer, etc.)
    And subsequent API calls using this ID should work correctly
    And the ID should be immutable and never change

  Scenario: Verify timestamp fields are set correctly
    Given a candidate has been successfully created
    When the candidate details are retrieved
    Then the created_at timestamp should be set to current time
    And the updated_at timestamp should match created_at
    And timestamps should be in a standard format (ISO 8601)
    And timestamps should include timezone information

  Scenario: Verify data consistency across multiple reads
    Given a candidate has been successfully created
    When the candidate data is retrieved multiple times
    Then all reads should return identical data
    And no data should be modified between reads (unless updated)
    And database consistency should be maintained

  # ==================== RATE LIMITING & THROTTLING ====================

  Scenario: Handle rate limiting - multiple rapid submissions
    Given a recruiter is sending rapid requests
    When the recruiter submits 100 candidate forms in 1 minute
    Then the system should enforce rate limiting
    And requests exceeding the limit should return HTTP 429 Too Many Requests
    And the error message should indicate retry timing
    And legitimate subsequent requests should work after rate limit window

  Scenario: Verify rate limiting is per-user, not global
    Given multiple recruiters are simultaneously creating candidates
    When recruiter A submits 50 rapid requests
    And recruiter B submits normal requests concurrently
    Then recruiter A should be rate limited (HTTP 429)
    But recruiter B's requests should succeed
    And rate limiting should be applied per user/IP, not globally

  # ==================== FORM STATE & SESSION MANAGEMENT ====================

  Scenario: Preserve form data when adding CV file
    Given the recruiter has filled in the form with candidate data
    When the recruiter selects and uploads a CV file
    Then the previously entered form data should be preserved
    And the file upload should not clear other fields
    And the recruiter should be able to modify any field after upload

  Scenario: Clear form after successful submission
    Given a candidate has been successfully created
    When the success page is shown or the form is reset
    Then the form should be cleared of all previous data
    And the form should be ready for entering a new candidate

  Scenario: Warn user before leaving page with unsaved data
    Given the recruiter has filled in some form fields
    When the recruiter attempts to navigate away or close the tab
    Then the browser should show a confirmation dialog
    And the dialog should indicate there is unsaved data
    And the recruiter should be able to cancel navigation or proceed

  Scenario: Handle session timeout during form submission
    Given the recruiter's session has expired
    When the recruiter submits the form
    Then the system should return HTTP 401 Unauthorized
    And the user should be redirected to login
    And the form data should ideally be preserved (optional)

  # ==================== COMPLIANCE & PRIVACY SCENARIOS ====================

  Scenario: Verify GDPR compliance - candidate data is stored securely
    Given candidate data including personal information is created
    When the candidate is stored in the database
    Then the data should be encrypted at rest
    And access should be logged for audit purposes
    And the recruiter should have the ability to delete/export candidate data later

  Scenario: Verify sensitive data is not logged in plain text
    Given a candidate with email and phone is created
    When logs are generated for this operation
    Then sensitive information should be masked or hashed in logs
    And full candidate details should not appear in application logs
    And audit logs should only record necessary metadata

  Scenario: Verify CV file storage complies with data protection requirements
    Given a CV file is uploaded
    When the file is stored
    Then the file should be encrypted at rest
    And the file should be stored outside the main database (secure file storage)
    And only authorized users should be able to access it
    And file deletion should be supported for data subject requests
