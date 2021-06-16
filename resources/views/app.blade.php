@extends('base')
@section('title','Conversion Calculator')

@section('content')

    @verbatim

    <div id="app" >

        <div class="container">

            <div class="content">

                convert from..

                <search-select :items="currencySymbols" :placeholder="'Choose base currency'" @selected-item="selectedBaseCurrency" ></search-select>

                to..

                <div v-for="(i, index) in quoteCurrencyFields" class="flex flex-align-middle">
                    <search-select :id="index" :items="currencySymbols" :placeholder="'Choose quote currency'" @selected-item="selectedQuoteCurrency" ></search-select>
                    <span v-if="index > 0" class="delete-icon text-danger" @click="removeQuoteCurrencyField(index)" >&times;</span>
                </div>

                <button class="btn btn-invert" @click="addQuoteCurrencyField" >+ add currency</button>

                <br><br>

                <button class="btn btn-primary" @click="convert" >Convert</button>

                <br>
                <div v-show="haveError" class="text-danger">{{errorMessage}}</div>

                <br><br>

                <div class="conversion-results">
                    
                    <div v-for="result in conversionResults">{{result.base_currency}} --> {{result.quote_currency}} : {{result.quote}}</div>

                </div>

            </div>

        </div>

    </div>

    @endverbatim

    <script type="text/javascript" src="{{ asset('js/app.js') }}"></script>
    
@endsection