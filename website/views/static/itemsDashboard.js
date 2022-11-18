let selectedCategories = [''];

function searchItem() {
    let searchValue = document.querySelector('#search-item-bar')?.value.trim().toLowerCase();
    let itemsWrapperElement = document.querySelector('.itemsWrapper');
    let itemsToSort = itemsWrapperElement.querySelectorAll('.item');

    let filteredItems = Array.prototype.slice.call(itemsToSort).filter(item => item.querySelector('span.itemName').textContent.trim().toLowerCase().includes(searchValue) && selectedCategories.some(category => item.getAttribute('category').includes(category)));

    // Hide Other Quests    
    itemsToSort.forEach(item => {
        // If the item is not in the filtered items array, hide it
        filteredItems.includes(item) ? item.style.display = 'flex' : item.style.display = 'none';
        // If the item categroy has no items visible, hide the category.
        item.parentElement.querySelectorAll('.item[style="display: flex;"]').length > 0 ? item.parentElement.style.display = 'flex' : item.parentElement.style.display = 'none';
    })
}

window.addEventListener('DOMContentLoaded', async (event) => {
    var element = document.querySelector("#multiselect__container-category-filter");

    var select = function (data) {
        data.length > 0 ? selectedCategories = data: selectedCategories = [''];
        searchItem();
    }

    Motus.ElementMultiselect.init(element, uniqueCategories, select, { title: "Category: " });
})

