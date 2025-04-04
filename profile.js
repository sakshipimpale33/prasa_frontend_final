document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOM fully loaded");

    // ✅ Get references to forms
    const registerForm = document.querySelector("#registerForm");
    const loginForm = document.querySelector("#loginForm");
    const userForm = document.querySelector("#userForm");
    const familyForm = document.querySelector("#familyForm");
    const experienceForm = document.querySelector("#experienceForm");
    const qualificationForm = document.querySelector("#qualificationForm");
    const medicalInfoForm = document.querySelector("#healthForm");

    // ✅ Retrieve authentication details
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("userEmail");

    console.log("Token:", token ? "Present" : "Not Found");
    console.log("Email:", email ? email : "Not Found");

    if (!token || !email) {
        alert("You need to log in first");
        window.location.href = "login.html";
        return;
    }

    // ✅ Call fetchUserProfile() only on the profile page
    if (document.getElementById("profilePage")) {
        fetchUserProfile();
    }

   // ✅ Improved Logout Function with server-side logout
document.getElementById("logout")?.addEventListener("click", async function () {
    try {
        // Set the redirect destination before making the logout request
        localStorage.setItem("redirectTo", "userForm"); // This sets where to go after next login
        
        // Send logout request to server to invalidate token
        const response = await fetch("https://prasa-backend-final.vercel.app/api/logout", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        });
        
        // Check if logout was successful
        if (response.ok) {
            console.log("Server-side logout successful");
        } else {
            console.warn("Server-side logout failed, continuing with client-side logout");
        }
    } catch (error) {
        console.error("Error during logout:", error);
    } finally {
        // Clear authentication data
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        
        // Redirect to login page
        window.location.href = "login.html";
    }
});
    // ✅ Profile Fetching Function (Runs Only on Profile Page)
    async function fetchUserProfile() {
        try {
            const response = await fetch(`https://prasa-backend-final.vercel.app/api/profile/${email}`, {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` }
            });

            const data = await response.json();

            if (response.ok) {
                document.getElementById("fullName").innerText = data.full_name || "N/A";
                document.getElementById("email").innerText = data.email || "N/A";
                document.getElementById("phone").innerText = data.phone || "N/A";
                document.getElementById("address").innerText = data.address || "N/A";
                document.getElementById("dob").innerText = formatDate(data.dob) || "N/A";
                document.getElementById("age").innerText = calculateAge(data.dob) || "N/A";
                document.getElementById("city").innerText = data.city || "N/A";
                document.getElementById("state").innerText = data.state || "N/A";
                document.getElementById("country").innerText = data.country || "N/A";
                document.getElementById("nationality").innerText = data.nationality || "N/A";
                // document.getElementById("aadharNo").innerText = maskAadhar(data.aadhar_no) || "N/A";
                // document.getElementById("panNo").innerText = data.pan_no || "N/A";
                // document.getElementById("passportNo").innerText = data.passport_no || "N/A";
                // document.getElementById("bankName").innerText = data.bankName || "N/A";
                // document.getElementById("accountNo").innerText = maskAccountNumber(data.accountNo) || "N/A";
                // document.getElementById("department").innerText = data.department || "N/A";
                // document.getElementById("designation").innerText = data.designation || "N/A";
            } else {
                alert(data.message || "Failed to load profile");
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    }
});

// 🔹 Helper Functions
function formatDate(dateString) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
}

function calculateAge(dob) {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

function maskAadhar(aadhar) {
    if (!aadhar || aadhar.length < 12) return "Invalid";
    return `XXXX-XXXX-${aadhar.slice(-4)}`;
}

function maskAccountNumber(accountNo) {
    if (!accountNo || accountNo.length < 4) return "Invalid";
    return `XXXX-XXXX-${accountNo.slice(-4)}`;
}