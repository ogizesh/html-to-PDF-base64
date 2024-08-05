window.function = async function (html, fileName, format, zoom, orientation, margin, breakBefore, breakAfter, breakAvoid, fidelity, customDimensions) {
    try {
        // Basic Fidelity Mapping
        const fidelityMap = {
            low: 1,
            standard: 1.5,
            high: 2,
        };

        // Dynamic Values
        html = html.value ?? "No HTML set.";
        fileName = fileName.value ?? "file";
        format = format.value ?? "a4";
        zoom = parseFloat(zoom.value) ?? 1;
        orientation = orientation.value ?? "portrait";
        margin = parseFloat(margin.value) ?? 0;
        breakBefore = breakBefore.value ? breakBefore.value.split(",") : [];
        breakAfter = breakAfter.value ? breakAfter.value.split(",") : [];
        breakAvoid = breakAvoid.value ? breakAvoid.value.split(",") : [];
        const quality = fidelityMap[fidelity.value] ?? 1.5;
        customDimensions = customDimensions.value ? customDimensions.value.split(",").map(Number) : null;

        // Document Dimensions
        const formatDimensions = {
            a0: [4967, 7022],
            a1: [3508, 4967],
            // Add other formats here...
            a4: [1240, 1754],
            letter: [1276, 1648],
        };

        // Get Final Dimensions from Selected Format
        const dimensions = customDimensions || formatDimensions[format];
        const finalDimensions = dimensions.map(dimension => Math.round(dimension / zoom));

        // PDF Options
        const opt = {
            pagebreak: { mode: ['css'], before: breakBefore, after: breakAfter, avoid: breakAvoid },
            margin: margin,
            filename: fileName,
            html2canvas: {
                useCORS: true,
                scale: quality
            },
            jsPDF: {
                unit: 'px',
                orientation: orientation,
                format: finalDimensions,
                hotfixes: ['px_scaling']
            }
        };

        // Generate PDF
        const pdfBase64 = await html2pdf().set(opt).from(html).toPdf().output('datauristring');
        const base64String = pdfBase64.split(',')[1];

        return JSON.stringify({
            success: true,
            message: "PDF generated successfully.",
            base64String: base64String
        });

    } catch (error) {
        return JSON.stringify({
            success: false,
            message: `Error generating PDF: ${error.message}`,
            base64String: ""
        });
    }
};
