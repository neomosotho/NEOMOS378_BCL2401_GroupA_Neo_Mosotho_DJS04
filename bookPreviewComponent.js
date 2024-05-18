 
class BookPreview extends HTMLElement {
  static get observedAttributes() {
    return ['author', 'id', 'image', 'title'];
  }
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const author = this.getAttribute('author');
    const id = this.getAttribute('id');
    const image = this.getAttribute('image');
    const title = this.getAttribute('title');

    this.shadowRoot.innerHTML = `
      <style>
        .preview {
          display: flex;
          align-items: center;
          cursor: pointer;
          border: none;
          background: none;
          padding: 10px;
        }
        .preview__image {
          width: 50px;
          height: 75px;
          object-fit: cover;
          margin-right: 10px;
        }
        .preview__info {
          display: flex;
          flex-direction: column;
        }
        .preview__title {
          font-size: 1rem;
          margin: 0;
        }
        .preview__author {
          font-size: 0.875rem;
          color: gray;
        }
      </style>
      <button class="preview" data-preview="${id}">
        <img class="preview__image" src="${image}" />
        <div class="preview__info">
          <h3 class="preview__title">${title}</h3>
          <div class="preview__author">${author}</div>
        </div>
      </button>
    `;
  }
}

customElements.define('book-preview', BookPreview);