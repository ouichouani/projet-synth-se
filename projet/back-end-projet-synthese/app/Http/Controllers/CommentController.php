<?php

namespace App\Http\Controllers;

use App\Events\newCommentEvent;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class CommentController extends Controller
{

    public function show($id){
        $comment = Comment::find($id) ;
        dd($comment->pin) ;
        return response()->json($comment);
    }

    public function store(Request $request)
    {

        try {
            $validation = $request->validate([
                'content' => 'required|string|min:1|max:300|filled',
                'pin_id' => 'required|exists:pins,id',
            ]);

            $comment = Comment::create([
                'user_id' => $request->user()->id,
                'pin_id'  => $validation['pin_id'],
                'content' => $validation['content'],
            ]);
            
            newCommentEvent::dispatch($comment);
            return response()->json(['message' => 'comment created', 'data' => $comment]);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()]);
        }
    }


    public function destroy(Request $request, $id)
    {
        $comment = Comment::find($id);
        if (!$comment) {
            return response()->json(['message' => 'comment not found']);
        }

        $user = $request->user() ;
        if ($user->admin || $comment->user_id == $user->id) { // admin can delete any pin 

            $comment->delete();
            return response()->json(['message' => 'comment deleted successfuly.'], 200);
        }
        
        return response()->json(['message' => 'not allowed to delete this comment .'], 403);
        
    }
}
