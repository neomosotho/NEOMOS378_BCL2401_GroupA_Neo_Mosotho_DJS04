class ShowMoreButton extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
  
      this.shadowRoot.innerHTML = `
        <style>
          .show-more {
            background-color: #007bff;
            border: none;
            color: white;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            margin: 4px 2px;
            cursor: pointer;
            border-radius: 4px;
          }
          .show-more:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
          }
        </style>
        <button class="show-more" id="show-more-button">
          <span>Show more</span>
          <span class="list__remaining">(0)</span>
        </button>
      `;
  
      this.button = this.shadowRoot.querySelector('#show-more-button');
    }
  
    update(remainingBooks) {
      this.button.querySelector('.list__remaining').innerText = `(${remainingBooks > 0 ? remainingBooks : 0})`;
      this.button.disabled = remainingBooks <= 0;
    }
  
    set onClick(callback) {
      this.button.addEventListener('click', callback);
    }
  }
  
  customElements.define('show-more-button', ShowMoreButton);