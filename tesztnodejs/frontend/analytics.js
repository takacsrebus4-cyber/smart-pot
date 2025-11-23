

const xValues = ["2025/11/01", "2025/11/02", "2025/11/03", "2025/11/04", "2025/11/05", "2025/11/06", "2025/11/07", "2025/11/08", "2025/11/09", "2025/11/10", "2025/11/11"];
const yValues = [7, 8, 8, 9, 9, 9, 10, 11, 14, 14, 15];
const zValues = [14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14];
const aValues = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];

const ctx = document.getElementById('myChart');

new Chart(ctx, {
    type: "line",
    data: {
        labels: xValues,
        datasets: [{
            label: "Moisture Level",
            fill: false,
            lineTension: 0,
            backgroundColor: "rgba(0,0,255,1.0)",
            borderColor: "rgba(0,0,255,1.0)",
            borderWidth: 4,
            data: yValues
        }, {
            label: "Maximum Moisture Level",
            data: zValues,
            fill: { value: 20 },
            lineTension: 0,
            backgroundColor: "rgba(255, 0, 0, 0.5)",
            borderColor: "rgba(255, 0, 0,1.0)",
            borderWidth: 0,
            pointRadius: 0,
        }, {
            label: "Minimum Moisture Level",
            data: aValues,
            fill: true,
            lineTension: 0,
            backgroundColor: "rgba(255, 0, 0, 0.5)",
            borderColor: "rgba(255, 0, 0,1.0)",
            borderWidth: 0,
            pointRadius: 0,
        }]
    },
    options: {
        plugins: {
            legend: { display: true },
            title: {
                display: true,
                text: "Average Moisture Level of the Plant Over the Week",
                font: { size: 16 },
                maintainAspectRatio: false
            },
        },
        scales: {
            x: {
                label: { display: true, text: "Date" },
            },
            y: {
                label: { display: true, text: "Moisture Level (%)" },
                min: 0,
                max: 20,
            }
        }
    }
});