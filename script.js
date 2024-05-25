document.addEventListener("DOMContentLoaded", () => {
    const assetTable = document.getElementById("assetTable");
    const liabilityTable = document.getElementById("liabilityTable");
    const assetDivisionTable = document.getElementById("assetDivisionTable");
    const liabilityDivisionTable = document.getElementById("liabilityDivisionTable");
    const totalAssetYou = document.getElementById("totalAssetYou");
    const totalAssetOther = document.getElementById("totalAssetOther");
    const totalLiabilityYou = document.getElementById("totalLiabilityYou");
    const totalLiabilityOther = document.getElementById("totalLiabilityOther");
    const netTotalYou = document.getElementById("netTotalYou");
    const netTotalOther = document.getElementById("netTotalOther");

    window.addAssetRow = function(description = "", yourValue = 0, otherValue = 0, agreedValue = 0, allocation = 50) {
        addRow(description, yourValue, otherValue, agreedValue, allocation, assetTable, assetDivisionTable);
    }

    window.addLiabilityRow = function(description = "", yourValue = 0, otherValue = 0, agreedValue = 0, allocation = 50) {
        addRow(description, yourValue, otherValue, agreedValue, allocation, liabilityTable, liabilityDivisionTable);
    }

    window.removeRow = function(button) {
        const row = button.parentElement.parentElement;
        const parentTable = row.parentElement;
        const index = Array.from(parentTable.children).indexOf(row);
        const divisionTable = parentTable.id === "assetTable" ? assetDivisionTable : liabilityDivisionTable;
        parentTable.removeChild(row);
        divisionTable.removeChild(divisionTable.children[index]);
        calculateAdjustments();
    }

    window.updateDivision = function(input) {
        const row = input.parentElement.parentElement;
        const parentTable = row.parentElement;
        const index = Array.from(parentTable.children).indexOf(row);
        const divisionTable = parentTable.id === "assetTable" ? assetDivisionTable : liabilityDivisionTable;
        const description = row.querySelector('.description').value;
        const agreedValue = parseFloat(row.querySelector('.agreedValue').value) || 0;
        const allocation = parseFloat(row.querySelector('.allocation') ? row.querySelector('.allocation').value : 50) || 50;

        const divisionRow = divisionTable.children[index];
        divisionRow.querySelector('.description').textContent = description;
        divisionRow.querySelector('.you').textContent = (agreedValue * (1 - allocation / 100)).toFixed(2);
        divisionRow.querySelector('.other').textContent = (agreedValue * (allocation / 100)).toFixed(2);

        const label = divisionRow.querySelector('.slider-label');
        if (allocation === 0) {
            label.textContent = `Transfer to You: ${agreedValue}`;
        } else if (allocation === 100) {
            label.textContent = `Transfer to Other Party: ${agreedValue}`;
        } else {
            label.textContent = `Sale: ${agreedValue} (You: ${(agreedValue * (1 - allocation / 100)).toFixed(2)}, Other Party: ${(agreedValue * (allocation / 100)).toFixed(2)})`;
        }

        calculateAdjustments();
    }

    window.updateSlider = function(slider) {
        const row = slider.parentElement.parentElement;
        const parentTable = row.parentElement.parentElement;
        const index = Array.from(parentTable.children).indexOf(row);
        const divisionTable = parentTable.id === "assetDivisionTable" ? assetDivisionTable : liabilityDivisionTable;
        const agreedValue = parseFloat(parentTable.children[index].querySelector('.agreedValue').value) || 0;
        const allocation = parseFloat(slider.value) || 0;

        divisionTable.children[index].querySelector('.you').textContent = (agreedValue * (1 - allocation / 100)).toFixed(2);
        divisionTable.children[index].querySelector('.other').textContent = (agreedValue * (allocation / 100)).toFixed(2);

        const label = divisionTable.children[index].querySelector('.slider-label');
        if (allocation === 0) {
            label.textContent = `Transfer to You: ${agreedValue}`;
        } else if (allocation === 100) {
            label.textContent = `Transfer to Other Party: ${agreedValue}`;
        } else {
            label.textContent = `Sale: ${agreedValue} (You: ${(agreedValue * (1 - allocation / 100)).toFixed(2)}, Other Party: ${(agreedValue * (allocation / 100)).toFixed(2)})`;
        }

        calculateAdjustments();
    }

    function addRow(description, yourValue, otherValue, agreedValue, allocation, parentTable, divisionTable) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><input type="text" class="description" placeholder="Description" value="${description}" oninput="updateDivision(this)" onblur="validateInput(this)"></td>
            <td><input type="number" class="yourValue" placeholder="Your Value" value="${yourValue}" oninput="updateDivision(this)" onblur="validateInput(this)"></td>
            <td><input type="number" class="otherValue" placeholder="Other Party's Value" value="${otherValue}" oninput="updateDivision(this)" onblur="validateInput(this)"></td>
            <td><input type="number" class="agreedValue" placeholder="Agreed Valuation" value="${agreedValue}" oninput="updateDivision(this)" onblur="validateInput(this)"></td>
            <td><button onclick="removeRow(this)">Remove</button></td>
        `;
        parentTable.appendChild(row);
        const divisionRow = document.createElement("tr");
        divisionRow.innerHTML = `
            <td class="description">${description}</td>
            <td class="you">${(agreedValue * (1 - allocation / 100)).toFixed(2)}</td>
            <td>
                <input type="range" class="allocation" min="0" max="100" value="${allocation}" oninput="updateSlider(this)">
                <div class="slider-label">${allocation === 0 ? `Transfer to You: ${agreedValue}` : allocation === 100 ? `Transfer to Other Party: ${agreedValue}` : `Sale: ${agreedValue} (You: ${(agreedValue * (1 - allocation / 100)).toFixed(2)}, Other Party: ${(agreedValue * (allocation / 100)).toFixed(2)})`}</div>
            </td>
            <td class="other">${(agreedValue * (allocation / 100)).toFixed(2)}</td>
        `;
        divisionTable.appendChild(divisionRow);
    }

    function calculateAdjustments() {
        let totalAssetYouValue = 0;
        let totalAssetOtherValue = 0;
        let totalLiabilityYouValue = 0;
        let totalLiabilityOtherValue = 0;

        assetDivisionTable.querySelectorAll('tr').forEach(row => {
            const you = parseFloat(row.querySelector('.you').textContent) || 0;
            const other = parseFloat(row.querySelector('.other').textContent) || 0;
            totalAssetYouValue += you;
            totalAssetOtherValue += other;
        });

        liabilityDivisionTable.querySelectorAll('tr').forEach(row => {
            const you = parseFloat(row.querySelector('.you').textContent) || 0;
            const other = parseFloat(row.querySelector('.other').textContent) || 0;
            totalLiabilityYouValue += you;
            totalLiabilityOtherValue += other;
        });

        const netTotalYouValue = totalAssetYouValue - totalLiabilityYouValue;
        const netTotalOtherValue = totalAssetOtherValue - totalLiabilityOtherValue;

        totalAssetYou.textContent = totalAssetYouValue.toFixed(2);
        totalAssetOther.textContent = totalAssetOtherValue.toFixed(2);
        totalLiabilityYou.textContent = totalLiabilityYouValue.toFixed(2);
        totalLiabilityOther.textContent = totalLiabilityOtherValue.toFixed(2);
        netTotalYou.textContent = netTotalYouValue.toFixed(2);
        netTotalOther.textContent = netTotalOtherValue.toFixed(2);
    }

    // Test by adding an initial row
    addAssetRow();
    addLiabilityRow();
});

function exportToCSV() {
    const assetTable = document.getElementById("assetTable");
    const liabilityTable = document.getElementById("liabilityTable");
    const assetDivisionTable = document.getElementById("assetDivisionTable");
    const liabilityDivisionTable = document.getElementById("liabilityDivisionTable");

    let csv = 'Description,Your Value,Other Party\'s Value,Agreed Valuation,Allocation,You,Other Party\n';
    assetTable.querySelectorAll('tr').forEach((row, index) => {
        const description = row.querySelector('.description').value;
        const yourValue = parseFloat(row.querySelector('.yourValue').value) || 0;
        const otherValue = parseFloat(row.querySelector('.otherValue').value) || 0;
        const agreedValue = parseFloat(row.querySelector('.agreedValue').value) || 0;
        const allocation = parseFloat(assetDivisionTable.children[index].querySelector('.allocation').value) || 0;
        const divisionRow = assetDivisionTable.children[index];
        const you = divisionRow.querySelector('.you').textContent;
        const other = divisionRow.querySelector('.other').textContent;
        csv += `${description},${yourValue},${otherValue},${agreedValue},${allocation},${you},${other}\n`;
    });

    liabilityTable.querySelectorAll('tr').forEach((row, index) => {
        const description = row.querySelector('.description').value;
        const yourValue = parseFloat(row.querySelector('.yourValue').value) || 0;
        const otherValue = parseFloat(row.querySelector('.otherValue').value) || 0;
        const agreedValue = parseFloat(row.querySelector('.agreedValue').value) || 0;
        const allocation = parseFloat(liabilityDivisionTable.children[index].querySelector('.allocation').value) || 0;
        const divisionRow = liabilityDivisionTable.children[index];
        const you = divisionRow.querySelector('.you').textContent;
        const other = divisionRow.querySelector('.other').textContent;
        csv += `${description},${yourValue},${otherValue},${agreedValue},${allocation},${you},${other}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'property_division.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
