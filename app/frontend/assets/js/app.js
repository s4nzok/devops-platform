
async function showMessage() {
    try {
        const response = await fetch("/api/health");

        if (!response.ok) {
            throw new Error("Backend request failed");
        }

        const data = await response.json();

        alert(
            "Welcome to NovaMart! 🚀\n\n" +
            "Backend Status: " + data.status
        );
    } catch (error) {
        alert(
            "Unable to connect to NovaMart backend.\n\n" +
            error.message
        );
    }
}
