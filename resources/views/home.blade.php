@extends('base')
@section('title','Conversion Calculator')
@section('bodyClass','homepage')
@section('content')

    <h3>Currency Converter</h3>

    <form action="/create" method="post">
        <label>Enter a Currency</label>
        <input type="text" name="content" placeholder="content">
        {{ csrf_field() }}
        <button type="submit">Submit</button>
    </div>


    <h4>Conversions</h4>
    <div style="margin-left:15px;">
        
        @foreach($conversions as $conversion)

            <div>{{ $conversion->content }}</div>
            <div>{{ $conversion->created_at->diffForHumans() }}</div>
            <a href="/delete/{{ $conversion->id }}">&times;</a>
            <br><br>

        @endforeach
    </div>

@endsection