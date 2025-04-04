document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.querySelector("#registerForm");
    const loginForm = document.querySelector("#loginForm");
    const userForm = document.querySelector("#userForm");
    const familyForm = document.querySelector("#familyForm"); // Add family form reference
    const experienceForm = document.querySelector("#experienceForm");
    const qualificationForm = document.querySelector("#qualificationForm");
    const medicalInfoForm = document.querySelector("#healthForm"); 

    console.log("DOM fully loaded"); // Debugging
// 🔹 Function to validate email format
function isValidEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
}

// Register User with Email Validation
if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        console.log("Register form submitted"); // Debugging

        const username = document.querySelector("#username").value;
        const email = document.querySelector("#email").value;
        const password = document.querySelector("#password").value;

        if (!isValidEmail(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        try {
            const response = await fetch("https://prasa-backend-final.vercel.app/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password })
            });

            const result = await response.json();
            alert(result.message);

            // Redirect to login page after successful registration
            if (response.ok) {
                window.location.href = "login.html";
            }
        } catch (error) {
            console.error("Registration error:", error);
            alert("An error occurred during registration. Please try again.");
        }
    });
}

// Login User with Email Validation
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        console.log("Login form submitted"); // Debugging
        
        const email = document.querySelector("#email").value;
        const password = document.querySelector("#password").value;
        
        if (!isValidEmail(email)) {
            alert("Please enter a valid email address.");
            return;
        }
        
        try {
            // ✅ Step 1: Send login request
            const response = await fetch("https://prasa-backend-final.vercel.app/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            
            const result = await response.json();
            
            if (response.ok && result.token) {
                // ✅ Step 2: Store token & email in localStorage
                localStorage.setItem("token", result.token);
                localStorage.setItem("userEmail", result.email);
                console.log("Login successful, stored email:", result.email);
                
                // ✅ Step 3: Check if user exists in user_data
                const profileResponse = await fetch(`https://prasa-backend-final.vercel.app/api/profile/${email}`, {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${result.token}` }
                });
                
                // 🔹 Check if user was redirected for filling form
                const redirectTo = localStorage.getItem("redirectTo");
                
                if (profileResponse.ok) {
                    console.log("User exists in user_data.");
                    
                    // If the user was redirected after logout to fill a form
                    if (redirectTo === "userForm") {
                        localStorage.removeItem("redirectTo"); // Remove redirect flag
                        window.location.href = "form.html"; // Redirect to the form page
                    } else {
                        window.location.href = "profile.html"; // Normal profile page
                    }
                } else {
                    console.log("User not found in user_data. Redirecting to form...");
                    window.location.href = "form.html"; // Redirect to complete profile form
                }
            } else {
                alert(result.message || "Invalid login credentials");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("An error occurred during login. Please try again.");
        }
    });
}


    // Register User
    

    // Submit User Details (Update or Create User Data)
   // Submit User Details (Update or Create User Data)
if (userForm) {
    console.log("User form found"); // Debugging

    // Function to validate email
    function isValidEmail(email) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    }

    // Function to validate phone number (must be 10 digits, starts with 6-9)
    function isValidPhone(phone) {
        const phonePattern = /^[6-9]\d{9}$/;
        return phonePattern.test(phone);
    }

    // Function to validate Aadhar number (must be 12 digits)
    function isValidAadhar(aadhar) {
        const aadharPattern = /^\d{12}$/;
        return aadharPattern.test(aadhar);
    }

    // Function to validate IFSC Code (must be 4 letters + 7 digits)
    function isValidIFSC(ifsc) {
        const ifscPattern = /^[A-Z]{4}0[A-Z0-9]{6}$/;
        return ifscPattern.test(ifsc);
    }

    // Function to check required fields
    function checkRequiredFields(form) {
        let isValid = true;
        form.querySelectorAll("input[required], select[required]").forEach((input) => {
            if (input.value.trim() === "") {
                isValid = false;
                alert(`Please fill out the ${input.placeholder || input.name} field.`);
            }
        });
        return isValid;
    }

    // Check if user is logged in
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("userEmail");
    console.log("Retrieved from localStorage - Token:", token ? "Present (not showing for security)" : "Not found");
    console.log("Retrieved from localStorage - Email:", email);
    
    if (!token || !email) {
        alert("You need to log in first");
        window.location.href = "login.html";
        return;
    }

    // Pre-fill data if it exists
    fetchUserData();

    userForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        console.log("User form submitted"); // Debugging

        const formData = {
            email: email, // Use email from localStorage
            title: document.querySelector("#title")?.value || "",
            firstName: document.querySelector("#firstName")?.value || "",
            middleName: document.querySelector("#middleName")?.value || "",
            lastName: document.querySelector("#lastName")?.value || "",
            dob: document.querySelector("#dob")?.value || "",
            age: document.querySelector("#age")?.value || "",
            address: document.querySelector("#address")?.value || "",
            phone: document.querySelector("#phone")?.value || "",
            city: document.querySelector("#city")?.value || "",
            state: document.querySelector("#state")?.value || "",
            pinCode: document.querySelector("#pinCode")?.value || "",
            country: document.querySelector("#country")?.value || "",
            nationality: document.querySelector("#nationality")?.value || "",
            religion: document.querySelector("#religion")?.value || "",
            aadharNo: document.querySelector("#aadharNo")?.value || "",
            drivingLicenseNo: document.querySelector("#drivingLicenseNo")?.value || "",
            panNo: document.querySelector("#panNo")?.value || "",
            passportNo: document.querySelector("#passportNo")?.value || "",
            votingCardNo: document.querySelector("#votingCardNo")?.value || "",
            rationCardNo: document.querySelector("#rationCardNo")?.value || "",
            uanNo: document.querySelector("#uanNo")?.value || "",
            esicNo: document.querySelector("#esicNo")?.value || "",
            bankName: document.querySelector("#bankName")?.value || "",
            ifscCode: document.querySelector("#ifscCode")?.value || "",
            accountNo: document.querySelector("#accountNo")?.value || "",
            bankBranch: document.querySelector("#bankBranch")?.value || "",
            maritalStatus: document.querySelector("#maritalStatus")?.value || "",
            spouseName: document.querySelector("#spouseName")?.value || "",
            children: document.querySelector("#children")?.value || "",
            dateOfJoining: document.querySelector("#dateOfJoining")?.value || "",
            department: document.querySelector("#department")?.value || "",
            designation: document.querySelector("#designation")?.value || "",
            reportingTo: document.querySelector("#reportingTo")?.value || "",
            totalexperience: document.querySelector("#totalexperience")?.value || ""
        };

        console.log("Submitting data with email:", formData.email);
        console.log("Full form data:", formData);
        console.log("Auth token being used (first few chars):", token.substring(0, 10) + "...");

        // 🔹 VALIDATIONS
        if (!checkRequiredFields(userForm)) return;

        if (formData.phone && !isValidPhone(formData.phone)) {
            alert("Please enter a valid 10-digit phone number.");
            return;
        }

        if (formData.aadharNo && !isValidAadhar(formData.aadharNo)) {
            alert("Please enter a valid 12-digit Aadhar number.");
            return;
        }

        if (formData.ifscCode && !isValidIFSC(formData.ifscCode)) {
            alert("Please enter a valid IFSC Code (e.g., HDFC0001234).");
            return;
        }

        try {
            const response = await fetch("https://prasa-backend-final.vercel.app/api/submit-form", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            console.log("Server response:", result);

            if (response.ok) {
                alert(result.message);
                // Redirect to family form instead of experience form
                window.location.href = "family.html";
            } else {
                alert(result.message || "Error submitting form");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("An error occurred while submitting the form. Please try again.");
        }
    });
}

    // Family Form - New code
    // Family Form - Updated code
    if (familyForm) {
        console.log("Family form found");
    
        // Function to validate email format
        function isValidEmail(email) {
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return emailPattern.test(email);
        }
    
        // Function to validate phone number (must be 10 digits, starts with 6-9)
        function isValidPhone(phone) {
            const phonePattern = /^[6-9]\d{9}$/;
            return phonePattern.test(phone);
        }
    
        // Function to validate Aadhar number (must be 12 digits)
        function isValidAadhar(aadhar) {
            const aadharPattern = /^\d{12}$/;
            return aadharPattern.test(aadhar);
        }
    
        // Function to check required fields
        function checkRequiredFields(form) {
            let isValid = true;
            form.querySelectorAll("input[required], select[required]").forEach((input) => {
                if (input.value.trim() === "") {
                    isValid = false;
                    alert(`Please fill out the ${input.placeholder || input.name} field.`);
                }
            });
            return isValid;
        }
    
        // Check if user is logged in
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("userEmail");
        if (!token || !email) {
            alert("You need to log in first");
            window.location.href = "login.html";
            return;
        }
    
        // Pre-fill family data if it exists
        fetchUserData();
    
        // Navigate back to personal info
        document.getElementById('backToPersonal')?.addEventListener('click', () => {
            window.location.href = 'form.html';
        });
    
        // Handle family form submission
        familyForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log("Family form submitted");
    
            const formData = {
                email: email,
                nominee1_name: document.querySelector("#nominee1_name")?.value || "",
                nominee1_relationship: document.querySelector("#nominee1_relationship")?.value || "",
                nominee1_share: document.querySelector("#nominee1_share")?.value || "",
                nominee2_name: document.querySelector("#nominee2Name")?.value || "",
                nominee2_relationship: document.querySelector("#nominee2Relationship")?.value || "",
                nominee2_share: document.querySelector("#nominee2Share")?.value || "",
                
                emergency1_name: document.querySelector("#emergency1_name")?.value || "",
                emergency1_relationship: document.querySelector("#emergency1_relationship")?.value || "",
                emergency1_contact: document.querySelector("#emergency1_contact")?.value || "",
                emergency1_email: document.querySelector("#emergency1_email")?.value || "",
                emergency2_name: document.querySelector("#emergency2_name")?.value || "",
                emergency2_relationship: document.querySelector("#emergency2_relationship")?.value || "",
                emergency2_contact: document.querySelector("#emergency2_contact")?.value || "",
                emergency2_email: document.querySelector("#emergency2_email")?.value || "",
                
                family1_name: document.querySelector("#family1_name")?.value || "",
                family1_dob: document.querySelector("#family1_dob")?.value || "",
                family1_relationship: document.querySelector("#family1_relationship")?.value || "",
                family1_occupation: document.querySelector("#family1_occupation")?.value || "",
                family1_aadhar: document.querySelector("#family1_aadhar")?.value || "",
    
                family2_name: document.querySelector("#family2_name")?.value || "",
                family2_dob: document.querySelector("#family2_dob")?.value || "",
                family2_relationship: document.querySelector("#family2_relationship")?.value || "",
                family2_occupation: document.querySelector("#family2_occupation")?.value || "",
                family2_aadhar: document.querySelector("#family2_aadhar")?.value || "",
    
                family3_name: document.querySelector("#family3_name")?.value || "",
                family3_dob: document.querySelector("#family3_dob")?.value || "",
                family3_relationship: document.querySelector("#family3_relationship")?.value || "",
                family3_occupation: document.querySelector("#family3_occupation")?.value || "",
                family3_aadhar: document.querySelector("#family3_aadhar")?.value || "",
    
                family4_name: document.querySelector("#family4_name")?.value || "",
                family4_dob: document.querySelector("#family4_dob")?.value || "",
                family4_relationship: document.querySelector("#family4_relationship")?.value || "",
                family4_occupation: document.querySelector("#family4_occupation")?.value || "",
                family4_aadhar: document.querySelector("#family4_aadhar")?.value || ""
            };
    
            console.log("Submitting family data:", formData);
    
            // ✅ VALIDATIONS
            if (!checkRequiredFields(familyForm)) return;
    
            if (formData.emergency1_email && !isValidEmail(formData.emergency1_email)) {
                alert("Please enter a valid emergency contact email.");
                return;
            }
    
            if (formData.emergency1_contact && !isValidPhone(formData.emergency1_contact)) {
                alert("Please enter a valid 10-digit emergency contact number.");
                return;
            }
    
            if (formData.family1_aadhar && !isValidAadhar(formData.family1_aadhar)) {
                alert("Please enter a valid 12-digit Aadhar number.");
                return;
            }
    
            try {
                const response = await fetch("https://prasa-backend-final.vercel.app/api/submit-family", {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(formData)
                });
    
                const result = await response.json();
                console.log("Server response:", result);
    
                if (response.ok) {
                    alert("Family details saved successfully!");
                    window.location.href = "experience_form.html";
                } else {
                    console.error("Server returned error:", result);
                    alert(result.message || "Error submitting family form.");
                }
            } catch (error) {
                console.error("Error submitting family form:", error);
                alert("An error occurred while submitting the family form.");
            }
        });
    }
    
    
    // Experience Form
    if (experienceForm) {
        console.log("Experience form found");
    
        // Function to validate date range (fromDate should be before toDate)
        function isValidDateRange(fromDate, toDate) {
            return new Date(fromDate) <= new Date(toDate);
        }
    
        // Function to check required fields
        function checkRequiredFields(form) {
            let isValid = true;
            form.querySelectorAll("input[required], select[required]").forEach((input) => {
                if (input.value.trim() === "") {
                    isValid = false;
                    alert(`Please fill out the ${input.placeholder || input.name} field.`);
                }
            });
            return isValid;
        }
    
        // Check if user is logged in
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("userEmail");
        if (!token || !email) {
            alert("You need to log in first");
            window.location.href = "login.html";
            return;
        }
    
        // Pre-fill experience data if it exists
        fetchUserDataex();
    
        // Add more experience entry fields
        document.getElementById('addExperience').addEventListener('click', () => {
            const experienceFields = document.getElementById('experienceFields');
            const newEntry = document.querySelector('.experience-entry').cloneNode(true);
    
            // Clear all input values in the new entry
            newEntry.querySelectorAll('input').forEach(input => {
                input.value = '';
            });
    
            experienceFields.appendChild(newEntry);
        });
    
        // Navigate back to family form
        document.getElementById('backToFamily').addEventListener('click', () => {
            window.location.href = 'family.html';
        });
    
        // Navigate to qualification form
        document.getElementById('goToQualification').addEventListener('click', async (e) => {
            e.preventDefault();
            console.log("Next button clicked - going to qualification form");
    
            // Gather all experience entries
            const experienceEntries = document.querySelectorAll('.experience-entry');
            const company = [];
            const fromDate = [];
            const toDate = [];
            const designation = [];
            const reasonForLeaving = [];
            const achievements = [];
            const kraHandle = [];
            const teamSize = [];
            const contactDetails = [];
    
            let hasEntries = false;
    
            experienceEntries.forEach(entry => {
                // Only include if the company name is filled
                const companyValue = entry.querySelector('input[name="company[]"]').value.trim();
                const fromValue = entry.querySelector('input[name="fromDate[]"]').value;
                const toValue = entry.querySelector('input[name="toDate[]"]').value;
                const designationValue = entry.querySelector('input[name="designation[]"]').value.trim();
    
                if (companyValue && fromValue && toValue && designationValue) {
                    hasEntries = true;
                    company.push(companyValue);
                    fromDate.push(fromValue);
                    toDate.push(toValue);
                    designation.push(designationValue);
                    reasonForLeaving.push(entry.querySelector('input[name="reasonForLeaving[]"]').value);
                    achievements.push(entry.querySelector('input[name="achievements[]"]').value || "");
                    kraHandle.push(entry.querySelector('input[name="kraHandle[]"]').value || "");
                    teamSize.push(entry.querySelector('input[name="teamSize[]"]').value || "");
                    contactDetails.push(entry.querySelector('input[name="contactDetails[]"]').value || "");
    
                    // ✅ Validate Date Range
                    if (!isValidDateRange(fromValue, toValue)) {
                        alert(`Invalid date range for ${companyValue}. "From" date must be before "To" date.`);
                        return;
                    }
                }
            });
    
            if (!hasEntries) {
                alert("Please enter at least one valid experience entry.");
                return;
            }
    
            const formData = {
                email: email,
                company, 
                fromDate, 
                toDate, 
                designation, 
                reasonForLeaving,
                achievements, 
                kraHandle, 
                teamSize, 
                contactDetails
            };
    
            console.log("Submitting experience data:", formData);
    
            // ✅ Validate Required Fields
            if (!checkRequiredFields(experienceForm)) return;
    
            try {
                const response = await fetch("https://prasa-backend-final.vercel.app/api/submit-experience", {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(formData)
                });
    
                const result = await response.json();
                console.log("Server response:", result);
    
                if (response.ok) {
                    console.log("Experience data saved successfully");
                    window.location.href = "qualification.html";
                } else {
                    console.error("Server returned error:", result);
                    alert(result.message || "Error submitting experience form.");
                }
            } catch (error) {
                console.error("Error submitting experience form:", error);
                alert("An error occurred while submitting the experience form.");
            }
        });
    }
    
    
    // Qualification Form
    if (qualificationForm) {
        console.log("Qualification form found");
        let formChanged = false;
        // Function to validate date range (fromDate should be before toDate)
        function isValidDateRange(fromDate, toDate) {
            return new Date(fromDate) <= new Date(toDate);
        }
    
        // Function to check required fields
        function checkRequiredFields(form) {
            let isValid = true;
            form.querySelectorAll("input[required], select[required]").forEach((input) => {
                if (input.value.trim() === "") {
                    isValid = false;
                    input.style.border = "1px solid red";
                    setTimeout(() => {
                        input.style.border = "";
                    }, 2000);
                }
            });
            return isValid;
        }
    
        // Check if user is logged in
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("userEmail");
        if (!token || !email) {
            alert("You need to log in first");
            window.location.href = "login.html";
            return;
        }
    
        // Pre-fill qualification data if it exists
        fetchUserDataqualification();
    
        // Add more qualification entry fields
        document.getElementById('addQualification').addEventListener('click', () => {
            addNewQualificationEntry();
        });
    
        // Add more certification entry fields
        document.getElementById('addCertification').addEventListener('click', () => {
            addNewCertificationEntry();
        });
    
        // Navigate back to experience
        document.getElementById('backToExperience').addEventListener('click', () => {
            window.location.href = 'experience.html';
        });
    
        // Submit all data
        qualificationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
    
            // Gather all qualification entries
            const qualificationEntries = document.querySelectorAll('.qualification-entry');
            const educationType = [];
            const eduFromDate = [];
            const eduToDate = [];
            const instituteName = [];
            const specialization = [];
            const nacAccretion = [];
            const boardUniversity = [];
            const eduType = [];
            const score = [];
            const status = [];
            const proofsSubmitted = [];
    
            let hasEntries = false;
    
            qualificationEntries.forEach(entry => {
                const eduTypeSelect = entry.querySelector('select[name="educationType[]"]');
                if (!eduTypeSelect) return;
                
                const eduTypeValue = eduTypeSelect.value.trim();
                const fromDateInput = entry.querySelector('input[name="eduFromDate[]"]');
                const toDateInput = entry.querySelector('input[name="eduToDate[]"]');
                
                if (!fromDateInput || !toDateInput) return;
                
                const fromDateValue = fromDateInput.value;
                const toDateValue = toDateInput.value;
                
                if (eduTypeValue && fromDateValue && toDateValue) {
                    hasEntries = true;
                    educationType.push(eduTypeValue);
                    eduFromDate.push(fromDateValue);
                    eduToDate.push(toDateValue);
                    
                    // Get all other fields
                    const instituteNameInput = entry.querySelector('input[name="instituteName[]"]');
                    instituteName.push(instituteNameInput ? instituteNameInput.value : '');
                    
                    const specializationInput = entry.querySelector('input[name="specialization[]"]');
                    specialization.push(specializationInput ? specializationInput.value : '');
                    
                    const nacAccretionInput = entry.querySelector('input[name="nacAccretion[]"]');
                    nacAccretion.push(nacAccretionInput ? nacAccretionInput.value : '');
                    
                    const boardUniversityInput = entry.querySelector('input[name="boardUniversity[]"]');
                    boardUniversity.push(boardUniversityInput ? boardUniversityInput.value : '');
                    
                    const eduTypeSelect = entry.querySelector('select[name="eduType[]"]');
                    eduType.push(eduTypeSelect ? eduTypeSelect.value : '');
                    
                    const scoreInput = entry.querySelector('input[name="score[]"]');
                    score.push(scoreInput ? scoreInput.value : '');
                    
                    const statusSelect = entry.querySelector('select[name="status[]"]');
                    status.push(statusSelect ? statusSelect.value : '');
                    
                    const proofsSubmittedSelect = entry.querySelector('select[name="proofsSubmitted[]"]');
                    proofsSubmitted.push(proofsSubmittedSelect ? proofsSubmittedSelect.value : '');
                    
                    // Validate Date Range
                    if (!isValidDateRange(fromDateValue, toDateValue)) {
                        alert(`Invalid date range for ${eduTypeValue}. "From" date must be before "To" date.`);
                        return;
                    }
                }
            });
    
            if (!hasEntries) {
                alert("Please enter at least one qualification entry.");
                return;
            }
    
            // Gather all certification entries
            const certificationEntries = document.querySelectorAll('.certification-entry');
            const certificationName = [];
            const certFromDate = [];
            const certToDate = [];
    
            certificationEntries.forEach(entry => {
                const certNameInput = entry.querySelector('input[name="certificationName[]"]');
                const certFromInput = entry.querySelector('input[name="certFromDate[]"]');
                const certToInput = entry.querySelector('input[name="certToDate[]"]');
                
                if (certNameInput && certFromInput && certToInput) {
                    const certNameValue = certNameInput.value.trim();
                    const certFromValue = certFromInput.value;
                    const certToValue = certToInput.value;
                    
                    if (certNameValue && certFromValue && certToValue) {
                        certificationName.push(certNameValue);
                        certFromDate.push(certFromValue);
                        certToDate.push(certToValue);
    
                        // Validate Date Range
                        if (!isValidDateRange(certFromValue, certToValue)) {
                            alert(`Invalid date range for ${certNameValue}. "From" date must be before "To" date.`);
                            return;
                        }
                    }
                }
            });
    
            // Get skills
            const skillsInput = document.getElementById('skills');
            const skills = skillsInput ? skillsInput.value : '';
    
            const formData = {
                email: email,
                educationType, eduFromDate, eduToDate, instituteName, specialization,
                nacAccretion, boardUniversity, eduType, score, status, proofsSubmitted,
                skills, certificationName, certFromDate, certToDate
            };
    
            console.log("Submitting qualification data:", formData);
    
            // Validate Required Fields
            if (!checkRequiredFields(qualificationForm)) return;
    
            try {
                const response = await fetch("https://prasa-backend-final.vercel.app/api/submit-qualification", {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(formData)
                });
    
                const result = await response.json();
                console.log("Server response:", result);
    
                if (response.ok) {
                    alert(result.message);
                    window.location.href = "medical_info.html";
                } else {
                    alert(result.message || "Error submitting qualification form.");
                }
            } catch (error) {
                console.error("Error submitting qualification form:", error);
                alert("An error occurred while submitting the qualification form.");
            }
        });
    }
    // In the medicalInfoForm section:

// 1. The form ID is likely "healthForm" based on the code at the top, but your selector is trying to find "medicalInfoForm"
// 2. Field selectors are using the wrong format (e.g., "#allergicDetails" instead of "#allergic_details")
// 3. Field validations need to be improved


// ===== MEDICAL FORM CONTROLLER ===== //
document.addEventListener("DOMContentLoaded", () => {
    console.log("[MEDICAL FORM] DOM Ready - Initializing");
    
    // 1. Verify form exists
    const form = document.getElementById("healthForm");
    if (!form) {
        console.error("[MEDICAL FORM] CRITICAL: Form element not found");
        return;
    }

    // 2. Add debug button
    addDebugButton();

    // 3. Load data with retry logic
    loadMedicalDataWithRetry(3);
});

// ===== CORE FUNCTIONALITY ===== //
async function loadMedicalDataWithRetry(retriesLeft = 3) {
    try {
        console.log(`[MEDICAL FORM] Attempting data load (${retriesLeft} retries left)`);
        
        // 1. Verify authentication
        const auth = verifyAuth();
        if (!auth.valid) {
            console.error("[AUTH] Failed:", auth.message);
            window.location.href = "login.html";
            return;
        }

        // 2. Fetch data
        const data = await fetchMedicalData(auth.token);
        if (!data.medicalInfo) {
            console.warn("[DATA] No medical info found - showing blank form");
            return;
        }

        // 3. Populate form
        populateForm(data.medicalInfo);
        
        console.log("[MEDICAL FORM] Data loaded successfully");
    } catch (error) {
        console.error("[LOAD ERROR]", error);
        
        if (retriesLeft > 0) {
            console.log(`Retrying in 1s... (${retriesLeft} left)`);
            setTimeout(() => loadMedicalDataWithRetry(retriesLeft - 1), 1000);
        } else {
            alert("Failed to load medical data. Please refresh the page.");
        }
    }
}

// ===== SUPPORT FUNCTIONS ===== //
// function verifyAuth() {
//     const token = localStorage.getItem("token");
//     const email = localStorage.getItem("userEmail");
    
//     if (!token) return { valid: false, message: "No JWT token found" };
//     if (!email) return { valid: false, message: "No user email found" };
    
//     return { valid: true, token, email };
// }

// async function fetchMedicalData(token) {
//     console.log("[API] Fetching medical data...");
    
//     const response = await fetch("http://localhost:5000/api/user-data", {
//         method: "GET",
//         headers: {
//             "Authorization": `Bearer ${token}`,
//             "Content-Type": "application/json"
//         },
//         cache: "no-store"
//     });

//     if (!response.ok) {
//         const error = await response.text().catch(() => "No error details");
//         throw new Error(`API Error ${response.status}: ${error}`);
//     }

//     return await response.json();
// }

// function populateForm(medicalData) {
//     console.log("[FORM] Populating with:", medicalData);
    
//     // Field mapping configuration
//     const fieldMap = [
//         // Physical Info
//         { selector: "#height", value: medicalData.height_cm },
//         { selector: "#weight", value: medicalData.weight_kg },
//         { selector: "#bloodGroup", value: medicalData.blood_group },
//         { selector: "#handicap", value: medicalData.handicap ? "Yes" : "No", type: "radio" },
        
//         // Medical History
//         { selector: "[name='isAllergic']", value: medicalData.is_allergic ? "Yes" : "No", type: "radio" },
//         { selector: "#allergicDetails", value: medicalData.allergic_details },
//         // ... Add ALL other fields following this pattern ...
        
//         // Emergency Contact
//         { selector: "#emergencyContactName", value: medicalData.emergency_contact_name },
//         { selector: "#emergencyContactPhone", value: medicalData.emergency_contact_phone },
//         { selector: "#emergencyContactRelation", value: medicalData.emergency_contact_relation }
//     ];

//     // Process all fields
//     fieldMap.forEach(field => {
//         try {
//             if (field.type === "radio") {
//                 setRadioValue(field.selector, field.value);
//             } else {
//                 setFieldValue(field.selector, field.value);
//             }
//         } catch (error) {
//             console.warn(`[FIELD ERROR] ${field.selector}:`, error);
//         }
//     });
// }

// function setFieldValue(selector, value) {
//     const element = document.querySelector(selector);
//     if (!element) {
//         console.warn(`[FIELD] Element not found: ${selector}`);
//         return;
//     }
//     element.value = value || "";
//     console.log(`[FIELD] Set ${selector} =`, value);
// }

// function setRadioValue(selector, value) {
//     const elements = document.querySelectorAll(selector);
//     if (elements.length === 0) {
//         console.warn(`[RADIO] Group not found: ${selector}`);
//         return;
//     }
    
//     elements.forEach(el => {
//         el.checked = (el.value === value);
//     });
//     console.log(`[RADIO] Set ${selector} = ${value}`);
// }

// // ===== DEBUG UTILITIES ===== //
// function addDebugButton() {
//     const btn = document.createElement("button");
//     btn.textContent = "DEBUG FORM";
//     btn.style.position = "fixed";
//     btn.style.top = "10px";
//     btn.style.right = "10px";
//     btn.style.zIndex = "9999";
//     btn.style.padding = "10px";
//     btn.style.background = "#ff0000";
//     btn.style.color = "white";
//     btn.style.border = "none";
//     btn.style.borderRadius = "5px";
    
//     btn.onclick = async () => {
//         console.clear();
//         console.group("[MEDICAL FORM DEBUG]");
        
//         // 1. Test Authentication
//         console.log("=== AUTHENTICATION ===");
//         const auth = verifyAuth();
//         console.log("Auth Status:", auth.valid ? "VALID" : "INVALID");
//         console.log("Token:", auth.token ? "*****" + auth.token.slice(-5) : "None");
//         console.log("Email:", auth.email || "None");
        
//         // 2. Test API Connection
//         console.log("\n=== API CONNECTION ===");
//         try {
//             const start = Date.now();
//             const response = await fetch("http://localhost:5000/api/user-data", {
//                 headers: { "Authorization": `Bearer ${auth.token}` }
//             });
//             const latency = Date.now() - start;
            
//             console.log("Response Status:", response.status);
//             console.log("Latency:", latency + "ms");
            
//             if (response.ok) {
//                 const data = await response.json();
//                 console.log("Response Data:", data);
//                 console.log("Medical Data Exists:", !!data.medicalInfo);
//             } else {
//                 console.error("Error:", await response.text());
//             }
//         } catch (error) {
//             console.error("API Test Failed:", error);
//         }
        
//         // 3. Test Form Elements
//         console.log("\n=== FORM ELEMENTS ===");
//         testFormElements();
        
//         console.groupEnd();
//     };
    
//     document.body.appendChild(btn);
// }

// function testFormElements() {
//     const testFields = [
//         "#height", "#weight", "#bloodGroup", 
//         "#allergicDetails", "#emergencyContactName"
//         // Add more critical fields to test
//     ];
    
//     testFields.forEach(selector => {
//         const el = document.querySelector(selector);
//         console.log(
//             `Element ${selector}:`, 
//             el ? "FOUND" : "MISSING",
//             el ? `(type: ${el.type || el.tagName})` : ""
//         );
//     });
// }
if (medicalInfoForm) {
    console.log("Medical Info form found");
    let formChanged = false;
    // Function to check required fields
    function checkRequiredFields(form) {
        let isValid = true;
        form.querySelectorAll("input[required], select[required]").forEach((input) => {
            if (input.value.trim() === "") {
                isValid = false;
                input.style.border = "1px solid red";
                setTimeout(() => {
                    input.style.border = "";
                }, 2000);
            }
        });
        return isValid;
    }
    medicalInfoForm.querySelectorAll('input, select, textarea').forEach(element => {
        element.addEventListener('change', () => {
            formChanged = true;
            console.log("Form modified");
        });
    });

    // Load data when form appears
    fetchUserMedicalInfo();
    medicalInfoForm.addEventListener("submit", async (e) => {
        e.preventDefault(); // Prevent Form Refresh
        console.log("Medical Info form submitted");
        
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("userEmail");
        
        if (!token || !email) {
            alert("You need to log in first");
            window.location.href = "login.html";
            return;
        }
        //fetchUserMedicalInfo();
        
        // Validate Required Fields
        if (!checkRequiredFields(medicalInfoForm)) {
            console.log("Validation failed");
            return;  // This is important - if validation fails, don't proceed
        }
        
        // Collect ALL form fields
        const formData = {
            // Personal Information
            height_cm: document.querySelector("#height_cm")?.value || "",
            weight_kg: document.querySelector("#weight_kg")?.value || "",
            blood_group: document.querySelector("#blood_group")?.value || "",
            handicap: document.querySelector("#handicap")?.value === 'Yes' ? 1 : 0,
        
            // Medical History
            is_allergic: document.querySelector("input[name='is_allergic']:checked")?.value || "No", // Send "Yes" or "No"
            allergic_details: document.querySelector("#allergic_details")?.value || "",
            has_medical_ailment: document.querySelector("input[name='has_medical_ailment']:checked")?.value || "No",
            medical_ailment_details: document.querySelector("#medical_ailment_details")?.value || "",
        
            // Surgery & Medical Conditions
            operation_last_year: document.querySelector("input[name='operation_last_year']:checked")?.value || "No",
            operation_last_year_details: document.querySelector("#operation_last_year_details")?.value || "",
            operation_before_year: document.querySelector("input[name='operation_before_year']:checked")?.value || "No",
            operation_before_year_details: document.querySelector("#operation_before_year_details")?.value || "",
            is_asthmatic: document.querySelector("input[name='is_asthmatic']:checked")?.value || "No",
            blood_pressure: document.querySelector("input[name='blood_pressure']:checked")?.value || "Don't Know", // Default string value
            has_heart_problem: document.querySelector("input[name='has_heart_problem']:checked")?.value || "No",
            is_diabetic: document.querySelector("input[name='is_diabetic']:checked").value || "No",
           // sugar_check_frequency: document.querySelector("#sugarCheckFrequency")?.value || "", // Optional field, blank if not filled
            had_stress_test: document.querySelector("input[name='had_stress_test']:checked")?.value || "No",
            stress_test_details: document.querySelector("#stress_test_details")?.value || "",
            had_mental_health_screening: document.querySelector("input[name='had_mental_health_screening']:checked")?.value || "No",
            mental_health_details: document.querySelector("#mental_health_details")?.value || "",
        
            // Additional Information
            had_fatal_accident: document.querySelector("input[name='had_fatal_accident']:checked")?.value || "No",
            fatal_accident_details: document.querySelector("#fatal_accident_details")?.value || "",
            has_eyesight_issue: document.querySelector("input[name='has_eyesight_issue']:checked")?.value || "No",
            has_hearing_issue: document.querySelector("input[name='has_hearing_issue']:checked")?.value || "No",
            is_smoker: document.querySelector("input[name='is_smoker']:checked")?.value || "No",
            smoking_frequency: document.querySelector("#smoking_frequency")?.value || "",
            consumes_alcohol: document.querySelector("input[name='consumes_alcohol']:checked")?.value || "No",
            alcohol_frequency: document.querySelector("#alcohol_frequency")?.value || "",
            exercises_regularly: document.querySelector("input[name='exercises_regularly']:checked")?.value || "No",
            exercise_frequency: document.querySelector("#exercise_frequency")?.value || "",
        
            // Emergency Contact
            emergency_contact_name: document.querySelector("#emergency_contact_name")?.value || "",
            emergency_contact_phone: document.querySelector("#emergency_contact_phone")?.value || "",
            emergency_contact_relation: document.querySelector("#emergency_contact_relation")?.value || ""
        };
        
        console.log("Submitting Medical Info Data:", formData);
        
        try {
            console.log("Sending medical data:", formData); // Log the data being sent
            
            const response = await fetch("https://prasa-backend-final.vercel.app/api/submit-medical-info", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            
            // Log the raw response status and headers before parsing JSON
            console.log("Response status:", response.status);
            console.log("Response headers:", Object.fromEntries([...response.headers]));
            
            let result;
            try {
                result = await response.json();
                console.log("Server response:", result);
            } catch (jsonError) {
                console.error("Error parsing JSON response:", jsonError);
                // If JSON parsing fails, try to get the raw text
                const textResponse = await response.text();
                console.log("Raw response text:", textResponse);
                result = { message: "Server returned invalid JSON response" };
            }
            
            if (response.ok) {
                alert("Medical information saved successfully!");
                window.location.href = "profile.html"; // Redirect to Profile Page
            } else {
                // Enhanced error logging for non-OK responses
                console.error("Server error details:", {
                    status: response.status,
                    statusText: response.statusText,
                    body: result
                });
                
                alert(result.message || `Error (${response.status}): Failed to submit medical form.`);
            }
        } catch (error) {
            // This will catch network errors and other exceptions
            console.error("Network or other error:", error);
            alert("A network error occurred while submitting the medical form. Check your connection and try again.");
        }
    });
} else {
    console.error("Medical Info form not found on this page");
}

// Function to fetch and populate medical info data
function fetchUserMedicalInfo() {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("userEmail");
    
    if (!token || !email) return;

    fetch(`https://prasa-backend-final.vercel.app/api/user-data`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log("Fetched medical info data:", data.medicalInfo);
        if (data.medicalInfo) {
            populateMedicalForm(data.medicalInfo);
        }
    })
    .catch(error => {
        console.error("Error fetching medical data:", error);
    });
}

// Function to populate medical form with existing data
function populateMedicalForm(medicalData) {
    console.log("Populating medical form with:", medicalData);
    
    // Physical Information
    if (medicalData.height_cm) document.querySelector("#height_cm").value = medicalData.height_cm;
    if (medicalData.weight_kg) document.querySelector("#weight_kg").value = medicalData.weight_kg;
    if (medicalData.blood_group) document.querySelector("#blood_group").value = medicalData.blood_group;
    if (medicalData.handicap !== undefined) {
        document.querySelector("#handicap").value = medicalData.handicap ? "Yes" : "No";
    }

    // Medical History
    setRadioValue("is_allergic", medicalData.is_allergic);
    if (medicalData.allergic_details) document.querySelector("#allergic_details").value = medicalData.allergic_details;
    setRadioValue("has_medical_ailment", medicalData.has_medical_ailment);
    if (medicalData.medical_ailment_details) document.querySelector("#medical_ailment_details").value = medicalData.medical_ailment_details;

    // Surgery & Medical Conditions
    setRadioValue("operation_last_year", medicalData.operation_last_year);
    if (medicalData.operation_last_year_details) document.querySelector("#operation_last_year_details").value = medicalData.operation_last_year_details;
    setRadioValue("operation_before_year", medicalData.operation_before_year);
    if (medicalData.operation_before_year_details) document.querySelector("#operation_before_year_details").value = medicalData.operation_before_year_details;
    setRadioValue("is_asthmatic", medicalData.is_asthmatic);
    setRadioValue("blood_pressure", medicalData.blood_pressure);
    setRadioValue("has_heart_problem", medicalData.has_heart_problem);
    setRadioValue("is_diabetic", medicalData.is_diabetic);
   // if (medicalData.sugar_check_frequency) document.querySelector("#sugarCheckFrequency").value = medicalData.sugar_check_frequency;
    setRadioValue("had_stress_test", medicalData.had_stress_test);
    if (medicalData.stress_test_details) document.querySelector("#stress_test_details").value = medicalData.stress_test_details;
    setRadioValue("had_mental_health_screening", medicalData.had_mental_health_screening);
    if (medicalData.mental_health_details) document.querySelector("#mental_health_details").value = medicalData.mental_health_details;

    // Additional Information
    setRadioValue("had_fatal_accident", medicalData.had_fatal_accident);
    if (medicalData.fatal_accident_details) document.querySelector("#fatal_accident_details").value = medicalData.fatal_accident_details;
    setRadioValue("has_eyesight_issue", medicalData.has_eyesight_issue);
    setRadioValue("has_hearing_issue", medicalData.has_hearing_issue);
    setRadioValue("is_smoker", medicalData.is_smoker);
    if (medicalData.smoking_frequency) document.querySelector("#smoking_frequency").value = medicalData.smoking_frequency;
    setRadioValue("consumes_alcohol", medicalData.consumes_alcohol);
    if (medicalData.alcohol_frequency) document.querySelector("#alcohol_frequency").value = medicalData.alcohol_frequency;
    setRadioValue("exercises_regularly", medicalData.exercises_regularly);
    if (medicalData.exercise_frequency) document.querySelector("#exercise_frequency").value = medicalData.exercise_frequency;

    // Emergency Contact
    if (medicalData.emergency_contact_name) document.querySelector("#emergency_contact_name").value = medicalData.emergency_contact_name;
    if (medicalData.emergency_contact_phone) document.querySelector("#emergency_contact_phone").value = medicalData.emergency_contact_phone;
    if (medicalData.emergency_contact_relation) document.querySelector("#emergency_contact_relation").value = medicalData.emergency_contact_relation;
}

// Helper function to set radio button values
function setRadioValue(name, value) {
    if (value === undefined || value === null) return;
    
    const radios = document.querySelectorAll(`input[name="${name}"]`);
    if (radios.length === 0) return;
    
    // Handle boolean values (1/0) from database
    if (typeof value === 'number') {
        value = value ? "Yes" : "No";
    }
    
    radios.forEach(radio => {
        if (radio.value === value) {
            radio.checked = true;
            
            // Trigger change event to show/hide dependent fields
            const event = new Event('change');
            radio.dispatchEvent(event);
        }
    });
}

// Call fetch function when page loads
document.addEventListener('DOMContentLoaded', () => {
    const medicalInfoForm = document.querySelector("#healthForm");
    if (medicalInfoForm) {
        console.log("Medical Info form found");
        fetchUserMedicalInfo();
        
        // Add event listeners for radio buttons to show/hide dependent fields
        setupRadioDependencies();
    }
});

// Function to setup event listeners for radio buttons that show/hide dependent fields
function setupRadioDependencies() {
    // Example for one radio group - you should add similar for all radio groups with dependent fields
    const radioGroups = [
        { name: 'is_allergic', target: 'allergic_details' },
        { name: 'has_medical_ailment', target: 'medical_ailment_details' },
        { name: 'operation_last_year', target: 'operation_last_year_details' },
        { name: 'operation_before_year', target: 'operation_before_year_details' },
        { name: 'had_stress_test', target: 'stress_test_details' },
        { name: 'had_mental_health_screening', target: 'mental_health_details' },
        { name: 'had_fatal_accident', target: 'fatal_accident_details' },
        { name: 'is_smoker', target: 'smoking_frequency' },
        { name: 'consumes_alcohol', target: 'alcohol_frequency' },
        { name: 'exercises_regularly', target: 'exercise_frequency' }
    ];
    
    radioGroups.forEach(group => {
        const radios = document.querySelectorAll(`input[name="${group.name}"]`);
        const targetElement = document.getElementById(group.target);
        
        if (radios.length && targetElement) {
            radios.forEach(radio => {
                radio.addEventListener('change', () => {
                    const parentDiv = targetElement.closest('.input-wrapper');
                    if (parentDiv) {
                        parentDiv.style.display = radio.value === 'Yes' ? 'block' : 'none';
                    }
                });
            });
            
            // Trigger initial state
            const checkedRadio = document.querySelector(`input[name="${group.name}"]:checked`);
            if (checkedRadio) {
                const event = new Event('change');
                checkedRadio.dispatchEvent(event);
            }
        }
    });
}

// Function to fetch user data including qualifications
function fetchUserDataqualification() {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("userEmail");
    
    if (!token || !email) return;

    fetch(`https://prasa-backend-final.vercel.app/api/user-data`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log("Fetched all user data:", data);
        populateQualificationForm({
            qualifications: data.qualifications || [],
            skills: data.skills || "",
            certifications: data.certifications || []
        });
    })
    .catch(error => {
        console.error("Error fetching user data:", error);
    });
}

// Function to populate qualification form with existing data
function populateQualificationForm(data) {
    const qualificationForm = document.getElementById("qualificationForm");
    const qualificationFields = document.getElementById("qualificationFields");
    const certificationFields = document.getElementById("certificationFields");
    
    if (!qualificationForm || !qualificationFields || !certificationFields) {
        console.error("Form elements not found");
        return;
    }

    // Clear any existing entries
    qualificationFields.innerHTML = "";
    certificationFields.innerHTML = "";
    
    // Check if we have qualification data to populate
    const qualifications = data.qualifications || [];
    console.log("Qualification data to populate:", qualifications);
    
    // Check if we have certification data to populate
    const certifications = data.certifications || [];
    console.log("Certification data to populate:", certifications);
    
    // Populate skills
    if (data.skills) {
        document.getElementById('skills').value = data.skills;
    }
    
    // Add qualification entries
    if (qualifications.length === 0) {
        addNewQualificationEntry();
    } else {
        qualifications.forEach((qual) => {
            addNewQualificationEntry(qual);
        });
    }
    
    // Add certification entries
    if (certifications.length === 0) {
        addNewCertificationEntry();
    } else {
        certifications.forEach((cert) => {
            addNewCertificationEntry(cert);
        });
    }
}

// Helper function to add new qualification entry
function addNewQualificationEntry(qual = {}) {
    const qualificationFields = document.getElementById("qualificationFields");
    if (!qualificationFields) return;

    const newEntry = document.createElement("div");
    newEntry.className = "qualification-entry";
    
    // Format dates for display
    const formatDateForInput = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toISOString().split('T')[0];
    };

    newEntry.innerHTML = `
        <div class="input-group">
            <i class="fas fa-graduation-cap"></i>
            <select name="educationType[]" required>
                <option value="">Select Education Type</option>
                <option value="SSC" ${qual.education_type === 'SSC' ? 'selected' : ''}>SSC</option>
                <option value="HSC" ${qual.education_type === 'HSC' ? 'selected' : ''}>HSC</option>
                <option value="ITI" ${qual.education_type === 'ITI' ? 'selected' : ''}>ITI</option>
                <option value="Diploma" ${qual.education_type === 'Diploma' ? 'selected' : ''}>Diploma</option>
                <option value="Graduation" ${qual.education_type === 'Graduation' ? 'selected' : ''}>Graduation</option>
                <option value="Post Graduation" ${qual.education_type === 'Post Graduation' ? 'selected' : ''}>Post Graduation</option>
                <option value="Others" ${qual.education_type === 'Others' ? 'selected' : ''}>Others</option>
            </select>
        </div>
        <div class="date-range">
            <div class="input-group">
                <i class="fas fa-calendar-alt"></i>
                <input type="text" name="eduFromDate[]" placeholder="Start Date" 
                       onfocus="(this.type='date')" onblur="if(!this.value)this.type='text'" 
                       required value="${formatDateForInput(qual.from_date) || ''}">
            </div>
            <div class="input-group">
                <i class="fas fa-calendar-alt"></i>
                <input type="text" name="eduToDate[]" placeholder="End Date" 
                       onfocus="(this.type='date')" onblur="if(!this.value)this.type='text'" 
                       required value="${formatDateForInput(qual.to_date) || ''}">
            </div>
        </div>
        <div class="input-group">
            <i class="fas fa-school"></i>
            <input type="text" name="instituteName[]" placeholder="Institute Name" required 
                   value="${qual.institute_name || ''}">
        </div>
        <div class="input-group">
            <i class="fas fa-book"></i>
            <input type="text" name="specialization[]" placeholder="Specialization" 
                   value="${qual.specialization || ''}">
        </div>
        <div class="input-group">
            <i class="fas fa-certificate"></i>
            <input type="text" name="nacAccretion[]" placeholder="NAC Accretion" 
                   value="${qual.nac_accretion || ''}">
        </div>
        <div class="input-group">
            <i class="fas fa-university"></i>
            <input type="text" name="boardUniversity[]" placeholder="Board/University" required 
                   value="${qual.board_university || ''}">
        </div>
        <div class="input-group">
            <i class="fas fa-clock"></i>
            <select name="eduType[]" required>
                <option value="">Select Type</option>
                <option value="Full Time" ${qual.edu_type === 'Full Time' ? 'selected' : ''}>Full Time</option>
                <option value="Part Time" ${qual.edu_type === 'Part Time' ? 'selected' : ''}>Part Time</option>
            </select>
        </div>
        <div class="input-group">
            <i class="fas fa-star"></i>
            <input type="text" name="score[]" placeholder="Score" required 
                   value="${qual.score || ''}">
        </div>
        <div class="input-group">
            <i class="fas fa-tasks"></i>
            <select name="status[]" required>
                <option value="">Select Status</option>
                <option value="Completed" ${qual.status === 'Completed' ? 'selected' : ''}>Completed</option>
                <option value="Not Completed" ${qual.status === 'Not Completed' ? 'selected' : ''}>Not Completed</option>
            </select>
        </div>
        <div class="input-group">
            <i class="fas fa-file-alt"></i>
            <select name="proofsSubmitted[]" required>
                <option value="">Proofs Submitted?</option>
                <option value="Yes" ${qual.proofs_submitted === 'Yes' ? 'selected' : ''}>Yes</option>
                <option value="No" ${qual.proofs_submitted === 'No' ? 'selected' : ''}>No</option>
            </select>
        </div>
        <button type="button" class="remove-qualification">Remove</button>
    `;
    
    // Add remove functionality
    newEntry.querySelector('.remove-qualification').addEventListener('click', () => {
        if (document.querySelectorAll('.qualification-entry').length > 1) {
            newEntry.remove();
        } else {
            alert("You need to have at least one qualification entry");
        }
    });
    
    qualificationFields.appendChild(newEntry);
}

