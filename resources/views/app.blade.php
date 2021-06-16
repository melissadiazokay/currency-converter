@extends('base')
@section('title','Conversion Calculator')

@section('content')

    @verbatim

    <div id="app" >

        <div class="container">

          <nav class="navbar navbar-expand-lg px-0 pb-0">
            <span class="navbar-brand">Currency Converter</span>
          </nav>

        </div>

        <div class="container">

            <div :class="{invisible: !haveError}" class="text-danger">{{errorMessage}}</div>

            <div class="d-flex align-items-start justify-content-between mb-3">

                <div class="pr-1" style="flex-grow: 0;">

                    <label class="mb-1"><strong>Amount</strong></label>

                    <input v-model="amountBaseCurrency" type="number" min="1" class="form-control">

                </div>

                <div class="px-1" style="flex-grow: 2;">

                    <label class="mb-1"><strong>From</strong></label>

                    <search-select :items="currencySymbols" :placeholder="'Choose base currency'" @selected-item="  selectedBaseCurrency" ></search-select>

                </div>

                <div class="pl-1" style="flex-grow: 2;"> 

                    <label class="mb-1"><strong>To</strong></label>

                    <div class="d-flex">

                        <div class="pr-2" style="flex-grow: 1;">
                            <div v-for="(i, index) in quoteCurrencyFields" class="d-flex align-items-center">
                                <search-select :id="index" :items="currencySymbols" :placeholder="'Choose quote currency'" @selected-item="selectedQuoteCurrency" ></search-select>
                                <span v-if="index > 0" class="delete-icon text-danger" @click="removeQuoteCurrencyField(index)" >&times;</span>
                            </div>
                        </div>

                        <button class="btn btn-sm btn-invert align-self-stretch" style="width: 45px; height: 38px;" @click="addQuoteCurrencyField" >+</button>

                    </div>

                </div> 

            </div>

            <div class="text-right">
                <button class="btn btn-invert convert-btn" @click="convert" >Convert</button>
            </div>

        </div>

        <div class="container conversion-results">

            <div v-show="showResults">

                <div>
                    
                   {{amountBaseCurrency}} {{baseCurrency}} =

                </div>
                    
                <div v-for="result in conversionResults">

                   {{result.computed_quote}} {{this.getSymbolName(result.quote_currency) + ' (' + result.quote_currency + ')' }}

                </div>

            </div>

        </div>


    </div>

    @endverbatim

    <script type="text/javascript" src="{{ asset('js/app.js') }}"></script>
    
@endsection