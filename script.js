// Sample external API endpoints
const jsonApiEndpoint = 'https://api.example.com/computer-parts/json';
const xmlApiEndpoint = 'https://api.example.com/computer-parts/xml';

// Function to fetch data from the external JSON API
function fetchJsonData() {
    fetch(jsonApiEndpoint)
        .then(response => response.json())
        .then(data => {
            displayComputerParts(data, '#computer-parts-info-json');
            visualizeData(data);
        })
        .catch(error => console.error('Error fetching JSON data:', error));
}

// Function to fetch data from the external XML API
function fetchXmlData() {
    fetch(xmlApiEndpoint)
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, 'application/xml');
            const parts = parseXmlData(xmlDoc);
            displayComputerParts(parts, '#computer-parts-info-xml');
        })
        .catch(error => console.error('Error fetching XML data:', error));
}

// Function to parse XML data
function parseXmlData(xmlDoc) {
    const parts = [];
    const items = xmlDoc.querySelectorAll('part');
    
    items.forEach(item => {
        const part = {
            name: item.querySelector('name').textContent,
            type: item.querySelector('type').textContent,
            price: parseFloat(item.querySelector('price').textContent),
            manufacturer: item.querySelector('manufacturer').textContent,
            stock: parseInt(item.querySelector('stock').textContent),
        };
        parts.push(part);
    });

    return parts;
}

// Function to display computer parts information
function displayComputerParts(parts, targetElement) {
    const computerPartsInfo = document.querySelector(targetElement);

    // Clear existing content
    computerPartsInfo.innerHTML = '';

    // Iterate over each part and display information
    parts.forEach(part => {
        const partInfo = `
            <div class="part">
                <h2>${part.name}</h2>
                <p>Type: ${part.type}</p>
                <p>Price: $${part.price}</p>
                <p>Manufacturer: ${part.manufacturer}</p>
                <p>Stock: ${part.stock}</p>
            </div>
        `;
        computerPartsInfo.innerHTML += partInfo;
    });
}

// Function for data visualization using D3.js
function visualizeData(data) {
    // Example: Create a bar chart of stock levels using D3.js
    const svg = d3.select('#computer-parts-info')
        .append('svg')
        .attr('width', 400)
        .attr('height', 200);

    const stockValues = data.map(part => part.stock);

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(stockValues)])
        .range([0, 400]);

    svg.selectAll('rect')
        .data(stockValues)
        .enter()
        .append('rect')
        .attr('x', 10)
        .attr('y', (d, i) => i * 40)
        .attr('width', d => xScale(d))
        .attr('height', 30)
        .attr('fill', 'blue');
}

// Fetch data on page load
document.addEventListener('DOMContentLoaded', function() {
    fetchJsonData();
    fetchXmlData();
});