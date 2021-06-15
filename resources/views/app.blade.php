@extends('base')
@section('title','Conversion Calculator')

@section('content')

    @verbatim

    <div id="app" >

        <div class="content">

            convert from..

            <search-select :items="currencySymbols"  @selected-item="selectedFromCurrency" ></search-select>

            to..

            <search-select :items="currencySymbols" @selected-item="selectedToCurrency" v-for="i in numberOfConvertToCurrencyFields" ></search-select>

            <br>

            <button class="btn btn-light" @click="numberOfConvertToCurrencyFields++" >+ add currency</button>
            <br><br>
            <button class="btn btn-primary" @click="convert" >Convert</button>

        </div>

    </div>

    @endverbatim

    <script type="text/javascript" src="{{ asset('js/app.js') }}"></script>
    
@endsection