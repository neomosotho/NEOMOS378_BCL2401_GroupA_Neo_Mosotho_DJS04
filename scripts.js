// Importing data and constants from external module
import { books, authors, genres, BOOKS_PER_PAGE } from './data.js';
import {bookPreviewComponent} from './bookPreviewComponent.js';


// Initializing variables for pagination and filtering
let page = 1;
let matches = books;

// Function to get DOM element by selector
const getElement = (selector) => document.querySelector(selector);

// Function to append and create options to a select element
const createBookPreviews = (books, container) => {
  const fragment = document.createDocumentFragment();
  books.forEach(({author, id, image, title}) => {
    const element = document.createElement('button');
    element.classList = 'preview'
    element.setAttribute('data-preview', id)
    element.innerHTML = `
        <img
            class="preview__image" src="${image}"
        />
        <div class="preview__info">
            <h3 class="preview__title">${title}</h3>
            <div class="preview__author">${authors[author]}</div>
        </div>
        `;

     fragment.appendChild(element);  
}) 
container.appendChild(fragment);
};

// Initial rendering of book previews
createBookPreviews(
    matches.slice(0, BOOKS_PER_PAGE),
    getElement("[data-list-items]")
  );

// Function to create and append options
  const createOptions = (options, defaultOption, container) => {
    const fragment = document.createDocumentFragment();
    const firstOption = document.createElement('option');
    firstOption.value = 'any';
    firstOption.innerText = 'defaultOption';
    fragment.appendChild(firstOption);
    Object.entries(options).forEach(([id, name]) => {
        const element = document.createElement('option');
        element.value = id;
        element.innerText = name;
        fragment.appendChild(element);
      });
      container.appendChild(fragment);
  };

createOptions(genres, "All Genres", getElement("[data-search-genres]"));
createOptions(authors, "All Authors", getElement("[data-search-authors]"));

const applyTheme = (theme) => {
    const isNight = theme === "night";
  document.documentElement.style.setProperty(
    "--color-dark",
    isNight ? "255, 255, 255" : "10, 10, 20"
  );
  document.documentElement.style.setProperty(
    "--color-light",
    isNight ? "10, 10, 20" : "255, 255, 255"
  );
  getElement("[data-settings-theme]").value = isNight ? "night" : "day";
};

applyTheme(
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "night" : "day"
);

// Function to update Show More button
const updateShowMoreButton = () => {
    const remainingBooks = matches.length - page * BOOKS_PER_PAGE;
    const button = getElement("[data-list-button]");
    button.innerHTML = `
        <span>Show more</span>
        <span class="list__remaining">(${
          remainingBooks > 0 ? remainingBooks : 0
        })</span>
      `;
    button.disabled = remainingBooks <= 0;
  };

// updating show more button initially
  updateShowMoreButton();

//   Function to close overlay
  const closeOverlay = (selector) => {
    getElement(selector).open = false;
  };

//   Function to open overlay
const openOverlay = (selector, focusSelector = null) => {
  getElement(selector).open = true;
  if (focusSelector) getElement(focusSelector).focus();
};

// Function to apply search filters to book data
const applySearchFilters = (filters) => {
    return books.filter((book) => {
      const titleMatch =
        filters.title.trim() === "" ||
        book.title.toLowerCase().includes(filters.title.toLowerCase());
      const authorMatch =
        filters.author === "any" || book.author === filters.author;
      const genreMatch =
        filters.genre === "any" || book.genres.includes(filters.genre);
      return titleMatch && authorMatch && genreMatch;
    });
  };

// Close search overlay
getElement("[data-search-cancel]").addEventListener("click", () =>
  closeOverlay("[data-search-overlay]")
);

// Close settings overlay
getElement("[data-settings-cancel]").addEventListener("click", () =>
  closeOverlay("[data-settings-overlay]")
);

// Open search overlay
getElement("[data-header-search]").addEventListener("click", () =>
  openOverlay("[data-search-overlay]", "[data-search-title]")
);

// Open settings overlay
getElement("[data-header-settings]").addEventListener("click", () =>
  openOverlay("[data-settings-overlay]")
);

// Close active book overlay
getElement("[data-list-close]").addEventListener("click", () =>
  closeOverlay("[data-list-active]")
);

getElement("[data-settings-form]").addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const { theme } = Object.fromEntries(formData);
  applyTheme(theme);
  closeOverlay("[data-settings-overlay]");
});

// Submit event listener for search form
getElement("[data-search-form]").addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);
    matches = applySearchFilters(filters);
    page = 1;
    getElement("[data-list-message]").classList.toggle(
      "list__message_show",
      matches.length < 1
    );
    getElement("[data-list-items]").innerHTML = "";
    createBookPreviews(
      matches.slice(0, BOOKS_PER_PAGE),
      getElement("[data-list-items]")
    );
    updateShowMoreButton();
    window.scrollTo({ top: 0, behavior: "smooth" });
    closeOverlay("[data-search-overlay]");
  });

  // Click event listener for "show more" button
getElement("[data-list-button]").addEventListener("click", () => {
    page++;
    const start = (page - 1) * BOOKS_PER_PAGE;
    const end = start + BOOKS_PER_PAGE;
    createBookPreviews(
      matches.slice(start, end),
      getElement("[data-list-items]")
    );
    updateShowMoreButton();
  });

  // Click event listener for book reviews
