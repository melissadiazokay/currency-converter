@extends('base')
@section('title','Conversion Calculator')

@section('content')

    @verbatim

    <div id="app" >

        <div class="content">

            convert from..

            <search-select :items="currencySymbols"  @selected-item="selectedBaseCurrency" ></search-select>

            to..

            <search-select :items="currencySymbols" @selected-item="selectedQuoteCurrency" v-for="i in numberOfConvertToCurrencyFields" ></search-select>

            <br>

            <button class="btn btn-light" @click="numberOfConvertToCurrencyFields++" >+ add currency</button>
            <br><br>
            <button class="btn btn-primary" @click="convert" >Convert</button>

            <br>
            <div v-show="haveError" class="text-error">{{errorMessage}}</div>

            <br><br>

            <div class="conversion-results">
                
                <div v-for="result in conversionResults">{{result.base_currency}} --> {{result.quote_currency}} : {{result.quote}}</div>

            </div>

        </div>

    </div>

    @endverbatim

    <script type="text/javascript" src="{{ asset('js/app.js') }}"></script>
    
@endsection