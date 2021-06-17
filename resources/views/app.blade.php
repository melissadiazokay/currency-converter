@extends('base')
@section('title','Conversion Calculator')

@section('content')

    @verbatim

    <div id="app" >

        <!-- Login modal component -->
        <login-modal :toggle="modalToggle" @modal-close="modalToggle = !modalToggle" @log-in-success="logInSuccess" ></login-modal>

        <!-- Hero -->
        <div class="container-fluid hero">

            <div v-show="!loggedIn" class="text-right">
                <button class="btn btn-invert mt-2" @click="modalToggle = !modalToggle">Login</button>
            </div>

            <div v-show="loggedIn" class="text-right pt-2">
                
                <div>Logged in as: <strong>{{loggedInEmail}}</strong></div>
                <div><a class="link pointer" @click="modalToggle = !modalToggle">Use a different email</a></div>
                <div><a class="pointer" @click="logout">Logout</a></div>

            </div>

            <div class="title"><h1>Currency Converter</h1></div>          

        </div>

        <!-- Calculator -->
        <div class="container" :class="{ active: showResults }">

            <div class="calculator-wrap pb-4 pt-3 px-3">

                <div class="pl-1 pb-2" :class="{ invisible: !haveError && !haveWarning, 'text-danger': haveError, 'text-warning': haveWarning }" >{{errorMessage}}</div>

                <div class="row mx-0">

                    <div class="col-md-3 px-1">

                        <label class="mb-1"><strong>Amount</strong></label>
                        <input v-model="amountBaseCurrency" type="number" min="1" class="form-control">

                    </div>

                    <div class="col-md-4 px-1" >

                        <label class="mb-1"><strong>From</strong></label>
                        <search-select :items="currencySymbols" :placeholder="'Choose base currency'" @selected-item="selectedBaseCurrency" ></search-select>

                    </div>

                    <div class="col-md px-1" > 
                        <label class="mb-1"><strong>To</strong></label>
                        <div class="d-flex">

                            <div class="pr-2" style="flex-grow: 1;">
                                <div v-for="(i, index) in quoteCurrencyFields" :id="'quote-currency-select-wrap-' + index" class="d-flex align-items-center" :key="index">
                                    <search-select :id="index" :items="currencySymbols" :placeholder="'Choose quote currency'" @selected-item="selectedQuoteCurrency" ></search-select>
                                    <span v-if="index > 0" class="delete-icon" @click="removeQuoteCurrencyField(index)" >&times;</span>
                                </div>
                            </div>

                            <button class="btn btn-sm btn-invert align-self-stretch" style="width: 45px; height: 38px;" @click="addQuoteCurrencyField" >+</button>

                        </div>

                    </div> 

                </div>

                <div class="text-right pr-1 mt-2">
                    <button class="btn btn-invert convert-btn" @click="convert" >Convert</button>
                </div>

                <!-- Results -->
                <div class="results-container pl-2" v-show="showResults">

                    <div class="result-base-currency">
                        
                       {{amountBaseCurrency}} {{this.getSymbolName(baseCurrency) + ' (' + baseCurrency + ')'}} =

                    </div>
                        
                    <div v-for="result in conversionResults" class="result-quote-currency">

                       {{result.computed_quote.toFixed(3)}} {{this.getSymbolName(result.quote_currency) + ' (' + result.quote_currency + ')' }}

                    </div>

                    <div v-if="conversionResults.length > 1" class="pt-3">
                        <h5>Best rate: <strong>{{bestRate.quote_currency}} @ {{bestRate.quote.toFixed(3)}} / {{bestRate.base_currency}}</strong></h5>
                    </div>
 
                    <button v-if="loggedIn && !conversionSavedSuccess" @click="saveConversion(conversionResults)" class="btn btn-invert save-btn mt-3">Save Conversion</button>

                    <div v-if="loggedIn && conversionSavedSuccess" :class="{ invisible: hideConversionSavedSuccess }"class="pt-3"style="color: #2ae350">Conversion saved!</div>

                </div>

            </div>

        </div>

        <!-- User conversions -->
        <div v-if="loggedIn && !loading" class="container mt-4 pl-4">

            <h5 style="border-bottom: 1px solid #444; color:#d0d0d0;" class="pb-1">Your Saved Conversions</h5>
            
            <div v-for="conversion in userConversions">
                <div v-for="c in conversion" class="d-flex py-1">
                   <div class="mr-auto">{{Math.round(c.computed_quote / c.quote)}} {{this.getSymbolName(c.base_currency)}} ({{c.base_currency}}) = {{c.computed_quote.toFixed(3)}} {{this.getSymbolName(c.quote_currency)}} ({{c.quote_currency}})</div>
                   <span class="pointer" @click="deleteConversion(conversion.id)">&times;</span>
                </div>
            </div>

            <div v-if="userConversions.length == 0" class="text-center mt-5 text-very-muted">
                <i>no saved conversions</i>
            </div>

        </div>

    </div>

    @endverbatim

    <script type="text/javascript" src="{{ asset('js/app.js') }}"></script>
    <script type="text/javascript" src="{{ asset('js/components/login-modal.js') }}"></script>
    <script type="text/javascript" src="{{ asset('js/components/search-select.js') }}"></script>
    <script type="text/javascript">
        const mountedApp = app.mount('#app');
    </script>
    
@endsection