// Helper function to add new certification entry
function addNewCertificationEntry(cert = {}) {
    const certificationFields = document.getElementById("certificationFields");
    if (!certificationFields) return;

    const newEntry = document.createElement("div");
    newEntry.className = "certification-entry";
    
    // Format dates for display
    const formatDateForInput = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toISOString().split('T')[0];
    };

    newEntry.innerHTML = `
        <div class="input-group">
            <i class="fas fa-certificate"></i>
            <input type="text" name="certificationName[]" placeholder="Certification Name" 
                   value="${cert.certification_name || ''}">
        </div>
        <div class="date-range">
            <div class="input-group">
                <i class="fas fa-calendar-alt"></i>
                <input type="text" name="certFromDate[]" placeholder="Start Date" 
                       onfocus="(this.type='date')" onblur="if(!this.value)this.type='text'" 
                       required value="${formatDateForInput(cert.from_date) || ''}">
            </div>
            <div class="input-group">
                <i class="fas fa-calendar-alt"></i>
                <input type="text" name="certToDate[]" placeholder="End Date" 
                       onfocus="(this.type='date')" onblur="if(!this.value)this.type='text'" 
                       required value="${formatDateForInput(cert.to_date) || ''}">
            </div>
        </div>
        <button type="button" class="remove-certification">Remove</button>
    `;
    
    // Add remove functionality
    newEntry.querySelector('.remove-certification').addEventListener('click', () => {
        if (document.querySelectorAll('.certification-entry').length > 1) {
            newEntry.remove();
        } else {
            alert("You need to have at least one certification entry");
        }
    });
    
    certificationFields.appendChild(newEntry);
}

