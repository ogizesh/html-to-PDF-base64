window.function = function(html, fileName, format, zoom, orientation, margin) {
    const debugInfo = {
        success: false,
        message: '',
        base64String: ''
    };

    try {
        // FIDELITY MAPPING
        const fidelityMap = {
            low: 1,
            standard: 1.5,
            high: 2,
        };

        // DYNAMIC VALUES
        html = html.value ?? "No HTML set.";
        fileName = fileName.value ?? "file";
        format = format.value ?? "a4";
        zoom = parseFloat(zoom.value) ?? 1;
        orientation = orientation.value ?? "portrait";
        margin = parseFloat(margin.value) ?? 0;

        // DOCUMENT DIMENSIONS
        const formatDimensions = {
            a4: [1240, 1754], // Simplified, add more if needed
            letter: [1276, 1648],
        };

        const dimensions = formatDimensions[format] || formatDimensions.a4;
        const finalDimensions = dimensions.map(dimension => Math.round(dimension / zoom));

        // Create an element to hold the HTML content
        const element = document.createElement('div');
        element.innerHTML = html;

        const opt = {
            margin: margin,
            filename: fileName,
            html2canvas: { scale: fidelityMap.standard },
            jsPDF: { unit: 'px', format: finalDimensions, orientation: orientation }
        };

        html2pdf().set(opt).from(element).toPdf().output('datauristring')
            .then(function(pdfBase64) {
                const base64String = pdfBase64.split(',')[1]; // Remove the data URI scheme part
                debugInfo.success = true;
                debugInfo.base64String = base64String;
            })
            .catch(function(error) {
                debugInfo.message = `Error generating PDF: ${error.message}`;
            });

    } catch (error) {
        debugInfo.message = `Error: ${error.message}`;
    }

    // Return the debug information
    return debugInfo;
};