getElement("[data-list-items]").addEventListener("click", (event) => {
    const pathArray = Array.from(event.composedPath());
    const active = pathArray.find((node) => node?.dataset?.preview);
    if (active) {
      const book = books.find((book) => book.id === active.dataset.preview);
      if (book) {
        getElement("[data-list-active]").open = true;
        getElement("[data-list-blur]").src = book.image;
        getElement("[data-list-image]").src = book.image;
        getElement("[data-list-title]").innerText = book.title;
        getElement("[data-list-subtitle]").innerText = `${
          authors[book.author]
        } (${new Date(book.published).getFullYear()})`; // Fixed string interpolation
        getElement("[data-list-description]").innerText = book.description;
      }
    }
  });

 

// // FilterDropdown as web components
// class FilterDropdown extends HTMLElement {
//   constructor() {
//     super();
//     this.attachShadow({ mode: 'open' });
//   }

//   connectedCallback() {
//       const { label, options } = this.dataset;
//       const select = document.createElement('select');
//       const defaultOption = document.createElement('option');
//       defaultOption.value = 'any';
//       defaultOption.innerText = `All ${label}`;
//       select.appendChild(defaultOption);
//       Object.entries(JSON.parse(options)).forEach(([id, name]) => {
//         const option = document.createElement('option');
//         option.value = id;
//         option.innerText = name;
//         select.appendChild(option);
//       });
//       select.addEventListener('change', () => this.dispatchEvent(new Event('filterChange')));
//       this.shadowRoot.appendChild(select);
//       const style = document.createElement('style');
//       style.textContent = `
//         select {
//           /* Add your select styles here */
//         }
//       `;
//       this.shadowRoot.appendChild(style);
//     }
//   }
  
//   // Define custom elements for genre and author dropdowns
//   customElements.define('genre-dropdown', FilterDropdown);
//   customElements.define('author-dropdown', FilterDropdown);

//   // themeSwitcher as web components
//   class ThemeSwitcher extends HTMLElement {
//     constructor() {
//       super();
//       this.attachShadow({ mode: 'open' });
//       this.theme = 'day'; // Default theme
//     }
  
//     connectedCallback() {
//       this.render();
//       this.shadowRoot.querySelector('select').addEventListener('change', this.changeTheme.bind(this));
//     }
  
//     render() {
//       const select = document.createElement('select');
//       const optionDay = document.createElement('option');
//       optionDay.value = 'day';
//       optionDay.innerText = 'Day';
//       const optionNight = document.createElement('option');
//       optionNight.value = 'night';
//       optionNight.innerText = 'Night';
//       select.appendChild(optionDay);
//       select.appendChild(optionNight);
//       select.value = this.theme;
//       this.shadowRoot.appendChild(select);
//     }
  
//     changeTheme(event) {
//       this.theme = event.target.value;
//       this.dispatchEvent(new CustomEvent('themeChange', { detail: this.theme }));
//     }
//   }
  
//   customElements.define('theme-switcher', ThemeSwitcher);

//   // Search-form web components
//   class SearchForm extends HTMLElement {
//     constructor() {
//       super();
//       this.attachShadow({ mode: 'open' });
//     }
  
//     connectedCallback() {
//       this.render();
//       this.shadowRoot.querySelector('form').addEventListener('submit', this.handleFormSubmit.bind(this));
//     }
  
//     render() {
//       const form = document.createElement('form');
//       form.innerHTML = `
//         <input type="text" placeholder="Search..." name="search" />
//         <button type="submit">Search</button>
//       `;
//       this.shadowRoot.appendChild(form);
//     }
  
//     handleFormSubmit(event) {
//       event.preventDefault();
//       const formData = new FormData(event.target);
//       const searchQuery = formData.get('search');
//       this.dispatchEvent(new CustomEvent('search', { detail: searchQuery }));
//     }
//   }
  
//   customElements.define('search-form', SearchForm);

// // showMoreButton as web components
// class ShowMoreButton extends HTMLElement {
//   constructor() {
//     super();
//     this.attachShadow({ mode: 'open' });
//     this.remainingBooks = 0;
//   }

//   static get observedAttributes() {
//     return ['remaining'];
//   }

//   attributeChangedCallback(name, oldValue, newValue) {
//     if (name === 'remaining') {
//       this.remainingBooks = parseInt(newValue);
//       this.render();
//     }
//   }

//   connectedCallback() {
//     this.render();
//     this.shadowRoot.querySelector('button').addEventListener('click', this.handleButtonClick.bind(this));
//   }

//   render() {
//     const button = document.createElement('button');
//     button.innerHTML = `
//       <span>Show more</span>
//       <span class="list__remaining">(${this.remainingBooks > 0 ? this.remainingBooks : 0})</span>
//     `;
//     this.shadowRoot.innerHTML = '';
//     this.shadowRoot.appendChild(button);
//   }

//   handleButtonClick() {
//     this.dispatchEvent(new CustomEvent('showMore'));
//   }
// }

// customElements.define('show-more-button', ShowMoreButton);