function fetchUserDataex() {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("userEmail");
    
    if (!token || !email) return;

    fetch(`https://prasa-backend-final.vercel.app/api/user-data`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log("Fetched all user data:", data);
        // Focus on experience data but keep other data if needed
        populateExperienceForm({
            experienceData: data.experiences || []
        });
    })
    .catch(error => {
        console.error("Error fetching user data:", error);
    });
}

function populateExperienceForm(data) {
    const experienceForm = document.getElementById("experienceForm");
    const experienceFields = document.getElementById("experienceFields");
    
    if (!experienceForm || !experienceFields) {
        console.error("Form elements not found");
        return;
    }

    // Clear any existing entries
    experienceFields.innerHTML = "";
    
    // Check if we have data to populate
    const experiences = data.experienceData || [];
    console.log("Experience data to populate:", experiences);
    
    if (experiences.length === 0) {
        // Add one empty entry if no data exists
        addNewExperienceEntry();
        return;
    }
    
    // For each experience entry in the data
    experiences.forEach((exp) => {
        addNewExperienceEntry(exp);
    });
}

function addNewExperienceEntry(exp = {}) {
    const experienceFields = document.getElementById("experienceFields");
    if (!experienceFields) return;

    const newEntry = document.createElement("div");
    newEntry.className = "experience-entry";
    
    // Format dates for display (MySQL format to HTML date input)
    const formatDateForInput = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toISOString().split('T')[0];
    };

    newEntry.innerHTML = `
        <div class="input-group">
            <i class="fas fa-building"></i>
            <input type="text" name="company[]" placeholder="Company Name" required value="${exp.company || ''}">
        </div>
        
        <div class="input-group">
            <i class="fas fa-user-tie"></i>
            <input type="text" name="designation[]" placeholder="Designation" required value="${exp.designation || ''}">
        </div>
        
        <div class="date-range">
            <div class="input-group">
                <i class="fas fa-calendar-alt"></i>
                <input type="text" name="fromDate[]" placeholder="Start Date" 
                       onfocus="(this.type='date')" onblur="if(!this.value)this.type='text'" 
                       required value="${formatDateForInput(exp.from_date) || ''}">
            </div>
            <div class="input-group">
                <i class="fas fa-calendar-alt"></i>
                <input type="text" name="toDate[]" placeholder="End Date" 
                       onfocus="(this.type='date')" onblur="if(!this.value)this.type='text'" 
                       required value="${formatDateForInput(exp.to_date) || ''}">
            </div>
        </div>
        
        <div class="input-group">
            <i class="fas fa-sign-out-alt"></i>
            <input type="text" name="reasonForLeaving[]" placeholder="Reason for Leaving" required value="${exp.reason_for_leaving || ''}">
        </div>
        <div class="input-group">
            <i class="fas fa-trophy"></i>
            <input type="text" name="achievements[]" placeholder="Achievements" value="${exp.achievements || ''}">
        </div>
        <div class="input-group">
            <i class="fas fa-tasks"></i>
            <input type="text" name="kraHandle[]" placeholder="KRA Handle" value="${exp.kra_handle || ''}">
        </div>
        <div class="input-group">
            <i class="fas fa-users"></i>
            <input type="number" name="teamSize[]" placeholder="Team Size Handle" value="${exp.team_size || ''}">
        </div>
        <div class="input-group">
            <i class="fas fa-address-book"></i>
            <input type="text" name="contactDetails[]" placeholder="Contact Details" value="${exp.contact_details || ''}">
        </div>
        
        <button type="button" class="remove-experience">Remove</button>
    `;
    
    // Add remove functionality
    newEntry.querySelector('.remove-experience').addEventListener('click', () => {
        if (document.querySelectorAll('.experience-entry').length > 1) {
            newEntry.remove();
        } else {
            alert("You need to have at least one experience entry");
        }
    });
    
    experienceFields.appendChild(newEntry);
}
    
    // Fetch user data (for pre-filling forms)
    async function fetchUserData() {
        const token = localStorage.getItem("token");
        if (!token) return;
        
        try {
            const response = await fetch("https://prasa-backend-final.vercel.app/api/user-data", {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` }
            });
            
            if (!response.ok) {
                console.error("Error fetching user data:", response.statusText);
                return;
            }
            
            const data = await response.json();
            
            // Pre-fill personal information form
            if (userForm && data.userData) {
                const userData = data.userData;
                if (document.querySelector("#title")) document.querySelector("#title").value = userData.title || "";
                if (document.querySelector("#firstName")) document.querySelector("#firstName").value = userData.first_name || "";
                if (document.querySelector("#middleName")) document.querySelector("#middleName").value = userData.middle_name || "";
                if (document.querySelector("#lastName")) document.querySelector("#lastName").value = userData.last_name || "";
                // Replace the DOB line with this code
if (document.querySelector("#dob")) {
    const dobField = document.querySelector("#dob");
    if (userData.dob) {
        // Log the original format for debugging
        console.log("Original DOB from API:", userData.dob);
        
        try {
            // Parse the date string from the API
            const date = new Date(userData.dob);
            
            // Check if we got a valid date
            if (!isNaN(date.getTime())) {
                // Format it as YYYY-MM-DD for HTML date input
                const year = date.getFullYear();
                // Add leading zeros for month and day if needed
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                
                const formattedDate = `${year}-${month}-${day}`;
                console.log("Formatted DOB:", formattedDate);
                dobField.value = formattedDate;
            } else {
                // Fallback to the original value if date parsing fails
                dobField.value = userData.dob;
                console.log("Invalid date format, using original");
            }
        } catch (error) {
            console.error("Error formatting DOB:", error);
            dobField.value = userData.dob;
        }
    } else {
        dobField.value = "";
    }
}
                if (document.querySelector("#age")) document.querySelector("#age").value = userData.age || "";
                if (document.querySelector("#address")) document.querySelector("#address").value = userData.address || "";
                if (document.querySelector("#phone")) document.querySelector("#phone").value = userData.phone || "";
                if (document.querySelector("#city")) document.querySelector("#city").value = userData.city || "";
                if (document.querySelector("#state")) document.querySelector("#state").value = userData.state || "";
                if (document.querySelector("#pinCode")) document.querySelector("#pinCode").value = userData.pin_code || "";
                if (document.querySelector("#country")) document.querySelector("#country").value = userData.country || "";
                if (document.querySelector("#nationality")) document.querySelector("#nationality").value = userData.nationality || "";
                if (document.querySelector("#religion")) document.querySelector("#religion").value = userData.religion || "";
                if (document.querySelector("#aadharNo")) document.querySelector("#aadharNo").value = userData.aadhar_no || "";
                if (document.querySelector("#drivingLicenseNo")) document.querySelector("#drivingLicenseNo").value = userData.driving_license_no || "";
                if (document.querySelector("#panNo")) document.querySelector("#panNo").value = userData.pan_no || "";
                if (document.querySelector("#passportNo")) document.querySelector("#passportNo").value = userData.passport_no || "";
                if (document.querySelector("#votingCardNo")) document.querySelector("#votingCardNo").value = userData.voting_card_no || "";
                if (document.querySelector("#rationCardNo")) document.querySelector("#rationCardNo").value = userData.ration_card_no || "";
                if (document.querySelector("#uanNo")) document.querySelector("#uanNo").value = userData.uan_no || "";
                if (document.querySelector("#esicNo")) document.querySelector("#esicNo").value = userData.esic_no || "";
                // New fields
                if (document.querySelector("#bankName")) document.querySelector("#bankName").value = userData.bankName || "";
                if (document.querySelector("#ifscCode")) document.querySelector("#ifscCode").value = userData.ifscCode || "";
                if (document.querySelector("#accountNo")) document.querySelector("#accountNo").value = userData.accountNo || "";
                if (document.querySelector("#bankBranch")) document.querySelector("#bankBranch").value = userData.bankBranch || "";
                if (document.querySelector("#maritalStatus")) document.querySelector("#maritalStatus").value = userData.maritalStatus || "";
                if (document.querySelector("#spouseName")) document.querySelector("#spouseName").value = userData.spouseName || "";
                if (document.querySelector("#children")) document.querySelector("#children").value = userData.children || "";
                // Replace the dateOfJoining line with this code
if (document.querySelector("#dateOfJoining")) {
    const dateOfJoiningField = document.querySelector("#dateOfJoining");
    if (userData.dateOfJoining) {
        // Log the original format for debugging
        console.log("Original Date of Joining from API:", userData.dateOfJoining);
        
        try {
            // Parse the date string from the API
            const date = new Date(userData.dateOfJoining);
            
            // Check if we got a valid date
            if (!isNaN(date.getTime())) {
                // Format it as YYYY-MM-DD for HTML date input
                const year = date.getFullYear();
                // Add leading zeros for month and day if needed
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                
                const formattedDate = `${year}-${month}-${day}`;
                console.log("Formatted Date of Joining:", formattedDate);
                dateOfJoiningField.value = formattedDate;
            } else {
                // Fallback to the original value if date parsing fails
                dateOfJoiningField.value = userData.dateOfJoining;
                console.log("Invalid date format, using original");
            }
        } catch (error) {
            console.error("Error formatting Date of Joining:", error);
            dateOfJoiningField.value = userData.dateOfJoining;
        }
    } else {
        dateOfJoiningField.value = "";
    }
}
                if (document.querySelector("#department")) document.querySelector("#department").value = userData.department || "";
                if (document.querySelector("#designation")) document.querySelector("#designation").value = userData.designation || "";
                if (document.querySelector("#reportingTo")) document.querySelector("#reportingTo").value = userData.reportingTo || "";
                if (document.querySelector("#totalexperience")) document.querySelector("#totalexperience").value = userData.totalexperience || "";
            }

          
           
            
            // Pre-fill family data
            if (familyForm && data.familyData) {
                const familyData = data.familyData;
                // Nominee 1
                if (document.querySelector("#nominee1_name")) document.querySelector("#nominee1_name").value = familyData.nominee1_name || "";
                if (document.querySelector("#nominee1_relationship")) document.querySelector("#nominee1_relationship").value = familyData.nominee1_relationship || "";
                if (document.querySelector("#nominee1_share")) document.querySelector("#nominee1_share").value = familyData.nominee1_share || "";
                
                // Nominee 2
                if (document.querySelector("#nominee2_name")) document.querySelector("#nominee2_name").value = familyData.nominee2_name || "";
                if (document.querySelector("#nominee2_relationship")) document.querySelector("#nominee2_relationship").value = familyData.nominee2_relationship || "";
                if (document.querySelector("#nominee2_share")) document.querySelector("#nominee2_share").value = familyData.nominee2_share || "";
                
                // Emergency 1
                if (document.querySelector("#emergency1_name")) document.querySelector("#emergency1_name").value = familyData.emergency1_name || "";
                if (document.querySelector("#emergency1_relationship")) document.querySelector("#emergency1_relationship").value = familyData.emergency1_relationship || "";
                if (document.querySelector("#emergency1_contact")) document.querySelector("#emergency1_contact").value = familyData.emergency1_contact || "";
                if (document.querySelector("#emergency1_email")) document.querySelector("#emergency1_email").value = familyData.emergency1_email || "";
                
                // Emergency 2
                if (document.querySelector("#emergency2_name")) document.querySelector("#emergency2_name").value = familyData.emergency2_name || "";
                if (document.querySelector("#emergency2_relationship")) document.querySelector("#emergency2_relationship").value = familyData.emergency2_relationship || "";
                if (document.querySelector("#emergency2_contact")) document.querySelector("#emergency2_contact").value = familyData.emergency2_contact || "";
                if (document.querySelector("#emergency2_email")) document.querySelector("#emergency2_email").value = familyData.emergency2_email || "";
                
                // Family Member 1
                if (document.querySelector("#family1_name")) document.querySelector("#family1_name").value = familyData.family1_name || "";
                if (document.querySelector("#family1_dob")) document.querySelector("#family1_dob").value = familyData.family1_dob || "";
                if (document.querySelector("#family1_dob")) {
                    const dobField = document.querySelector("#family1_dob");
                    if (familyData.family1_dob) {
                        // Log the original format for debugging
                        console.log("Original DOB from API:", familyData.family1_dob);
                        
                        try {
                            // Parse the date string from the API
                            const date = new Date(familyData.family1_dob);
                            
                            // Check if we got a valid date
                            if (!isNaN(date.getTime())) {
                                // Format it as YYYY-MM-DD for HTML date input
                                const year = date.getFullYear();
                                // Add leading zeros for month and day if needed
                                const month = String(date.getMonth() + 1).padStart(2, '0');
                                const day = String(date.getDate()).padStart(2, '0');
                                
                                const formattedDate = `${year}-${month}-${day}`;
                                console.log("Formatted DOB:", formattedDate);
                                dobField.value = formattedDate;
                            } else {
                                // Fallback to the original value if date parsing fails
                                dobField.value = familyData.family1_dob;
                                console.log("Invalid date format, using original");
                            }
                        } catch (error) {
                            console.error("Error formatting DOB:", error);
                            dobField.value = familyData.family1_dob;
                        }
                    } else {
                        dobField.value = "";
                    }
                }
                if (document.querySelector("#family1_relationship")) document.querySelector("#family1_relationship").value = familyData.family1_relationship || "";
                if (document.querySelector("#family1_occupation")) document.querySelector("#family1_occupation").value = familyData.family1_occupation || "";
                if (document.querySelector("#family1_aadhar")) document.querySelector("#family1_aadhar").value = familyData.family1_aadhar || "";
                
                // Family Member 2
                if (document.querySelector("#family2_name")) document.querySelector("#family2_name").value = familyData.family2_name || "";
                if (document.querySelector("#family2_dob")) document.querySelector("#family2_dob").value = familyData.family2_dob || "";
                if (document.querySelector("#family2_dob")) {
                    const dobField = document.querySelector("#family2_dob");
                    if (familyData.family2_dob) {
                        // Log the original format for debugging
                        console.log("Original DOB from API:", familyData.family2_dob);
                        
                        try {
                            // Parse the date string from the API
                            const date = new Date(familyData.family2_dob);
                            
                            // Check if we got a valid date
                            if (!isNaN(date.getTime())) {
                                // Format it as YYYY-MM-DD for HTML date input
                                const year = date.getFullYear();
                                // Add leading zeros for month and day if needed
                                const month = String(date.getMonth() + 1).padStart(2, '0');
                                const day = String(date.getDate()).padStart(2, '0');
                                
                                const formattedDate = `${year}-${month}-${day}`;
                                console.log("Formatted DOB:", formattedDate);
                                dobField.value = formattedDate;
                            } else {
                                // Fallback to the original value if date parsing fails
                                dobField.value = familyData.family2_dob;
                                console.log("Invalid date format, using original");
                            }
                        } catch (error) {
                            console.error("Error formatting DOB:", error);
                            dobField.value = familyData.family2_dob;
                        }
                    } else {
                        dobField.value = "";
                    }
                }
                if (document.querySelector("#family2_relationship")) document.querySelector("#family2_relationship").value = familyData.family2_relationship || "";
                if (document.querySelector("#family2_occupation")) document.querySelector("#family2_occupation").value = familyData.family2_occupation || "";
                if (document.querySelector("#family2_aadhar")) document.querySelector("#family2_aadhar").value = familyData.family2_aadhar || "";
                
                // Family Member 3
                if (document.querySelector("#family3_name")) document.querySelector("#family3_name").value = familyData.family3_name || "";
                if (document.querySelector("#family3_dob")) document.querySelector("#family3_dob").value = familyData.family3_dob || "";
                if (document.querySelector("#family3_dob")) {
                    const dobField = document.querySelector("#family3_dob");
                    if (familyData.family3_dob) {
                        // Log the original format for debugging
                        console.log("Original DOB from API:", familyData.family3_dob);
                        
                        try {
                            // Parse the date string from the API
                            const date = new Date(familyData.family3_dob);
                            
                            // Check if we got a valid date
                            if (!isNaN(date.getTime())) {
                                // Format it as YYYY-MM-DD for HTML date input
                                const year = date.getFullYear();
                                // Add leading zeros for month and day if needed
                                const month = String(date.getMonth() + 1).padStart(2, '0');
                                const day = String(date.getDate()).padStart(2, '0');
                                
                                const formattedDate = `${year}-${month}-${day}`;
                                console.log("Formatted DOB:", formattedDate);
                                dobField.value = formattedDate;
                            } else {
                                // Fallback to the original value if date parsing fails
                                dobField.value = familyData.family3_dob;
                                console.log("Invalid date format, using original");
                            }
                        } catch (error) {
                            console.error("Error formatting DOB:", error);
                            dobField.value = familyData.family3_dob;
                        }
                    } else {
                        dobField.value = "";
                    }
                }
                if (document.querySelector("#family3_relationship")) document.querySelector("#family3_relationship").value = familyData.family3_relationship || "";
                if (document.querySelector("#family3_occupation")) document.querySelector("#family3_occupation").value = familyData.family3_occupation || "";
                if (document.querySelector("#family3_aadhar")) document.querySelector("#family3_aadhar").value = familyData.family3_aadhar || "";
                
                // Family Member 4
                if (document.querySelector("#family4_name")) document.querySelector("#family4_name").value = familyData.family4_name || "";
                if (document.querySelector("#family4_dob")) document.querySelector("#family4_dob").value = familyData.family4_dob || "";
                if (document.querySelector("#family4_dob")) {
                    const dobField = document.querySelector("#family4_dob");
                    if (familyData.family4_dob) {
                        // Log the original format for debugging
                        console.log("Original DOB from API:", familyData.family4_dob);
                        
                        try {
                            // Parse the date string from the API
                            const date = new Date(familyData.family4_dob);
                            
                            // Check if we got a valid date
                            if (!isNaN(date.getTime())) {
                                // Format it as YYYY-MM-DD for HTML date input
                                const year = date.getFullYear();
                                // Add leading zeros for month and day if needed
                                const month = String(date.getMonth() + 1).padStart(2, '0');
                                const day = String(date.getDate()).padStart(2, '0');
                                
                                const formattedDate = `${year}-${month}-${day}`;
                                console.log("Formatted DOB:", formattedDate);
                                dobField.value = formattedDate;
                            } else {
                                // Fallback to the original value if date parsing fails
                                dobField.value = familyData.family4_dob;
                                console.log("Invalid date format, using original");
                            }
                        } catch (error) {
                            console.error("Error formatting DOB:", error);
                            dobField.value = familyData.family4_dob;
                        }
                    } else {
                        dobField.value = "";
                    }
                }
                if (document.querySelector("#family4_relationship")) document.querySelector("#family4_relationship").value = familyData.family4_relationship || "";
                if (document.querySelector("#family4_occupation")) document.querySelector("#family4_occupation").value = familyData.family4_occupation || "";
                if (document.querySelector("#family4_aadhar")) document.querySelector("#family4_aadhar").value = familyData.family4_aadhar || "";
            }
            
            // Pre-fill experience form (unchanged)

            
            // Pre-fill qualifications form (unchanged)
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }
});