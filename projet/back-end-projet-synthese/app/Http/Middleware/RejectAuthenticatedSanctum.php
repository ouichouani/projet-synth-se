<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;
use Symfony\Component\HttpFoundation\Response;

class RejectAuthenticatedSanctum
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken(); //check for a raw token in the Authorization header.
        $accessToken = PersonalAccessToken::findToken($token); // handles hashing and lookup.
        
        if ($accessToken && $accessToken->tokenable) {//The tokenable relationship ensures the token actually belongs to a user.
            return response()->json([
                'message' => 'You are already logged in. Please log out to register or log in with another account.'
            ], 403);
        }
        return $next($request);
    }
}
