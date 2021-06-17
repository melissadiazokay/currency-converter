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
      loading: true,
    }
  },

  methods: {

    async getCurrencySymbols() {

      const endpoint = 'https://swop.cx/rest/currencies?api-key=108480aad9accf675fc2bd498fee338ae50501975086b897ba9fd5aa4caf9ef6'

      // const endpoint = './assets/currencies.json';

      const response = await fetch(endpoint);
      this.currencySymbols = await response.json();
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

            this.hideConversionSavedSuccess = false;
            this.conversionSavedSuccess = false;
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

  },

  computed: {

    bestRate(){

      let indexOfBestRate = 0;
      for(let i=0; i < this.conversionResults.length; i++){
        if(this.conversionResults[i].quote > this.conversionResults[indexOfBestRate].quote){
          indexOfBestRate = i; 
        }
      }

      return this.conversionResults[indexOfBestRate]
    }
  },

  mounted() {

    if(this.checkLogin()){
      this.getUserConversions();
    }

    this.getCurrencySymbols()
  },
  
});
