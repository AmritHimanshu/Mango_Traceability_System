const generateHTML = (farmData) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Farm Report</title>
        <style>
            body {
                font-family: Helvetica, sans-serif;
                font-size: 12px;
                padding: 30px 50px;
                background-color: white;
                color: black;
            }
            .header {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .header-child{
                width: 33.33%;
                text-align: center;
                padding: 10px;
            }
            .body{
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            .title {
                font-size: 20px;
                font-weight: bold;
                color: #31473A;
                text-align: center;
            }
            .title-middle{
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .line {
                width: 50px;
                height: 0;
                border: 1px solid black;
            }
            .table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 5px;
            }
            .table th, .table td {
                border: 1px solid #ddd;
                padding: 5px;
                text-align: center;
            }
            .table th {
                background-color: #f2f2f2;
                font-weight: bold;
            }
            .section {
                margin-top: 30px;
            }
            .grid {
                display: flex;
                flex-direction: row;
                align-items: flex-start;
                flex-wrap: wrap;
                justify-content: space-between;
            }
            .grid-item {
                width: 45%;
                padding: 10px;
                text-align: center;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }
        </style>
        </head>
        <body>
            <div class="header">
                <div class="header-child">
                    <h2>${farmData?.farm || "Farm Name"}</h2>
                    <p>ID: ${farmData?.uniqueID || " - "}</p>
                </div>
                <div class="header-child title">
                    <p>Mango</p>
                    <div class="title-middle">
                        <p class="line"></p>
                        <p>Traceability</p>
                        <p class="line"></p>
                    </div>
                    <p>System</p>
                </div>
                <div class="header-child">
                    <h2>${farmData?.crop || "Crop Name"}</h2>
                    <p>${new Date().toISOString().split("T")[0]}</p>
                </div>
            </div>

            <div class="body">
                <div class="section">
                    <h3>Farm Activities</h3>
                    <table class="table">
                        <tr>
                            <th>Ploughing Date</th>
                            <th>Sowing Date</th>
                            <th>Flowering Date</th>
                            <th>Pheromone Trap Date</th>
                            <th>Lure Change Date</th>
                        </tr>
                        <tr>
                            <td>
                                ${farmData?.ploughingDate
                                ? new Date(farmData.ploughingDate)
                                    .toISOString()
                                    .split("T")[0]
                                : " - "}
                            </td>
                            <td>
                                ${farmData?.sowingDate
                                ? new Date(farmData.sowingDate)
                                    .toISOString()
                                    .split("T")[0]
                                : " - "}
                            </td>
                            <td>
                                ${farmData?.floweringDate
                                ? new Date(farmData.floweringDate)
                                    .toISOString()
                                    .split("T")[0]
                                : " - "}
                            </td>
                            <td>
                                ${farmData?.pheromoneTrapDate
                                ? new Date(farmData.pheromoneTrapDate)
                                    .toISOString()
                                    .split("T")[0]
                                : " - "}
                            </td>
                            <td>
                                ${farmData?.lureChangeDate
                                ? new Date(farmData.lureChangeDate)
                                    .toISOString()
                                    .split("T")[0]
                                : " - "}
                            </td>
                        </tr>
                    </table>
                </div>

                <div class="grid">
                    ${farmData?.weedingDate.length > 0 ? (
                        `<div class="grid-item">
                            <h3>Weeding Dates</h3>
                            <table class="table">
                                    ${(farmData?.weedingDate || [])
                                    .reduce((acc, date, index) => {
                                        if (index % 3 === 0) acc.push([]);
                                        acc[acc.length - 1].push(date);
                                        return acc;
                                    }, [])
                                    .map((row) => 
                                        `<tr>
                                            ${row.map((date) =>
                                                `<td>
                                                    ${new Date(date).toISOString().split("T")[0]}
                                                </td>`
                                            ).join("")}
                                        </tr>`
                                    ).join("")}
                            </table>
                        </div>`
                    ):""}

                    ${(farmData?.irrigationDates?.artificial.length > 0 || farmData?.irrigationDates.natural.length > 0) ? (
                        `<div class="grid-item">
                            <h3>Irrigation Dates</h3>
                            <table class="table">
                                <tr>
                                    <th>Artificial</th>
                                    <th>Natural</th>
                                </tr>
                                ${(() => {
                                    const artificial = farmData?.irrigationDates?.artificial || [];
                                    const natural = farmData?.irrigationDates?.natural || [];
                                    const maxLength = Math.max(artificial.length, natural.length);

                                    return Array.from({ length: maxLength })
                                        .map(
                                            (_, i) =>
                                                `<tr>
                                                    <td>${farmData.irrigationDates.artificial[i]
                                                    ? new Date(artificial[i])
                                                        .toISOString()
                                                        .split("T")[0]
                                                    : "-"}</td>
                                                    <td>${farmData.irrigationDates.natural[i]
                                                    ? new Date(natural[i])
                                                        .toISOString()
                                                        .split("T")[0]
                                                    : "-"}</td>
                                                </tr>`
                                        )
                                        .join("");
                                })()}
                            </table>
                        </div>`
                    ):""}

                    ${farmData?.fertilizerApplications.length > 0 ? (
                        `<div class="grid-item">
                            <h4>Fertilizer Application</h4>
                            <table class="table">
                                <tr>
                                    <th>Date</th>
                                    <th>Volume (L)</th>
                                </tr>
                                ${(farmData?.fertilizerApplications || [])
                                .map(
                                    (app) =>
                                        `<tr>
                                            <td>${new Date(app.date)
                                                        .toISOString()
                                                        .split("T")[0]}
                                            </td>
                                            <td>${app.volume}</td>
                                        </tr>`
                                )
                                .join("")}
                            </table>
                        </div>`
                    ):""}
                    
                    ${farmData?.pesticideApplications.length > 0 ? (
                        `<div class="grid-item">
                            <h4>Pesticide Application</h4>
                            <table class="table">
                                <tr>
                                    <th>Date</th>
                                    <th>Volume (L)</th>
                                </tr>
                                ${(farmData?.pesticideApplications || [])
                                .map(
                                    (app) =>
                                        `<tr>
                                            <td>${new Date(app.date)
                                                        .toISOString()
                                                        .split("T")[0]}
                                            </td>
                                            <td>${app.volume}</td>
                                        </tr>`
                                )
                                .join("")}
                            </table>
                        </div>`
                    ):""}
                    
                    ${farmData?.bagging.length > 0 ? (
                        `<div class="grid-item">
                            <h4>Bagging</h4>
                            <table class="table">
                                <tr>
                                    <th>Date</th>
                                    <th>Quantity</th>
                                </tr>
                                    ${(farmData?.bagging || []).map((item) => (
                                        `<tr>
                                            <td>
                                                ${new Date(item.date).toISOString().split("T")[0]}
                                            </td>
                                            <td>
                                                ${item.quantity}
                                            </td>
                                        </tr>`
                                    ))}
                            </table>
                        </div>`
                    ):""}
                    
                    ${farmData?.specialCare.length > 0 ? (
                        `<div class="grid-item">
                            <h4>Special care</h4>
                            <table class="table">
                                <tr>
                                    <th>Date</th>
                                    <th>Name</th>
                                </tr>
                                ${(farmData?.specialCare || []).map((item) => (
                                    `<tr>
                                        <td>
                                            ${new Date(item.date).toISOString().split("T")[0]}
                                        </td>
                                        <td>
                                            ${item.name}
                                        </td>
                                    </tr>`
                                ))}
                            </table>
                        </div>`
                    ):""}
                    
                    ${farmData?.harvest.date ? (
                        `<div class="grid-item">
                            <h4>Harvest</h4>
                            <table class="table">
                                <tr>
                                    <th>Date</th>
                                    <th>Yield</th>
                                </tr>
                                <tr>
                                    <td>${new Date(farmData?.harvest?.date)
                                        .toISOString()
                                        .split("T")[0]}</td>
                                    <td>${farmData?.harvest?.yield}</td>
                                </tr>
                            </table>
                        </div>`
                    ):""}
                    
                </div>
            </div>
        </body>
    </html>
  `;
};

module.exports = generateHTML;