document.addEventListener('DOMContentLoaded', function() {

    const addActivityBtn = document.getElementById('add-activity');
    const generateChartBtn = document.getElementById('generate-chart');
    const activitiesContainer = document.getElementById('activities');
    const lifespanInput = document.getElementById('lifespan');
    const ctx = document.getElementById('lifeChart').getContext('2d');
    let lifeChart;

    addActivityRow();

    function addActivityRow() {
        const div = document.createElement('div');
        div.classList.add('input-group');

        const activityId = 'activity-name-' + (document.querySelectorAll('.activity-name').length + 1);
        const hoursId = 'hours-per-day-' + (document.querySelectorAll('.activity-hours').length + 1);

        const nameDiv = document.createElement('div');
        
        const activitySpan = document.createElement('span');
        activitySpan.textContent = 'Activity Name:';

        const activityName = document.createElement('input');
        activityName.type = 'text';
        activityName.id = activityId; 
        activityName.placeholder = 'Reading...';
        activityName.classList.add('activity-name');

        nameDiv.appendChild(activitySpan);
        nameDiv.appendChild(activityName);

        const hoursDiv = document.createElement('div');
        hoursDiv.classList.add('hours-row');

        const hoursPerDaySpan = document.createElement('span');
        hoursPerDaySpan.textContent = 'Hours per day:';

        const activityHours = document.createElement('input');
        activityHours.type = 'number';
        activityHours.id = hoursId; 
        activityHours.placeholder = 'Hours per day';
        activityHours.classList.add('activity-hours');
        activityHours.min = 0;
        activityHours.max = 24;

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'X';
        removeBtn.classList.add('remove-activity');
        removeBtn.addEventListener('click', () => {
            div.remove();
        });

        hoursDiv.appendChild(hoursPerDaySpan);
        hoursDiv.appendChild(activityHours);
        hoursDiv.appendChild(removeBtn);

        div.appendChild(nameDiv);
        div.appendChild(hoursDiv);

        activitiesContainer.appendChild(div);
    }

    addActivityBtn.addEventListener('click', addActivityRow);

    generateChartBtn.addEventListener('click', () => {
        const activityNames = document.querySelectorAll('.activity-name');
        const activityHours = document.querySelectorAll('.activity-hours');
        const lifespan = parseInt(lifespanInput.value);

        let labels = [];
        let data = [];

        for (let i = 0; i < activityNames.length; i++) {
            const name = activityNames[i].value.trim();
            const hours = parseFloat(activityHours[i].value);

            if (name === '' || isNaN(hours) || hours < 0 || hours > 24) {
                alert('Please enter valid activity names and hours (0-24).');
                return;
            }

            labels.push(name);
            data.push(hours);
        }

        const totalDailyHours = data.reduce((a, b) => a + b, 0);
        
        if (totalDailyHours > 24) {
            alert('Total daily hours exceed 24, please adjust your inputs.');
            return;
        }

        const totalHoursInLife = lifespan * 365 * 24;
        const activityTotalHours = data.map(hours => hours * 365 * lifespan);
        const activityPercentages = activityTotalHours.map(hours => ((hours / totalHoursInLife) * 100).toFixed(2));

        const chartData = {
            labels: labels,
            datasets: [{
                data: activityPercentages,
                backgroundColor: generateColors(labels.length),
            }]
        };

        if (lifeChart) {
            lifeChart.destroy();
        }

        lifeChart = new Chart(ctx, {
            type: 'pie',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const index = context.dataIndex;
                                const hours = activityTotalHours[index];
                                const percentage = activityPercentages[index];
                                return `${labels[index]}: ${percentage}% (${formatNumber(hours)} hours)`;
                            }
                        }
                    }
                }
            }
        });
    });

    function generateColors(num) {
        const colors = [];
        for (let i = 0; i < num; i++) {
            const r = Math.floor(Math.random() * 255);
            const g = Math.floor(Math.random() * 255);
            const b = Math.floor(Math.random() * 255);
            colors.push(`rgba(${r}, ${g}, ${b}, 0.7)`);
        }
        return colors;
    }

    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

});
