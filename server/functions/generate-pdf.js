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
                justify-content: space-between;
                align-items: center;
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
            .table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
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
                gap: 3px;
            }
        </style>
        </head>
        <body>
            <div class="header">
                <div>
                    <h2>${farmData?.farm || "Farm Name"}</h2>
                    <p>ID: ${farmData?.uniqueID || " - "}</p>
                </div>
                <div class="title">Mango Traceability System</div>
                <div>
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
                    <div class="grid-item">
                        <h3>Weeding Dates</h3>
                        <table class="table">
                            <tr>
                                ${(farmData?.weedingDate || []).map(date => `<td>${new Date(date).toISOString().split("T")[0]}</td>`).join("")}
                            </tr>
                        </table>
                    </div>

                    <div class="grid-item">
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
                                                <td>${artificial[i] || "-"}</td>
                                                <td>${natural[i] || "-"}</td>
                                            </tr>`
                                    )
                                    .join("");
                            })()}
                        </table>
                    </div>

                    <div class="grid-item">
                        <h4>Fertilizer Application</h4>
                        <table class="table">
                            <tr>
                                <th>Date</th>
                                <th>Volume (L)</th>
                            </tr>
                            ${(farmData?.fertilizerApplications || [])
                            .map(
                                (app) =>
                                    `<tr><td>${app.date}</td><td>${app.volume}</td></tr>`
                            )
                            .join("")}
                        </table>
                    </div>

                    <div class="grid-item">
                        <h4>Pesticide Application</h4>
                        <table class="table">
                            <tr>
                                <th>Date</th>
                                <th>Volume (L)</th>
                            </tr>
                            ${(farmData?.pesticideApplications || [])
                            .map(
                                (app) =>
                                    `<tr><td>${app.date}</td><td>${app.volume}</td></tr>`
                            )
                            .join("")}
                        </table>
                    </div>

                    <div class="grid-item">
                        <h4>Harvest</h4>
                        <table class="table">
                            <tr>
                                <th>Date</th>
                                <th>Yield</th>
                            </tr>
                            <tr>
                                <td>${farmData?.harvest?.date || "-"}</td>
                                <td>${farmData?.harvest?.yield || "-"}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </body>
    </html>
  `;
};

module.exports = generateHTML;