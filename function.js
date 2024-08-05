window.function = function(html) {
    let result = {
        success: false,
        message: "Processing...",
        base64String: ""
    };

    try {
        setTimeout(function() {
            result.success = true;
            result.message = "Completed async operation";
            result.base64String = "Base64 string here";
            // This would not return to Glide because it’s after the return statement
        }, 1000);

    } catch (error) {
        result.message = `Error: ${error.message}`;
    }

    return result;
};
