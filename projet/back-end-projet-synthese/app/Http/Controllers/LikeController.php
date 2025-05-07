<?php

namespace App\Http\Controllers;

use App\Events\newLikeEvent;
use App\Models\Like;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LikeController extends Controller
{

    public function store(Request $request)
    {
        
        $like = Like::create([
            'user_id' => $request->user()->id,
            'pin_id' => $request->pin_id,
        ]);
        newLikeEvent::dispatch($like) ;
        return response()->json(['message' => 'like created with success' , 'data' => $like]) ;

    }


    public function destroy($id)
    {
        $like = Like::find($id);
        if (!$like ){ return response()->json(['message' => 'like not found']) ;}
        $like->delete();
        return response()->json(['message' => 'like deleted']) ;
    }
}
