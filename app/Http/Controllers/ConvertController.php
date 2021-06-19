<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Conversions; 

class ConvertController extends Controller {
    
    public function fetch($email){

        $conversions = Conversions::where('email',$email)->get()->toArray();
        return response()->json($conversions);
    }

    public function create(Request $request) {
        
        $email = $request->email;
        $content = json_decode($request->content,true);
        
        foreach ($content as $C) {

            $conversion = new Conversions();
            $conversion->email = $email;
            $conversion->content = json_encode($C);

            $conversion->save();            
        }

        return response()->json([
            'status' => 1,
            'message' => 'ok'
        ]);
    }

    public function delete($id) {

        Conversions::destroy($id);

        return response()->json([
            'status' => 1,
            'message' => 'ok'
        ]);

    }

}