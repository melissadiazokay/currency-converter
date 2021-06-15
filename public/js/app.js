const app = Vue.createApp({

  data() {

    return {
      numberOfConvertToCurrencyFields: 1,
      showThing: true,
      currencySymbols: [],
      fromCurrency: '',
      toCurrency: [],
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

      for(let i=0; i < this.toCurrency.length; i++){

        let endpoint = `https://swop.cx/rest/rates/${this.fromCurrency}/${this.toCurrency[i]}?api-key=108480aad9accf675fc2bd498fee338ae50501975086b897ba9fd5aa4caf9ef6`

        let response = await fetch(endpoint);
        let data = await response.json();
        console.log(data)
      }

    },

    selectedFromCurrency(symbol) {

      console.log('selected from',symbol)
      this.fromCurrency = symbol;
    },

    selectedToCurrency(symbol) {

      console.log('selected to',symbol)
      this.toCurrency.push(symbol);
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
  `<div>

    <input class="form-control" v-model="searchQuery" placeholder="Search thing" @keyup="searchOnChangeHandler" />

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
      showSearchResults: false
    }
  },

  computed: {

  },

  methods: {

    selectItem(itemIndex) {

      console.log(itemIndex)
      this.searchQuery = `${this.searchResults[itemIndex].name} (${this.searchResults[itemIndex].symbol})`;
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

      }

      console.log(this.searchResults)

    } 
       
  },

});


const mountedApp = app.mount('#app');