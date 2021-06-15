const app = Vue.createApp({

  data() {

    return {
      numberOfConvertToCurrencyFields: 1,
      showThing: true,
      currencySymbols: [],
      baseCurrency: '',
      quoteCurrency: [],
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

    selectedBaseCurrency(symbol) {

      console.log('selected from',symbol)
      this.baseCurrency = symbol;
    },

    selectedQuoteCurrency(symbol) {

      console.log('selected to',symbol)
      this.quoteCurrency.push(symbol);
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

  props: ['items'], // an array of key:value objects

  /*html*/
  template:
  `<div class="search-select-form-wrapper">

    <input class="form-control" :class="{ active: searchResults.length > 0 }" v-model="searchQuery" placeholder="Search thing" @keyup="searchOnChangeHandler"/>

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
      showSearchResults: false,
    }
  },

  computed: {

  },

  methods: {

    selectItem(itemIndex) {

      console.log(itemIndex)
      this.searchQuery = `${this.searchResults[itemIndex].name} (${this.searchResults[itemIndex].symbol})`;
      this.searchResults = [];
      this.showSearchResults = false;

      this.$emit('selected-item',this.searchResults[itemIndex].symbol) // emit event

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

            this.showSearchResults = true;
          }
        }

      } else this.showSearchResults = false;

      console.log(this.searchResults)

    } 
       
  },

});


const mountedApp = app.mount('#app');