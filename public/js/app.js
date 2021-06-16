const app = Vue.createApp({

  data() {

    return {
      showThing: true,
      currencySymbols: [],
      baseCurrency: '',
      quoteCurrency: [],
      quoteCurrencyFields: [0],
      conversionResults: [],
      haveError: false,
      errorMessage: '',
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

      for(let i=0; i < this.quoteCurrency.length; i++){

        try {

          console.log('OK')

          let endpoint = `https://swop.cx/rest/rates/${this.baseCurrency}/${this.quoteCurrency[i]}?api-key=108480aad9accf675fc2bd498fee338ae50501975086b897ba9fd5aa4caf9ef6`

          let response = await fetch(endpoint);
          let data = await response.json();
          console.log('result',data)

          if(data.error === undefined){ // success!

            this.conversionResults.push(data);

            this.haveError = false;


          } else { // API error response

            this.haveError = true;
            this.errorMessage = data.error.message;
          } 

        } catch (error){

          console.log('ERROR!!',error)
          this.haveError = true;
          this.errorMessage = 'there was an error';
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

      this.quoteCurrencyFields.push(this.quoteCurrencyFields.length)
    },

    removeQuoteCurrencyField(index){

        this.quoteCurrencyFields.splice(index, 1);
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

    <input class="form-control" :class="{ active: searchResults.length > 0 }" :placeholder="this.placeholder" v-model="searchQuery" @keyup="searchOnChangeHandler"/>

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

      this.searchResults = [];

      let query = e.target.value.toLowerCase();
      console.log(query)

      if(query.length > 0){

        for(let i=0; i < this.items.length; i++){

          // basic search pattern
          if(this.items[i].code.toLowerCase().includes(query)
          || this.items[i].name.toLowerCase().includes(query)){ 

            // match!

            this.searchResults.push({ 
              symbol: this.items[i].code,
              name: this.items[i].name,
            });

          }
        }

      } 

      console.log(this.searchResults)

    } 
       
  },

});


const mountedApp = app.mount('#app');