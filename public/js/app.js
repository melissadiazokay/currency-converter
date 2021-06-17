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
      loggedIn: false,
      loggedInEmail: '',
      userConversions: [],
      conversionSavedSuccess: false,
      hideConversionSavedSuccess: false,
      loading: true
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
            this.conversionSavedSuccess = false;
            this.hideConversionSavedSuccess = false;

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

        const el = document.getElementById(`quote-currency-select-wrap-${index}`)
        el.parentNode.removeChild(el);

        this.quoteCurrencyFields.splice(index, 1);
    },

    errorTimeout(delay = 3000){
      setTimeout(function () {
        this.haveError = false; 
        this.haveWarning = false 
      }.bind(this), delay)
    },

    logInSuccess(loginSuccessObj){

      console.log('loginSuccessObj:',loginSuccessObj);

      localStorage.setItem("loggedInEmail", loginSuccessObj.email);
      this.loggedInEmail = loginSuccessObj.email;
      this.loggedIn = true;
      this.showResults = false;
      this.getUserConversions();
    },

    checkLogin(){

      const loggedInEmail = localStorage.getItem("loggedInEmail");
      if(loggedInEmail) {
        this.loggedInEmail = loggedInEmail;
        this.loggedIn = true;
        return true;
      }
      return false;
    },

    logout(){

      localStorage.removeItem('loggedInEmail');
      this.loggedInEmail = '';
      this.loggedIn = false;
    },

    async getUserConversions(){

      this.loading = true;
      this.userConversions = [];

      const response = await fetch(`/conversions/${this.loggedInEmail}`);
      const data = await response.json();

      data.reverse(); // reverse to show newest results first

      for(let i=0; i < data.length; i++){
        let conversion = JSON.parse(data[i].content);
        conversion['id'] = data[i].id;
        this.userConversions.push(conversion);
      }

      this.loading = false;
      
    },

    async saveConversion(conversion){

      const response = await fetch('/save-conversion', {
        method: "post",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `email=${this.loggedInEmail}&content=${JSON.stringify(conversion)}`
      });

      const res = await response.json();

      if(res.status == 1){

        this.conversionSavedSuccess = true;
        this.getUserConversions()

        setTimeout(function () {
          this.hideConversionSavedSuccess = true;
        }.bind(this), 4000)
        
      }
    },

    async deleteConversion(id){

      const response = await fetch(`/delete-conversion/${id}`);
      const res = await response.json();

      if(res.status == 1){
        this.getUserConversions()
      }
    },

  },

  computed: {

  },

  mounted() {
      
    console.log('app mounted')

    if(this.checkLogin()){
      this.getUserConversions();
    }

    this.getCurrencySymbols()
  },
  
});

/* Components */

// modal component
app.component('login-modal',{

  props: ['toggle'],

  /*html*/
  template: 
  `<div class="modal fade" :class="{ active: modalOpen }" >
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
        <div class="modal-body pt-1">
          <div :class="{ invisible: !haveError }" class="pb-1 text-warning" >{{errorMessage}}</div>
          <input class="form-control" v-model="email" @keyup.enter="submit" />
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
      email: '',
      haveError: false,
      errorMessage: '&nbsp;'
    }
  },

  computed: {

    modalOpen(){

      this.email = '';
      return this.toggle;
    }

  },

  methods: {

    modalClose(){

      this.$emit('modal-close');
    },

    validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    },

    submit(){

      if(this.email.length > 0 && this.validateEmail(this.email)){

        this.$emit('log-in-success',{
          email: this.email,
          conversions: []
        });
        
        this.modalClose()

      } else {

        this.haveError = true;
        this.errorMessage = 'Please enter a valid email address.'
        setTimeout(function () { this.haveError = false; }.bind(this), 3000)
      }
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