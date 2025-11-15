import { getLists } from './api.js';

// Sample category distribution data (based on TheMealDB)
// In a real app, you might fetch this from an analytics endpoint
const categoryData = {
  'Beef': 45,
  'Chicken': 38,
  'Dessert': 32,
  'Lamb': 28,
  'Pasta': 25,
  'Pork': 22,
  'Seafood': 20,
  'Side': 18,
  'Starter': 15,
  'Vegan': 12,
  'Vegetarian': 10,
  'Breakfast': 8,
  'Goat': 5
};

async function initChart() {
  try {
    // Fetch actual categories from API
    const { categories } = await getLists();
    
    // Create a simple distribution (for demo purposes)
    // In production, this would come from actual usage data
    const labels = categories.slice(0, 10); // Top 10 categories
    const data = labels.map((cat, i) => categoryData[cat] || Math.floor(Math.random() * 30) + 5);
    
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;
    
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Number of Recipes',
          data: data,
          backgroundColor: 'rgba(110, 231, 183, 0.6)',
          borderColor: 'rgba(110, 231, 183, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: '#a7b0bd'
            },
            grid: {
              color: 'rgba(35, 38, 45, 0.5)'
            }
          },
          x: {
            ticks: {
              color: '#a7b0bd'
            },
            grid: {
              color: 'rgba(35, 38, 45, 0.5)'
            }
          }
        }
      }
    });
  } catch (e) {
    console.error('Failed to load chart:', e);
  }
}

initChart();

