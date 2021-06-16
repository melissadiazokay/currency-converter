@extends('base')
@section('title','Conversion Calculator')

@section('content')

    @verbatim

    <div id="app" >

        <modal :toggle="modalToggle" @modal-close="modalToggle = !modalToggle"></modal>

        <div class="container-fluid hero">

            <div v-show="!showLoginButton" class="text-right">
                <button class="btn btn-invert mt-2" @click="modalToggle = !modalToggle">Login</button>
            </div>

            <div class="title"><h1>Currency Converter</h1></div>          

        </div>

        <div class="container" :class="{ active: showResults }">

            <div class="form-container pb-4 pt-3 px-3">

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
                                <div v-for="(i, index) in quoteCurrencyFields" class="d-flex align-items-center">
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

                       {{result.computed_quote}} {{this.getSymbolName(result.quote_currency) + ' (' + result.quote_currency + ')' }}

                    </div>

                </div>

            </div>

        </div>

    </div>

    @endverbatim

    <script type="text/javascript" src="{{ asset('js/app.js') }}"></script>
    
@endsection