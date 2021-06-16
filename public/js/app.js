const app = Vue.createApp({

  data() {

    return {
      showThing: true,
      currencySymbols: [],
      baseCurrency: '',
      quoteCurrency: [],
      quoteCurrencyFields: [0],
      conversionResults: [],
      showResults: false,
      haveError: false,
      haveWarning: false,
      errorMessage: '&nbsp;',
      amountBaseCurrency: 1
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
          console.log('result',data)

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

      console.log('selected base:',selectedCurrencyObj)
      this.baseCurrency = selectedCurrencyObj.symbol;
    },

    selectedQuoteCurrency(selectedCurrencyObj) {

      console.log('selected quote:',selectedCurrencyObj)
      this.quoteCurrency[selectedCurrencyObj.id] = selectedCurrencyObj.symbol;
    },

    addQuoteCurrencyField(){

      if(this.quoteCurrencyFields.length >= 10) {
        this.haveWarning = true;
        this.errorMessage = "Maximum number of quote currency fields is 10.";
        this.errorTimeout();
        return;
      }

      this.quoteCurrencyFields.push(this.quoteCurrencyFields.length)
    },

    removeQuoteCurrencyField(index){

        this.quoteCurrencyFields.splice(index, 1);
    },

    errorTimeout(){
      setTimeout(function () {
        this.haveError = false; 
        this.haveWarning = false 
      }.bind(this), 3000)
    }

  },

  computed: {

  },

  mounted() {
      
    console.log('appp mounted')
    this.getCurrencySymbols()

  },

  
});


// components
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

      console.log(itemIndex)

      console.log(this.searchResults)

      this.searchQuery = `${this.searchResults[itemIndex].name} (${this.searchResults[itemIndex].symbol})`;

      this.$emit('selected-item',{
        id: this.id,
        symbol: this.searchResults[itemIndex].symbol
      }) // emit event

      this.searchResults = [];
    },

    searchOnChangeHandler(e) {

      console.log('target:',e.target)

      this.searchResults = [];

      // if close icon clicked, allow above line to set searchResults to empty array, which will trigger computed property to close search options, then return
      if(e.target.classList.contains('fa-times')){
        return;
      }

      let query = e.target.value ? e.target.value.toLowerCase(): '';
      console.log(query)

      for(let i=0; i < this.items.length; i++){

        if(query.length > 0){

          // basic search pattern
          if(this.items[i].code.toLowerCase().includes(query)
          || this.items[i].name.toLowerCase().includes(query)){ 

            // match!

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

      

      console.log(this.searchResults)

    } 
       
  },

});


const mountedApp = app.mount('#app');