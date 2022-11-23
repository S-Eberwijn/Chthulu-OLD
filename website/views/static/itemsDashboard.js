let selectedCategories = [''], selectedRarities = [''];

function searchItem() {
    let searchValue = document.querySelector('#search-item-bar')?.value.trim().toLowerCase();
    let itemsWrapperElement = document.querySelector('.itemsWrapper');
    let itemsToSort = itemsWrapperElement.querySelectorAll('.item');

    let filteredItems = Array.prototype.slice.call(itemsToSort).filter(item => item.querySelector('span.itemName').textContent.trim().toLowerCase().includes(searchValue) && selectedCategories.some(category => item.getAttribute('category').startsWith(category)) && selectedRarities.some(rarity => item.getAttribute('rarity').startsWith(rarity)));

    // Hide Other Quests    
    itemsToSort.forEach(item => {
        // If the item is not in the filtered items array, hide it
        filteredItems.includes(item) ? item.style.display = 'flex' : item.style.display = 'none';
        // If the item categroy has no items visible, hide the category.
        item.parentElement.querySelectorAll('.item[style="display: flex;"]').length > 0 ? item.parentElement.style.display = 'flex' : item.parentElement.style.display = 'none';
    })
}

window.addEventListener('DOMContentLoaded', async (event) => {
    var categoryFilterElement = document.querySelector("#multiselect__container-category-filter");
    var rarityFilterElement = document.querySelector("#multiselect__container-rarity-filter");


    var selectCategories = function (data) {
        data.length > 0 ? selectedCategories = data: selectedCategories = [''];
        searchItem();
    }

    var selectRarities = function (data) {
        data.length > 0 ? selectedRarities = data: selectedRarities = [''];
        searchItem();
    }

    Motus.ElementMultiselect.init(categoryFilterElement, uniqueCategories, selectCategories, { title: "Category: ", emptyText: "Select a category...", selectedText: "Categories" });
    Motus.ElementMultiselect.init(rarityFilterElement, uniqueRarities, selectRarities, { title: "Rarity: ", emptyText: "Select a rarity...", selectedText: "Rarities" });

})

