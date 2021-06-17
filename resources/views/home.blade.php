@extends('base')
@section('title','Conversion Calculator')

@section('content')

    <h3>Currency Converter</h3>

    <form action="/save-conversion" method="post">
        <label>Enter a Currency</label>
        <input type="text" name="email" placeholder="email">
        <input type="text" name="content" placeholder="content">
        {{ csrf_field() }}
        <button type="submit">Submit</button>
    </div>

    <h4>Conversions</h4>
    <div style="margin-left:15px;">
        
        @foreach($conversions as $conversion)

            <div>{{ $conversion->email }}</div>
            <div>{{ $conversion->content }}</div>
            <div>{{ $conversion->created_at->diffForHumans() }}</div>
            <a href="/delete-conversion/{{ $conversion->id }}">&times;</a>
            <br><br>

        @endforeach
    </div>

@endsection

