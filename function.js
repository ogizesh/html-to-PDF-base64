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
    		a2: [2480, 3508],
    		a3: [1754, 2480],
    		a4: [1240, 1754],
    		a5: [874, 1240],
    		a6: [620, 874],
    		a7: [437, 620],
    		a8: [307, 437],
    		a9: [219, 307],
    		a10: [154, 219],
    		b0: [5906, 8350],
    		b1: [4175, 5906],
    		b2: [2953, 4175],
    		b3: [2085, 2953],
    		b4: [1476, 2085],
    		b5: [1039, 1476],
    		b6: [738, 1039],
    		b7: [520, 738],
    		b8: [366, 520],
    		b9: [260, 366],
    		b10: [183, 260],
    		c0: [5415, 7659],
    		c1: [3827, 5415],
    		c2: [2705, 3827],
    		c3: [1913, 2705],
    		c4: [1352, 1913],
    		c5: [957, 1352],
    		c6: [673, 957],
    		c7: [478, 673],
    		c8: [337, 478],
    		c9: [236, 337],
    		c10: [165, 236],
    		dl: [650, 1299],
    		letter: [1276, 1648],
    		government_letter: [1199, 1577],
    		legal: [1276, 2102],
    		junior_legal: [1199, 750],
    		ledger: [2551, 1648],
    		tabloid: [1648, 2551],
    		credit_card: [319, 508]
        };

        let dimensions = customDimensions || formatDimensions[format];

        if (!dimensions) {
            throw new Error("Invalid format or custom dimensions provided.");
        }

        const finalDimensions = dimensions.map(dimension => Math.round(dimension / zoom));

        // Create an iframe to isolate the context
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none'; // Hide the iframe
        document.body.appendChild(iframe);

        const doc = iframe.contentDocument || iframe.contentWindow.document;
        doc.open();
        doc.write(html);
        doc.close();

        const element = doc.body;  // Use the iframe's body for the PDF content

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
        const pdfBase64 = await html2pdf().set(opt).from(element).toPdf().output('datauristring');
        const base64String = pdfBase64.split(',')[1];

        // Clean up iframe
        document.body.removeChild(iframe);

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
