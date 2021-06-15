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

      const endpoint = 'https://swop.cx/rest/currencies?api-key=108480aad9accf675fc2bd498fee338ae50501975086b897ba9fd5aa4caf9ef6'

      const response = await fetch(endpoint);
      const data = await response.json();
      console.log(data)

      for(let i=0; i < data.length; i++){
        this.currencySymbols.push(data[i].code);
      }      
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

  props: ['items'],

  /*html*/
  template:
  `<div>

    <input class="form-control" v-model="searchQuery" placeholder="Search thing" @keyup="searchOnChangeHandler" />

    <div class="search-select-results" v-show="showSearchResults" >
      <ul>
        <li v-for="result in searchResults" @click="selectItem(result)" >{{result}}</li>
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

    selectItem(item) {

      console.log(item)
      this.searchQuery = item;
      this.showSearchResults = false;

      this.$emit('selected-item',item) // emit event

    },

    searchOnChangeHandler(e) {

      this.searchResults = [];

      let query = e.target.value;
      console.log(query)

      if(query.length > 0){

        for(let i=0; i < this.items.length; i++){

          if(this.items[i].toLowerCase().includes(query)){ // match!

            this.searchResults.push(this.items[i]);
            this.showSearchResults = true;
          }
        }

      }

      console.log(this.searchResults)


    } 
       
  },

});


const mountedApp = app.mount('#app');