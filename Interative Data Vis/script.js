document.addEventListener("DOMContentLoaded", function () {
    // Theme toggle functionality
    const themeSwitch = document.getElementById("theme-switch");
    const body = document.body;

    const savedTheme = localStorage.getItem("viz-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    // Set initial theme
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
        body.classList.add("dark");
        if (themeSwitch) themeSwitch.checked = true;
    }

    if (themeSwitch) {
        themeSwitch.addEventListener("change", () => {
            body.classList.toggle("dark");
            localStorage.setItem("viz-theme", body.classList.contains("dark") ? "dark" : "light");
            updateChart();
        });
    }

    // Chart setup
    const dataChart = document.getElementById("data-chart")?.getContext("2d");
    let chart;

    // Current selections
    let currentDataSource = "sales";
    let currentChartType = "bar";
    let currentTimeRange = "week";

    // Sample data sets
    const dataSets = {
        sales: {
            week: { labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], data: [1200, 1900, 1500, 2000, 2400, 1800, 1200] },
            month: { labels: ["Week 1", "Week 2", "Week 3", "Week 4"], data: [5800, 7700, 8900, 7400] },
            quarter: { labels: ["Jan", "Feb", "Mar"], data: [22000, 25000, 28000] },
            year: { labels: ["Q1", "Q2", "Q3", "Q4"], data: [75000, 85000, 92000, 98000] }
        },
        website: {
            week: { labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], data: [320, 480, 420, 580, 720, 680, 490] },
            month: { labels: ["Week 1", "Week 2", "Week 3", "Week 4"], data: [1500, 1800, 2100, 2400] },
            quarter: { labels: ["Jan", "Feb", "Mar"], data: [4500, 5200, 5800] },
            year: { labels: ["Q1", "Q2", "Q3", "Q4"], data: [16000, 18000, 22000, 25000] }
        },
        temperature: {
            week: { labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], data: [15, 18, 20, 22, 24, 19, 17] },
            month: { labels: ["Week 1", "Week 2", "Week 3", "Week 4"], data: [18, 21, 23, 20] },
            quarter: { labels: ["Jan", "Feb", "Mar"], data: [5, 8, 12] },
            year: { labels: ["Q1", "Q2", "Q3", "Q4"], data: [10, 20, 30, 25] }
        }
    };

    // Chart colors
    const chartColors = ['rgba(74, 108, 247, 0.7)', 'rgba(255, 107, 107, 0.7)', 'rgba(81, 207, 102, 0.7)'];

    // Initialize chart
    function initChart() {
        if (chart) chart.destroy();

        const data = dataSets[currentDataSource][currentTimeRange];

        chart = new Chart(dataChart, {
            type: currentChartType,
            data: {
                labels: data.labels,
                datasets: [{
                    label: currentDataSource.toUpperCase(),
                    data: data.data,
                    backgroundColor: chartColors,
                    borderColor: chartColors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true }
                }
            }
        });

        updateInsights(data.data);
    }

    // Update insights
    function updateInsights(data) {
        const highestValue = Math.max(...data);
        const lowestValue = Math.min(...data);
        const totalValue = data.reduce((sum, val) => sum + val, 0);
        const averageValue = (totalValue / data.length).toFixed(2);

        document.getElementById("highest-value").textContent = highestValue;
        document.getElementById("lowest-value").textContent = lowestValue;
        document.getElementById("total-value").textContent = totalValue;
        document.getElementById("average-value").textContent = averageValue;
    }

    // Event listeners for button clicks
    function handleButtonClicks() {
        document.querySelectorAll(".selector-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                currentDataSource = btn.dataset.source;

                // Remove active class from all buttons
                document.querySelectorAll(".selector-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                initChart();
            });
        });

        document.querySelectorAll(".chart-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                currentChartType = btn.dataset.type;

                document.querySelectorAll(".chart-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                initChart();
            });
        });

        document.querySelectorAll(".time-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                currentTimeRange = btn.dataset.range;

                document.querySelectorAll(".time-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                initChart();
            });
        });
    }

    // Initialize everything
    handleButtonClicks();
    initChart();
});
