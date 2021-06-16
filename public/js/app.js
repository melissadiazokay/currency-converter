const app = Vue.createApp({

  data() {

    return {
      currencySymbols: [],
      baseCurrency: '',
      quoteCurrency: [],
      quoteCurrencyFields: [0],
      conversionResults: [],
      showResults: false,
      haveError: false,
      haveWarning: false,
      errorMessage: '&nbsp;',
      amountBaseCurrency: 1,
      modalToggle: false,
      loggedIn: false
    }
  },

  methods: {

    async getCurrencySymbols() {

      // const endpoint = 'https://swop.cx/rest/currencies?api-key=108480aad9accf675fc2bd498fee338ae50501975086b897ba9fd5aa4caf9ef6'

       const endpoint = './assets/currencies.json';

      const response = await fetch(endpoint);
      this.currencySymbols = await response.json();

      console.log(this.currencySymbols);

    },

    async convert(){

      this.conversionResults = [];

      if(this.baseCurrency == '') {
        this.errorMessage = "Please choose a base currency.";
        this.haveWarning = true;
      } else if(this.quoteCurrency.length == 0) {
        this.errorMessage = "Please choose at least one quote currency.";
        this.haveWarning = true;
      }

      for(let i=0; i < this.quoteCurrency.length; i++){

        try {

          let endpoint = `https://swop.cx/rest/rates/${this.baseCurrency}/${this.quoteCurrency[i]}?api-key=108480aad9accf675fc2bd498fee338ae50501975086b897ba9fd5aa4caf9ef6`

          let response = await fetch(endpoint);
          let data = await response.json();

          if(data.error === undefined){ // success!

            data['computed_quote'] = data.quote * this.amountBaseCurrency;

            this.conversionResults.push(data);
            this.showResults = true;
            this.haveError = false;

          } else { // API error response

            this.errorMessage = data.error.message;
            this.haveError = true;
          } 

        } catch (error){ 
          this.errorMessage = 'there was an error';
          this.haveError = true;
        }

      }

      if(this.haveError || this.haveWarning){ // hide error message after 3s
        this.showResults = false;
        this.errorTimeout();
      }

    },

    getSymbolName(symbol){

      for(let i=0; i < this.currencySymbols.length; i++){
        if(this.currencySymbols[i].code == symbol){
          return this.currencySymbols[i].name;
        }
      }

    },

    selectedBaseCurrency(selectedCurrencyObj) {

      this.baseCurrency = selectedCurrencyObj.symbol;
    },

    selectedQuoteCurrency(selectedCurrencyObj) {

      this.quoteCurrency[selectedCurrencyObj.id] = selectedCurrencyObj.symbol;
    },

    addQuoteCurrencyField(){

      if(this.quoteCurrencyFields.length >= 10) {
        this.haveWarning = true;
        this.errorMessage = "Maximum number of quote currency fields is 10.";
        this.errorTimeout(4000);
        return;
      }

      this.quoteCurrencyFields.push(this.quoteCurrencyFields.length)
    },

    removeQuoteCurrencyField(index){

        this.quoteCurrencyFields.splice(index, 1);
    },

    errorTimeout(delay = 3000){
      setTimeout(function () {
        this.haveError = false; 
        this.haveWarning = false 
      }.bind(this), delay)
    },

  },

  computed: {

    showLoginButton(){

      return this.loggedIn;
    }
  },

  mounted() {
      
    console.log('appp mounted')
    this.getCurrencySymbols()

  },
  
});

/* Components */

// modal component
app.component('modal',{

  props: ['toggle'],

  /*html*/
  template: 
  `<div class="modal fade" :class="{ active: toggle }" >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <div>
            <h5 class="modal-title" >Login</h5>
            <div class="modal-subtitle">Enter your email address to retrieve saved conversions</div>
          </div>
          <button type="button" class="close" @click="modalClose" >
            <span aria-hidden="true">&times;</span>
          
          </button>
        </div>
        <div class="modal-body">
          <input class="form-control" v-model="email" placeholder="" />
          <div class="text-right mt-2">
            <button class="btn btn-invert" type="email" @click="submit">Login</button>
          </div>
        </div>
      </div>
    </div>
  </div>`,

  data(){

    return {
      active: false,
      email: ''
    }
  },

  methods: {

    modalClose(){

      this.$emit('modal-close');
    },

    submit(){

      console.log(this.email)

      // this.modalClose()
    }

  },

});

// search select component
app.component('search-select', {

  props: {
    id: Number, 
    items: Array,
    placeholder: String
  }, 

  /*html*/
  template:

  `<div :id="'search-select-' + this.id" class="search-select">

    <div class="input-field">

      <i class="fa" :class="{ 'fa-times': this.showSearchResults, 'fa-chevron-down': !this.showSearchResults }" @click="searchOnChangeHandler" ></i>

      <input class="form-control" :class="{ active: searchResults.length > 0 }" :placeholder="this.placeholder" v-model="searchQuery" @keyup="searchOnChangeHandler" @click="searchOnChangeHandler" />

    </div>

    <div class="search-select-results" v-show="showSearchResults" >
      <ul>
        <li v-for="(result, index) in searchResults" @click="selectItem(index)" >{{result.name}} ({{result.symbol}})</li>
      </ul>
    </div>

    <div>{{selectedItem}}</div>

  </div>`,

  data(){

    return {
      searchQuery: '',
      selectedItem: '',
      searchResults: [],
    }
  },

  computed: {

    showSearchResults(){

      return this.searchResults.length > 0
    }

  },

  methods: {

    selectItem(itemIndex) {

      this.searchQuery = `${this.searchResults[itemIndex].name} (${this.searchResults[itemIndex].symbol})`;

      this.$emit('selected-item',{
        id: this.id,
        symbol: this.searchResults[itemIndex].symbol
      }) // emit event

      this.searchResults = [];
    },

    searchOnChangeHandler(e) {

      this.searchResults = [];

      // if close icon clicked, return from function with @searchResult empty, which will allow computed property @showSearchResults to be set accordingly
      if(e.target.classList.contains('fa-times')){
        return;
      }

      const query = e.target.value ? e.target.value.toLowerCase() : '';

      // handle case where user backspaces to clear the input field; search results dropdown should close automatically
      if(e.keyCode == 8 && query.length == 0){
        return;
      }

      // loop through items and return matching entries
      for(let i=0; i < this.items.length; i++){

        if(query.length > 0){

          // basic search pattern
          if(this.items[i].code.toLowerCase().includes(query)
          || this.items[i].name.toLowerCase().includes(query)){ 

            // MATCH!

            this.searchResults.push({ 
              symbol: this.items[i].code,
              name: this.items[i].name,
            });

          }

        } else { // for empty query, show all results. this handles case when user initally clicks on input field

          this.searchResults.push({ 
            symbol: this.items[i].code,
            name: this.items[i].name,
          });
        }

      }

    } 
       
  },

});

const mountedApp = app.mount('#app');